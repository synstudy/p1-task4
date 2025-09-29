# TaskFlow - Jira-like Task Management System

TaskFlow is a comprehensive task management system built with modern technologies following clean architecture principles. It provides a Jira-like experience for managing projects, tasks, and team collaboration.

## 🚀 Features

- **User Management**: Role-based access control (Admin, User) with UUID v6 identifiers
- **Project Management**: Create, manage, and track projects with member assignments
- **Task Management**: Create, assign, and track tasks with status and priority
- **Comment System**: Add comments to tasks for better collaboration
- **Authentication**: Secure JWT-based authentication with UUID v6 tokens
- **Responsive UI**: Mobile-friendly interface using Vue 3 and Vuetify

## 🛠️ Tech Stack

### Backend

- **Node.js** with **NestJS** framework
- **TypeScript** for type safety
- **Prisma ORM** for database management with UUID v6 support
- **PostgreSQL** as the primary database
- **JWT** for authentication with UUID v6 claims
- **Bcrypt** for password hashing
- **UUID v6** for entity identification and token generation

### Frontend

- **Vue 3** with Composition API
- **Vuetify** Material Design component framework
- **Pinia** for state management
- **Vue Router** for navigation
- **Axios** for API communication
- **TypeScript** for type safety

### Infrastructure

- **Docker** and **Docker Compose** for containerization
- **ESLint** and **Prettier** for code quality
- **Prisma Migrate** for database schema management

## 📁 Project Structure

The project follows Clean Architecture principles:

```
taskflow/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── application/       # Use cases, DTOs, and services
│   │   ├── domain/            # Business entities, repositories, and interfaces
│   │   ├── infrastructure/    # Database, auth, config, and external services
│   │   └── presentation/      # Controllers, guards, pipes, and decorators
│   ├── prisma/                # Prisma schema and migrations
│   │   ├── schema.prisma      # Database schema with UUID v6 definitions
│   │   └── migrations/        # SQL migration files
│   └── Dockerfile
├── frontend/                   # Vue 3 frontend application
│   ├── src/
│   │   ├── composables/       # Vue composition functions
│   │   ├── components/        # Reusable UI components
│   │   ├── views/             # Page components
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # API clients
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utility functions
│   │   ├── router/            # Vue Router configuration
│   │   └── layouts/           # Layout components
│   └── Dockerfile
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # Project documentation
```

## 🚀 Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **npm** or **yarn**

### Test User

A test user with admin privileges is created during the seeding process:

- **Email**: admin@example.com
- **Password**: 123456

### Installation

There are two ways to run the application:

#### Option 1: Manual Installation (as described below)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. Start the database and services:
   ```bash
   docker-compose up -d
   ```

3. Install backend dependencies and run migrations:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

5. Start both applications:
   ```bash
   # Terminal 1: Start backend
   cd ../backend
   npm run start:dev
   
   # Terminal 2: Start frontend
   cd ../frontend
   npm run dev
   ```

#### Option 2: Docker Compose (Recommended)

The application can be run completely with Docker Compose:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. Run the entire stack with Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000/api
- Database: localhost:5432 (PostgreSQL)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. Start the database and services:
   ```bash
   docker-compose up -d
   ```

3. Install backend dependencies and run migrations:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

5. Start both applications:
   ```bash
   # Terminal 1: Start backend
   cd ../backend
   npm run start:dev
   
   # Terminal 2: Start frontend
   cd ../frontend
   npm run dev
   ```

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

**backend/.env**:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=60m
PORT=3000
```

**frontend/.env**:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### UUID v6 Implementation

The system uses UUID v6 for all entity identification:
- Generated at the application level for new entities
- Stored as UUID type in PostgreSQL database
- Used in JWT tokens for user identification
- Ensures global uniqueness and improved security

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT token
- `GET /api/users/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)

