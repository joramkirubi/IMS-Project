Inventory Management System

A full-featured Inventory Management System built with Django 5.2, Django REST Framework, React, Vite, and Tailwind CSS.
It provides a robust backend API, audit logging, and a user-friendly frontend for managing products, orders, customers, suppliers, and stock movements.

Table of Contents

Overview

Backend

Features

Models & Relationships

Serializers

API Endpoints

Audit Logging

Admin Interface

Setup & Configuration

Frontend

Overview

Folder Structure

Pages

Components

Hooks

API Integration

Styling & Layout

Running the Frontend

License

Overview

This project is a complete inventory management system with:

Backend: Django 5.2 + DRF, PostgreSQL, JWT authentication, audit logging.

Frontend: React + Vite + Tailwind CSS, responsive UI, charts, reusable components.

Features: CRUD operations, stock tracking, order management, customer & supplier management, dashboard analytics.

Backend
Features

Full CRUD for products, categories, customers, suppliers, orders, and stock movements.

Audit logging for create, update, and delete actions.

Stock tracking (IN/OUT) for all products.

JWT authentication for secure API access.

Admin panel with search, filters, and list displays.

CORS enabled for frontend integration.

Models & Relationships
Model	Description	Key Relationships
Category	Product categories	One-to-many → Products
Product	Items in inventory	Belongs to Category; linked to PurchaseItem, SalesItem, StockMovement
Supplier	Supplier info	One-to-many → PurchaseOrders
Customer	Customer info	One-to-many → SalesOrders
PurchaseOrder	Records purchases from suppliers	One-to-many → PurchaseItems
PurchaseItem	Individual products in a purchase order	Linked to Product & PurchaseOrder
SalesOrder	Records sales to customers	One-to-many → SalesItems; linked to Customer and processed_by User
SalesItem	Individual products in a sales order	Linked to Product & SalesOrder
StockMovement	Tracks stock in/out	Linked to Product; movement_type: IN/OUT
AuditLog	Logs user actions	Linked to User
Serializers

Category, Product, Supplier, Customer: basic CRUD (__all__ fields)

PurchaseOrderSerializer: includes supplier_name

PurchaseItemSerializer: includes product_name, purchase_order_id, purchase_order_display

SalesOrderSerializer: includes customer_name

SalesItemSerializer: includes product_name and sales_order_display

StockMovementSerializer: displays product name

AuditLogSerializer: shows user.username instead of ID

ViewSets & API Endpoints
Resource	Endpoint	Methods	Description
Categories	/api/categories/	GET, POST, PUT, DELETE	Manage categories
Products	/api/products/	GET, POST, PUT, DELETE	Manage products
Suppliers	/api/suppliers/	GET, POST, PUT, DELETE	Manage suppliers
Customers	/api/customers/	GET, POST, PUT, DELETE	Manage customers
Purchase Orders	/api/purchaseorders/	GET, POST, PUT, DELETE	Manage purchase orders
Purchase Items	/api/purchaseitems/	GET, POST, PUT, DELETE	Manage purchase items
Sales Orders	/api/salesorders/	GET, POST, PUT, DELETE	Manage sales orders
Sales Items	/api/salesitems/	GET, POST, PUT, DELETE	Manage sales items
Stock Movements	/api/stockmovements/	GET, POST, PUT, DELETE	Track stock in/out
Audit Logs	/api/auditlogs/	GET	View system audit logs

All endpoints use DRF ModelViewSets for automatic CRUD functionality.

Audit Logging

Middleware: CurrentUserMiddleware stores the logged-in user in thread-local storage.

Signals: post_save and post_delete track actions on key models.

Tracked Models: Category, Product, Supplier, Customer, PurchaseOrder, PurchaseItem, SalesOrder, SalesItem, StockMovement.

Example log: "admin created Product 'Blue Paint 5L'".

Admin Interface

Fully registered models with list displays, search fields, and filters.

Key features:

View products by category

Track purchase/sales orders and items

Monitor stock movements

View audit logs with user actions

Backend Setup & Configuration

Dependencies

Django==5.2
djangorestframework
django-cors-headers
python-dotenv
psycopg2
djangorestframework-simplejwt


Database

PostgreSQL configuration in .env:

DATABASE_NAME=<your_db_name>
DATABASE_USER=<your_db_user>
DATABASE_PASSWORD=<your_db_password>
DATABASE_HOST=<your_db_host>
DATABASE_PORT=<your_db_port>


Authentication

JWT Authentication:

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DATETIME_FORMAT': '%b %d, %Y, %I:%M %p',
}


CORS

CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]


Running Backend

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


API available at http://localhost:8000/api/.

Example API Usage

Add a product:

POST /api/products/
{
  "name": "Blue Paint 5L",
  "sku": "BP5001",
  "category": 1,
  "quantity": 50,
  "cost_price": 1200.00,
  "selling_price": 1500.00
}


Record stock in:

POST /api/stockmovements/
{
  "product": 1,
  "movement_type": "IN",
  "quantity": 20,
  "reference": "PO-1"
}


View audit logs:

GET /api/auditlogs/

Frontend
Overview

Built with React, Vite, and Tailwind CSS

User-friendly interface for managing inventory, orders, customers, suppliers, and stock

Responsive design with dashboard charts and reusable components

Folder Structure
frontend/
├─ src/
│  ├─ assets/             ← Images, logos (e.g., shepherd_logo.png)
│  ├─ components/         ← Reusable UI components
│  ├─ hooks/              ← Custom hooks (e.g., useFetchData.js)
│  ├─ pages/              ← Full page views
│  ├─ App.jsx
│  ├─ App.css
│  └─ index.css
├─ vite.config.js
├─ tailwind.config.js
├─ package.json
└─ package-lock.json

Pages
Page	Description
Dashboard	Overview of products, orders, and stock movements with charts
Products	List, add, edit, delete products
Categories	List, add, edit, delete categories
Customers	List, add, edit, delete customers
Suppliers	List, add, edit, delete suppliers
Purchase Orders	List and manage purchase orders
Purchase Items	Add items to purchase orders
Sales Orders	List and manage sales orders
Sales Items	Add items to sales orders
Stock Movements	Track stock in/out
Components
Component	Description
Sidebar	Navigation menu for pages
DataTable	Reusable table for listing data
Add*Form	Forms to add/edit records (Product, Category, Customer, Supplier, etc.)
DashboardCard	Card for showing key metrics
SalesChart	Line chart for visualizing sales trends
Hooks

useFetchData.js: Fetches backend data, handles loading and errors

API Integration

Backend endpoints (http://localhost:8000/api/...)

Example:

const { data, loading, error } = useFetchData('http://localhost:8000/api/products/');

Styling & Layout

Tailwind CSS for utility-first styling

Responsive components for desktop and mobile

Sidebar is collapsible; dashboard uses cards & charts

Running Frontend
cd frontend
npm install
npm run dev


Open in browser: http://localhost:5173

License

This project is licensed under the MIT License.
