# Setup & Configuration Guide

Complete step-by-step guide for setting up and configuring the Disaster Management & Alert System.

---

## 📋 Prerequisites

### System Requirements
- **RAM**: Minimum 4GB
- **Disk Space**: 2GB (including dependencies)
- **OS**: Windows, macOS, or Linux

### Software Requirements
```
Java JDK 17+
Node.js 18+
npm/yarn
MySQL 8.0+ (or PostgreSQL 12+)
Git
```

### Ports Required
- Backend: `8080`
- Frontend: `5173` (Vite dev server)
- Database: `3306` (MySQL)

---

## 🔧 Installation Steps

### Step 1: Install Required Software

#### Windows
```powershell
# Install Java 17
choco install openjdk17  # or download from oracle.com

# Install Node.js
choco install nodejs

# Install MySQL
choco install mysql
```

#### macOS
```bash
# Install Java 17
brew install openjdk@17

# Install Node.js
brew install node

# Install MySQL
brew install mysql
```

#### Linux (Ubuntu/Debian)
```bash
# Update packages
sudo apt-get update

# Install Java 17
sudo apt-get install openjdk-17-jdk

# Install Node.js
sudo apt-get install nodejs npm

# Install MySQL
sudo apt-get install mysql-server
```

### Step 2: Clone Repository
```bash
git clone https://github.com/yourusername/disaster-management.git
cd disaster-management
```

### Step 3: Database Setup

#### Using MySQL
```sql
-- Open MySQL Workbench or MySQL CLI

-- Create database
CREATE DATABASE disaster_db;

-- Use database
USE disaster_db;

-- Check tables (will be created by Spring Boot)
SHOW TABLES;
```

#### Using PostgreSQL (Alternative)
```sql
CREATE DATABASE disaster_db;
\c disaster_db
```

### Step 4: Configure Backend

#### Edit `backend/src/main/resources/application.properties`
```properties
# ============= DATABASE CONFIGURATION =============
spring.datasource.url=jdbc:mysql://localhost:3306/disaster_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# ============= SERVER CONFIGURATION =============
server.port=8080
server.servlet.context-path=/

# ============= JWT CONFIGURATION =============
app.jwtSecret=your_super_secret_jwt_key_change_in_production
app.jwtExpirationMs=86400000

# ============= EMAIL CONFIGURATION =============
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# ============= FILE UPLOAD CONFIGURATION =============
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# ============= LOGGING CONFIGURATION =============
logging.level.root=INFO
logging.level.com.disruptor=DEBUG
```

### Step 5: Start Backend

#### Option A: Using IDE (IntelliJ IDEA/Eclipse)
1. Open `backend` folder in IDE
2. Right-click `AlertSystemApplication.java`
3. Click "Run" or press `Ctrl+Shift+F10` (IntelliJ)

#### Option B: Using Terminal
```bash
cd backend

# Clean and build
mvn clean install

# Run application
mvn spring-boot:run
```

**Expected Output**:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

...
2026-01-15 11:30:45.123  INFO 12345 --- [main] com.disruptor.alertsystem.AlertSystemApplication: Started AlertSystemApplication in 5.234 seconds
```

**Verify Backend**:
```bash
curl http://localhost:8080/api/disasters/active
```

### Step 6: Start Frontend

#### Open New Terminal
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🔑 First-Time Setup Workflows

### Workflow 1: Admin Account Creation

1. **Register as Admin**
   - Go to http://localhost:5173/register
   - Fill form with admin details
   - Select role: `ADMIN`
   - Submit

2. **Login as Admin**
   - Go to http://localhost:5173/login
   - Enter email and password
   - You'll see Admin Dashboard

### Workflow 2: Create Officer Account

1. **Admin Dashboard** → Officers Tab
2. **Fill Officer Form**:
   - Name: Rajesh Kumar
   - Email: rajesh@example.com
   - Phone: 9876543210
   - State: Maharashtra
   - District: Mumbai
   - Location: Bandra East

3. **Click "Create Officer"**
   - System generates temporary password
   - Copy and send to officer

4. **Officer Logs In** with email and temporary password
   - Officer can update own profile
   - Officer can change password

### Workflow 3: Create Disaster

1. **Admin Dashboard** → Create Disaster Section
2. **Fill Disaster Form**:
   - Title: Flash Flood in Mumbai
   - Type: FLOOD
   - Severity: CRITICAL
   - State: Maharashtra
   - District: Mumbai
   - Location: Latitude/Longitude (19.0760, 72.8777)

3. **Submit** → Disaster created and marked ACTIVE

### Workflow 4: Assign Officer to Area

1. **Admin Dashboard** → Create Affected Area
2. **Fill Area Form**:
   - Area Name: Bandra East
   - Severity: CRITICAL
   - Affected Population: 10,000
   - Select Disaster

3. **Submit** → Area created

4. **Click "Assign Officer"** → Select Officer → Confirm

### Workflow 5: Create & Assign Task

1. **Admin Dashboard** → Tasks Tab
2. **Fill Task Form**:
   - Title: Assess Building Damage
   - Type: ASSESSMENT
   - Priority: CRITICAL
   - Select Officer from dropdown
   - Due Date: Tomorrow 6 PM
   - Location: Bandra East

3. **Submit** → Task assigned

4. **Officer Dashboard** → Tasks Tab → See assigned task

### Workflow 6: Officer Updates Progress

1. **Officer Dashboard** → Tasks Tab
2. **Click task** → "Update Progress"
3. **Set percentage** (25%, 50%, 75%, 100%)
4. **Submit** → Admin sees update

---

## 🗄️ Database Configuration

### MySQL Connection (Recommended for Production)
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/disaster_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### PostgreSQL Connection (Alternative)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/disaster_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQL10Dialect
```

