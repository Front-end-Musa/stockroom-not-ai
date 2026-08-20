# Stockroom Inventory

A full-stack CRUD application for maintaining a shop's stockroom product catalog. Teams can search, sort, page through, add, update, and remove products from a single inventory workspace.

## Technology

| Area | Implementation |
| --- | --- |
| Frontend | Angular 22, TypeScript, SCSS, SSR |
| Client state | Component signals with direct API service calls |
| Backend | ASP.NET Core (.NET 10) |
| Data access | Entity Framework Core 10 |
| Database | PostgreSQL with Npgsql |

## Repository layout

```text
crud_app/
├── crud-app-frontend/                 # Angular application
│   └── src/app/
│       ├── core/                       # API configuration, interceptor, HTTP service
│       ├── features/products/          # Inventory workspace UI
│       ├── shared/models/              # API-facing TypeScript types
├── crud-app-backend/
│   ├── crud-app-backend.slnx           # .NET solution
│   └── crud-app-backend/
│       ├── Controllers/                # REST endpoints
│       ├── Data/                       # DbContext and initializer helper
│       ├── Dtos/                       # Request, response, query, and paging DTOs
│       ├── ExceptionHandling/          # Centralized 404 problem-details handler
│       ├── Mappings/                   # Entity-to-DTO mapping
│       ├── Migrations/                 # EF Core schema migrations
│       ├── Models/                     # EF Core entities
│       └── Services/                   # Product application service
└── PRODUCT.md                          # Product direction
```

## Features

- Product catalog with name, description, price, quantity, and audit timestamps.
- Server-side search, sorting, and pagination.
- Create, edit, and delete operations from the Angular workspace.
- PostgreSQL persistence through EF Core migrations.
- Centralized API error handling with RFC 7807 problem details for missing products.
- Development CORS support for the Angular server at `http://localhost:4200`.

## Prerequisites

- .NET 10 SDK
- Node.js and npm (the frontend declares npm 11.17.0)
- PostgreSQL
- A trusted local ASP.NET Core HTTPS development certificate, because the frontend targets the API's HTTPS profile by default

Trust a development certificate if required:

```powershell
dotnet dev-certs https --trust
```

## Run locally

### 1. Configure the database

Create a PostgreSQL database, for example `crud_app`. Store its connection string in .NET user secrets; it is not committed to configuration files.

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=crud_app;Username=postgres;Password=YOUR_PASSWORD" --project .\crud-app-backend\crud-app-backend\crud-app-backend.csproj
```

### 2. Apply migrations

```powershell
dotnet ef database update --project .\crud-app-backend\crud-app-backend\crud-app-backend.csproj --startup-project .\crud-app-backend\crud-app-backend\crud-app-backend.csproj
```

If EF CLI is not available:

```powershell
dotnet tool install --global dotnet-ef
```

### 3. Start the API

```powershell
dotnet run --project .\crud-app-backend\crud-app-backend\crud-app-backend.csproj --launch-profile https
```

The HTTPS profile serves the API at `https://localhost:7217`; it also listens on `http://localhost:5030`. The frontend's API base URL is configured in `crud-app-frontend/src/app/core/environment/environment.ts`.

### 4. Start the frontend

In a second terminal:

```powershell
Set-Location .\crud-app-frontend
npm install
npm start
```

Open `http://localhost:4200`.

## API

Base route: `/api/products`

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Return a page of products |
| `GET` | `/api/products/{id}` | Return one product |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

### List parameters

`GET /api/products` accepts the following optional query parameters:

| Parameter | Default | Notes |
| --- | --- | --- |
| `search` | — | Case-insensitive partial match against name or description |
| `pageNumber` | `1` | Minimum `1` |
| `pageSize` | `10` | Between `1` and `100` |
| `sortBy` | ID | `name` or `price` |
| `sortDirection` | `asc` | `asc` for ascending or `desc` for descending |

Example:

```http
GET /api/products?search=mouse&pageNumber=1&pageSize=10&sortBy=price&sortDirection=asc
```

### Payloads

Create and update requests use the same JSON shape:

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic Bluetooth mouse",
  "price": 29.99,
  "quantity": 24
}
```

A list request returns a page envelope:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Wireless Mouse",
      "description": "Ergonomic Bluetooth mouse",
      "price": 29.99,
      "quantity": 24,
      "createdAt": "2026-08-19T10:00:00Z",
      "updatedAt": "2026-08-19T10:00:00Z"
    }
  ],
  "totalCount": 1,
  "pageNumber": 1,
  "pageSize": 10
}
```

## Architecture

The API follows a controller → service → EF Core/PostgreSQL flow. Product list queries are composed against `IQueryable`, so filtering, sorting, counting, and paging run in PostgreSQL before results are returned. API DTOs keep persistence entities separate from HTTP contracts.

On the frontend, the Products feature uses a facade to dispatch NgRx actions. Effects call the typed `ProductsService`; the entity store holds the loaded page, loading/error state, selected product, query, and total count. An HTTP interceptor prefixes relative API requests with the configured backend URL.

## Development commands

```powershell
# Backend
dotnet build .\crud-app-backend\crud-app-backend.slnx
dotnet run --project .\crud-app-backend\crud-app-backend\crud-app-backend.csproj

# Frontend (run from crud-app-frontend)
npm start
npm run build
npm test
```

## Current scope

This project focuses on inventory catalog maintenance. Authentication, authorization, user roles, stock-count workflows, audit history, and a production deployment configuration are outside the current scope.
