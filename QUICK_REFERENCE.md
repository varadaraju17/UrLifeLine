# 🚀 Quick Reference Guide

Fast lookup for common tasks and important information.

---

## ⚡ Start Here in 5 Minutes

### 1. Prerequisites Check
```bash
java -version          # Should show Java 17+
node --version        # Should show Node 18+
npm --version        # Should be included
mysql --version      # Should show MySQL 8.0+
```

### 2. Backend Start (Terminal 1)
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Wait for: "Started AlertSystemApplication in X seconds"
```

### 3. Frontend Start (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### 4. First Login
```
Admin Account:
  Email: admin@example.com
  Password: YourPassword123
  
Navigate to: http://localhost:5173
Click: Login
```

---

## 🎯 Common Tasks

### Create First Disaster (Admin)
1. Login as Admin
2. Go to Admin Dashboard
3. Fill "Create Disaster" form
4. Set severity: CRITICAL
5. Click Submit

### Create Officer Account (Admin)
1. Admin Dashboard → Officers Tab
2. Click "Create New Officer"
3. Enter: Name, Email, Phone, State, District
4. Click "Create Officer"
5. Copy temporary password and send to officer

### Assign Task (Admin)
1. Admin Dashboard → Tasks Tab
2. Click "Create New Task"
3. Fill: Title, Type, Priority, Officer, Due Date
4. Click "Assign Task"

### Officer Updates Progress
1. Login as Officer
2. Officer Dashboard → Tasks Tab
3. Click task → "Update Progress"
4. Set percentage (25%, 50%, 75%, 100%)
5. Submit

### Citizen Finds Shelter
1. Login as Citizen
2. Citizen Dashboard → Shelters Tab
3. View available shelters
4. Click for details and contact info

---

## 🗂️ Important File Locations

```
Backend Config:
  backend/src/main/resources/application.properties

Frontend Routes:
  frontend/src/App.jsx

Main Classes:
  Backend: src/main/java/com/disruptor/alertsystem/
  Frontend: src/components/

Database:
  Create: CREATE DATABASE disaster_db;
  Access: mysql -u root -p disaster_db
```

---

## 🔑 Configuration Essentials

### Database Connection
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/disaster_db
spring.datasource.username=root
spring.datasource.password=root
```

### JWT Secret (Change in Production!)
```properties
app.jwtSecret=your_super_secret_key_here
app.jwtExpirationMs=86400000  # 24 hours
```

### Email Service (Gmail)
```properties
spring.mail.host=smtp.gmail.com
spring.mail.username=your_email@gmail.com
spring.mail.password=app_password (16 chars)
```

---

## 🧪 Testing APIs with cURL

### Login and Get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Returns: { "token": "eyJhbGc..." }
```

### Get Active Disasters
```bash
curl -X GET http://localhost:8080/api/disasters/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Disaster (Admin Only)
```bash
curl -X POST http://localhost:8080/api/disasters/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Flash Flood",
    "disasterType": "FLOOD",
    "severity": "CRITICAL",
    "state": "Maharashtra",
    "district": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'
```

---

## 🎨 UI Navigation

### Admin Dashboard
```
Top Navigation:
  ├── Admin Dashboard (current)
  ├── Disasters
  ├── Profile
  └── Logout

Tabs:
  ├── Officers (create/manage)
  └── Tasks (create/assign)
```

### Officer Dashboard
```
Top Navigation:
  ├── Officer Dashboard (current)
  ├── Alerts
  ├── Profile
  └── Logout

Tabs:
  ├── Tasks (my tasks, progress)
  ├── Areas (update status)
  └── Shelters (manage occupancy)
```

### Citizen Dashboard
```
Top Navigation:
  ├── Citizen Dashboard (current)
  ├── Profile
  └── Logout

Tabs:
  ├── Alerts (disasters)
  ├── Shelters (find shelter)
  └── Queries (submit/track)
```

---

## 🔐 User Credentials Template

### Admin Registration
```
Name: System Admin
Email: admin@example.com
Password: SecurePass123!
Role: ADMIN
State: Maharashtra
District: Mumbai
```

### Officer Account (Created by Admin)
```
Name: Field Officer
Email: officer@example.com
Phone: 9876543210
State: Maharashtra
District: Mumbai
Location: Bandra
Temporary Password: TEMP_2026_uuid (auto-generated)
```

### Citizen Registration
```
Name: John Citizen
Email: citizen@example.com
Password: SecurePass123!
Role: CITIZEN
State: Maharashtra
District: Mumbai
```

---

## 📊 Database Quick Commands

### Connect to MySQL
```bash
mysql -u root -p
# Enter password: root
```

### View Database
```sql
USE disaster_db;
SHOW TABLES;
DESC users;
SELECT * FROM disasters;
```

