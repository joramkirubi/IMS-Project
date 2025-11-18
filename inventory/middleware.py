import threading

_user = threading.local()

class CurrentUserMiddleware:
    """
    Middleware to store the current logged-in user in thread-local storage.
    This allows signals and other parts of the app to access the user safely.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Try to set the user from the standard request (session-based)
        _user.value = getattr(request, "user", None)

        # If user is not authenticated and there is an Authorization header,
        # try to authenticate using JWT so API requests carry the correct user
        # into thread-local storage. This lets signals know the user for
        # REST API operations that use token auth.
        try:
            if (not _user.value or not getattr(_user.value, "is_authenticated", False)):
                auth_header = request.META.get("HTTP_AUTHORIZATION") or request.headers.get("Authorization")
                if auth_header and auth_header.startswith("Bearer "):
                    try:
                        from rest_framework_simplejwt.authentication import JWTAuthentication

                        jwt_auth = JWTAuthentication()
                        auth_result = jwt_auth.authenticate(request)
                        if auth_result is not None:
                            user, _token = auth_result
                            _user.value = user
                    except Exception:
                        # Don't fail the request if token decoding fails here;
                        # leave _user as-is (possibly AnonymousUser)
                        pass
        except Exception:
            # Defensive: ensure middleware never raises
            pass

        response = self.get_response(request)
        _user.value = None
        return response

def get_current_user():
    return getattr(_user, "value", None)

