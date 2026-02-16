import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));

// Student
const MyLearning = lazy(() => import("./pages/student/MyLearning"));
const BrowseCourses = lazy(() => import("./pages/student/BrowseCourses"));
const CourseView = lazy(() => import("./pages/student/CourseView"));
const LessonPlayer = lazy(() => import("./pages/student/LessonPlayer"));
const QuizAttempt = lazy(() => import("./pages/student/QuizAttempt"));
const WishlistPage = lazy(() => import("./pages/student/WishlistPage"));

// Instructor
const InstructorDashboard = lazy(() => import("./pages/instructor/InstructorDashboard"));
const InstructorCourses = lazy(() => import("./pages/instructor/InstructorCourses"));
const ManageCourse = lazy(() => import("./pages/instructor/ManageCourse"));
const CreateCourse = lazy(() => import("./pages/instructor/CreateCourse"));
const InstructorStudents = lazy(() => import("./pages/instructor/InstructorStudents"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const PageLoader = () => (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading...</p>
    </div>
);

function App() {
    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
            <Navbar />

            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* PUBLIC */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* PROFILE */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]} />
                        }
                    >
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* STUDENT */}
                    <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                        <Route path="/student/my-learning" element={<MyLearning />} />
                        <Route path="/student/courses" element={<BrowseCourses />} />
                        <Route path="/student/wishlist" element={<WishlistPage />} />
                        <Route path="/student/course/:courseId" element={<CourseView />} />
                        <Route
                            path="/student/course/:courseId/lesson/:lessonId"
                            element={<LessonPlayer />}
                        />
                        <Route
                            path="/student/course/:courseId/quiz/:quizId"
                            element={<QuizAttempt />}
                        />
                    </Route>

                    {/* INSTRUCTOR */}
                    <Route element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}>
                        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                        <Route path="/instructor/courses" element={<InstructorCourses />} />
                        <Route path="/instructor/students" element={<InstructorStudents />} />
                        <Route path="/instructor/create-course" element={<CreateCourse />} />
                        <Route
                            path="/instructor/course/:courseId/manage"
                            element={<ManageCourse />}
                        />
                    </Route>

                    {/* ADMIN */}
                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
