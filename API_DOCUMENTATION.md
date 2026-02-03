# API Documentation

Complete REST API reference for Disaster Management & Alert System.

**Base URL**: `http://localhost:8080/api`  
**Authentication**: Bearer Token (JWT)  
**Content-Type**: `application/json`

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "role": "CITIZEN",
  "state": "Maharashtra",
  "district": "Mumbai"
}

Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CITIZEN",
  "message": "User registered successfully"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john@example.com",
  "role": "CITIZEN",
  "expiresIn": 86400
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CITIZEN",
  "phone": "9876543210",
  "state": "Maharashtra",
  "district": "Mumbai",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

## 🚨 Disaster Endpoints

### Create Disaster (Admin Only)
```http
POST /disasters/create
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Flash Flood in Mumbai",
  "description": "Severe flooding in western parts",
  "disasterType": "FLOOD",
  "severity": "CRITICAL",
  "state": "Maharashtra",
  "district": "Mumbai",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "estimatedAffectedPopulation": 50000
}

Response: 201 Created
{
  "id": 1,
  "title": "Flash Flood in Mumbai",
  "status": "ACTIVE",
  "createdBy": "admin@example.com",
  "createdAt": "2026-01-15T11:00:00Z"
}
```

### Get Active Disasters
```http
GET /disasters/active
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "title": "Flash Flood in Mumbai",
    "disasterType": "FLOOD",
    "severity": "CRITICAL",
    "state": "Maharashtra",
    "district": "Mumbai",
    "status": "ACTIVE",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "estimatedAffectedPopulation": 50000,
    "createdAt": "2026-01-15T11:00:00Z"
  }
]
```

### Get Disaster by ID
```http
GET /disasters/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "title": "Flash Flood in Mumbai",
  "description": "Severe flooding in western parts",
  "disasterType": "FLOOD",
  "severity": "CRITICAL",
  "state": "Maharashtra",
  "district": "Mumbai",
  "status": "ACTIVE",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "estimatedAffectedPopulation": 50000,
  "createdBy": "admin@example.com",
  "createdAt": "2026-01-15T11:00:00Z",
  "updatedAt": "2026-01-15T12:00:00Z"
}
```

### Update Disaster Status (Admin Only)
```http
PUT /disasters/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "RECOVERY"
}

Response: 200 OK
{
  "id": 1,
  "title": "Flash Flood in Mumbai",
  "status": "RECOVERY",
  "updatedAt": "2026-01-15T14:00:00Z"
}
```

---

## 🗺️ Affected Area Endpoints

### Create Affected Area (Admin/Officer)
```http
POST /affected-areas/create
Authorization: Bearer {admin_or_officer_token}
Content-Type: application/json

{
  "disasterId": 1,
  "areaName": "Bandra East",
  "address": "Bandra, Mumbai",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "state": "Maharashtra",
  "district": "Mumbai",
  "severity": "CRITICAL",
  "estimatedAffectedPopulation": 10000
}

Response: 201 Created
{
  "id": 1,
  "areaName": "Bandra East",
  "address": "Bandra, Mumbai",
  "severity": "CRITICAL",
  "status": "IDENTIFIED",
  "estimatedAffectedPopulation": 10000,
  "createdAt": "2026-01-15T11:30:00Z"
}
```

### Get Affected Areas by Disaster
```http
GET /affected-areas/disaster/{disasterId}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "areaName": "Bandra East",
    "address": "Bandra, Mumbai",
    "latitude": 19.0596,
    "longitude": 72.8295,
    "severity": "CRITICAL",
    "status": "IDENTIFIED",
    "estimatedAffectedPopulation": 10000,
    "assignedOfficerId": 5
  }
]
```

### Get Affected Areas by State
```http
GET /affected-areas/state/{state}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "areaName": "Bandra East",
    "state": "Maharashtra",
    "district": "Mumbai",
    "severity": "CRITICAL",
    "status": "IDENTIFIED"
  },
  {
    "id": 2,
    "areaName": "Worli",
    "state": "Maharashtra",
    "district": "Mumbai",
    "severity": "HIGH",
    "status": "UNDER_ASSESSMENT"
  }
]
```

