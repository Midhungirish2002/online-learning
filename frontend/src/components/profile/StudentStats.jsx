import PropTypes from "prop-types";

const StudentStats = ({ profile }) => {
    if (!profile.enrollments) return null;

    return (
        <div className="max-w-6xl mx-auto mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 pb-2">
                User Activity Details
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Enrollments</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {profile.stats.total_courses}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Quizzes Passed</div>
                    <div className="text-3xl font-bold text-green-600">
                        {profile.stats.quizzes_passed}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Average Quiz Score</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {Math.round(profile.stats.avg_quiz_score)}%
                    </div>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <h3 className="px-6 py-4 font-semibold border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    Enrolled Courses
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 uppercase text-xs text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Enrolled At</th>
                                <th className="px-6 py-3">Progress</th>
                                <th className="px-6 py-3">Last Quiz Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {profile.enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-500">
                                        No enrollments found.
                                    </td>
                                </tr>
                            ) : (
                                profile.enrollments.map((env) => (
                                    <tr
                                        key={env.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {env.course_title}
                                            {!env.is_active && (
                                                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                                    Dropped
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(env.enrolled_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{
                                                            width: `${env.progress_percent}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium w-8 text-right">
                                                    {env.progress_percent}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${env.quiz_status.includes("Passed")
                                                        ? "bg-green-100 text-green-700"
                                                        : env.quiz_status.includes("Failed")
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {env.quiz_status}
                                            </span>
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

StudentStats.propTypes = {
    profile: PropTypes.shape({
        enrollments: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                course_title: PropTypes.string,
                enrolled_at: PropTypes.string,
                is_active: PropTypes.bool,
                progress_percent: PropTypes.number,
                quiz_status: PropTypes.string
            })
        ),
        stats: PropTypes.shape({
            total_courses: PropTypes.number,
            quizzes_passed: PropTypes.number,
            avg_quiz_score: PropTypes.number
        })
    }).isRequired
};

export default StudentStats;
