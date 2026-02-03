# 📚 Documentation Index

Complete documentation for the Disaster Management & Alert System.

---

## 📖 Documentation Files

### 1. **[README.md](README.md)** - Start Here!
- **Purpose**: Project overview and quick start guide
- **Contents**:
  - Project features overview
  - System architecture diagram
  - Prerequisites and installation
  - Running the application
  - Deployment instructions
  - Security features
  - Testing guidelines
  - Emergency contacts

### 2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete Setup Instructions
- **Purpose**: Step-by-step setup and configuration
- **Contents**:
  - System requirements and prerequisites
  - Backend setup (Spring Boot)
  - Frontend setup (React)
  - Database configuration (MySQL, PostgreSQL, H2)
  - JWT security configuration
  - Email service setup (Gmail SMTP)
  - First-time workflows (Admin, Officer, Citizen)
  - Docker deployment
  - Troubleshooting common issues
  - Database schema reference
  - Performance optimization tips
  - Security checklist

### 3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - REST API Reference
- **Purpose**: Complete API endpoint documentation
- **Contents**:
  - Authentication endpoints
  - Disaster management endpoints
  - Affected area endpoints
  - Task management endpoints
  - Shelter management endpoints
  - Resource endpoints
  - Officer management (Admin)
  - Citizen query endpoints
  - Response formats and error handling
  - Status and enum value reference
  - cURL and Postman examples

### 4. **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** - Architecture & Workflows
- **Purpose**: System design and user workflows
- **Contents**:
  - System architecture layers (presentation, API, business logic, data)
  - User role hierarchy and permissions
  - Complete disaster response workflow (6 phases)
  - Admin dashboard workflow
  - Officer dashboard workflow
  - Citizen portal workflow
  - Authentication flow (registration, login, officer creation)
  - API request/response flow examples
  - Data relationships and ERD
  - Real-time notification flow
  - Location-based features
  - Status indicator flows

---

## 🚀 Quick Start