### Update Area Status (Officer)
```http
PUT /affected-areas/{id}/status
Authorization: Bearer {officer_token}
Content-Type: application/json

{
  "status": "BEING_ASSISTED"
}

Response: 200 OK
{
  "id": 1,
  "areaName": "Bandra East",
  "status": "BEING_ASSISTED",
  "updatedAt": "2026-01-15T12:30:00Z"
}
```

### Assign Officer to Area (Admin Only)
```http
PUT /affected-areas/{id}/assign-officer/{officerId}
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "id": 1,
  "areaName": "Bandra East",
  "assignedOfficerId": 5,
  "assignedOfficerName": "Rajesh Kumar",
  "message": "Officer assigned successfully"
}
```

---

## 📋 Task Endpoints

### Create Task (Admin Only)
```http
POST /tasks/create
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Assess building damage",
  "description": "Check structural damage in residential buildings",
  "disasterId": 1,
  "affectedAreaId": 1,
  "assignedToId": 5,
  "taskType": "ASSESSMENT",
  "priority": "CRITICAL",
  "state": "Maharashtra",
  "district": "Mumbai",
  "location": "Bandra East",
  "dueDate": "2026-01-16T18:00:00Z"
}

Response: 201 Created
{
  "id": 1,
  "title": "Assess building damage",
  "assignedToName": "Rajesh Kumar",
  "taskType": "ASSESSMENT",
  "priority": "CRITICAL",
  "status": "ASSIGNED",
  "progressPercentage": 0,
  "createdAt": "2026-01-15T11:45:00Z"
}
```

### Get Officer's Tasks
```http
GET /tasks/officer/{officerId}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "title": "Assess building damage",
    "disasterId": 1,
    "affectedAreaId": 1,
    "taskType": "ASSESSMENT",
    "priority": "CRITICAL",
    "status": "IN_PROGRESS",
    "progressPercentage": 50,
    "location": "Bandra East",
    "dueDate": "2026-01-16T18:00:00Z",
    "createdAt": "2026-01-15T11:45:00Z"
  },
  {
    "id": 2,
    "title": "Distribute relief materials",
    "disasterId": 1,
    "taskType": "RESOURCE_DISTRIBUTION",
    "priority": "HIGH",
    "status": "ASSIGNED",
    "progressPercentage": 0,
    "location": "Worli",
    "dueDate": "2026-01-16T20:00:00Z"
  }
]
```

### Update Task Progress (Officer)
```http
PUT /tasks/{id}/progress
Authorization: Bearer {officer_token}
Content-Type: application/json

{
  "progressPercentage": 50
}

Response: 200 OK
{
  "id": 1,
  "title": "Assess building damage",
  "status": "IN_PROGRESS",
  "progressPercentage": 50,
  "updatedAt": "2026-01-15T13:00:00Z"
}
```

### Update Task Status (Admin/Officer)
```http
PUT /tasks/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "COMPLETED"
}

Response: 200 OK
{
  "id": 1,
  "title": "Assess building damage",
  "status": "COMPLETED",
  "progressPercentage": 100,
  "completedAt": "2026-01-15T17:00:00Z"
}
```

### Get Tasks by Status (Officer)
```http
GET /tasks/officer/{officerId}/status/{status}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "title": "Assess building damage",
    "status": "IN_PROGRESS",
    "progressPercentage": 50
  }
]
```

---

## 🏠 Shelter Endpoints

