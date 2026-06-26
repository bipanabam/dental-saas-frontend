# Dental SaaS Backend

## 🏥 Overview

**Dental Sass** is a comprehensive, multi-tenant dental practice management system built with modern Python technologies. This backend provides a complete platform for dental clinics to manage patients, appointments, clinical encounters, treatment plans, and practice operations with enterprise-grade security and scalability.

The system is designed to support dental professionals in delivering quality patient care by automating administrative tasks, maintaining comprehensive medical records, managing appointments and queues, and providing role-based access control for different staff members.

## ✨ Key Features

### Patient Management
- **Patient Registration & Profiles** — Comprehensive patient demographic and contact information
- **Medical Records** — Detailed patient medical history, allergies, blood type, family medical history
- **Family Relationships** — Track family members and their relationships
- **Patient Search & Duplicate Detection** — Efficiently find patients and prevent duplicate records

### Appointment Management
- **Flexible Booking** — Schedule appointments with support for regular and walk-in bookings
- **Status Tracking** — Track appointments through multiple states (pending, confirmed, checked-in, completed, no-show, etc.)
- **Rescheduling & Follow-ups** — Reschedule existing appointments or create follow-up appointments
- **Appointment Confirmation** — Patient confirmation workflow
- **Appointment Cancellation** — Cancel with predefined reasons

### Queue Management
- **Real-time Queue System** — Live queue display for clinic reception and doctors
- **Queue Operations** — Call, skip, and recall patients from the queue
- **Estimated Wait Times** — Calculate and display estimated wait times per patient
- **Doctor-specific Queues** — Track separate queues per dentist

### Clinical Encounters
- **Comprehensive Encounter Records** — Document each patient visit with detailed information
- **Medical Examination** — Record examination findings with structured data
- **Diagnosis Management** — Document diagnoses with hierarchical taxonomy
- **Investigations** — Order and track investigations/lab tests with results
- **Treatment Planning** — Create treatment plans with individual items and procedures
- **Procedure Tracking** — Mark procedures as performed, deferred, or cancelled
- **Encounter History** — Maintain complete encounter history per patient

### User & Authorization Management
- **Multi-role Support** — Doctor, Dentist, Receptionist, Admin roles with custom permissions
- **Role-based Access Control** — Fine-grained permissions for different user types
- **User Session Management** — Track active sessions and enable logout capabilities
- **Profile Management** — User profiles with specializations and qualifications
- **User Preferences** — Customize user settings and preferences

### Tenant Management
- **Multi-tenant Architecture** — Complete data isolation between tenants
- **Tenant Settings** — Customizable tenant configurations
- **Tenant Admin Panel** — Tenant-level settings and management

### Data & Taxonomy
- **Procedure Catalog** — Searchable catalog of dental procedures with details
- **Medical Taxonomy** — Hierarchical disease/condition classification
- **Examination Data** — Structured examination findings
- **Investigations Taxonomy** — Available investigations and tests
- **Findings & Diagnoses Taxonomy** — Standardized clinical terms

### Authentication & Security
- **JWT-based Authentication** — Secure token-based authentication
- **Refresh Token Support** — Long-lived refresh tokens with secure rotation
- **Multi-session Support** — Users can maintain multiple active sessions
- **Session Revocation** — Logout all sessions or individual sessions
- **Password Management** — Secure password change and reset functionality
- **Verification System** — Email verification workflow

### System Administration
- **Super Admin Interface** — Separate admin authentication and management
- **Permission Management** — Define and manage system-wide permissions
- **Health Checks** — System health monitoring endpoints

## 🏗️ Tech Stack

- **Runtime** — Python 3.12+
- **Web Framework** — FastAPI (modern, fast, production-ready)
- **Database** — PostgreSQL with async SQLAlchemy ORM
- **Migrations** — Alembic for schema versioning and migrations
- **Authentication** — PyJWT for token management
- **Password Security** — pwdlib with Argon2 hashing
- **API Documentation** — Automatic Swagger UI and ReDoc generation
- **Async Support** — asyncpg for non-blocking database access
- **Production Server** — Gunicorn + Uvicorn
- **Containerization** — Docker & Docker Compose
- **Configuration Management** — Pydantic Settings

