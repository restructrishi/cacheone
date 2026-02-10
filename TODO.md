# To-Do List (from project.md PRD)

## Landing Page
- [x] **Landing page** – Hero, Supported Modules (CRM/HRMS), Key Benefits, Login CTA
- [x] **CTAs** – "Login as Super Admin" + optional "Request Demo"

## Authentication & Access
- [x] **Auth** – Role-based Super Admin login (email + password; optional SSO)
- [ ] **Post-login redirect** – No orgs → Org Creation page; orgs exist → Org Management Dashboard

## Super Admin Dashboard
- [x] **Dashboard** – Orgs list, Create Org, Module overview, System status

## Organization Creation
- [ ] **Org creation form** – Name* (required), Industry, Size, Contact Email, Status (Active default)
- [ ] **Default modules** – CRM + Organisation auto-enabled; HRMS optional toggle
- [ ] **Module config** – Organisation & CRM enabled+locked; HRMS disabled+editable

## Organization Management
- [ ] **Org list view** – Name, Active modules, Status, Created date, Actions
- [ ] **Org actions** – Edit, Enable/Disable modules, Activate/Suspend, View summary

## Backend / Post-Creation
- [ ] **Post-creation** – Init DB/config, apply module config, provision default roles, show in dashboard
- [ ] **Permissions** – Super Admin CRUD + module toggling; strict org data isolation

## Non-Functional
- [ ] **Performance** – Page load <2s, Org creation <5s; 10k+ orgs scale
- [ ] **Security** – RBAC, secure API auth, data isolation per org

---

*Out of scope (Phase 1): End-user CRM functionality, HRMS workflows, external user registration.*
