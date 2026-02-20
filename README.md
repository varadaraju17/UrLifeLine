# 🚨 UrLifeLine — Disaster Management & Alert System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)

**A full-stack emergency response platform for coordinating disaster relief across India — built for Admins, Field Officers, and Citizens.**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [User Roles & Permissions](#user-roles--permissions)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Default Credentials](#default-credentials)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Emergency Contacts](#emergency-contacts-india)

---

## 🌐 Overview

**UrLifeLine** is a real-time disaster management platform enabling multi-role emergency coordination. It connects administrators, field officers, volunteers, and citizens into a single command-and-response system with:

- **Real-time alert broadcasting** by state and district
- **Rescue request management** from citizens with geolocation
- **Emergency team seeding** across 86+ Indian districts (533+ pre-seeded teams)
- **Volunteer registration and alerting** by district
- **Interactive map visualizations** of disaster-affected zones
- **Shelter and resource tracking** for displaced citizens
- **JWT-secured role-based access control**

---

## ✨ Key Features

### 🔴 Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Officer Management** | Create and manage field officer accounts with district assignments |
| **Disaster Declaration** | Register disasters with type, severity, and geolocation |
| **Task Assignment** | Assign tasks to officers by priority, location, and type |
| **Alert Broadcasting** | Send emergency alerts targeting specific districts or entire states |
| **Affected Area Mapping** | Mark and track geographic areas with severity levels |
| **Shelter Management** | Create/edit shelters with real-time occupancy tracking |
| **Resource Management** | Track emergency supplies (food, water, medical kits, etc.) |
| **Citizen Queries** | Review and respond to public queries |
| **Emergency Teams** | View and manage all 533+ pre-seeded emergency teams |
| **Rescue Requests** | View all active rescue requests across all districts |

### 👮 Officer Dashboard
| Feature | Description |
|---------|-------------|
| **Task Management** | View and update assigned tasks with progress percentages |
| **Send Alerts** | Broadcast emergency alerts to their assigned district |
| **Emergency Teams Tab** | View fire, ambulance, NDRF, police teams in their district |
| **Volunteers Tab** | See all registered volunteers in their district |
| **Rescue Operations Tab** | View incoming rescue requests and assign teams/volunteers |
| **Assign Teams & Volunteers** | Link emergency teams and volunteers to rescue requests |
| **Shelter Occupancy** | Update shelter data in real time |
| **Alert History** | View and delete previously sent alerts |

### 🧑‍🤝‍🧑 Citizen Dashboard
| Feature | Description |
|---------|-------------|
| **Active Alerts** | Receive emergency alerts broadcast to their district |
| **Request Rescue** | Submit geo-tagged rescue requests with urgency level |
| **My Rescue Requests** | Track the status of their submitted requests |
| **Volunteer Registration** | Register as a volunteer with skills and availability |
| **Shelter Finder** | Find nearby shelters with capacity and facility info |
| **Resource Locator** | View available emergency resources near them |
| **Query Submission** | Submit queries and track response status |

### 🗺️ Core Platform Features
- **Interactive Map** — Leaflet.js map with affected areas, shelters, and resources
- **District-Level Filtering** — All data scoped to the user's state & district
- **Geolocation Capture** — Rescue requests auto-capture GPS coordinates
- **Volunteer Alerts** — Automatic alert created when officer assigns volunteers to a rescue request
- **533+ Pre-Seeded Emergency Teams** — Fire, Ambulance, Police, NDRF seeded across 86 districts
- **"Lifeline Pulse" Dark Theme** — Glassmorphism UI with neon accents
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **JWT Authentication** — Stateless, secure authentication with 24-hour token expiry

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Core language |
| Spring Boot | 3.2.1 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | ORM & database abstraction |
| JWT (JJWT) | 0.11.x | Stateless token auth |
| H2 Database | in-memory | Development database |
| MySQL | 8.0+ | Production database |
| Hibernate | 6.4.x | ORM implementation |
| Lombok | 1.18.x | Boilerplate reduction |
| Maven | 3.6+ | Build automation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI library |
| Vite | 5.x | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | — | Animations & transitions |
| Leaflet / React-Leaflet | 1.9.4 / 4.2.3 | Interactive maps |
| Axios | 1.x | HTTP client |
| Lucide React | — | Icon library |

---

## 👥 User Roles & Permissions

### `ROLE_ADMIN`
- ✅ Create and manage officer accounts
- ✅ Declare and track disasters
- ✅ Assign tasks to officers
- ✅ Create shelters and resources
- ✅ Broadcast emergency alerts to any district/state
- ✅ View all rescue requests (all districts)
- ✅ Manage citizen queries
- ✅ Delete alerts and manage emergency teams
- ✅ View 533+ seeded emergency teams

### `ROLE_OFFICER`
- ✅ View tasks assigned to them
- ✅ Update task progress (0–100%)
- ✅ Send alerts to their district
- ✅ View emergency teams in their district
- ✅ View volunteers in their district
- ✅ View and manage rescue requests in their district
- ✅ Assign teams & volunteers to rescue requests
- ✅ Update shelter occupancy
- ✅ Respond to citizen queries
- ❌ Cannot manage other officers or create tasks

### `ROLE_CITIZEN`
- ✅ View active alerts for their district
- ✅ Submit rescue requests with geolocation
- ✅ Track status of their rescue requests
- ✅ Register / unregister as a volunteer
- ✅ Set volunteer skills and availability
- ✅ Find available shelters
- ✅ View emergency resources
- ✅ Submit and track queries
- ❌ Cannot access any admin or officer data

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────┐
│          React Frontend (Vite)        │
│  ┌──────────┐ ┌──────────┐ ┌───────┐ │
│  │  Admin   │ │ Officer  │ │Citizen│ │
│  │Dashboard │ │Dashboard │ │Portal │ │
│  └──────────┘ └──────────┘ └───────┘ │
└───────────────────┬───────────────────┘
                    │ HTTPS / REST API
┌───────────────────▼───────────────────┐
│         Spring Boot Backend           │
│  ┌──────────────────────────────────┐ │
│  │  Spring Security + JWT Filter    │ │
│  ├──────────────────────────────────┤ │
│  │     REST Controllers (14+)       │ │
│  │  Auth · Alert · Rescue · Shelter │ │
│  │  Volunteer · EmergencyTeam · ... │ │
│  ├──────────────────────────────────┤ │
│  │         Service Layer            │ │
│  ├──────────────────────────────────┤ │
│  │     JPA Repositories (14+)       │ │
│  └──────────────────────────────────┘ │
└───────────────────┬───────────────────┘
                    │ JPA / Hibernate
┌───────────────────▼───────────────────┐
│            Database (H2/MySQL)        │
│  Users · Disasters · RescueRequests   │
│  EmergencyTeams · Alerts · Shelters   │
│  Resources · Tasks · Volunteers       │
└───────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK)
- **Node.js** v18+
- **Maven** 3.6+
- **Git**
- *(Optional for production)* **MySQL 8.0+**

