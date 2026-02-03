# System Architecture & Workflows

Complete documentation of system architecture, data flows, and user workflows for the Disaster Management & Alert System.

---

## 🏗️ System Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Admin       │  │   Officer    │  │    Citizen   │   │
│  │  Dashboard   │  │  Dashboard   │  │   Portal     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│          React.js (Vite) - Port 5173                    │
└────────────────────────────────────────────────────────────┘
                         ↓ HTTP/REST
┌────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                       │
│          Spring Boot (Port 8080) - JWT Authentication     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ CORS Filter | Auth Filter | Error Handler | Logging │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │  User      │ │  Disaster  │ │   Task     │            │
│  │  Service   │ │  Service   │ │  Service   │            │
│  └────────────┘ └────────────┘ └────────────┘            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │  Shelter   │ │  Resource  │ │   Query    │            │
│  │  Service   │ │  Service   │ │  Service   │            │
│  └────────────┘ └────────────┘ └────────────┘            │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                        │
│  Spring Data JPA - 6 Main Repositories                    │
│  - UserRepository     - AffectedAreaRepository             │
│  - DisasterRepository - ShelterRepository                  │
│  - TaskRepository     - ResourceRepository                 │
│  - CitizenQueryRepository                                  │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  MySQL / PostgreSQL / H2 Database                   │  │
│  │  - 9 Entity Models with relationships               │  │
│  │  - Automated schema generation via Hibernate        │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 👥 User Role Hierarchy

### ROLE_ADMIN (System Administrator)
```
Permissions:
├── User Management
│   ├── Create officer accounts
│   ├── Update officer details
│   ├── Change officer status (ACTIVE/INACTIVE/ON_LEAVE/DEPLOYED)
│   └── Deactivate officer
├── Disaster Management
│   ├── Create disaster incidents
│   ├── Update disaster status
│   ├── View all disasters
│   └── Declare affected areas
├── Task Management
│   ├── Create tasks
│   ├── Assign tasks to officers
│   ├── Update task status
│   ├── View all tasks
│   └── Cancel tasks
├── Resource Management
│   ├── Create shelters
│   ├── Create resources
│   ├── Update availability
│   └── View all resources
└── Query Management
    ├── View all citizen queries
    ├── Assign queries to officers
    └── Monitor responses
```

### ROLE_OFFICER (Field Responder)
```
Permissions:
├── Task Management
│   ├── View assigned tasks
│   ├── Update task progress (0-100%)
│   ├── Update task status
│   └── Add task notes
├── Field Operations
│   ├── Update affected area status
│   ├── Publish field assessments
│   ├── Update shelter occupancy
│   └── Distribute resources
├── Query Response
│   ├── View assigned citizen queries
│   ├── Respond to queries
│   └── Mark queries as resolved
└── Data Publishing
    ├── Real-time status updates
    ├── Coordinate with other officers
    └── Submit field reports

Restrictions:
├── Cannot create officer accounts
├── Cannot assign tasks to others
├── Cannot view other officers' tasks
├── Cannot modify admin data
└── Cannot access finance/billing
```

### ROLE_CITIZEN (Public User)
```
Permissions:
├── Alert Viewing
│   ├── View active disasters
│   ├── Filter by state/district
│   ├── Check affected areas
│   └── Get alert notifications
├── Shelter Finding
│   ├── Search shelters
│   ├── Check capacity
│   ├── View facilities
│   └── Get contact info
├── Resource Checking
│   ├── View available resources
│   ├── Check distribution points
│   └── Get resource details
├── Query Submission
│   ├── Submit relief queries
│   ├── Track query status
│   └── View officer responses
└── Profile Management
    ├── Update personal info
    ├── Change password
    └── View query history

Restrictions:
├── Cannot create disasters
├── Cannot assign tasks
├── Cannot modify any data
├── Cannot view other citizens' queries
├── Cannot access officer/admin dashboards
└── Cannot create shelters/resources
```

---

## 🔄 Disaster Response Workflow