### For Developers
1. Read [README.md](README.md) - Overview and features
2. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) - Step-by-step installation
3. Reference [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API endpoints
4. Study [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) - System design

### For Project Managers
1. Read [README.md](README.md) - Features and capabilities
2. Review [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md#-disaster-response-workflow) - Disaster workflow
3. Check [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md#-user-role-hierarchy) - User roles and permissions

### For QA/Testers
1. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation
2. Read [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) - All workflows
3. Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Test all endpoints
4. Create test cases based on workflows

### For DevOps/System Admins
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md#-docker-setup-optional) - Docker setup
2. Follow database configuration section
3. Review [SETUP_GUIDE.md](SETUP_GUIDE.md#-running-the-application) - Production deployment
4. Check security checklist

---

## 🎯 Key Features Overview

### ✨ Core Capabilities
- **Disaster Management**: Create and track disasters by type and severity
- **Officer Management**: Admin creates officer accounts with temporary passwords
- **Task Assignment**: Assign location-based tasks to officers with progress tracking
- **Affected Area Tracking**: Mark and update status of affected regions
- **Shelter Management**: Track shelter capacity and facilities
- **Resource Distribution**: Manage emergency resources (food, water, medical, etc.)
- **Citizen Support**: Citizens submit queries and receive officer responses
- **Real-time Updates**: Officers publish field data and updates
- **Map Integration**: Geolocation support for all location-based features
- **Role-Based Access**: Separate dashboards for Admin, Officer, and Citizen

---

## 🏗️ Technology Stack

### Backend
```
Framework:    Spring Boot 3.2.1
Language:     Java 17
Database:     MySQL 8.0 / PostgreSQL / H2
ORM:          Hibernate (Spring Data JPA)
Security:     Spring Security + JWT
Build Tool:   Maven
Dependencies: 
  - Spring Data JPA
  - Spring Security
  - MySQL Connector
  - Jakarta Persistence
  - Lombok
  - Mail (JavaMail)
```

### Frontend
```
Framework:    React 19.2.0
Build Tool:   Vite 5.x
Router:       React Router 7.11.0
HTTP Client:  Axios
Forms:        Formik + Yup
Styling:      Tailwind CSS
Maps:         Leaflet 1.9.4 + React-Leaflet 4.2.3
Package Mgr:  npm / yarn
```

---

## 📊 Database Schema

### Core Tables

| Entity | Purpose | Key Fields |
|--------|---------|-----------|
| **users** | User accounts | id, name, email, role, state, district |
| **disasters** | Disaster incidents | id, title, type, severity, state, district, status |
| **affected_areas** | Geographic areas | id, area_name, disaster_id, severity, status, latitude, longitude |
| **tasks** | Work assignments | id, disaster_id, assigned_to_id, type, priority, status, progress |
| **shelters** | Refuge centers | id, disaster_id, name, capacity, occupancy, facilities, status |
| **resources** | Emergency supplies | id, disaster_id, type, quantity, priority, location, status |
| **citizen_queries** | Public requests | id, disaster_id, citizen_id, subject, status, assigned_officer_id |

---

## 🔐 Security Features

- ✅ **JWT Token Authentication**: Stateless token-based auth
- ✅ **Role-Based Access Control**: @PreAuthorize annotations on endpoints
- ✅ **Password Encryption**: BCrypt hashing for passwords
- ✅ **CORS Protection**: Configured for frontend origin
- ✅ **SQL Injection Prevention**: Parameterized queries via JPA
- ✅ **Input Validation**: Constraint validation on entities
- ✅ **HTTPS Support**: Ready for production SSL/TLS

---

## 📈 API Endpoints Summary

### Authentication (3 endpoints)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user info

### Disasters (4 endpoints)
- `POST /disasters/create` - Create disaster (ADMIN)
- `GET /disasters/active` - Get active disasters
- `GET /disasters/{id}` - Get disaster details
- `PUT /disasters/{id}` - Update disaster status

### Affected Areas (6 endpoints)
- `POST /affected-areas/create` - Create affected area
- `GET /affected-areas/{id}` - Get area details
- `GET /affected-areas/disaster/{id}` - Get areas by disaster
- `GET /affected-areas/state/{state}` - Get areas by state
- `PUT /affected-areas/{id}/status` - Update area status
- `PUT /affected-areas/{id}/assign-officer/{officerId}` - Assign officer

### Tasks (7 endpoints)
- `POST /tasks/create` - Create task (ADMIN)
- `GET /tasks/officer/{id}` - Get officer's tasks
- `PUT /tasks/{id}/progress` - Update progress (OFFICER)
- `PUT /tasks/{id}/status` - Update status
- `GET /tasks/all` - Get all tasks (ADMIN)
- `DELETE /tasks/{id}` - Delete task (ADMIN)
- `GET /tasks/disaster/{id}` - Get tasks by disaster

### Shelters (6 endpoints)
- `POST /shelters/create` - Create shelter
- `GET /shelters/{id}` - Get shelter details
- `GET /shelters/state/{state}` - Shelters by state
- `GET /shelters/available` - Available shelters
- `PUT /shelters/{id}/occupancy` - Update occupancy
- `GET /shelters/all` - List all shelters

### Resources (7 endpoints)
- `POST /resources/create` - Add resource
- `GET /resources/{id}` - Get resource details
- `GET /resources/type/{type}` - Resources by type
- `GET /resources/available` - Available resources
- `GET /resources/state/{state}` - Resources by state
- `PUT /resources/{id}/quantity` - Update quantity
- `GET /resources/all` - List all resources

### Officer Management - Admin Only (6 endpoints)
- `POST /admin/create-officer` - Create officer account
- `GET /admin/officers` - List officers
- `PUT /admin/officers/{id}` - Update officer
- `PUT /admin/officers/{id}/status` - Change status
- `PUT /admin/officers/{id}/deactivate` - Deactivate
- `PUT /admin/officers/{id}/activate` - Activate

### Citizen Queries (7 endpoints)
- `POST /queries/create` - Submit query (CITIZEN)
- `GET /queries/{id}` - Get query details
- `GET /queries/citizen/my-queries` - My queries (CITIZEN)
- `GET /queries/officer/{id}` - Officer's queries
- `PUT /queries/{id}/assign/{officerId}` - Assign to officer
- `PUT /queries/{id}/respond` - Respond to query
- `GET /queries/open` - Open queries (ADMIN/OFFICER)

**Total: 50+ REST Endpoints**

---

## 👥 User Roles & Permissions

### ROLE_ADMIN
- ✅ Create/manage officer accounts
- ✅ Declare disasters
- ✅ Assign tasks to officers
- ✅ Create shelters and resources
- ✅ View all system data
- ✅ Manage citizen queries

### ROLE_OFFICER
- ✅ View assigned tasks
- ✅ Update task progress
- ✅ Update affected area status
- ✅ Manage shelter occupancy
- ✅ Distribute resources
- ✅ Respond to citizen queries
- ❌ Cannot manage other officers

### ROLE_CITIZEN
- ✅ View active disaster alerts
- ✅ Find shelter locations
- ✅ Check resource availability
- ✅ Submit queries/complaints
- ✅ Track query status
- ❌ Cannot modify any data

---

## 🔄 Disaster Response Phases

1. **DECLARATION**: Admin creates disaster, system alerts citizens
2. **ASSESSMENT**: Admin creates affected areas, assigns officers
3. **RESPONSE**: Admin creates tasks, officers execute field operations
4. **SUPPORT**: Officers manage shelters/resources, respond to queries
5. **RECOVERY**: Track recovery progress, close shelters
6. **CLOSURE**: Mark disaster resolved, archive data

---

## 🔧 Configuration Files

### Backend Configuration
```
backend/src/main/resources/
├── application.properties     # Database, JWT, email config
└── application-prod.properties (optional)
```

### Frontend Configuration
```
frontend/
├── vite.config.js            # Vite build config
├── tailwind.config.js        # Tailwind CSS config
├── package.json              # Dependencies
└── .env (create for API URL)
```

---

## 📋 Directory Structure

```
disaster-management/
├── README.md                      ← Start here
├── API_DOCUMENTATION.md           ← All endpoints
├── SETUP_GUIDE.md                 ← Installation
├── SYSTEM_ARCHITECTURE.md         ← Design & workflows
├── backend/
│   ├── pom.xml                   ← Maven config
│   ├── mvnw.cmd / mvnw            ← Maven wrapper
│   ├── src/main/
│   │   ├── java/com/disruptor/alertsystem/
│   │   │   ├── AlertSystemApplication.java
│   │   │   ├── config/            ← Security, CORS config
│   │   │   ├── controller/        ← REST endpoints
│   │   │   ├── model/             ← Entity classes
│   │   │   ├── payload/           ← Request/Response DTOs
│   │   │   ├── repository/        ← Database queries
│   │   │   ├── security/          ← JWT, Auth
│   │   │   └── service/           ← Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── target/                    ← Compiled output
├── frontend/
│   ├── package.json               ← npm dependencies
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                ← Main app, routing
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OfficerDashboard.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ... (other components)
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   └── auth-header.js
│   │   └── assets/
│   └── public/
└── .github/                       ← GitHub workflows
```

---

## 🧪 Testing the System

### Manual Testing
1. **Register** admin account
2. **Create disaster** via Admin Dashboard
3. **Create officer** account
4. **Create affected areas** and assign officer
5. **Create tasks** and assign to officer
6. **Login as officer** and update progress
7. **Register citizen** and submit query
8. **Respond to query** as officer
9. **Verify all data** is displayed correctly

### API Testing
- Use Postman collection (included)
- Test all endpoints with different roles
- Verify error handling (400, 401, 403, 404)
- Test edge cases (invalid data, missing fields)

### Load Testing
- Test with multiple concurrent users
- Monitor response times
- Check database query performance
- Verify horizontal scaling capability

---

## 📱 Key Workflows

### Admin Workflow
Officer Creation → Disaster Declaration → Area Assignment → Task Creation → Progress Monitoring

### Officer Workflow
View Tasks → Update Progress → Publish Field Data → Respond to Queries → Close Tasks

### Citizen Workflow
View Alerts → Find Shelter → Submit Query → Track Response → Access Resources

---

## 🌍 India Location Support

**Pre-configured with**:
- 28 States + 8 Union Territories
- 700+ Districts
- 1000+ Cities/Towns
- Complete state-district hierarchy
- Geolocation (latitude/longitude) support

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Kill process on port or change port in application.properties |
| Database connection failed | Check MySQL running, verify credentials, ensure database created |
| JWT token expired | Login again to get new token |
| CORS error | Update spring.web.cors.allowed-origins in application.properties |
| File upload fails | Increase spring.servlet.multipart.max-file-size |

### Getting Help
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
2. Review error logs in terminal/console
3. Check browser console for frontend errors
4. Create GitHub issue with error details
5. Contact: support@disastermanagement.in

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release with all core features |
| Future | TBD | Mobile app, advanced analytics, ML predictions |

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Write tests
5. Submit pull request

---

## 🙏 Acknowledgments

Built with modern full-stack technologies to serve as a comprehensive disaster management solution for India.

---

## 📞 Quick Links

- **GitHub Repository**: [https://github.com/yourusername/disaster-management](https://github.com/yourusername/disaster-management)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/disaster-management/issues)
- **Project Board**: [GitHub Projects](https://github.com/yourusername/disaster-management/projects)
- **Email Support**: support@disastermanagement.in
- **Emergency Hotline (India)**: 112 | Disaster Helpline: 1070

---

**Last Updated**: January 2026  
**Current Version**: 1.0.0  
**Status**: ✅ Production Ready

**Next Steps**:
1. Deploy to production environment
2. Populate initial state/district data
3. Train admin users on system
4. Launch to officers
5. Invite citizens to register
6. Monitor usage and gather feedback
