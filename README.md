# Shepherd IMS

Shepherd's Inventory Management System is a small inventory management system with a Django backend (Django REST Framework) and a React + Vite frontend styled with Tailwind CSS. It provides CRUD operations for products, categories, customers, suppliers, purchase/sales orders, stock movements, and audit logs.

This README covers how to set up the project locally on Windows (PowerShell), where the important files live, and troubleshooting tips.

---

## Repository layout

- `manage.py` - Django management entrypoint.
- `backend/` - Django project (settings, urls, wsgi/asgi).
- `inventory/` - Django app containing models, serializers, views, signals and migrations.
- `frontend/` - React + Vite frontend (components, pages, API wrapper).


## Prerequisites

- Python 3.10+ (https://www.python.org/)
- Node.js 18+ and npm (https://nodejs.org/)
- Git (optional)
- A database supported by Django (SQLite works out-of-the-box; PostgreSQL recommended for production)


## Quick start (Windows PowerShell)

Open PowerShell in the project root `C:\Users\ADMIN\ims-project`.

### Backend (Django)

1. Create and activate a Python virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies

If you have a `requirements.txt` (root or `backend/`), use it. Otherwise install the common deps:

```powershell
if (Test-Path .\requirements.txt) { pip install -r requirements.txt } elseif (Test-Path .\backend\requirements.txt) { pip install -r .\backend\requirements.txt } else { pip install django djangorestframework django-cors-headers python-dotenv djangorestframework-simplejwt }
```

3. Configure environment variables (optional)

If you use a database, create a `.env` or set environment variables for `SECRET_KEY`, DB connection, etc. You can also edit `backend/settings.py` for local testing.

4. Run migrations and create a superuser

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

5. Run the backend dev server

```powershell
python manage.py runserver
```

Backend default: `http://127.0.0.1:8000/`


### Frontend (React + Vite)

1. Install dependencies and start dev server

```powershell
cd .\frontend
npm install
npm run dev
```

Vite default: `http://localhost:5173/` (check terminal for actual URL)

2. Ensure the API base URL in `frontend/src/api/axios.js` matches your backend (e.g., `http://127.0.0.1:8000/api/`).


## Environment & CORS notes

- If frontend and backend are on different origins, enable CORS in Django (use `django-cors-headers`) and add the frontend origin to `CORS_ALLOWED_ORIGINS` in `backend/settings.py`.


## Running tests

- Backend: `python manage.py test`
- Frontend: use the frontend test runner if tests exist (e.g., `npm test`).


## Important files & where to look

- Backend settings: `backend/settings.py`
- Django app: `inventory/` (models, serializers, views, signals, migrations)
- Frontend entry: `frontend/src/main.jsx`
- Frontend API wrapper: `frontend/src/api/axios.js`
- Frontend components: `frontend/src/components/`


## Common troubleshooting

- "ModuleNotFoundError" in Django: activate the virtual env and install deps into it.
- Frontend can't reach backend: confirm backend is running and `axios` base URL matches, and that CORS allows the frontend origin.
- Port conflicts: change ports or stop the service using the port.


## Notes & best practices

- Do not commit secrets; use environment variables or a `.env` file excluded via `.gitignore`.


## Optional improvements

## License

This project is licensed under the MIT License.


## License

This project is licensed under the MIT License.
