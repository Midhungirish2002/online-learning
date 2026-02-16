import { useEffect, useState } from "react";
import { fetchCourses as getCourses, publishCourse, deleteCourse } from "../../api/courses";
import { fetchInstructorAnalytics } from "../../api/analytics";
import { Plus, Edit, Trash2, Eye, Users, BarChart3, Award } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchAnalytics();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await getCourses({ mine: true });
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetchInstructorAnalytics();
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to fetch instructor analytics", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishToggle = async (course) => {
        try {
            await publishCourse(course.id, !course.is_published);
            fetchCourses();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            // Optimistic update
            setCourses((prev) => prev.filter((c) => c.id !== courseId));
            await deleteCourse(courseId);
        } catch (error) {
            console.error("Failed to delete course", error);
            fetchCourses(); // Revert on error
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Instructor Dashboard
                    </h1>
                    <Link
                        to="/instructor/create-course"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white"
                    >
                        <Plus size={18} />
                        Create Course
                    </Link>
                </div>

                {/* ANALYTICS SUMMARY */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard
                            icon={<BarChart3 />}
                            label="Total Courses"
                            value={analytics.courses.length}
                        />
                        <StatCard
                            icon={<Users />}
                            label="Total Enrollments"
                            value={analytics.courses.reduce(
                                (sum, c) => sum + c.enrolled_students,
                                0
                            )}
                        />
                        <StatCard
                            icon={<Award />}
                            label="Avg Completion Rate"
                            value={
                                analytics.courses.length
                                    ? Math.round(
                                          analytics.courses.reduce(
                                              (sum, c) => sum + c.completion_rate_percent,
                                              0
                                          ) / analytics.courses.length
                                      ) + "%"
                                    : "0%"
                            }
                        />
                        <StatCard
                            icon={<BarChart3 />}
                            label="Avg Quiz Score"
                            value={
                                analytics.courses.length
                                    ? Math.round(
                                          analytics.courses.reduce(
                                              (sum, c) => sum + c.average_score,
                                              0
                                          ) / analytics.courses.length
                                      )
                                    : 0
                            }
                        />
                    </div>
                )}

                {/* VISUAL CHARTS */}
                {analytics && analytics.courses.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Enrollment Bar Chart */}
                        <BarChartComponent
                            data={analytics.courses.map((c) => ({
                                name:
                                    c.course_title.length > 20
                                        ? c.course_title.substring(0, 20) + "..."
                                        : c.course_title,
                                enrollments: c.enrolled_students
                            }))}
                            dataKey="enrollments"
                            xAxisKey="name"
                            color="#3b82f6"
                            title="Enrollments per Course"
                            height={300}
                        />

                        {/* Quiz Performance Area Chart */}
                        <AreaChartComponent
                            data={analytics.courses.map((c) => ({
                                name:
                                    c.course_title.length > 20
                                        ? c.course_title.substring(0, 20) + "..."
                                        : c.course_title,
                                score: c.average_score
                            }))}
                            dataKey="score"
                            xAxisKey="name"
                            color="#8b5cf6"
                            title="Average Quiz Scores"
                            height={300}
                        />

                        {/* Completion Rate Bar Chart */}
                        <BarChartComponent
                            data={analytics.courses.map((c) => ({
                                name:
                                    c.course_title.length > 20
                                        ? c.course_title.substring(0, 20) + "..."
                                        : c.course_title,
                                rate: c.completion_rate_percent
                            }))}
                            dataKey="rate"
                            xAxisKey="name"
                            color="#10b981"
                            title="Completion Rate (%)"
                            height={300}
                            horizontal={false}
                        />

                        {/* Student Distribution Area Chart */}
                        <AreaChartComponent
                            data={analytics.courses.map((c) => ({
                                name:
                                    c.course_title.length > 20
                                        ? c.course_title.substring(0, 20) + "..."
                                        : c.course_title,
                                completed: c.completed_students,
                                enrolled: c.enrolled_students
                            }))}
                            dataKey="completed"
                            xAxisKey="name"
                            color="#ec4899"
                            title="Completed vs Enrolled Students"
                            height={300}
                        />
                    </div>
                )}

                {/* COURSE TABLE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors duration-300">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 sticky top-0">
                            <tr>
                                <th className="p-4">Course Title</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created At</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-8 text-center text-slate-500 dark:text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-8 text-center text-slate-500 dark:text-gray-500"
                                    >
                                        No courses found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                                    >
                                        <td className="p-4 font-medium">{course.title}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    course.is_published
                                                        ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20"
                                                        : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20"
                                                }`}
                                            >
                                                {course.is_published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 dark:text-gray-400 text-sm">
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/instructor/course/${course.id}/manage`
                                                    )
                                                }
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePublishToggle(course)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 transition"
                                                title={
                                                    course.is_published ? "Unpublish" : "Publish"
                                                }
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-red-600 dark:text-red-400 transition"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-4 transition-colors duration-300">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export default InstructorDashboard;
