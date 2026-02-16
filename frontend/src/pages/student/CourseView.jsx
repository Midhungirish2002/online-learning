import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseById, rateCourse } from "../../api/courses";
import { fetchLessons } from "../../api/lessons";
import { fetchQuizzes } from "../../api/quizzes";
import { PlayCircle, CheckCircle, Lock, Star, HelpCircle } from "lucide-react";
import ForumSection from "../../components/ForumSection";

const CourseView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [showRating, setShowRating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await fetchCourseById(courseId);
                setCourse(courseRes.data);

                const lessonsRes = await fetchLessons(courseId);
                setLessons(lessonsRes.data);

                const quizzesRes = await fetchQuizzes(courseId);
                setQuizzes(quizzesRes.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleLessonClick = (lesson) => {
        if (!lesson.is_locked) {
            navigate(`/student/course/${courseId}/lesson/${lesson.id}`);
        }
    };

    const handleRate = async (e) => {
        e.preventDefault();
        try {
            await rateCourse(courseId, { rating, feedback });
            alert("Thank you for your rating!");
            setShowRating(false);
        } catch {
            alert("Failed to submit rating.");
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center text-white">Loading course...</div>;
    }

    if (error) {
        return <div className="min-h-screen pt-24 text-center text-red-400">{error}</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-slate-950 text-white pb-12">
            <div className="max-w-4xl mx-auto">
                {/* COURSE HEADER */}
                {course && (
                    <div className="mb-8 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
                        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                        <p className="text-gray-300">{course.description}</p>
                    </div>
                )}

                {/* LESSONS */}
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>

                <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`p-5 rounded-xl border flex justify-between items-center
                ${
                    lesson.is_locked
                        ? "bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed"
                        : "bg-slate-900 border-slate-700 hover:border-blue-500/50 cursor-pointer"
                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${
                      lesson.is_completed
                          ? "bg-green-500/20 text-green-400"
                          : lesson.is_locked
                            ? "bg-slate-800 text-slate-500"
                            : "bg-blue-500/20 text-blue-400"
                  }
                `}
                                >
                                    {lesson.is_completed ? (
                                        <CheckCircle size={20} />
                                    ) : lesson.is_locked ? (
                                        <Lock size={20} />
                                    ) : (
                                        <PlayCircle size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        {index + 1}. {lesson.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {lesson.is_locked
                                            ? "Complete previous lesson to unlock"
                                            : "Ready to start"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* QUIZZES */}
                {quizzes.length > 0 && (
                    <div className="mt-14">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <HelpCircle className="text-purple-500" />
                            Quizzes
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            {quizzes.map((quiz, index) => (
                                <div
                                    key={quiz.id}
                                    className="group relative bg-slate-900 border border-slate-700 rounded-xl p-6
                             hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/10 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                                                Quiz {index + 1}
                                            </span>
                                            <h3 className="text-xl font-bold text-white">
                                                {quiz.title || `Assessment ${index + 1}`}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 mb-6">
                                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">
                                            Pass Criteria
                                        </p>
                                        <p className="text-white font-mono text-lg">
                                            {quiz.pass_marks}{" "}
                                            <span className="text-slate-500">/</span>{" "}
                                            {quiz.total_marks}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(`/student/course/${courseId}/quiz/${quiz.id}`)
                                        }
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Attempt Quiz
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COURSE FORUM */}
                <ForumSection courseId={courseId} />

                {/* RATING */}
                <div className="mt-16 pt-8 border-t border-slate-800">
                    <button
                        onClick={() => setShowRating(!showRating)}
                        className="flex items-center gap-2 text-yellow-400"
                    >
                        <Star />
                        {showRating ? "Cancel Rating" : "Rate this Course"}
                    </button>

                    {showRating && (
                        <form onSubmit={handleRate} className="mt-6 p-6 bg-slate-900 rounded-xl">
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className={
                                            rating >= s ? "text-yellow-400" : "text-gray-600"
                                        }
                                    >
                                        <Star fill={rating >= s ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full bg-slate-800 rounded-lg p-3 mb-4"
                                placeholder="Share your experience..."
                            />

                            <button
                                type="submit"
                                disabled={rating === 0}
                                className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold"
                            >
                                Submit Review
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseView;