### Create Shelter (Admin/Officer)
```http
POST /shelters/create
Authorization: Bearer {admin_or_officer_token}
Content-Type: application/json

{
  "name": "Relief Camp A",
  "address": "Mumbai Central School, Bandra",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "state": "Maharashtra",
  "district": "Mumbai",
  "totalCapacity": 500,
  "currentOccupancy": 150,
  "contactPerson": "Rajesh Kumar",
  "contactNumber": "9876543210",
  "hasWaterFacility": true,
  "hasFoodFacility": true,
  "hasMedicalFacility": true,
  "hasElectricity": true,
  "hasSanitationFacility": true,
  "disasterId": 1
}

Response: 201 Created
{
  "id": 1,
  "name": "Relief Camp A",
  "address": "Mumbai Central School, Bandra",
  "totalCapacity": 500,
  "currentOccupancy": 150,
  "status": "OPERATIONAL",
  "availableSpace": 350,
  "createdAt": "2026-01-15T12:00:00Z"
}
```

### Get Available Shelters
```http
GET /shelters/available
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Relief Camp A",
    "address": "Mumbai Central School, Bandra",
    "latitude": 19.0596,
    "longitude": 72.8295,
    "totalCapacity": 500,
    "currentOccupancy": 150,
    "availableSpace": 350,
    "status": "OPERATIONAL",
    "facilities": {
      "water": true,
      "food": true,
      "medical": true,
      "electricity": true,
      "sanitation": true
    },
    "occupancyPercentage": 30,
    "contactNumber": "9876543210"
  }
]
```

### Get Shelters by State
```http
GET /shelters/state/{state}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Relief Camp A",
    "address": "Mumbai Central School, Bandra",
    "state": "Maharashtra",
    "district": "Mumbai",
    "availableSpace": 350,
    "status": "OPERATIONAL"
  }
]
```

### Update Shelter Occupancy (Officer)
```http
PUT /shelters/{id}/occupancy
Authorization: Bearer {officer_token}
Content-Type: application/json

{
  "newOccupancy": 450
}

Response: 200 OK
{
  "id": 1,
  "name": "Relief Camp A",
  "currentOccupancy": 450,
  "status": "FULL",
  "message": "Shelter at full capacity"
}
```

### Get Shelter Details
```http
GET /shelters/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "Relief Camp A",
  "address": "Mumbai Central School, Bandra",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "state": "Maharashtra",
  "district": "Mumbai",
  "totalCapacity": 500,
  "currentOccupancy": 450,
  "status": "FULL",
  "contactPerson": "Rajesh Kumar",
  "contactNumber": "9876543210",
  "facilities": {
    "water": true,
    "food": true,
    "medical": true,
    "electricity": true,
    "sanitation": true
  },
  "createdAt": "2026-01-15T12:00:00Z"
}
```

---

## 📦 Resource Endpoints

### Create Resource (Admin/Officer)
```http
POST /resources/create
Authorization: Bearer {admin_or_officer_token}
Content-Type: application/json

{
  "name": "Drinking Water",
  "description": "Packaged drinking water bottles",
  "resourceType": "WATER",
  "totalQuantity": 1000,
  "availableQuantity": 800,
  "unit": "bottles",
  "priority": "CRITICAL",
  "location": "Bandra East",
  "state": "Maharashtra",
  "district": "Mumbai",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "disasterId": 1
}

Response: 201 Created
{
  "id": 1,
  "name": "Drinking Water",
  "resourceType": "WATER",
  "availableQuantity": 800,
  "priority": "CRITICAL",
  "status": "AVAILABLE",
  "createdAt": "2026-01-15T12:15:00Z"
}
```

### Get Resources by Type
```http
GET /resources/type/{type}
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Drinking Water",
    "resourceType": "WATER",
    "availableQuantity": 800,
    "totalQuantity": 1000,
    "priority": "CRITICAL",
    "location": "Bandra East",
    "status": "AVAILABLE"
  },
  {
    "id": 5,
    "name": "Mineral Water",
    "resourceType": "WATER",
    "availableQuantity": 500,
    "totalQuantity": 500,
    "priority": "HIGH",
    "location": "Worli",
    "status": "AVAILABLE"
  }
]
```

### Get Available Resources
```http
GET /resources/available
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Drinking Water",
    "resourceType": "WATER",
    "availableQuantity": 800,
    "priority": "CRITICAL",
    "location": "Bandra East",
    "state": "Maharashtra",
    "district": "Mumbai",
    "status": "AVAILABLE"
  }
]
```

