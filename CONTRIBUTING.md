# Contributing to Shepherd IMS

Thanks for your interest in contributing! This project welcomes contributions of all kinds: bug reports, fixes, documentation improvements, and features.

Getting started

1. Fork the repository and create a feature branch:

```bash
git checkout -b feat/my-change
```

2. Work on your changes and include tests where applicable.

3. Keep commits focused and write descriptive commit messages.

4. Open a pull request against the `main` branch with a clear description of the change.

Coding style

- Python: follow PEP8. Use black/isort if possible.
- JavaScript/React: follow the project's ESLint and Prettier rules (see `frontend/` for configs).

Testing

- Add or update Django tests in `inventory/tests.py`.
- Run backend tests locally:

```powershell
python manage.py test
```

Pull request checklist

- [ ] Code builds and tests pass locally
- [ ] Changes are well documented
- [ ] No secrets are committed
- [ ] PR description explains the why, not only the what

If you're unsure about a change, open an issue first so we can discuss the approach.