## 🚀 Getting Started

### Prerequisites

- Python 3.12 or higher
- PostgreSQL 13 or higher
- Git
- Optional: Docker & Docker Compose for containerized development

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dental-saas-backend
```

### 2. Create and Activate Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate it
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env.dev` file in the project root with the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/dental_saas_db

# Redis Configuration (optional for caching/sessions)
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Configuration
APP_NAME=Dental SaaS Backend
APP_DESCRIPTION=A comprehensive dental practice management system
API_V1_PREFIX=/api/v1
DEBUG=True
ENV=dev

# CORS Configuration (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Optional: Email Configuration (for future notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
```

> **Note:** The application uses `app/core/config.py` to load settings. For production, use `.env` instead of `.env.dev`.

### 5. Set Up the Database

Initialize the database and run migrations:

```bash
# Create database (if not exists)
createdb dental_saas_db

# Run all migrations to the latest version
alembic upgrade head
```

To create a new migration after schema changes:

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### 6. Start the Development Server

```bash
# Start with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running, access:

- 📘 **Swagger UI** (Interactive API docs): http://localhost:8000/docs
- 📗 **ReDoc** (Alternative docs): http://localhost:8000/redoc
- 💚 **Health Check**: http://localhost:8000/healthz

## 🐳 Docker Development

### Quick Start with Docker Compose

The easiest way to run the entire stack locally:

```bash
# Start all services (app, PostgreSQL, Redis)
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop services
docker compose down

# Stop and remove all data
docker compose down -v
```

### What's Included in docker-compose.yml

- **app** — FastAPI application on port `8000`
- **db** — PostgreSQL database on port `5432`
- **redis** — Redis cache on port `6379`

### Environment Setup with Docker

The `docker-compose.yml` uses environment variables from `.env.dev`. Make sure your `.env.dev` file exists before running `docker compose up`.

### Accessing Services in Docker

```bash
# Access the application
curl http://localhost:8000/healthz

# Connect to PostgreSQL from host
psql -h localhost -U postgres -d dental_saas_db

# Access Redis CLI
redis-cli -h localhost -p 6379
```

### Production Deployment

For production deployments, see `docker-compose.prod.yml` which includes:

- Traefik reverse proxy integration
- HTTPS/TLS configuration with Let's Encrypt
- Health checks and auto-restart policies
- Network isolation

Deploy with:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📡 API Overview

All API routes are prefixed with `/api/v1`. The backend follows RESTful conventions with comprehensive error handling and validation.

### Core API Modules

#### **Authentication** (`/auth`)
- `POST /register-tenant` — Register new tenant organization
- `POST /token` — Login with credentials
- `POST /refresh` — Refresh access token
- `POST /logout` — Logout current session
- `POST /logout-all` — Logout from all sessions
- `GET /me` — Get current user profile
- `GET /profile` — Get detailed profile
- `PUT /profile` — Update profile
- `POST /password` — Change password
- `GET /sessions` — List active sessions

#### **Tenant Management** (`/tenant`)
- `GET /me` — Get tenant details
- `PUT /me` — Update tenant information
- `GET /me/settings` — Get tenant settings
- `PUT /me/settings` — Update tenant settings