### Complete Disaster Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: DISASTER DECLARATION (Admin)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Admin receives disaster alert/report                   │
│  2. Admin creates Disaster record                          │
│     └── Title, Type, Severity, Location, Population        │
│  3. System marks Disaster as ACTIVE                        │
│  4. Alerts pushed to Citizens in affected state/district   │
│  5. Officers notified for readiness                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: SITUATION ASSESSMENT (Admin + Officer)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Admin creates Affected Areas                           │
│     └── Mark specific regions with severity levels         │
│  2. Admin assigns Officers to Affected Areas               │
│     └── Based on location and expertise                    │
│  3. Officers begin on-ground assessment                    │
│  4. Officers update area status                            │
│     └── IDENTIFIED → UNDER_ASSESSMENT                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: RESPONSE COORDINATION (Admin + Officer)            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Admin creates Tasks for specific operations            │
│     ├── Task Types: RESCUE, ASSESSMENT, RESOURCE_DIST,    │
│     │              SHELTER_MGT, MEDICAL_AID, MONITORING   │
│     ├── Assigns to specific officers by location          │
│     └── Sets priority and due date                         │
│                                                              │
│  2. Officers receive task assignments                      │
│  3. Officers execute assigned tasks                        │
│     ├── Update progress (25%, 50%, 75%, 100%)             │
│     ├── Publish field data                                │
│     └── Coordinate with team                              │
│                                                              │
│  4. Admin monitors progress in real-time                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: RESOURCE & SHELTER MANAGEMENT (All)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Admin creates Shelters                                 │
│     ├── Location, Capacity, Facilities                     │
│     ├── Contact information                                │
│     └── Status tracking                                    │
│                                                              │
│  2. Officers manage shelter occupancy                      │
│     ├── Update current occupancy                          │
│     ├── Track facility availability                       │
│     └── System auto-marks FULL when at capacity           │
│                                                              │
│  3. Admin creates Resources                                │
│     ├── Type: FOOD, WATER, MEDICAL, etc.                  │
│     ├── Quantity and priority tracking                    │
│     └── Distribution points                               │
│                                                              │
│  4. Officers distribute resources                          │
│     ├── Update available quantity                         │
│     ├── Track distribution                                │
│     └── Mark as DEPLETED when exhausted                   │
│                                                              │
│  5. Citizens find shelters and resources                   │
│     ├── View available shelters                           │
│     ├── Check facilities                                  │
│     └── Get directions                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: CITIZEN SUPPORT (Officer + Citizen)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Citizens submit queries/requests                       │
│     ├── Categories: RELIEF_REQUEST, MISSING_PERSON,       │
│     │              MEDICAL_EMERGENCY, etc.                 │
│     ├── Location and urgency details                       │
│     └── Contact information                                │
│                                                              │
│  2. Admin assigns queries to officers                      │
│  3. Officers respond with help/information                │
│     ├── Provide resource directions                       │
│     ├── Schedule assistance                               │
│     ├── Provide medical guidance                          │
│     └── Update query status to RESOLVED                   │
│                                                              │
│  4. Citizens view responses in query history               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: RECOVERY & CLOSURE (Admin)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Officers update area status to RECOVERY_ONGOING        │
│  2. Tasks are marked COMPLETED                             │
│  3. Shelters gradually close (PERMANENTLY_CLOSED)          │
│  4. Resources distributed or archived                      │
│  5. Admin updates Disaster status to RECOVERY              │
│  6. Citizens stop receiving new alerts                     │
│  7. Eventually marked RESOLVED and ARCHIVED                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 👨‍💼 Admin Dashboard Workflow

### Officer Management
```
STEP 1: Navigate to Admin Dashboard
STEP 2: Go to "Officers" Tab
STEP 3: Click "Create New Officer"
STEP 4: Fill Form:
        - Name: Officer full name
        - Email: Unique email
        - Phone: Contact number
        - State: Officer's assigned state
        - District: Officer's assigned district
        - Location: Primary location

STEP 5: Click "Create Officer"
        → System generates temporary password
        → Password displayed (copy and send to officer)
        → Officer receives email with login credentials

STEP 6: Officer logs in with temporary password
        → Forces password change
        → Officer can update profile
        → Officer gets API token

STEP 7: Update Officer Status:
        - ACTIVE: Available for tasks
        - INACTIVE: Not available
        - ON_LEAVE: Temporarily unavailable
        - DEPLOYED: Currently on assignment
```

