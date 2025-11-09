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
        _user.value = getattr(request, "user", None)
        response = self.get_response(request)
        _user.value = None
        return response

def get_current_user():
    return getattr(_user, "value", None)

