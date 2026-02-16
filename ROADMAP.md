# Project Roadmap & Agenda

This document serves as a checklist for code maintenance, technical debt reduction, and future feature additions.

## 🛠 Code Maintenance & Refactoring (Immediate Wins)

### Backend (Django)
- [x] **Cleanup Deprecated Files**: Verify logic is migrated and remove `learning/serializers_old.py` and `learning/views_old.py`.



- [ ] **API Documentation**: Install and configure `drf-spectacular` to generate Swagger/OpenAPI documentation automatically at `/api/schema/swagger-ui/`.
- [x] **Type Hinting**: Add Python type hints to complex views and services for better IDE support and error checking.
- [ ] **Expand Testing**: 
    - Create a `tests/` directory to replace the single `tests.py` file.
    - Write unit tests for core logical flows (Course enrollment, Quiz calculation).
    - Target at least 70% code coverage.

### Frontend (React)
- [x] **Centralize API Calls**: Refactor any remaining direct `axios` calls in components to use functions from `src/api/`.
- [ ] **Prop Validation**: Ensure all components use `PropTypes` or move towards TypeScript for better type safety.
- [ ] **Error Boundaries**: Wrap major page sections in Error Boundaries to prevent full app crashes on minor component errors.
- [x] **Code Splitting**: Use `React.lazy` and `Suspense` for route-based code splitting to improve initial load time.
- [x] **Linting**: Enforce consistent code style using ESLint and Prettier.

---

## 🚀 Feature Additions (Future Goals)

### User Experience & Engagement
- [ ] **Dark/Light Mode**: Add a global theme toggler that persists user preference (localStorage).
- [x] **Real-time Notifications**: Implement Django Channels (WebSockets) for real-time alerts (e.g., "Assignment Graded", "New Course Available").
- [x] **Discussion Forums**: Add a comment section or forum per course/lesson for student-instructor interaction.

### Analytics & Reporting
- [x] **Visual Dashboard**: Use a library like `Recharts` or `Chart.js` to render graphs for:
    - Instructor: Daily/Monthly revenue, enrollment trends.
    - Admin: Platform traffic, active users density.
- [x] **PDF Certificates**: Generate downloadable PDF certificates using `ReportLab` or `WeasyPrint` upon course completion.

### Monetization & Payments
- [ ] **Payment Gateway**: Integrate Stripe or PayPal API for actual payment processing (replacing mock handling).
- [ ] **Coupons/Discounts**: Add a model for discount codes applied at checkout.

---

## 🏗 Infrastructure & DevOps
- [ ] **Dockerization**: Create a `Dockerfile` and `docker-compose.yml` to spin up Frontend, Backend, and Database with one command.
- [ ] **CI/CD Pipeline**: Set up GitHub Actions to run linting and tests automatically on every push to `main`.