#### **User Management** (`/users`)
- `GET /` — List all users (paginated)
- `POST /` — Create new user
- `GET /summary` — Get user statistics
- `GET /doctor` — List doctors only
- `GET /{user_id}` — Get user details
- `PUT /{user_id}` — Update user
- `DELETE /{user_id}` — Delete user
- `PUT /{user_id}/restore` — Restore deleted user
- `GET|PUT /{user_id}/profile` — User profile management
- `GET|PUT /{user_id}/access` — User access/permissions
- `GET|DELETE /{user_id}/sessions` — User session management
- `DELETE /{user_id}/sessions/{session_id}` — Revoke specific session
- `GET /{user_id}/security` — Security settings
- `PUT /{user_id}/security/password` — Admin password reset
- `PUT /{user_id}/security/verification` — Email verification
- `GET|PUT /{user_id}/preferences` — User preferences

#### **Patient Management** (`/patients`)
- `GET /` — List patients (paginated)
- `POST /` — Register new patient
- `GET /search` — Search patients
- `POST /check-duplicate` — Check for duplicate patients
- `GET /{patient_id}` — Get patient details
- `PUT /{patient_id}` — Update patient
- `DELETE /{patient_id}` — Delete patient (soft delete)
- `PUT /{patient_id}/restore` — Restore deleted patient
- `GET|POST /{patient_id}/medical-record` — Patient medical records
- `POST /{patient_id}/assign-doctor` — Assign doctor to patient
- `GET|POST /{patient_id}/family` — Family relationships
- `DELETE /{patient_id}/family/{family_member_id}` — Remove family member
- `GET /{patient_id}/appointments` — Patient appointments
- `GET /{patient_id}/encounters` — Patient encounters
- `GET /{patient_id}/medical-history` — Patient medical history
- `GET /{patient_id}/treatment-plans` — Patient treatment plans
- `GET /{patient_id}/procedures` — Patient procedures
- `GET /{patient_id}/summary` — Patient summary data

#### **Appointment Management** (`/appointments`)
- `GET /` — List appointments (paginated)
- `POST /` — Create appointment
- `GET /today` — Get today's appointments
- `POST /walk-in` — Create walk-in appointment
- `GET /{appointment_id}` — Get appointment details
- `PUT /{appointment_id}` — Update appointment
- `DELETE /{appointment_id}` — Cancel appointment
- `POST /{appointment_id}/confirm` — Confirm appointment
- `POST /{appointment_id}/check-in` — Check-in patient
- `POST /{appointment_id}/start` — Start appointment
- `POST /{appointment_id}/complete` — Complete appointment
- `POST /{appointment_id}/no-show` — Mark as no-show
- `POST /{appointment_id}/reschedule` — Reschedule appointment
- `POST /{appointment_id}/follow-up` — Create follow-up appointment

#### **Queue Management** (`/queue`)
- `GET /today` — Get today's queue
- `GET /doctors/{doctor_id}/today` — Get specific doctor's queue
- `GET /display` — Queue display data
- `POST /{queue_id}/call` — Call patient from queue
- `POST /{queue_id}/skip` — Skip patient in queue
- `POST /{queue_id}/recall` — Recall patient
- `GET /{queue_id}/estimated-wait` — Get wait time estimate

#### **Clinical Encounters** (`/encounters`)
- `GET /` — List encounters (paginated)
- `GET /by-appointment/{appointment_id}` — Get encounter for appointment
- `GET /{encounter_id}` — Get encounter details
- `PATCH /{encounter_id}` — Update encounter
- `POST /{encounter_id}/close` — Close encounter
- `GET|POST /{encounter_id}/history` — Medical history documentation
- `GET|POST /{encounter_id}/examination` — Examination findings
- `GET|POST /{encounter_id}/findings` — Clinical findings
- `DELETE /{encounter_id}/findings/{finding_id}` — Remove finding
- `GET|POST /{encounter_id}/diagnoses` — Diagnoses
- `GET|POST /{encounter_id}/investigations` — Order investigations
- `PATCH /{encounter_id}/investigations/{investigation_id}/result` — Update investigation result
- `GET|POST /{encounter_id}/treatment-plan` — Treatment plan
- `POST /{encounter_id}/treatment-plan/items` — Add treatment plan items
- `POST /{encounter_id}/treatment-plan/items/{item_id}/perform` — Mark as performed
- `PATCH /{encounter_id}/treatment-plan/items/{item_id}/defer` — Defer procedure
- `PATCH /{encounter_id}/treatment-plan/items/{item_id}/cancel` — Cancel procedure