### Update Resource Quantity (Officer)
```http
PUT /resources/{id}/quantity
Authorization: Bearer {officer_token}
Content-Type: application/json

{
  "quantityDistributed": 100
}

Response: 200 OK
{
  "id": 1,
  "name": "Drinking Water",
  "availableQuantity": 700,
  "totalDistributed": 300,
  "status": "AVAILABLE",
  "updatedAt": "2026-01-15T13:30:00Z"
}
```

---

## 👮 Officer Management (Admin Only)

### Create Officer Account
```http
POST /admin/create-officer
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@example.com",
  "phone": "9876543210",
  "state": "Maharashtra",
  "district": "Mumbai",
  "location": "Bandra"
}

Response: 201 Created
{
  "id": 5,
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@example.com",
  "phone": "9876543210",
  "role": "OFFICER",
  "status": "ACTIVE",
  "temporaryPassword": "TEMP_2026_abc123xyz",
  "message": "Officer created. Send temporary password to email.",
  "createdAt": "2026-01-15T11:00:00Z"
}
```

### Get Admin's Officers
```http
GET /admin/officers
Authorization: Bearer {admin_token}

Response: 200 OK
[
  {
    "id": 5,
    "name": "Rajesh Kumar",
    "email": "rajesh.kumar@example.com",
    "phone": "9876543210",
    "state": "Maharashtra",
    "district": "Mumbai",
    "location": "Bandra",
    "status": "ACTIVE",
    "createdAt": "2026-01-15T11:00:00Z"
  },
  {
    "id": 6,
    "name": "Priya Singh",
    "email": "priya.singh@example.com",
    "phone": "9988776655",
    "state": "Maharashtra",
    "district": "Thane",
    "location": "Thane Central",
    "status": "ACTIVE",
    "createdAt": "2026-01-14T10:00:00Z"
  }
]
```

### Update Officer Details (Admin)
```http
PUT /admin/officers/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Rajesh Kumar Updated",
  "phone": "9876543211",
  "location": "Andheri"
}

Response: 200 OK
{
  "id": 5,
  "name": "Rajesh Kumar Updated",
  "phone": "9876543211",
  "location": "Andheri",
  "updatedAt": "2026-01-15T14:00:00Z"
}
```

### Update Officer Status (Admin)
```http
PUT /admin/officers/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "ON_LEAVE"
}

Response: 200 OK
{
  "id": 5,
  "name": "Rajesh Kumar",
  "status": "ON_LEAVE",
  "updatedAt": "2026-01-15T14:30:00Z"
}
```

---

## 💬 Citizen Query Endpoints

### Submit Query (Citizen)
```http
POST /queries/create
Authorization: Bearer {citizen_token}
Content-Type: application/json

{
  "subject": "Need food relief",
  "message": "Haven't received any relief materials yet. Please help.",
  "category": "RELIEF_REQUEST",
  "state": "Maharashtra",
  "district": "Mumbai",
  "location": "Bandra East",
  "disasterId": 1
}

Response: 201 Created
{
  "id": 1,
  "subject": "Need food relief",
  "category": "RELIEF_REQUEST",
  "status": "OPEN",
  "createdAt": "2026-01-15T13:45:00Z"
}
```

### Get My Queries (Citizen)
```http
GET /queries/citizen/my-queries
Authorization: Bearer {citizen_token}

Response: 200 OK
[
  {
    "id": 1,
    "subject": "Need food relief",
    "category": "RELIEF_REQUEST",
    "status": "RESOLVED",
    "createdAt": "2026-01-15T13:45:00Z",
    "assignedOfficerName": "Rajesh Kumar",
    "response": "Relief materials will be delivered tomorrow morning.",
    "responseDate": "2026-01-15T14:15:00Z"
  }
]
```

