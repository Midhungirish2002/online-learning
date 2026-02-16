import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCourseById } from "../../api/courses";
import { fetchLessons, createLesson } from "../../api/lessons";
import { fetchQuizzes, createQuiz, createQuestion } from "../../api/quizzes";
import { Plus, BookOpen, HelpCircle, ArrowLeft } from "lucide-react";
import ForumSection from "../../components/ForumSection";

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lesson
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonContent, setNewLessonContent] = useState("");

    // Quiz
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [quizPassMarks, setQuizPassMarks] = useState(50);

    // Question
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
    const [correctOption, setCorrectOption] = useState("A");

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            const courseRes = await fetchCourseById(courseId);
            const lessonsRes = await fetchLessons(courseId);
            const quizzesRes = await fetchQuizzes(courseId);

            setCourse(courseRes.data);
            setLessons(lessonsRes.data);
            setQuizzes(quizzesRes.data);
        } catch (err) {
            console.error("Load error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ===================== LESSON ===================== */

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await createLesson(courseId, {
                title: newLessonTitle,
                content: newLessonContent,
                lesson_order: lessons.length + 1
            });
            setNewLessonTitle("");
            setNewLessonContent("");
        } catch (err) {
            console.error("Add lesson error:", err);
            alert(err.response?.data?.detail || "Failed to add lesson. Check console for details.");
        }
    };

    /* ===================== QUIZ ===================== */

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            await createQuiz(courseId, {
                title: newQuizTitle,
                pass_marks: Number(quizPassMarks)
            });
            setNewQuizTitle("");
            setQuizPassMarks(50);
            setShowCreateQuiz(false);
            fetchData();
        } catch (err) {
            alert("Failed to create quiz");
        }
    };

    /* ===================== QUESTION (FIXED) ===================== */

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        if (
            !selectedQuizId ||
            !questionText.trim() ||
            !options.A.trim() ||
            !options.B.trim() ||
            !options.C.trim() ||
            !options.D.trim()
        ) {
            alert("All fields are required");
            return;
        }

        try {
            await createQuestion(selectedQuizId, {
                question_text: questionText.trim(),
                option_a: options.A.trim(),
                option_b: options.B.trim(),
                option_c: options.C.trim(),
                option_d: options.D.trim(),
                correct_option: correctOption.toUpperCase() // ✅ REQUIRED
            });

            // reset
            setShowAddQuestion(false);
            setQuestionText("");
            setOptions({ A: "", B: "", C: "", D: "" });
            setCorrectOption("A");
            setSelectedQuizId(null);

            alert("Question added successfully");
        } catch (err) {
            console.error("Add question error:", err.response?.data);
            alert(
                err.response?.data ? JSON.stringify(err.response.data) : "Failed to add question"
            );
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center text-white">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 px-6 bg-slate-950 text-white"
        >
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/instructor/dashboard")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-10"
                >
                    {course?.title}
                </motion.h1>

                {/* ================= LESSONS ================= */}
                <section className="mb-14">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold flex gap-2">
                            <BookOpen /> Lessons
                        </h2>
                        <button
                            onClick={() => setShowAddLesson(!showAddLesson)}
                            className="bg-blue-600 px-4 py-2 rounded"
                        >
                            <Plus size={16} /> Add Lesson
                        </button>
                    </div>

                    <AnimatePresence>
                        {showAddLesson && (
                            <motion.form
                                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleAddLesson}
                                className="mb-4 space-y-3"
                            >
                                <input
                                    placeholder="Lesson title"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    className="w-full p-2 rounded bg-slate-800"
                                    required
                                />
                                <textarea
                                    placeholder="Lesson content"
                                    value={newLessonContent}
                                    onChange={(e) => setNewLessonContent(e.target.value)}
                                    className="w-full p-2 rounded bg-slate-800"
                                    required
                                />
                                <button className="bg-green-600 px-4 py-2 rounded">
                                    Save Lesson
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {lessons.map((l, i) => (
                        <motion.div
                            key={l.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 bg-slate-900 rounded mb-2"
                        >
                            {i + 1}. {l.title}
                        </motion.div>
                    ))}
                </section>

                {/* ================= QUIZZES ================= */}
                <section>
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold flex gap-2">
                            <HelpCircle /> Quizzes
                        </h2>
                        <button
                            onClick={() => setShowCreateQuiz(!showCreateQuiz)}
                            className="bg-purple-600 px-4 py-2 rounded"
                        >
                            <Plus size={16} /> Create Quiz
                        </button>
                    </div>

                    <AnimatePresence>
                        {showCreateQuiz && (
                            <motion.form
                                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleCreateQuiz}
                                className="mb-6 space-y-3"
                            >
                                <input
                                    placeholder="Quiz title"
                                    value={newQuizTitle}
                                    onChange={(e) => setNewQuizTitle(e.target.value)}
                                    className="w-full p-2 rounded bg-slate-800"
                                    required
                                />
                                <input
                                    type="number"
                                    value={quizPassMarks}
                                    onChange={(e) => setQuizPassMarks(e.target.value)}
                                    className="w-full p-2 rounded bg-slate-800"
                                    required
                                />
                                <button className="bg-green-600 px-4 py-2 rounded">
                                    Create Quiz
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="grid gap-6 md:grid-cols-2">
                        {quizzes.map((quiz, index) => (
                            <motion.div
                                key={quiz.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 bg-slate-900 rounded-xl"
                            >
                                <h3 className="font-bold mb-2">
                                    Quiz {index + 1}: {quiz.title || "Assessment"}
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">
                                    Pass Marks: {quiz.pass_marks}
                                </p>

                                <button
                                    onClick={() => {
                                        setSelectedQuizId(quiz.id);
                                        setShowAddQuestion(true);
                                    }}
                                    className="bg-purple-700 w-full py-2 rounded"
                                >
                                    Add Question
                                </button>

                                <AnimatePresence>
                                    {showAddQuestion && selectedQuizId === quiz.id && (
                                        <motion.form
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onSubmit={handleAddQuestion}
                                            className="mt-4 space-y-2"
                                        >
                                            <input
                                                placeholder="Question"
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                                className="w-full p-2 rounded bg-slate-800"
                                            />

                                            {["A", "B", "C", "D"].map((k) => (
                                                <input
                                                    key={k}
                                                    placeholder={`Option ${k}`}
                                                    value={options[k]}
                                                    onChange={(e) =>
                                                        setOptions({
                                                            ...options,
                                                            [k]: e.target.value
                                                        })
                                                    }
                                                    className="w-full p-2 rounded bg-slate-800"
                                                />
                                            ))}

                                            <select
                                                value={correctOption}
                                                onChange={(e) => setCorrectOption(e.target.value)}
                                                className="w-full p-2 rounded bg-slate-800"
                                            >
                                                {["A", "B", "C", "D"].map((o) => (
                                                    <option key={o} value={o}>
                                                        Correct: {o}
                                                    </option>
                                                ))}
                                            </select>

                                            <button className="bg-green-600 w-full py-2 rounded">
                                                Save Question
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ================= FORUM ================= */}
                <section className="mt-14">
                    <ForumSection courseId={courseId} />
                </section>
            </div>
        </motion.div>
    );
};

export default ManageCourse;
