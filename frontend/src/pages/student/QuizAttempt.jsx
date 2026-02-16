import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestions, submitQuizAttempt } from "../../api/quizzes";
import { CheckCircle, AlertCircle, Save } from "lucide-react";

const QuizAttempt = () => {
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                // Fetch Quiz details (we might need a specific endpoint for this or reuse course structure)
                // Assuming we can get questions directly
                const questionsRes = await fetchQuestions(quizId); // Check if this endpoint exists for students
                // If not, we need to ensure the student can fetch questions.
                // Based on SRS, there is GET /quizzes/{id}/questions
                setQuestions(questionsRes.data);
            } catch (err) {
                console.error("Failed to load quiz", err);
                setError("Failed to load quiz questions. You may not be eligible yet.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizData();
    }, [quizId]);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        try {
            const response = await submitQuizAttempt(quizId, answers);
            setResult(response.data);
        } catch (err) {
            console.error("Quiz submission failed", err);
            setError(err.response?.data?.error || "Submission failed.");
        }
    };

    if (loading)
        return <div className="min-h-screen pt-24 text-center text-white">Loading quiz...</div>;

    if (result) {
        return (
            <div className="min-h-screen pt-24 px-4 md:px-8 bg-slate-950 text-white flex justify-center items-center">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
                    {result.message.includes("passed") ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    ) : (
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    )}
                    <h2 className="text-2xl font-bold mb-2">{result.message}</h2>
                    <p className="text-gray-400 mb-6">Score: {result.data.score}</p>
                    <button
                        onClick={() => navigate(`/student/course/${courseId}`)}
                        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-slate-950 text-white pb-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Quiz Attempt</h1>
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/50">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div
                            key={q.id}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
                        >
                            <h3 className="text-xl font-medium mb-4">
                                {index + 1}. {q.question_text}
                            </h3>
                            <div className="space-y-3">
                                {["A", "B", "C", "D"].map((opt) => {
                                    const optionText = q[`option_${opt.toLowerCase()}`];
                                    if (!optionText) return null;
                                    return (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                                            ${
                                                answers[q.id] === opt
                                                    ? "bg-blue-600/20 border-blue-500"
                                                    : "border-slate-700 hover:bg-slate-800"
                                            }
                                        `}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={opt}
                                                checked={answers[q.id] === opt}
                                                onChange={() => handleOptionChange(q.id, opt)}
                                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-600"
                                            />
                                            <span className="text-gray-300">{optionText}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        Submit Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;