#### **Procedures** (`/procedures`)
- `GET /{procedure_id}` — Get procedure details
- `PATCH /{procedure_id}` — Update procedure
- `POST /{procedure_id}/cancel` — Cancel procedure

#### **Procedure Catalog** (`/procedure-catalog`)
- `GET /` — List procedures (paginated)
- `GET /search` — Search procedures
- `GET /{catalog_id}` — Get procedure details

#### **Taxonomy & Data** (`/taxonomy`)
- `GET /` — Get all taxonomy data
- `GET /medical-history` — Medical history terms
- `GET /examination` — Examination findings taxonomy
- `GET /findings` — Clinical findings taxonomy
- `GET /diagnoses` — Diagnoses taxonomy
- `GET /investigations` — Investigations taxonomy

#### **Roles & Permissions** (`/roles`, `/system`)
- `GET /roles/` — List roles
- `POST /roles/` — Create role
- `GET|PUT|DELETE /roles/{role_id}` — Manage roles
- `GET|PUT /roles/{role_id}/permissions` — Role permissions
- `GET /system/permissions` — List all available permissions

#### **Super Admin** (`/super-admin`)
- `GET /auth/me` — Get super admin profile
- `POST /auth/login` — Super admin login

### Response Format

All API responses follow a consistent format with proper HTTP status codes:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

