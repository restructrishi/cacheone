# Product Requirements Document (PRD)
## Super Admin–Driven Organization & Module Setup Platform

---

## 1. Overview

This document defines the requirements for building a **Landing Page** and an **end-to-end Super Admin–driven setup flow** that allows:
- Super Admin login
- Organization creation & management
- Default and optional module selection (CRM, HRMS)
- Automatic provisioning of selected modules per organization

The platform is designed to support **multi-tenant organizations** with scalable module-based architecture.

---

## 2. Goals & Objectives

### Primary Goals
- Enable Super Admin to onboard and manage multiple organizations
- Allow modular product activation (CRM, HRMS)
- Provide a clean, guided setup experience from landing page to dashboard

### Success Metrics
- Organization creation completed in < 3 minutes
- Zero manual backend intervention required
- Default CRM access enabled automatically post-creation

---

## 3. User Roles

### 3.1 Super Admin
- Full platform access
- Can create, edit, activate, deactivate organizations
- Can enable/disable modules per organization
- Can manage organization status and metadata

### 3.2 Organization Admin (Future Scope)
- Manages users within their organization
- Access limited to enabled modules only

---

## 4. Landing Page Requirements

### Purpose
- Explain platform value proposition
- Drive Super Admin login
- Act as the entry point to the system

### Sections
- Hero section (Product overview)
- Supported Modules (CRM, HRMS)
- Key Benefits
- Login CTA (Super Admin only)

### CTAs
- **Login as Super Admin**
- **Request Demo** (optional)

---

## 5. Authentication & Access Flow

### Login
- Role-based login (Super Admin)
- Secure authentication (email + password / SSO – optional)

### Post Login Redirect
- If no organizations exist → redirect to **Organization Creation Page**
- If organizations exist → redirect to **Organization Management Dashboard**

---

## 6. Super Admin Dashboard

### Purpose
Central control panel for managing all organizations.

### Core Sections
- Organizations List
- Create Organization
- Module Overview
- System Status

---

## 7. Organization Creation Flow

### Entry Point
- Visible immediately after Super Admin login (first-time or via dashboard)

### Organization Creation Form
**Fields**
- Organization Name (required)
- Industry Type
- Organization Size
- Contact Email
- Status (Active by default)

### Default Behavior
- **CRM module is auto-selected**
- **Organization module is auto-enabled**
- HRMS is optional (toggle)

### Module Selection
- CRM → Enabled & locked by default
- HRMS → Optional checkbox
- Future modules → Disabled by default

---

## 8. Module Configuration Logic

### Default Configuration
| Module | Status | Editable |
|------|-------|----------|
| Organization | Enabled | No |
| CRM | Enabled | No |
| HRMS | Disabled | Yes |

### Rules
- At least one core module (CRM) must be active
- Disabled modules are inaccessible to org users
- Modules can be enabled/disabled later by Super Admin

---

## 9. Organization Management

### Organization List View
- Organization Name
- Active Modules
- Status (Active / Suspended)
- Created Date
- Actions

### Actions
- Edit Organization Details
- Enable/Disable Modules
- Activate / Suspend Organization
- View Organization Summary

---

## 10. Post-Creation System Behavior

Once organization is created:
- Database schema is initialized
- Module-specific configurations are applied
- Default roles are provisioned
- Organization appears in dashboard instantly

---

## 11. Permissions & Access Control

### Super Admin Permissions
- Full CRUD on organizations
- Module toggling
- System-level visibility

### Organization Isolation
- Each organization data is strictly isolated
- Modules load based on organization configuration

---

## 12. Non-Functional Requirements

### Performance
- Page load < 2 seconds
- Organization creation < 5 seconds

### Security
- Role-based access control
- Secure API authentication
- Data isolation per organization

### Scalability
- Support 10,000+ organizations
- Plug-and-play module onboarding

---

## 13. Assumptions

- CRM is the core product
- HRMS is an add-on module
- Super Admin is internal (not customer-facing)

---

## 14. Future Enhancements

- Billing & subscription management
- Organization Admin self-onboarding
- Module marketplace
- Audit logs & activity tracking

---

## 15. Out of Scope (Phase 1)

- End-user CRM functionality
- HRMS workflows
- External user registration

---

## 16. Open Questions

- Should module pricing be linked at creation?
- Do we allow organization deletion or only suspension?
- Should HRMS require additional configuration steps?

---
