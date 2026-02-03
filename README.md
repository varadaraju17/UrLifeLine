# 🚨 Disaster Management & Alert System

A comprehensive full-stack application for managing disaster alerts, coordinating emergency response, and communicating with affected citizens across India.

**Built with**: Spring Boot (Backend) | React.js (Frontend) | Tailwind CSS | PostgreSQL/H2

---

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [System Architecture](#system-architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## ✨ Features

### 🔴 Admin Dashboard
- **Officer Management**: Create officer accounts with unique credentials
- **Disaster Declaration**: Register and track disasters by region/severity
- **Task Assignment**: Assign tasks to officers by location and type
- **Affected Area Mapping**: Mark and track affected areas with severity levels
- **Resource Management**: Manage shelters and emergency resources
- **Query Management**: Review and respond to citizen queries
- **Real-time Monitoring**: Track officer status and task progress

### 👮 Officer Dashboard
- **Task Management**: View assigned tasks with location and priority
- **Progress Tracking**: Update task status and completion percentage
- **Affected Area Updates**: Publish real-time updates on area severity
- **Shelter Management**: Manage shelter capacity and update occupancy
- **Resource Allocation**: Distribute resources to affected areas
- **Query Response**: Respond to citizen queries in real-time

### 👥 Citizen Portal
- **Disaster Alerts**: Receive real-time notifications for disasters in their region
- **Shelter Locator**: Find nearest shelters with capacity, facilities, and contact info
- **Resource Information**: View available resources and distribution points
- **Query Submission**: Raise queries about relief measures
- **Safety Updates**: Track disaster status and recovery progress

### 🗺️ Core Features
- **Geolocation Mapping**: Interactive maps showing affected areas, shelters, resources
- **Multi-level Severity**: CRITICAL → HIGH → MEDIUM → LOW classification
- **Location-based Filtering**: State, district, and pincode-level data organization
- **Real-time Notifications**: Push alerts for disaster incidents
- **Audit Logging**: Track all system changes and user actions
- **Data for India**: Pre-configured states, districts, and cities

---

## 📦 Prerequisites

*   **Java 17+** (JDK)
*   **Node.js** (v18+)
*   **MySQL Server** (or H2 for development)
*   **Maven** 3.6+
*   **Git**

---

## 🚀 Installation

### Backend Setup (Spring Boot)
The backend runs on `http://localhost:8080/api`

#### Using IDE (IntelliJ/Eclipse)
1. Open the `backend` folder
2. The IDE detects `pom.xml` and auto-downloads dependencies
3. Run `AlertSystemApplication.java`
4. Check http://localhost:8080/api/disasters/active

#### Using Terminal
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup (React)
The frontend runs on `http://localhost:5173`

```bash
cd frontend
npm install
npm run dev
```

Access the app at http://localhost:5173

---

## 🏗️ System Architecture

```
┌─────────────────────┐
│   React Frontend    │ (Vite)
│   - Admin Panel     │
│   - Officer Dashboard
│   - Citizen Portal  │
└────────────┬────────┘
             │ HTTP/REST
┌────────────▼────────┐
│  Spring Boot API    │ (JWT Auth)
│  - 6 Main Controllers
│  - Service Layer    │
│  - Repository Layer │
└────────────┬────────┘
             │ JPA/Hibernate
┌────────────▼────────┐
│   Database (H2/MySQL)
│  - 9 Entity Models  │
│  - Relationships    │
└─────────────────────┘
```

---

## 👥 User Roles & Permissions

### ROLE_ADMIN
- ✅ Create/manage officer accounts
- ✅ Declare disasters
- ✅ Assign tasks to officers
- ✅ Create shelters and resources
- ✅ View all system data
- ✅ Manage queries
- ✅ Generate reports

### ROLE_OFFICER
- ✅ View assigned tasks
- ✅ Update task progress
- ✅ Update affected area status
- ✅ Manage shelter occupancy
- ✅ Distribute resources
- ✅ Respond to queries
- ❌ Cannot manage other officers or create tasks

### ROLE_CITIZEN
- ✅ View active disaster alerts
- ✅ Find shelter locations and facilities
- ✅ Check resource availability
- ✅ Submit queries/complaints
- ✅ Track query status
- ❌ Cannot modify any data

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login with email/password
GET    /api/auth/me               - Get current user info
```

### Disasters
```
GET    /api/disasters/active      - Get active disasters
POST   /api/disasters/create      - Create disaster (ADMIN)
PUT    /api/disasters/{id}        - Update disaster status
GET    /api/disasters/{id}        - Get disaster details
```

### Affected Areas
```
POST   /api/affected-areas/create - Add affected area (ADMIN/OFFICER)
GET    /api/affected-areas/{id}   - Get area details
GET    /api/affected-areas/disaster/{id} - Areas by disaster
GET    /api/affected-areas/state/{state} - Areas by state
PUT    /api/affected-areas/{id}/status   - Update area status
PUT    /api/affected-areas/{id}/assign-officer/{officerId} - Assign officer
```

### Tasks
```
POST   /api/tasks/create          - Create & assign task (ADMIN)
GET    /api/tasks/officer/{id}    - Get officer's tasks
PUT    /api/tasks/{id}/progress   - Update progress (OFFICER)
PUT    /api/tasks/{id}/status     - Update status
GET    /api/tasks/all             - Get all tasks (ADMIN)
DELETE /api/tasks/{id}            - Delete task (ADMIN)
```

### Shelters
```
POST   /api/shelters/create       - Create shelter
GET    /api/shelters/{id}         - Get shelter details
GET    /api/shelters/state/{state} - Shelters by state
GET    /api/shelters/available    - Available shelters
PUT    /api/shelters/{id}/occupancy - Update occupancy
GET    /api/shelters/all          - List all shelters
```

### Resources
```
POST   /api/resources/create      - Add resource
GET    /api/resources/{id}        - Get resource details
GET    /api/resources/type/{type} - Resources by type
GET    /api/resources/available   - Available resources
GET    /api/resources/state/{state} - Resources by state
PUT    /api/resources/{id}/quantity - Update quantity
```

### Officer Management (Admin)
```
POST   /api/admin/create-officer  - Create officer account
GET    /api/admin/officers        - List admin's officers
PUT    /api/admin/officers/{id}   - Update officer details
PUT    /api/admin/officers/{id}/status - Change officer status
PUT    /api/admin/officers/{id}/deactivate - Deactivate officer
PUT    /api/admin/officers/{id}/activate   - Activate officer
```

### Citizen Queries
```
POST   /api/queries/create        - Submit query (CITIZEN)
GET    /api/queries/{id}          - Get query details
GET    /api/queries/citizen/my-queries - My submitted queries
GET    /api/queries/officer/{id}  - Officer's assigned queries
PUT    /api/queries/{id}/assign/{officerId} - Assign to officer
PUT    /api/queries/{id}/respond  - Add response
GET    /api/queries/open          - Open queries (ADMIN/OFFICER)
```

---

## 📊 Database Schema

### Core Entities
1. **User** - Admin, Officer, Citizen accounts
2. **Disaster** - Disaster incidents with severity & location
3. **AffectedArea** - Geographic areas impacted by disasters
4. **Task** - Assigned jobs for officers (rescue, assessment, etc.)
5. **Shelter** - Temporary shelters with capacity & facilities
6. **Resource** - Emergency resources (food, water, medical, etc.)
7. **CitizenQuery** - Public queries and responses
8. **Alert** - Notification system
9. **Report** - Incident reports and status updates

### Key Relationships
- User → Role (One-to-Many)
- Disaster → AffectedAreas (One-to-Many)
- User (Admin) → User (Officers) (One-to-Many)
- Task → User (Assigned Officer) (Many-to-One)
- Task → AffectedArea (Many-to-One)
- Shelter → Disaster (Many-to-One)
- Resource → Disaster (Many-to-One)

---

## 🌍 India Data Integration

The system is pre-configured with:
- **28 States & 8 Union Territories** of India
- **District-level** subdivisions
- **City/Pincode** mapping for precise location tracking
- **Regional disaster patterns** and common disaster types

---

## 🎨 UI/UX Improvements

### Color Scheme
- **Admin**: Blue theme (#2563eb)
- **Officer**: Green theme (#16a34a)
- **Citizen**: Amber theme (#f59e0b)

### Features
- ✨ Responsive design (Mobile/Tablet/Desktop)
- 🎯 Intuitive navigation with role-based menus
- 📊 Real-time status indicators
- 🔔 Alert notifications
- 📱 Mobile-friendly interface
- ♿ Accessibility compliant

---

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
cd backend
heroku login
heroku create app-name
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

### Docker Deployment
```bash
docker-compose up --build
```

---

## 🔐 Security Features

- ✅ JWT Token Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Password Encryption (BCrypt)
- ✅ CORS Protection
- ✅ SQL Injection Prevention
- ✅ HTTPS Support (Production)

---

## 📈 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Emergency Contacts (India)

- **All Emergencies**: 112
- **Disaster Helpline**: 1070
- **National Disaster Management Authority**: 1800-180-1111

---

## 📄 License

This project is licensed under MIT License - see LICENSE file for details

---

## 👨‍💻 Developed By

Disaster Management System Team | 2026

For support, email: support@disastermanagement.in

**Last Updated**: January 2026

### Option B: Using Command Line (Requires Maven)
1.  Open terminal in `backend` folder.
2.  Run:
    ```bash
    mvn spring-boot:run
    ```

---

## 3. Frontend Setup (React)
The frontend runs on `http://localhost:5173`.

### Important Note on Path Issues
If your project folder name contains special characters like `&`, `npm run dev` might fail on Windows.

**Solution**: Use the provided helper script.

1.  Open terminal in `frontend` folder.
2.  Run:
    ```powershell
    .\run_frontend.ps1
    ```

**Standard Method** (If folder name is simple):
1.  `npm install`
2.  `npm run dev`

---

## 4. Default Credentials
*   **Sign Up**: Go to `/register` to create a new user.
*   **Roles**:
    *   `citizen` (Default)
    *   `responder`
    *   `admin`
