import { useEffect, useState } from "react";
import { fetchInstructorStudents } from "../../api/analytics";
import { motion } from "framer-motion";
import { User, BookOpen, Calendar, Activity } from "lucide-react";

const InstructorStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetchInstructorStudents();
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch students", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return (
            <div className="pt-24 min-h-screen bg-white dark:bg-slate-950 text-center text-gray-500">
                Loading students...
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Enrolled Students</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        View progress and details of students enrolled in your courses.
                    </p>
                </div>

                {students.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-800">
                        <User size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            No students yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Students who enroll in your courses will appear here.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-100 dark:bg-slate-800 uppercase text-xs text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Student</th>
                                        <th className="px-6 py-4 font-medium">Course</th>
                                        <th className="px-6 py-4 font-medium">Joined Date</th>
                                        <th className="px-6 py-4 font-medium">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                    {students.map((student, index) => (
                                        <motion.tr
                                            key={`${student.student_id}-${index}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {student.student_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {student.student_email || "No email"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <BookOpen size={16} className="text-gray-400" />
                                                    <span>{student.course_title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Calendar size={16} />
                                                    {new Date(
                                                        student.enrolled_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[200px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{
                                                                width: `${student.progress_percentage}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                                        {student.progress_percentage}%
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {student.completed_lessons} of{" "}
                                                    {student.total_lessons} lessons
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InstructorStudents;
