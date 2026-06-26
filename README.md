# Dental SaaS Frontend

## Product Overview

Dental SaaS is a modern, clinic-focused dental practice management application designed for multi-tenant dental practices. The frontend delivers a polished, workflow-driven experience for receptionists, dentists, and admins across the patient lifecycle: from booking appointments to clinical encounter management, queue operations, and practice administration.

This frontend is built with Next.js, Tailwind CSS, React Query, and a type-safe OpenAPI integration to connect with the backend services described in `BACKEND-README.md`.

## Who This Product Serves

- Dental clinic administrators who need quick visibility into daily operations
- Reception teams handling patient bookings, walk-ins, and schedule management
- Dentists and clinical staff documenting encounters, diagnoses, procedures, and treatment plans
- Practice managers configuring tenant settings and staff access across multiple clinics

## Core User Workflows

### 1. Secure Clinic Access

- Login screen for clinic staff
- Tenant-aware authentication for multi-clinic environments
- Role-based interfaces for admins, doctors, and receptionists

### 2. Appointment Management

- Daily and ranged appointment views with filters for status, source, and appointment type
- Book intake sessions and walk-in appointments
- Confirm, check in, start, complete, or mark no-shows directly from the appointment workspace
- Reschedule and create follow-up appointments from the same workflow

### 3. Live Queue Management

- Real-time queue board for the day’s patients
- Filter queues by doctor or clinic-wide view
- View waiting, serving, and completed queue counts instantly
- Refresh and manage live tokens from the queue board

### 4. Clinical Encounter Workspace

- Encounter detail screen with stage-based workflow navigation
- Central workspace for intake, examination, diagnoses, investigations, and treatment planning
- Summary panel for fast access to encounter context and patient history
- Mobile-friendly stage selector for on-the-go clinical users

### 5. Patient Registry & Medical Records

- Central patient list with filters for category, status, gender, and blood group
- Patient search and registry analytics for clinic operations
- Patient creation flows and detailed patient record management
- Soft-delete aware listing and patient status handling

### 6. Procedure Catalog & Clinical Reference

- Searchable procedure catalog with codes, categories, duration, and cost
- Active/inactive procedure management views
- Category filter and keyword search for fast procedure lookup
- Built for seamless appointment and encounter integration

### 7. Clinical Taxonomy & Reference

- Clinical registry for medical history, examination findings, diagnoses, and investigations
- Encounter stage explorer for structured clinical workflows
- Taxonomy-driven authoring for consistent clinical documentation

### 8. Staff Directory & Access Control

- Staff profile pages with overview, access, sessions, and preferences tabs
- Active / disabled user management
- Password reset, account edit, and restore operations
- Role-aware interface for doctor and admin workflows

### 9. Tenant & Clinic Settings

- Tenant settings and clinic configuration available in settings sections
- Procedure catalog and role settings administration
- Multi-tenant awareness for clinic branding and tenant-specific controls

## Product Value for Landing Page

Dental SaaS is positioned as an all-in-one clinic operations platform that brings together:

- appointment and queue management
- patient charting and clinical documentation
- treatment planning and procedure catalog reference
- role-based staff management
- real-time clinic dashboards

This makes it ideal for dental practices looking to modernize front-desk operations, reduce manual scheduling friction, and centralize clinical workflows in one SaaS application.

## Project Structure Highlights

- `src/app` — application routes and page layout
- `src/components` — reusable UI components and domain screens
- `src/hooks` — API integration hooks and query abstractions
- `src/lib` — utilities, workflow helpers, and type-safe API models
- `src/providers` — global providers for auth, tenant, and query state
- `src/config` — dashboard and product configuration data

## How to Run

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Backend Integration

This frontend consumes the backend API described in `BACKEND-README.md`, including:

- authentication and tenant sessions
- appointments, queue, and encounter management
- patient records and clinical taxonomy
- user roles, permissions, and tenant settings

## Why This System Matters

Dental SaaS is designed for real dental clinics, not generic scheduling tools. It supports the full patient journey, from reception and queue flow to clinical documentation and billing-ready procedure catalogs. That makes it a strong foundation for a polished landing page and a compelling product narrative.
