# Online Learning Platform

A comprehensive full-stack learning management system with **Django REST Framework** backend and **React** frontend.

## 🌐 Live Demo

**Frontend Demo**: [https://midhungirish2002.github.io/online-learning/](https://midhungirish2002.github.io/online-learning/)

> **Note**: This is a static frontend demo hosted on GitHub Pages. Backend features require a deployed Django server.


## 🌟 Features

### User Management
- **Role-based Access Control**: Admin, Instructor, and Student roles with distinct permissions
- **Profile Management**: Customizable user profiles with bio, avatar, and contact information
- **JWT Authentication**: Secure token-based authentication system

### Course Management
- **Course Creation**: Instructors can create and manage courses with descriptions, pricing, and categories
- **Lesson Organization**: Multiple lessons per course with video and text content support
- **Quiz System**: Create quizzes with multiple-choice questions and automatic grading
- **Course Ratings**: Students can rate and review courses
- **Wishlist**: Students can bookmark courses for later enrollment

### Learning Experience
- **Progress Tracking**: Automatic tracking of lesson completion and course progress
- **Lecture Notes**: Students can take private notes on individual lessons
- **Quiz Attempts**: Track quiz scores and attempts with detailed analytics
- **Course Certificates**: Generate downloadable PDF certificates upon course completion

### Engagement & Communication
- **Discussion Forums**: Course-level and lesson-level comment threads for Q&A
- **Real-time Notifications**: WebSocket-based notification system for instant updates
- **Notification Bell**: Live notification feed with unread indicators

### Analytics & Reporting
- **Student Dashboard**: View enrolled courses, progress, and quiz results
- **Instructor Dashboard**: Track student enrollments, revenue, and engagement metrics
- **Admin Dashboard**: Platform-wide analytics, user management, and system statistics
- **Visual Charts**: Interactive graphs powered by Recharts for data visualization

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.0+ with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Real-time**: Django Channels with WebSocket support (Daphne)
- **PDF Generation**: ReportLab for certificates
- **Email**: SMTP integration for notifications
- **CORS**: django-cors-headers for frontend integration

### Frontend
- **Framework**: React 18+ with React Router
- **HTTP Client**: Axios for API calls
- **Styling**: CSS3 with modern responsive design
- **Icons**: Lucide React icons
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite (recommended) or Create React App

## 📁 Project Structure

```
online-learning/
├── core/                      # Django project settings
│   ├── settings.py           # Main settings with Channels support
│   ├── asgi.py              # ASGI config for WebSockets
│   └── urls.py              # Root URL configuration
├── learning/                 # Main Django app
│   ├── models.py            # Database models
│   ├── serializers/         # Modular serializers
│   │   ├── auth.py         # Authentication serializers
│   │   ├── courses.py      # Course-related serializers
│   │   ├── users.py        # User profile serializers
│   │   └── ...
│   ├── views/              # Modular API views
│   │   ├── admin_views.py  # Admin endpoints
│   │   ├── courses.py      # Course management
│   │   ├── quizzes.py      # Quiz system
│   │   ├── forum.py        # Discussion forums
│   │   └── ...
│   ├── consumers.py        # WebSocket consumers
│   ├── routing.py          # WebSocket routing
│   ├── notifications.py    # Notification utilities
│   └── utils/              # Helper utilities
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── api/           # API service modules
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/
│   │   │   ├── instructor/
│   │   │   └── student/
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
├── requirements.txt        # Python dependencies
├── manage.py              # Django management script
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **PostgreSQL 12+**
- **Node.js 16+** and npm
- **Redis** (for Django Channels layer)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Midhungirish2002/online-learning.git
   cd online-learning
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # Email (for notifications)
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password
   
   # Django Secret Key
   SECRET_KEY=your-secret-key-here
   ```

5. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Seed Database (Optional):**
   ```bash
   python manage.py seed_data
   ```

   **Default Test Credentials:**
   
   | Role | Username | Password |
   |------|----------|----------|
   | **Admin** | `admin` | `admin123` |
   | **Instructor** | `instructor1` | `password123` |
   | **Student** | `student1` | `password123` |

7. **Start Redis (for WebSockets):**
   ```bash
   # Windows (with WSL or Redis for Windows)
   redis-server
   
   # Linux/Mac
   redis-server
   ```

8. **Run the Django server:**
   ```bash
   python manage.py runserver
   ```
   Backend API: `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend app: `http://localhost:5173/` (Vite) or `http://localhost:3000/` (CRA)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/refresh/` - Refresh access token

### Student API (`/api/student-api/`)
- `/courses/` - Browse and enroll in courses
- `/my-courses/` - View enrolled courses
- `/progress/` - Track learning progress
- `/quizzes/` - Take quizzes and view results
- `/wishlist/` - Manage course wishlist
- `/notes/` - Lecture notes CRUD
- `/forum/` - Discussion forums

### Instructor API (`/api/instructor-api/`)
- `/courses/` - Create and manage courses
- `/lessons/` - Add lessons to courses
- `/quizzes/` - Create and manage quizzes
- `/students/` - View enrolled students
- `/analytics/` - Revenue and engagement metrics

### Admin API (`/api/admin-api/`)
- `/users/` - User management (CRUD)
- `/analytics/` - Platform-wide statistics
- `/courses/` - Course moderation

### Notifications
- `GET /api/notifications/` - Fetch user notifications
- `POST /api/notifications/<id>/mark-read/` - Mark as read
- **WebSocket**: `ws://localhost:8000/ws/notifications/` - Real-time updates

## 🎨 Key Features Explained

### Real-time Notifications
Uses Django Channels with WebSocket connections to deliver instant notifications for:
- Course enrollments
- New quiz attempts
- Forum replies
- Course completions

### Modular Architecture
- **Serializers** and **Views** are organized into separate modules for better maintainability
- **API services** in frontend centralize all HTTP requests
- **Component-based** React architecture with reusable UI elements

### Progress Tracking
- Automatically marks lessons as completed when viewed
- Calculates overall course completion percentage
- Tracks quiz attempts with score history

### Certificate Generation
- Generates professional PDF certificates using ReportLab
- Includes student name, course title, completion date, and unique certificate ID
- Available for download upon 100% course completion

## 🧪 Testing

```bash
# Run Django tests
python manage.py test

# Run frontend tests (if configured)
cd frontend
npm test
```

## 📝 Future Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features including:
- Payment gateway integration (Stripe/PayPal)
- Dark/light theme toggle
- Advanced analytics
- Docker containerization
- CI/CD pipeline

## 📄 License

This project is open-source and available under the MIT License.

## 👤 Author

**Midhun Girish**
- GitHub: [@Midhungirish2002](https://github.com/Midhungirish2002)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Happy Learning! 🎓**