### Task Creation & Assignment
```
STEP 1: Go to "Tasks" Tab
STEP 2: Click "Create New Task"
STEP 3: Fill Task Form:
        - Title: Task description
        - Description: Detailed info
        - Disaster: Select active disaster
        - Affected Area: Select area (optional)
        - Officer: Select from dropdown
        - Type: RESCUE | ASSESSMENT | RESOURCE_DIST | etc
        - Priority: CRITICAL | HIGH | MEDIUM | LOW
        - Location: Task location
        - State/District: Geographic details
        - Due Date: Target completion date

STEP 4: Click "Assign Task"
        → Task created with status ASSIGNED
        → Officer receives notification
        → Task appears in Officer Dashboard

STEP 5: Monitor Task Progress:
        - View progress bar in task list
        - See officer's updates
        - Can pause/resume/cancel task
        - Get completion notifications
```

---

## 👮 Officer Dashboard Workflow

### Task Management
```
STEP 1: Log in as Officer
STEP 2: Navigate to Officer Dashboard
STEP 3: Go to "Tasks" Tab
        → See all assigned tasks
        → Filter by status (ASSIGNED, IN_PROGRESS, etc)

STEP 4: Click on task to view details:
        - Title and description
        - Disaster information
        - Affected area details
        - Due date and priority
        - Current progress

STEP 5: Update Task Progress:
        - Click "Update Progress"
        - Set percentage (25%, 50%, 75%, 100%)
        - Add optional notes
        - Submit update

STEP 6: Complete Task:
        - Set progress to 100%
        - Click "Mark as Completed"
        - Add completion notes
        - Submit
```

### Field Operations
```
STEP 1: Go to "Affected Areas" Tab
        → See assigned and unassigned areas
        → View severity levels (CRITICAL, HIGH, etc)

STEP 2: Update Area Status:
        - IDENTIFIED → UNDER_ASSESSMENT (start work)
        - UNDER_ASSESSMENT → BEING_ASSISTED (support started)
        - BEING_ASSISTED → RECOVERY_ONGOING (recovery phase)
        - RECOVERY_ONGOING → RECOVERED (complete recovery)

STEP 3: Go to "Shelters" Tab:
        - View shelters in affected areas
        - Check occupancy percentage
        - View facilities available

STEP 4: Update Shelter Occupancy:
        - Click shelter
        - Enter new occupancy number
        - Submit
        - System auto-marks FULL if at capacity

STEP 5: Go to "Resources" Tab:
        - Check available resources
        - View type and quantity
        - Track priority levels

STEP 6: Distribute Resources:
        - Click resource
        - Enter quantity distributed
        - Update available quantity
        - System marks DEPLETED if zero left
```

### Query Response
```
STEP 1: Go to "Queries" Tab
        → See assigned citizen queries
        → Filter by status (OPEN, ASSIGNED, RESOLVED)

STEP 2: Click on query:
        - View citizen's request
        - See location and category
        - Read any existing notes

STEP 3: Respond to Query:
        - Click "Respond"
        - Type response message:
          * Shelter location if relief request
          * Resource information if material needed
          * Medical guidance if health issue
          * Coordination details for rescue
        - Submit response

STEP 4: Mark as Resolved:
        - After responding
        - Click "Mark Resolved"
        - Query status becomes RESOLVED
        - Citizen sees response in their history
```

---

## 👥 Citizen Portal Workflow

### View Disaster Alerts
```
STEP 1: Log in as Citizen
STEP 2: Navigate to Citizen Dashboard
STEP 3: Go to "Alerts" Tab
        → See active disasters
        → Sorted by severity
        → Color-coded: CRITICAL (red), HIGH (orange), etc

STEP 4: View Disaster Details:
        - Disaster type (FLOOD, EARTHQUAKE, etc)
        - Affected areas
        - Population impact estimate
        - Last update time
        - Official recommendations

STEP 5: Filter by Location:
        - Select your state
        - Select your district
        - See disasters affecting your area
        - Get area-specific guidance
```