For paginated responses:

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 10,
  "total_pages": 10
}
```

## 📁 Project Structure

```
dental-saas-backend/
├── alembic/                          # Database migration management
│   ├── env.py                        # Migration environment config
│   ├── script.py.mako               # Migration template
│   └── versions/                     # Migration files
│       ├── 487e48618006_initial_migration.py
│       ├── 0077f7ef9ee6_user_profile_table_added.py
│       └── ...                       # Other migrations
│
├── app/                              # Main application package
│   ├── main.py                       # FastAPI application factory & router registration
│   │
│   ├── core/                         # Core application configuration
│   │   ├── config.py                # Settings (database, JWT, CORS, etc.)
│   │   ├── database.py              # SQLAlchemy async engine & session
│   │   ├── security.py              # JWT token generation/validation
│   │   └── dependencies.py          # Dependency injection utilities
│   │
│   ├── api/                          # API endpoints
│   │   ├── v1/                       # API v1 endpoints
│   │   │   ├── auth/                # Authentication routes
│   │   │   │   └── router.py
│   │   │   ├── tenant/              # Tenant management
│   │   │   │   └── router.py
│   │   │   ├── users/               # User management
│   │   │   │   └── router.py
│   │   │   ├── patients/            # Patient management
│   │   │   │   └── router.py
│   │   │   ├── appointments/        # Appointment management
│   │   │   │   └── router.py
│   │   │   ├── queue/               # Queue management
│   │   │   │   └── router.py
│   │   │   ├── encounters/          # Clinical encounters
│   │   │   │   └── router.py
│   │   │   ├── procedures/          # Procedure management
│   │   │   │   └── router.py
│   │   │   ├── procedure_catalog/   # Procedure catalog
│   │   │   │   └── router.py
│   │   │   ├── taxonomy/            # Taxonomy data
│   │   │   │   └── router.py
│   │   │   ├── roles/               # Role management
│   │   │   │   └── router.py
│   │   │   └── system/              # System endpoints
│   │   │       └── router.py
│   │   │
│   │   └── super_admin/             # Super admin endpoints
│   │       └── auth/
│   │           └── router.py
│   │
│   ├── models/                       # SQLAlchemy ORM models
│   │   ├── user.py                  # User, UserProfile, UserSession models
│   │   ├── tenant.py                # Tenant model
│   │   ├── patient.py               # Patient, PatientFamilyLink models
│   │   ├── appointment.py           # Appointment, Queue models
│   │   ├── encounter.py             # Clinical encounter and related models
│   │   ├── role.py                  # Role and Permission models
│   │   └── ...                      # Other models
│   │
│   ├── schemas/                      # Pydantic request/response schemas
│   │   ├── auth.py                  # Auth request/response schemas
│   │   ├── user.py                  # User schemas
│   │   ├── patient.py               # Patient schemas
│   │   ├── appointment.py           # Appointment schemas
│   │   ├── encounter.py             # Encounter schemas
│   │   └── ...                      # Other schemas
│   │
│   ├── services/                     # Business logic layer
│   │   ├── auth_service.py          # Authentication logic
│   │   ├── user_service.py          # User management logic
│   │   ├── patient_service.py       # Patient management logic
│   │   ├── appointment_service.py   # Appointment management logic
│   │   ├── queue_service.py         # Queue management logic
│   │   ├── encounter_service.py     # Clinical encounter logic
│   │   └── ...                      # Other services
│   │
│   ├── utils/                        # Utility functions
│   │   ├── validators.py            # Input validation helpers
│   │   ├── exceptions.py            # Custom exceptions
│   │   └── helpers.py               # General utilities
│   │
│   ├── taxonomy/                     # Taxonomy data definitions
│   │   └── ...                      # Taxonomy data files
│   │
│   ├── templates/                    # Jinja2 templates
│   │   └── landing/
│   │       └── index.html           # Landing page
│   │
│   └── scripts/                      # Utility scripts
│       └── ...                      # Database seeders, etc.
│
├── boot/                             # Startup scripts
│   └── docker-run.sh                # Docker container entry point
│
├── docs/                             # Documentation
│   ├── buddha_dental_api.md         # Detailed API documentation
│   ├── er-diagram.mmd               # Entity relationship diagram
│   └── ...
│
├── .env.dev                          # Development environment variables
├── .env.example                      # Environment variable template
├── .gitignore                        # Git ignore file
├── alembic.ini                       # Alembic configuration
├── docker-compose.yml               # Docker Compose for development
├── docker-compose.prod.yml          # Docker Compose for production
├── Dockerfile                        # Docker image definition
├── requirements.txt                 # Python dependencies
├── pyproject.toml                   # Python project metadata
├── open-api.json                    # OpenAPI/Swagger specification
└── README.md                         # This file
```

### Key Directories Explained

- **`app/api/v1/`** — All API route handlers organized by domain (auth, users, patients, etc.)
- **`app/models/`** — SQLAlchemy ORM models representing database tables
- **`app/schemas/`** — Pydantic validation models for request/response contracts
- **`app/services/`** — Business logic separated from API handlers
- **`alembic/versions/`** — Historical record of all database schema changes

## 🗄️ Database

### Database Architecture

The application uses **PostgreSQL** as the primary database with:

- **Async SQLAlchemy ORM** for non-blocking database access
- **Asyncpg** driver for high-performance async operations
- **Alembic** for version control and migrations

### Key Tables & Entities

#### Core Entities
- **users** — System users (doctors, receptionists, admins, etc.)
- **user_profile** — Extended user profile information
- **user_session** — Active login sessions with refresh tokens
- **tenant** — Organization/clinic data isolation
- **patients** — Patient demographic information
- **patient_family_link** — Family relationship tracking

#### Clinical Data
- **appointment** — Scheduled and walk-in appointments
- **queue** — Patient queue management
- **clinical_encounter** — Patient visit/consultation records
- **encounter_history** — Medical history documentation
- **encounter_examination** — Physical examination findings
- **encounter_findings** — Clinical findings
- **encounter_diagnosis** — Diagnoses assigned during encounters
- **encounter_investigation** — Lab tests and investigations
- **treatment_plan** — Treatment planning data
- **procedure** — Procedures performed

#### Authorization
- **role** — User roles and their metadata
- **permission** — System permissions
- **role_permission** — Role-permission associations

#### Administrative
- **procedure_catalog** — Available dental procedures
- **medical_record** — Patient medical records
- **tenant_settings** — Tenant-specific configuration

### Database Setup

```bash
# Create database
createdb dental_saas_db