### H2 In-Memory (Development Only)
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## 🔐 JWT Configuration

### Generate Secure JWT Secret (Do not use example below in production)
```bash
# Generate random 256-character secret
openssl rand -base64 32 | head -c 256
```

### Update `application.properties`
```properties
app.jwtSecret=your_generated_secret_here_minimum_256_characters
app.jwtExpirationMs=86400000  # 24 hours in milliseconds
```

---

## 📧 Email Configuration (Gmail SMTP)

### Step 1: Enable 2FA on Gmail
1. Go to myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Create App Password
1. Go to myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate app password
4. Copy the 16-character password

### Step 3: Update `application.properties`
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx  # 16-char app password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.port=587
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
```

### Alternative: SendGrid
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=SG.your_sendgrid_api_key
```

---

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Build

#### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/alertsystem-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build  # Creates dist/
# Serve with any HTTP server
npx serve dist
```

---

## 🐳 Docker Setup (Optional)

### Create `Dockerfile` for Backend
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/alertsystem-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Create `Dockerfile` for Frontend
```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: disaster_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/disaster_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Run with Docker
```bash
docker-compose up --build
```

---

## 🔍 Troubleshooting

### Issue: Backend won't start
```
Error: Failed to bind to port 8080
```
**Solution**: 
```bash
# Check what's using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # macOS/Linux

# Kill process
taskkill /PID process_id /F  # Windows
kill -9 process_id  # macOS/Linux
```

### Issue: Frontend can't connect to backend
```
GET http://localhost:8080/api/... 
CORS error
```
**Solution**: Update `application.properties`
```properties
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### Issue: MySQL connection failed
```
ERROR 1045 (28000): Access denied for user 'root'@'localhost'
```
**Solution**:
```bash
# Reset MySQL password
mysql -u root -p  # Enter current password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue: JWT token expired
```
401 Unauthorized - Invalid or expired token
```
**Solution**: Login again to get new token

### Issue: File upload failing
```
413 Payload Too Large
```
**Solution**: Increase upload limit in `application.properties`
```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

---

## 📊 Database Schema

### Main Tables

#### users
- id (PK)
- name
- email (UNIQUE)
- password_hash
- phone
- role (ADMIN/OFFICER/CITIZEN)
- state
- district
- location
- is_active
- created_at
- updated_at

#### disasters
- id (PK)
- title
- description
- disaster_type
- severity
- state
- district
- latitude
- longitude
- estimated_population
- status (ACTIVE/RECOVERY/RESOLVED)
- created_by (FK → users.id)
- created_at

#### affected_areas
- id (PK)
- disaster_id (FK → disasters.id)
- area_name
- address
- latitude
- longitude
- severity
- status
- estimated_population
- assigned_officer_id (FK → users.id)
- created_at

#### tasks
- id (PK)
- disaster_id (FK → disasters.id)
- affected_area_id (FK → affected_areas.id)
- title
- description
- assigned_to_id (FK → users.id)
- created_by_id (FK → users.id)
- task_type
- priority
- status
- progress_percentage
- due_date
- created_at

#### shelters
- id (PK)
- disaster_id (FK → disasters.id)
- name
- address
- latitude
- longitude
- total_capacity
- current_occupancy
- has_water_facility
- has_food_facility
- has_medical_facility
- contact_number
- status
- created_at

#### resources
- id (PK)
- disaster_id (FK → disasters.id)
- name
- resource_type
- total_quantity
- available_quantity
- unit
- priority
- location
- state
- district
- status
- created_at

#### citizen_queries
- id (PK)
- disaster_id (FK → disasters.id)
- citizen_id (FK → users.id)
- subject
- message
- category
- location
- state
- district
- assigned_officer_id (FK → users.id)
- status
- response_text
- response_date
- created_at

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### API Testing with cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get Active Disasters
curl -X GET http://localhost:8080/api/disasters/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API Testing with Postman
1. Import API documentation
2. Set environment variables:
   - `{{baseUrl}}` = http://localhost:8080/api
   - `{{token}}` = JWT token from login
3. Run request collections

---

## 📈 Performance Tips

### Optimize Database
```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_disaster_status ON disasters(status);
CREATE INDEX idx_task_officer ON tasks(assigned_to_id);
CREATE INDEX idx_shelter_state ON shelters(state);
CREATE INDEX idx_resource_type ON resources(resource_type);
```

### Optimize Frontend
```bash
# Build optimization
cd frontend
npm run build  # Creates optimized production build

# Analyze bundle size
npm install -g bundlesize
npx webpack-bundle-analyzer
```

### Caching Strategy
```properties
# Add to application.properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
```

---

## 🔒 Security Checklist

- [ ] Change JWT secret in production
- [ ] Enable HTTPS/SSL certificates
- [ ] Set strong database password
- [ ] Enable SQL injection prevention
- [ ] Configure CORS properly
- [ ] Disable H2 console in production
- [ ] Enable Spring Security
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable password encryption
- [ ] Regular security audits

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs: `backend/logs/` or browser console
3. Create GitHub issue with details
4. Email: support@disastermanagement.in

**Last Updated**: January 2026
