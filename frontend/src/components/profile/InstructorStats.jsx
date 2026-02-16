import PropTypes from "prop-types";

const InstructorStats = ({ profile }) => {
    if (!profile.created_courses) return null;

    return (
        <div className="max-w-6xl mx-auto mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 pb-2">
                Instructor Activity Details
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Created Courses</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {profile.stats.instructor_courses_count}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Students Taught</div>
                    <div className="text-3xl font-bold text-green-600">
                        {profile.stats.instructor_total_students}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Average Course Rating</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {Math.round(profile.stats.instructor_avg_rating)}/5
                    </div>
                </div>
            </div>

            {/* Created Courses Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm mb-12">
                <h3 className="px-6 py-4 font-semibold border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    Created Courses
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 uppercase text-xs text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Course Title</th>
                                <th className="px-6 py-3">Created At</th>
                                <th className="px-6 py-3">Students</th>
                                <th className="px-6 py-3">Rating</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {profile.created_courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        No courses created yet.
                                    </td>
                                </tr>
                            ) : (
                                profile.created_courses.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white">
                                            {course.total_students}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white">
                                            ⭐ {course.average_rating}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${course.is_published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {course.is_published ? "Published" : "Draft"}
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

InstructorStats.propTypes = {
    profile: PropTypes.shape({
        created_courses: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                title: PropTypes.string,
                created_at: PropTypes.string,
                total_students: PropTypes.number,
                average_rating: PropTypes.number,
                is_published: PropTypes.bool
            })
        ),
        stats: PropTypes.shape({
            instructor_courses_count: PropTypes.number,
            instructor_total_students: PropTypes.number,
            instructor_avg_rating: PropTypes.number
        })
    }).isRequired
};

export default InstructorStats;