# Run all pending migrations
alembic upgrade head

# Check migration status
alembic current
alembic heads

# Create new migration
alembic revision --autogenerate -m "Description of changes"
```

### Soft Deletes

The system implements soft deletes for audit trails:

```python
# Users, patients, and appointments have:
deleted_at: Optional[datetime]  # NULL = active, SET = deleted
```

### Data Isolation

Multi-tenancy is enforced through:

1. **Tenant ID foreign keys** — All records linked to a tenant
2. **Query filters** — Automatic tenant filtering in services
3. **Database constraints** — Foreign key relationships ensure data integrity

## 🔐 Authentication & Authorization

### Authentication Flow

#### Tenant User Login
```
1. POST /auth/token with username & password
2. System validates credentials
3. Returns access_token (short-lived, ~30 min) + refresh_token (long-lived, ~7 days)
4. Use access_token in Authorization: Bearer header
5. Access token expires → use refresh_token at POST /auth/refresh
```

#### Token Structure

- **Access Token** — Stateless JWT containing user identity, tenant, roles, and permissions
- **Refresh Token** — Long-lived token stored in database with revocation tracking
- **Token Claims** — sub (user_id), tenant_id, roles, permissions

### Authorization Model

#### Role-Based Access Control (RBAC)
- **Predefined Roles**: Doctor, Dentist, Receptionist, Admin, SuperAdmin
- **Custom Roles**: Tenants can create custom roles
- **Permissions**: Fine-grained permissions assigned to roles
- **Enforcement**: Decorators check required permissions on each endpoint

#### Permission Examples
- `users:read` — View user information
- `users:write` — Create/update users
- `patients:read` — View patient records
- `appointments:manage` — Create/modify appointments
- `encounters:write` — Document clinical encounters
- `queue:manage` — Manage patient queue

### Session Management

- **Multiple Sessions** — Users can maintain multiple active sessions (mobile, desktop, etc.)
- **Session Tracking** — Track device, IP, last activity
- **Session Revocation** — Logout single session or all sessions
- **Session Expiry** — Automatic cleanup of expired sessions

### Security Features

✅ **Password Security**
- Argon2 hashing with salt
- Secure password change endpoint
- Password strength validation

✅ **Token Security**
- JWT tokens signed with RS256/HS256
- Refresh token rotation on each use
- Token revocation tracking

✅ **CORS Protection**
- Configurable allowed origins
- Credentials support for cross-origin requests

✅ **Trusted Hosts**
- Prevent Host header attacks

✅ **Endpoint Protection**
- All protected endpoints require valid JWT
- Role-based access control on sensitive operations

## 🏢 Multi-Tenancy Architecture

### Tenant Isolation

The system ensures complete data isolation between tenants:

#### Isolation Mechanisms

1. **Database Level**
   - Every record has `tenant_id` foreign key
   - Foreign key constraints prevent cross-tenant data access

2. **Application Level**
   - JWT tokens include tenant_id
   - All queries automatically filtered by tenant_id
   - Services validate tenant ownership before operations

3. **API Level**
   - User can only access resources in their tenant
   - Administrative operations scoped to tenant

### Tenant Operations

```
1. Tenant Registration → Automatic tenant & admin user creation
2. Tenant Settings → Customize clinic name, logo, settings
3. Tenant Users → Manage team members with role assignments
4. Tenant Data → All patient, appointment, encounter data isolated
```

### Tenant Admin Capabilities

- Manage clinic information and settings
- Create and manage user accounts
- Define custom roles and permissions
- View clinic-level analytics and reports

## 📝 Development & Coding Standards

### Code Organization

- **Separation of Concerns** — Routes → Services → Models
- **Dependency Injection** — FastAPI dependencies for database, current user
- **Error Handling** — Custom exception classes with HTTP status mapping
- **Validation** — Pydantic schemas for all request/response validation

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/patient-bulk-import

# 2. Make changes and run migrations if needed
alembic revision --autogenerate -m "Add bulk_import_status to patients"

# 3. Test locally
uvicorn app.main:app --reload

# 4. Run linting (if configured)
# flake8 app/

# 5. Commit with clear messages
git commit -m "feat: add bulk patient import functionality"

# 6. Push and create pull request
git push origin feature/patient-bulk-import
```