### Projects
- `POST /api/projects` - Create a new project (Admin/User)
- `GET /api/projects` - Get projects (Admin sees all, User sees only projects they're members of)
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project (Admin/Manager/Project Owner)
- `DELETE /api/projects/:id` - Delete project (Admin/Project Owner)
- `POST /api/projects/:id/members` - Add user to project (Admin/Manager)
- `DELETE /api/projects/:id/members/:userId` - Remove user from project (Admin/Project Owner)
- `GET /api/projects/:id/members` - Get project members

### Tasks
- `POST /api/tasks` - Create a new task (Admin/User)
- `GET /api/tasks` - Get all tasks (Admin sees all, User sees only tasks they're assigned to or created)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task (Admin/Manager/Task Creator/Assignee)
- `DELETE /api/tasks/:id` - Delete task (Admin/Manager/Task Creator)
- `GET /api/tasks/project/:projectId` - Get tasks by project ID
- `GET /api/tasks/assignee/:assigneeId` - Get tasks by assignee ID
- `GET /api/tasks/creator/:creatorId` - Get tasks by creator ID

### Comments
- `POST /api/comments` - Create a new comment (Admin/User)
- `GET /api/comments/:id` - Get comment by ID
- `PUT /api/comments/:id` - Update comment (Admin/Manager/Comment Author)
- `DELETE /api/comments/:id` - Delete comment (Admin/Manager/Comment Author)
- `GET /api/comments/task/:taskId` - Get comments by task ID
- `GET /api/comments/author/:authorId` - Get comments by author ID

> **Note**: All ID parameters in the API are UUID v6 strings for enhanced security and uniqueness.

## 🧪 Testing

### Backend Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

## 🚢 Deployment

The application is containerized with Docker. To build and run in production:

```bash
# Using the provided docker-compose.yml
docker-compose up --build

# Or for a production setup
docker-compose -f docker-compose.yml up --build -d
```

## 🔐 Security Features

- **UUID v6 Implementation**: All entities use UUID v6 for unique identification
- **JWT Authentication**: Secure token-based authentication with role claims
- **Role-Based Access Control**: Granular permissions based on user and project roles
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Input Validation**: Comprehensive validation for all API endpoints
- **SQL Injection Protection**: Prisma ORM prevents SQL injection attacks
- **Data Isolation**: Users can only access data they're authorized to see

## 🎯 Core Functionality

### User Management
- **Registration & Authentication**: Secure user signup and login with JWT tokens
- **Role Assignment**: Admin users can assign roles to other users
- **Profile Management**: Users can update their personal information
- **User Directory**: View and manage all system users (admin only)

### Project Management
- **Project Creation**: Users can create projects they own
- **Member Management**: Project owners/managers can add/remove members
- **Role Assignment**: Assign project-specific roles (Worker, Manager)
- **Project Visibility**: Users see only projects they're members of

### Task Management
- **Task Creation**: Create tasks within projects
- **Task Assignment**: Assign tasks to project members
- **Status Tracking**: Track task progress through workflow stages
- **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- **Task Visibility**: Users see only tasks they created or are assigned to

### Collaboration Features
- **Comments**: Add comments to tasks for team discussion
- **Activity Tracking**: Timestamps for all entity creation and updates
- **Real-time Updates**: Instant feedback on all operations
- **Role-Based Visibility**: Users only see projects and tasks they're authorized to access

## 🔐 Role-Based Access Control

### Global Roles

1. **ADMIN**:
   - Full system access
   - Can create/edit/delete any project
   - Can manage all users and their roles
   - Can view all projects and tasks in the system

2. **USER**:
   - Limited access to system resources
   - Can create projects they own
   - Can only see projects they are members of
   - Can create tasks within projects they're members of
   - Can only see tasks they created or are assigned to

### Project Member Roles

Within each project, users can have specific roles that determine their permissions:

1. **MANAGER**:
   - Can add/remove members from the project
   - Can edit project details
   - Can create tasks within the project
   - Can assign tasks to project members

2. **WORKER**:
   - Can view project details
   - Can create tasks within the project
   - Can be assigned tasks
   - Can update tasks they're assigned to

### Access Rules

- **Project Visibility**: Users can only see projects they are members of
- **Task Visibility**: Users can only see tasks they created or are assigned to
- **Comment Access**: Users can only edit/delete their own comments
- **Role Management**: Only ADMIN users can change global user roles
- **Project Ownership**: Project creators become project owners with full project permissions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ using modern web technologies