### Reset Database
```sql
DROP DATABASE disaster_db;
CREATE DATABASE disaster_db;
# Restart backend - tables auto-created
```

---

## 🐛 Troubleshooting Quick Fixes

### Port 8080 Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :8080
kill -9 [PID]

# Or change port in application.properties
server.port=8081
```

### MySQL Connection Failed
```bash
# Check MySQL running
mysql -u root -p

# Reset password if forgotten
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;

# Update application.properties
spring.datasource.password=newpassword
```

### CORS Error in Frontend
```properties
# Add to application.properties
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

### JWT Token Expired
```
Error: 401 Unauthorized - Invalid or expired token

Solution: Logout and login again to get new token
```

### Dependencies Not Downloaded
```bash
# Clean and rebuild
mvn clean
mvn install -DskipTests

# Or
mvn dependency:resolve
```

---

## 📈 Performance Tips

### Speed Up Backend Build
```bash
mvn clean install -DskipTests -T 1C
```

### Speed Up Frontend Development
```bash
npm run dev -- --open  # Auto-open browser
```

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_disaster_state ON disasters(state);
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| H2 Console | http://localhost:8080/h2-console |
| MySQL | localhost:3306 |

---

## 📱 Key Endpoints Quick Lookup

### Authentication
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
```

### Core Operations
```
POST   /disasters/create              (ADMIN)
POST   /admin/create-officer          (ADMIN)
POST   /tasks/create                  (ADMIN)
PUT    /tasks/{id}/progress           (OFFICER)
POST   /queries/create                (CITIZEN)
GET    /shelters/available            (ALL)
```

### Monitoring
```
GET    /disasters/active              (ALL)
GET    /tasks/officer/{id}            (OFFICER)
GET    /queries/citizen/my-queries    (CITIZEN)
```

---

## 🎓 Documentation Map

| Need | Document |
|------|----------|
| Overview | README.md |
| API Endpoints | API_DOCUMENTATION.md |
| Installation | SETUP_GUIDE.md |
| Architecture | SYSTEM_ARCHITECTURE.md |
| Navigation | DOCUMENTATION_INDEX.md |
| Summary | PROJECT_COMPLETION_SUMMARY.md |
| Quick Ref | This file |

---

## ✅ Pre-Launch Checklist

- [ ] Java 17+ installed
- [ ] Node.js 18+ installed
- [ ] MySQL running
- [ ] Backend builds successfully
- [ ] Frontend runs without errors
- [ ] Can login with admin account
- [ ] Can create officer account
- [ ] Can create disaster
- [ ] Can see disaster in citizen dashboard
- [ ] All API endpoints responding

---

## 🆘 Emergency Support

### Immediate Help
1. Check troubleshooting section above
2. Review error messages in console
3. Check browser's Developer Console (F12)

### Detailed Help
1. SETUP_GUIDE.md - Troubleshooting section
2. README.md - Support section
3. Check application logs in `backend/logs/`

### Contact Support
- Email: support@disastermanagement.in
- Create GitHub issue with error details

---

## 📞 Quick Numbers (India)

| Purpose | Number |
|---------|--------|
| All Emergencies | 112 |
| Disaster Helpline | 1070 |
| Police | 100 |
| Fire | 101 |
| Ambulance | 102 |

---

## 🚀 Deploy to Production

### Quick Deploy Steps
1. Update `application.properties` with prod values
2. Change JWT secret to strong value
3. Use production MySQL database
4. Build: `mvn clean package -DskipTests`
5. Run: `java -jar target/alertsystem-0.0.1-SNAPSHOT.jar`
6. Deploy frontend build to web server

### Environment Variables (Production)
```
SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/disaster_db
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=strong_password
APP_JWT_SECRET=very_long_random_string_256_chars
SPRING_MAIL_PASSWORD=gmail_app_password
```

---

## 💾 Backup & Recovery

### Database Backup
```bash
mysqldump -u root -p disaster_db > backup.sql
```

### Database Restore
```bash
mysql -u root -p disaster_db < backup.sql
```

---

## 📋 Code Quality

### Code Format
- Java: Google Style Guide
- React: ESLint + Prettier
- Both: 2-space indentation

### Running Tests
```bash
# Backend
mvn test

# Frontend
npm test
```

---

## 🎯 Success Metrics

System is working correctly when:
- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:5173
- ✅ Can register and login
- ✅ Roles are enforced (403 for unauthorized)
- ✅ API endpoints return correct data
- ✅ All dashboards display correctly
- ✅ Can create/update records

---

## 📦 Version Information

| Component | Version |
|-----------|---------|
| Java | 17+ |
| Spring Boot | 3.2.1 |
| React | 19.2.0 |
| MySQL | 8.0+ |
| Node.js | 18+ |
| npm | Latest |

---

**Last Updated**: January 2026
**Quick Ref Version**: 1.0.0

**For comprehensive details, see full documentation in project root.**