---

### 1. Clone the Repository
```bash
git clone https://github.com/varadaraju17/UrLifeLine.git
cd UrLifeLine
```

---

### 2. Backend Setup (Spring Boot)
The backend runs on **http://localhost:8080**

```powershell
cd backend
.\mvnw spring-boot:run
```

> **Note**: The backend uses an **H2 in-memory database** by default. Data resets on every restart. For persistence, configure MySQL in `application.properties`.

The server will auto-seed:
- ✅ Default **Admin** account
- ✅ **533+ Emergency Teams** across 86 districts

#### H2 Console (Development)
Access the in-browser database console at:
```
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:disaster_db
User: SA
Password: (leave blank)
```

---

### 3. Frontend Setup (React)
The frontend runs on **http://localhost:5173**

```bash
cd frontend
npm install
npm run dev
```

#### Windows Note
If your folder path contains `&` or special characters, use PowerShell directly:
```powershell
cd frontend; npm run dev
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `varadarajuny@gmail.com` | `Varada883@` |
| **Officer / Citizen** | Register at `/register` | Your chosen password |

> After login, the system automatically sets the dashboard based on the account role.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| `POST` | `/api/auth/signup` | Public |
| `POST` | `/api/auth/signin` | Public |

### Alerts
| Method | Endpoint | Role |
|--------|----------|------|
| `POST` | `/api/alerts/broadcast` | OFFICER |
| `POST` | `/api/alerts/create` | ADMIN |
| `GET` | `/api/alerts/active` | CITIZEN |
| `GET` | `/api/alerts/my-alerts` | OFFICER, ADMIN |
| `DELETE` | `/api/alerts/{id}` | OFFICER, ADMIN |

### Rescue Requests
| Method | Endpoint | Role |
|--------|----------|------|
| `POST` | `/api/rescue-requests` | CITIZEN |
| `GET` | `/api/rescue-requests/my-requests` | CITIZEN |
| `GET` | `/api/rescue-requests/district/{district}` | OFFICER, ADMIN |
| `GET` | `/api/rescue-requests/district/{district}/pending` | OFFICER, ADMIN |
| `PUT` | `/api/rescue-requests/{id}/assign` | OFFICER, ADMIN |
| `PUT` | `/api/rescue-requests/{id}/status` | OFFICER, ADMIN |
| `DELETE` | `/api/rescue-requests/{id}` | ADMIN |

### Emergency Teams
| Method | Endpoint | Role |
|--------|----------|------|
| `GET` | `/api/emergency-teams/district/{district}` | OFFICER, ADMIN |
| `GET` | `/api/emergency-teams/district/{district}/available` | OFFICER, ADMIN |
| `GET` | `/api/emergency-teams/district/{district}/type/{type}` | OFFICER, ADMIN |
| `POST` | `/api/emergency-teams` | OFFICER, ADMIN |
| `PUT` | `/api/emergency-teams/{id}/status` | OFFICER, ADMIN |
| `DELETE` | `/api/emergency-teams/{id}` | OFFICER, ADMIN |

### Volunteers
| Method | Endpoint | Role |
|--------|----------|------|
| `GET` | `/api/volunteers/district/{district}` | OFFICER, ADMIN |
| `GET` | `/api/volunteers/me` | CITIZEN |
| `PUT` | `/api/volunteers/me` | CITIZEN |

### Disasters & Tasks
| Method | Endpoint | Role |
|--------|----------|------|
| `GET` | `/api/disasters/active` | All |
| `POST` | `/api/disasters/create` | ADMIN |
| `POST` | `/api/tasks/create` | ADMIN |
| `GET` | `/api/tasks/officer/{id}` | OFFICER |
| `PUT` | `/api/tasks/{id}/progress` | OFFICER |

### Shelters & Resources
| Method | Endpoint | Role |
|--------|----------|------|
| `GET` | `/api/shelters/district/{district}` | All |
| `PUT` | `/api/shelters/{id}/occupancy` | OFFICER, ADMIN |
| `GET` | `/api/resources/district/{district}` | All |

> Full endpoint documentation: see [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

---

## 📁 Project Structure

```
UrLifeLine/
├── backend/
│   └── src/main/java/com/disruptor/alertsystem/
│       ├── AlertSystemApplication.java       # Entry point
│       ├── DataInitializer.java              # Seeds admin account
│       ├── controller/                       # 14+ REST controllers
│       │   ├── AuthController.java
│       │   ├── AlertController.java
│       │   ├── RescueRequestController.java
│       │   ├── EmergencyTeamController.java
│       │   ├── VolunteerController.java
│       │   ├── ShelterController.java
│       │   ├── ResourceController.java
│       │   └── ...
│       ├── model/                            # 12+ JPA entities
│       │   ├── User.java
│       │   ├── Alert.java
│       │   ├── RescueRequest.java
│       │   ├── EmergencyTeam.java
│       │   ├── Disaster.java
│       │   └── ...
│       ├── repository/                       # JPA repositories
│       ├── service/
│       │   ├── EmergencyTeamDataSeeder.java  # Seeds 533+ teams at startup
│       │   ├── RescueRequestService.java
│       │   └── UserDetailsImpl.java
│       ├── security/
│       │   ├── WebSecurityConfig.java
│       │   ├── JwtUtils.java
│       │   └── AuthTokenFilter.java
│       └── payload/                          # DTOs
│           ├── JwtResponse.java
│           ├── LoginRequest.java
│           └── SignupRequest.java
│
├── frontend/
│   └── src/
│       ├── App.jsx                           # Routing
│       ├── components/
│       │   ├── AdminDashboard.jsx
│       │   ├── OfficerDashboard.jsx
│       │   ├── CitizenDashboard.jsx
│       │   ├── officer/
│       │   │   ├── EmergencyTeamsTab.jsx     # District emergency teams
│       │   │   ├── VolunteersTab.jsx         # District volunteers
│       │   │   └── RescueOperationsTab.jsx   # Rescue request management
│       │   ├── citizen/
│       │   │   ├── RequestRescue.jsx         # Geo-tagged rescue form
│       │   │   └── MyRescueRequests.jsx      # Request tracking
│       │   └── MapComponent.jsx             # Leaflet map
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── alertService.js
│       │   └── rescueService.js             # Teams, volunteers, rescue APIs
│       └── data/
│           └── indian_states_districts.js    # All 28 states + districts
│
├── README.md
├── API_DOCUMENTATION.md
├── SETUP_GUIDE.md
├── SYSTEM_ARCHITECTURE.md
└── render.yaml                               # Render.com deployment config
```

---

## 🗄️ Database Schema

| Entity | Key Fields |
|--------|-----------|
| `User` | id, name, email, password, role (ADMIN/OFFICER/CITIZEN), district, state, isVolunteer, volunteerSkills |
| `Disaster` | id, name, type, severity, state, district, status |
| `Alert` | id, title, message, district, state, status, broadcastTime, createdBy |
| `RescueRequest` | id, citizen, district, state, rescueType, location, latitude, longitude, urgencyLevel, status, assignedTeamIds, notifiedVolunteerIds |
| `EmergencyTeam` | id, teamName, teamType, district, status, contactPerson, phone, vehicleCount, personnelCount |
| `Shelter` | id, name, district, capacity, currentOccupancy, status, facilities |
| `Resource` | id, type, district, quantity, availableQuantity, status |
| `Task` | id, title, type, priority, assignedOfficer, district, status, progressPercentage |
| `CitizenQuery` | id, citizen, subject, category, status, officerResponse |

---

## 🔐 Security

| Feature | Details |
|---------|---------|
| **Authentication** | JWT Bearer tokens, 24-hour expiry |
| **Password Hashing** | BCrypt with strength 10 |
| **Authorization** | `@PreAuthorize` method-level RBAC on every endpoint |
| **CORS** | Configured for frontend origin with credentials |
| **CSRF** | Disabled (stateless JWT, no session) |
| **SQL Injection** | Spring Data JPA parameterized queries |
| **Input Validation** | `@NotBlank`, `@Size`, `@Email` constraints |

---

## 🌍 India Data Integration

- **All 28 States + 8 Union Territories** supported
- **700+ districts** pre-configured in frontend dropdowns
- **86 districts** fully seeded with emergency teams
- **533+ emergency teams**: Fire Brigade, Ambulance, Police, NDRF, CRPF
- Emergency helplines pre-configured: **112**, **1070**, **108**, **100**

---

## 🚀 Deployment

### Render.com (using `render.yaml`)
The project includes a `render.yaml` for one-click Render deployment.

### Manual Backend (Production)
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/alertsystem-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:mysql://your-db/disaster_db \
  --spring.datasource.username=root \
  --spring.datasource.password=yourpassword
```

### Manual Frontend (Production)
```bash
cd frontend
npm run build
# Deploy the `dist/` folder to Vercel / Netlify / static host
```

---

## 🔭 Future Roadmap

- [ ] WebSocket real-time notifications
- [ ] Push notification (FCM) for mobile
- [ ] SMS alerts via Twilio/MSG91
- [ ] React Native mobile app
- [ ] ML-based disaster prediction
- [ ] WhatsApp Bot integration
- [ ] Offline support (PWA)
- [ ] Redis caching for performance
- [ ] Admin analytics dashboard with charts
- [ ] Multi-language support (Hindi + regional languages)
- [ ] OAuth2 / Google Sign-In

---

## 📞 Emergency Contacts (India)

| Service | Number |
|---------|--------|
| All Emergencies | **112** |
| Disaster Helpline | **1070** |
| Ambulance | **108** |
| Police | **100** |
| Fire Brigade | **101** |
| NDMA Helpline | **1800-180-1111** |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

<div align="center">

**Built with ❤️ for disaster resilience in India**

*UrLifeLine — When every second counts*

</div>