### Find Shelter
```
STEP 1: Go to "Shelters" Tab
STEP 2: See Available Shelters:
        - Name and address
        - Current capacity percentage
        - Available space
        - Distance (if location enabled)

STEP 3: View Shelter Details:
        - Total and current occupancy
        - Available facilities:
          * Water facility ✓
          * Food facility ✓
          * Medical facility ✓
          * Electricity ✓
          * Sanitation ✓
        - Contact person name
        - Contact phone number
        - Opening hours

STEP 4: Get Directions:
        - Click "View on Map" (if available)
        - See shelter location
        - Get directions
        - Call contact number

STEP 5: Plan Movement:
        - Check occupancy before going
        - Note available facilities
        - Coordinate with family
        - Carry identification
```

### Submit Query/Request
```
STEP 1: Go to "Queries" Tab
STEP 2: Click "Submit New Query"
STEP 3: Fill Query Form:
        - Subject: What you need help with
        - Category: RELIEF_REQUEST | MEDICAL | MISSING | etc
        - Message: Detailed description
        - Location: Where you are
        - State/District: Geographic info
        - Contact: Your phone number

STEP 4: Submit Query
        → Assigned to available officer
        → You receive notification
        → Query visible in your history

STEP 5: Monitor Status:
        - OPEN: Waiting assignment
        - ASSIGNED: Officer working on it
        - RESOLVED: Officer sent response

STEP 6: View Officer Response:
        - Open resolved query
        - Read officer's response
        - Get resource/shelter directions
        - Follow provided guidance
```

---

## 🔐 Authentication Flow

### Registration Flow
```
User fills registration form:
├── Name, Email, Phone
├── Password (encrypted)
├── Role selection (ADMIN, OFFICER, CITIZEN)
└── Location (State, District)
                ↓
Spring Security validates input
├── Email uniqueness check
├── Password strength validation
├── Phone format validation
└── Encryption (BCrypt)
                ↓
User record created in database
├── Role assignment
├── Status flags set
└── Timestamps recorded
                ↓
User receives confirmation
├── Registration successful message
└── Redirect to login page
```

### Login Flow
```
User enters email and password
                ↓
Spring Security validates:
├── Email exists in database
├── Password matches (BCrypt comparison)
└── User is ACTIVE/not deactivated
                ↓
JWT token generated:
├── User ID encoded
├── Role information included
├── Expiration set (24 hours)
└── Signed with secret key
                ↓
Token sent to frontend:
├── Stored in browser localStorage
├── Included in all subsequent API calls
└── Sent as Authorization: Bearer {token}
                ↓
API requests authenticated:
├── Token verified on each request
├── Role-based authorization checked (@PreAuthorize)
└── Request processed or rejected
```

### Officer Account Creation by Admin
```
Admin submits officer form:
├── Name, Email, Phone
├── State, District, Location
└── Department (optional)
                ↓
UserManagementService:
├── Generates UUID-based temporary password
├── Creates User record with ROLE_OFFICER
├── Sets status to ACTIVE
└── Records created timestamp
                ↓
Email service sends credentials:
├── Email with login credentials
├── Temporary password (non-reversible)
├── Instructions for first login
└── Password change requirement note
                ↓
Officer receives email:
├── Logs in with email + temp password
├── System forces password change
├── Sets new secure password
└── Can now use Officer Dashboard
```

---

## 🔗 API Request/Response Flow

### Example: Task Creation Request
```
FRONTEND:
POST /api/tasks/create
Headers: {
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}
Body: {
  "title": "Assess building damage",
  "disasterId": 1,
  "affectedAreaId": 1,
  "assignedToId": 5,
  "taskType": "ASSESSMENT",
  "priority": "CRITICAL",
  "dueDate": "2026-01-16T18:00:00Z"
}
                    ↓
BACKEND - Auth Filter:
├── Extract token from header
├── Verify token signature
├── Check token expiration
└── Extract user ID and role
                    ↓
BACKEND - @PreAuthorize("hasRole('ADMIN')"):
├── Check user has ROLE_ADMIN
└── If not → Return 403 Forbidden
                    ↓
BACKEND - TaskController.createTask():
├── Validate input (not null, not empty)
├── Check disaster exists
├── Check officer exists
└── Check affected area exists
                    ↓
BACKEND - TaskService.createTask():
├── Create Task entity
├── Set status = ASSIGNED
├── Set progress = 0
├── Set createdAt timestamp
└── Save to database
                    ↓
BACKEND - Response:
{
  "id": 1,
  "title": "Assess building damage",
  "status": "ASSIGNED",
  "progressPercentage": 0,
  "createdAt": "2026-01-15T11:45:00Z"
}
                    ↓
FRONTEND:
├── Receive response (201 Created)
├── Show success notification
├── Update task list
└── Refresh dashboard
```

