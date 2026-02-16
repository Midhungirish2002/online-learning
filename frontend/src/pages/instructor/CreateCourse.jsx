import { useState } from "react";
import { createCourse } from "../../api/courses";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await createCourse({ title, description });
            navigate("/instructor/dashboard");
        } catch (err) {
            console.error("Failed to create course", err);
            setError("Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-950 text-white">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Advanced React Patterns"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe what students will learn..."
                            rows="4"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/instructor/dashboard")}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
