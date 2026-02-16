import { useEffect, useState } from "react";
import { fetchAdminAnalytics } from "../../api/analytics";
import { exportAdminResults } from "../../api/admin";
import UserManagement from "./UserManagement";
import PieChartComponent from "../../components/charts/PieChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";

import {
    Users,
    BookOpen,
    Activity,
    ShieldCheck,
    AlertCircle,
    TrendingUp,
    GraduationCap
} from "lucide-react";

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10">
        <div
            className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}
        >
            <Icon size={80} />
        </div>
        <div className="relative z-10">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass} bg-opacity-20 text-slate-900 dark:text-white`}
            >
                <Icon size={24} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm tracking-wider uppercase font-medium">
                {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">{value}</h3>
            {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
        </div>
    </div>
);

/* ---------------- DASHBOARD ---------------- */
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchAdminAnalytics();
            setStats(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load analytics data.");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- EXPORT HANDLER ---------------- */
    const downloadResults = async (format) => {
        try {
            const response = await exportAdminResults(format);

            // Create blob URL from axios response data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = format === "pdf" ? "quiz_results.pdf" : "quiz_results.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Export failed");
        }
    };

    /* ---------------- STATES ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
                <Activity
                    className="animate-spin text-blue-600 dark:text-blue-500 mb-4"
                    size={48}
                />
                <h2 className="text-xl font-semibold">Loading Admin Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-xl border border-red-200 dark:border-red-500/20">
                    <AlertCircle
                        className="mx-auto mb-3 text-red-600 dark:text-red-400"
                        size={40}
                    />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    /* ---------------- DATA ---------------- */
    const usersByRole = stats?.users_by_role || {};
    const totalStudents = usersByRole.STUDENT || 0;
    const totalInstructors = usersByRole.INSTRUCTOR || 0;
    const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);

    const courses = stats?.courses || { total: 0, published: 0 };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        System overview & analytics
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        subtext={`${totalStudents} Students • ${totalInstructors} Instructors`}
                        icon={Users}
                        colorClass="bg-blue-600"
                    />
                    <StatCard
                        title="Courses"
                        value={courses.total}
                        subtext={`${courses.published} Published`}
                        icon={BookOpen}
                        colorClass="bg-purple-600"
                    />
                    <StatCard
                        title="Enrollments"
                        value={stats.enrollments}
                        icon={GraduationCap}
                        colorClass="bg-emerald-600"
                    />
                    <StatCard
                        title="Pass Rate"
                        value={`${stats.quiz_pass_rate_percent}%`}
                        icon={TrendingUp}
                        colorClass="bg-orange-600"
                    />
                </div>

                {/* VISUAL CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* User Distribution Pie Chart */}
                    <PieChartComponent
                        data={Object.entries(usersByRole).map(([role, count]) => ({
                            name: role,
                            value: count
                        }))}
                        dataKey="value"
                        nameKey="name"
                        title="User Distribution by Role"
                        height={350}
                    />

                    {/* Platform Activity Bar Chart */}
                    <BarChartComponent
                        data={[
                            { metric: "Total Users", count: totalUsers },
                            { metric: "Total Courses", count: courses.total },
                            { metric: "Published Courses", count: courses.published },
                            { metric: "Enrollments", count: stats.enrollments }
                        ]}
                        dataKey="count"
                        xAxisKey="metric"
                        color="#8b5cf6"
                        title="Platform Activity Overview"
                        height={350}
                    />
                </div>

                {/* EXPORT BUTTONS */}
                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => downloadResults("excel")}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold text-white"
                    >
                        ⬇ Export CSV
                    </button>

                    <button
                        onClick={() => downloadResults("pdf")}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white"
                    >
                        ⬇ Export PDF
                    </button>
                </div>

                {/* USER MANAGEMENT */}
                <UserManagement />
            </div>
        </div>
    );
};

export default AdminDashboard;