### Get Open Queries (Admin/Officer)
```http
GET /queries/open
Authorization: Bearer {admin_or_officer_token}

Response: 200 OK
[
  {
    "id": 1,
    "citizenName": "John Doe",
    "subject": "Need food relief",
    "category": "RELIEF_REQUEST",
    "status": "OPEN",
    "location": "Bandra East",
    "createdAt": "2026-01-15T13:45:00Z"
  }
]
```

### Assign Query to Officer (Admin)
```http
PUT /queries/{id}/assign/{officerId}
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "id": 1,
  "subject": "Need food relief",
  "status": "ASSIGNED",
  "assignedOfficerId": 5,
  "assignedOfficerName": "Rajesh Kumar",
  "message": "Query assigned successfully"
}
```

### Respond to Query (Officer)
```http
PUT /queries/{id}/respond
Authorization: Bearer {officer_token}
Content-Type: application/json

{
  "response": "Relief materials will be delivered tomorrow morning at 9 AM."
}

Response: 200 OK
{
  "id": 1,
  "subject": "Need food relief",
  "status": "RESOLVED",
  "response": "Relief materials will be delivered tomorrow morning at 9 AM.",
  "responseDate": "2026-01-15T14:15:00Z"
}
```

---

## 🔄 Response Formats

### Success Response (200 OK)
```json
{
  "id": 1,
  "name": "Example",
  "status": "SUCCESS",
  "message": "Operation completed successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "timestamp": "2026-01-15T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input data",
  "path": "/api/disasters/create"
}
```

### Unauthorized Response (401)
```json
{
  "timestamp": "2026-01-15T14:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### Forbidden Response (403)
```json
{
  "timestamp": "2026-01-15T14:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

---

## 🔀 Status & Enum Values

### User Roles
- `ADMIN` - Full system access
- `OFFICER` - Field operations
- `CITIZEN` - Public access

### Officer Status
- `ACTIVE` - Available for assignment
- `INACTIVE` - Not available
- `ON_LEAVE` - Temporarily unavailable
- `DEPLOYED` - Currently on assignment

### Disaster Status
- `ACTIVE` - Ongoing disaster
- `RECOVERY` - Recovery phase
- `RESOLVED` - Disaster handled
- `ARCHIVED` - Historical record

### Affected Area Status
- `IDENTIFIED` - Area marked
- `UNDER_ASSESSMENT` - Being assessed
- `BEING_ASSISTED` - Receiving help
- `RECOVERY_ONGOING` - Recovering
- `RECOVERED` - Fully recovered

### Shelter Status
- `OPERATIONAL` - Open and running
- `FULL` - At full capacity
- `TEMPORARY_CLOSED` - Temporarily closed
- `PERMANENTLY_CLOSED` - No longer operational
- `UNDER_SETUP` - Being set up

### Task Status
- `CREATED` - Newly created
- `ASSIGNED` - Assigned to officer
- `IN_PROGRESS` - Officer working
- `ON_HOLD` - Temporarily paused
- `COMPLETED` - Task finished
- `CANCELLED` - Task cancelled

### Disaster Type
- `FLOOD` - Flooding disaster
- `EARTHQUAKE` - Seismic event
- `CYCLONE` - Cyclone/typhoon
- `LANDSLIDE` - Landslide event
- `FIRE` - Fire disaster
- `DROUGHT` - Drought condition
- `OTHER` - Other disasters

### Severity Levels
- `CRITICAL` - Immediate danger
- `HIGH` - High risk
- `MEDIUM` - Moderate risk
- `LOW` - Low risk

### Resource Type
- `FOOD` - Food items
- `WATER` - Drinking water
- `MEDICAL` - Medical supplies
- `CLOTHING` - Clothing items
- `SHELTER_MATERIAL` - Building materials
- `RESCUE_EQUIPMENT` - Rescue tools
- `COMMUNICATION_DEVICE` - Communication equipment
- `VEHICLE` - Transportation
- `FUEL` - Fuel/energy
- `OTHER` - Other resources

---

**Last Updated**: January 2026  
For support: support@disastermanagement.in