---

## 📊 Data Relationships

### User & Role Relationships
```
User (Citizen) → Role: CITIZEN
                 ├── Can view alerts
                 ├── Can find shelters
                 └── Can submit queries

User (Officer) → Role: OFFICER
                 ├── assignedAdmin (FK to Admin User)
                 ├── state, district, location
                 ├── status (ACTIVE/INACTIVE/ON_LEAVE/DEPLOYED)
                 ├── assigned tasks
                 ├── assigned queries
                 └── assigned affected areas

User (Admin) → Role: ADMIN
              ├── created officers (1-to-Many)
              ├── created disasters (1-to-Many)
              ├── created tasks (1-to-Many)
              └── manages system
```

### Disaster Relationships
```
Disaster ─→ created_by (User-Admin)
        ├──→ affected_areas (1-to-Many)
        │    └──→ assigned_officer (User-Officer)
        ├──→ tasks (1-to-Many)
        │    └──→ assigned_to (User-Officer)
        ├──→ shelters (1-to-Many)
        └──→ resources (1-to-Many)
```

### Task Relationships
```
Task ─→ disaster (Many-to-One)
    ├──→ assigned_to (User-Officer)
    ├──→ created_by (User-Admin)
    ├──→ affected_area (Many-to-One)
    └──→ status (Enum)
         └──→ CREATED → ASSIGNED → IN_PROGRESS → COMPLETED
```

---

## 🚨 Real-Time Notification Flow

```
Disaster Created → System Trigger
                    ↓
Fetch affected state/district
                    ↓
Send Push Notifications to:
├── All Officers in that state
├── All Citizens in that district
└── All Admins
                    ↓
Notification content:
├── "Critical Flood in Mumbai"
├── Severity level
├── Affected areas
└── Recommended actions
                    ↓
Users receive notification:
├── Browser notification (if enabled)
├── Alert in Disaster tab
├── Email notification (optional)
└── Mobile push (if mobile app)
```

---

## 🗺️ Location-Based Features

### State & District Hierarchy
```
India
├── Maharashtra
│   ├── Mumbai (Bombay)
│   ├── Pune
│   ├── Thane
│   ├── Nagpur
│   └── ... (30+ districts)
├── Karnataka
│   ├── Bangalore (Bengaluru)
│   ├── Mysore
│   ├── Mangalore
│   └── ... (31+ districts)
├── Tamil Nadu
├── Delhi
├── ... (28 states + 8 union territories)
└── Total: 700+ districts
```

### Geolocation Features
```
Models with latitude/longitude:
├── Disaster (center point)
├── AffectedArea (area extent)
├── Shelter (physical location)
├── Resource (distribution point)
└── Task (work location)

Features enabled:
├── Map visualization
├── Distance calculation
├── Nearby search
├── Location-based filtering
└── Route optimization
```

---

## 🔄 System Status Indicators

### Task Progress
```
Task Progress: 0% → 25% → 50% → 75% → 100%
               ↓
               Status Updates:
               CREATED → ASSIGNED → IN_PROGRESS → ON_HOLD → COMPLETED
```

### Affected Area Status Flow
```
IDENTIFIED (marked on map)
    ↓
UNDER_ASSESSMENT (initial assessment)
    ↓
BEING_ASSISTED (receiving help)
    ↓
RECOVERY_ONGOING (recovery phase)
    ↓
RECOVERED (back to normal)
```

### Shelter Status Flow
```
UNDER_SETUP (being prepared)
    ↓
OPERATIONAL (accepting people)
    ↓
FULL (at maximum capacity)
    ↓
TEMPORARY_CLOSED (brief closure)
    ↓
PERMANENTLY_CLOSED (shutdown)
```

---

**Last Updated**: January 2026
**System Version**: 1.0.0
**Documentation Version**: 1.0.0