### Testing

Create tests in `tests/` directory (to be added):

```bash
# Run tests
pytest

# With coverage
pytest --cov=app/
```

### Adding New Features

When adding a new resource (e.g., new patient field):

1. **Update Schema** — Add to Pydantic schema in `app/schemas/`
2. **Update Model** — Add to SQLAlchemy model in `app/models/`
3. **Create Migration** — Generate migration file
4. **Update Service** — Add business logic in `app/services/`
5. **Update Router** — Add/modify endpoints in `app/api/v1/`
6. **Update Tests** — Add corresponding tests

## 📊 API Documentation

The API documentation is automatically generated from code:

- **Swagger UI** — Interactive API testing: http://localhost:8000/docs
- **ReDoc** — Static documentation: http://localhost:8000/redoc
- **OpenAPI Schema** — Machine-readable spec: http://localhost:8000/openapi.json

### Documentation Files

- `docs/buddha_dental_api.md` — Detailed API reference
- `docs/er-diagram.mmd` — Database entity relationship diagram
- `open-api.json` — OpenAPI 3.1.0 specification

## 🔧 Troubleshooting

### Common Issues

**Issue: Database connection refused**
```bash
# Check PostgreSQL is running
psql -U postgres -d postgres -c "SELECT 1"

# Verify DATABASE_URL in .env.dev
# Format: postgresql+asyncpg://user:password@host:port/database
```

**Issue: Alembic migrations failing**
```bash
# Check current migration status
alembic current

# View migration history
alembic history

# Downgrade one migration
alembic downgrade -1
```

**Issue: JWT token validation errors**
```bash
# Verify JWT_SECRET_KEY is set correctly
# Check token not expired (compare token exp claim to current time)
# Ensure Authorization header format: Bearer <token>
```

**Issue: Docker container not starting**
```bash
# Check logs
docker compose logs app

# Rebuild without cache
docker compose build --no-cache app

# Check environment variables
docker compose config | grep -A 20 "app:"
```

## 📚 Additional Resources

- **FastAPI Documentation** — https://fastapi.tiangolo.com
- **SQLAlchemy Async** — https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
- **Alembic Documentation** — https://alembic.sqlalchemy.org
- **PostgreSQL Documentation** — https://www.postgresql.org/docs
- **JWT Introduction** — https://jwt.io/introduction

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** — `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, descriptive commits
4. **Update documentation** — README, API docs, etc.
5. **Test thoroughly** — Ensure changes work locally and don't break existing functionality
6. **Submit a pull request** — With a clear description of changes

### Commit Message Convention

```
feat: add patient bulk import functionality
fix: correct queue order calculation
docs: update API documentation
refactor: reorganize appointment service
test: add tests for user authentication
```

## 📄 License

This project currently has no license specified. Please add an appropriate license file as needed.

## 🎯 Roadmap

Planned features and improvements:

- [ ] Patient communication module (SMS/Email)
- [ ] Advanced reporting and analytics
- [ ] Insurance integration
- [ ] Payment processing
- [ ] Video consultation support
- [ ] Mobile app APIs
- [ ] AI-powered diagnostics suggestions
- [ ] Real-time notifications
- [ ] Audit logging
- [ ] Compliance certifications (HIPAA, GDPR)
