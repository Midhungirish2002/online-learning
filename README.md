# Online Learning Platform Backend

A robust backend for an online learning management system, built with **Django** and **Django REST Framework (DRF)**.

## Features

- **User Management**: Custom User model with Roles (Admin, Instructor, Student).
- **Course Management**: Create courses, lessons, and quizzes.
- **Engagement**: Track lesson progress, quiz attempts, and course ratings.
- **Authentication**: JWT-based authentication (SimpleJWT).
- **Admin**: Standard Django Admin interface.

## Tech Stack

- **Framework**: Django 6.0, Django REST Framework
- **Database**: PostgreSQL (configured via environment variables)
- **Auth**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL

### Installation

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

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Setup:**
   Create a `.env` file in `core/` (or root, depending on config) with the following:
   ```env
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password
   ```

5. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

### Seeding Data

To quickly set up the database with test users and content, run:

```bash
python manage.py seed_data
```

**Default Test Credentials:**

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Instructor** | `instructor1` | `password123` |
| **Student** | `student1` | `password123` |

### Running the Server

```bash
python manage.py runserver
```
API is available at `http://127.0.0.1:8000/`.

## API Documentation

- **Admin API**: `/api/admin-api/`
- **Instructor API**: `/api/instructor-api/`
- **Student API**: `/api/student-api/`
