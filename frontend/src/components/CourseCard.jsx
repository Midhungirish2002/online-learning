import { BookOpen, Award, Download, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { downloadCertificate } from "../api/certificates";
import { useState } from "react";
import PropTypes from "prop-types";

const CourseCard = ({ course }) => {
    const [downloading, setDownloading] = useState(false);

    // Generate a random gradient based on course ID
    const gradients = [
        "from-blue-500 to-cyan-400",
        "from-purple-500 to-pink-500",
        "from-emerald-500 to-teal-400",
        "from-orange-500 to-amber-400",
        "from-indigo-500 to-purple-600"
    ];
    const gradient = gradients[(course.id || course.course) % gradients.length];

    const handleDownloadCertificate = async () => {
        try {
            setDownloading(true);
            const response = await downloadCertificate(course.id || course.course);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `certificate_${course.title || course.course_title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download certificate:", error);
            alert("Failed to download certificate. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    // Support both direct course object and enrollment object
    const title = course.title || course.course_title;
    const enrolledDate = course.enrolled_at;
    const courseId = course.id || course.course;
    const isCompleted = course.is_completed || false;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
            <div className={`h-32 bg-gradient-to-br ${gradient} p-6 flex items-end relative`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <BookOpen className="text-white/80 w-12 h-12 absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Completion Badge */}
                {isCompleted && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <CheckCircle size={14} />
                        Completed
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    Enrolled on: {new Date(enrolledDate).toLocaleDateString()}
                </p>

                <div className="flex flex-col gap-2">
                    <Link
                        to={`/student/course/${courseId}`}
                        className="block w-full py-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                    >
                        Continue Learning
                    </Link>

                    {/* Certificate Download Button */}
                    {isCompleted && (
                        <button
                            onClick={handleDownloadCertificate}
                            disabled={downloading}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Award size={18} />
                                    Get Certificate
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

CourseCard.propTypes = {
    course: PropTypes.shape({
        // From MyCoursesView
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        instructor: PropTypes.string,
        enrolled_at: PropTypes.string,
        is_completed: PropTypes.bool,
        completion_date: PropTypes.string,
        // Legacy enrollment format (for backwards compatibility)
        course: PropTypes.number,
        course_title: PropTypes.string
    }).isRequired
};

export default CourseCard;
