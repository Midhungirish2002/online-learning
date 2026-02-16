import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLessonById, completeLesson } from "../../api/lessons";
import { ArrowLeft, CheckCircle, ChevronRight, StickyNote, Plus, Edit2, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import ForumSection from "../../components/ForumSection";
import { fetchNotes, createNote, updateNote, deleteNote } from "../../api/lessons";

const LessonPlayer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await fetchLessonById(lessonId);
                setLesson(response.data);
            } catch (error) {
                console.error("Failed to load lesson", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
        loadNotes();
    }, [lessonId]);

    const handleComplete = async () => {
        try {
            await completeLesson(lessonId);
            // Navigate back to course view or next lesson
            navigate(`/student/course/${courseId}`);
        } catch (error) {
            console.error("Failed to complete lesson", error);
            alert(error.response?.data?.error || "Could not complete lesson.");
        }
    };

    const loadNotes = async () => {
        try {
            const res = await fetchNotes(lessonId);
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to load notes", err);
        }
    };

    const handleCreateNote = async () => {
        if (!noteContent.trim()) return;
        try {
            const res = await createNote(lessonId, noteContent);
            setNotes(prev => [res.data, ...prev]);
            setNoteContent("");
        } catch (err) {
            console.error("Failed to create note", err);
            alert("Failed to save  note");
        }
    };

    const handleUpdateNote = async () => {
        if (!editingNote || !noteContent.trim()) return;
        try {
            const res = await updateNote(editingNote.id, noteContent);
            setNotes(prev => prev.map(n => n.id === editingNote.id ? res.data : n));
            setEditingNote(null);
            setNoteContent("");
        } catch (err) {
            console.error("Failed to update note", err);
            alert("Failed to update note");
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(noteId);
            setNotes(prev => prev.filter(n => n.id !== noteId));
        } catch (err) {
            console.error("Failed to delete note", err);
            alert("Failed to delete note");
        }
    };

    const startEdit = (note) => {
        setEditingNote(note);
        setNoteContent(note.content);
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setNoteContent("");
    };

    if (loading)
        return <div className="min-h-screen pt-24 text-center text-white">Loading lesson...</div>;
    if (!lesson)
        return <div className="min-h-screen pt-24 text-center text-red-400">Lesson not found.</div>;

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-slate-950 text-white pb-12">
            <div className="max-w-4xl mx-auto">
                {/* Notes Toggle Button */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(`/student/course/${courseId}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={20} /> Back to Course
                    </button>
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                        <StickyNote size={18} />
                        {showNotes ? "Hide Notes" : "Show Notes"}
                    </button>
                </div>

                {/* Notes Sidebar */}
                {showNotes && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="mb-8 bg-slate-800 border border-slate-700 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <StickyNote size={20} className="text-yellow-400" />
                            My Notes
                        </h3>

                        {/* Note Input */}
                        <div className="mb-6">
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Write your note here..."
                                className="w-full bg-slate-900 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                            />
                            <div className="flex gap-2 mt-2">
                                {editingNote ? (
                                    <>
                                        <button
                                            onClick={handleUpdateNote}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                                        >
                                            <Edit2 size={16} /> Update Note
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleCreateNote}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                                    >
                                        <Plus size={16} /> Add Note
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {notes.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No notes yet. Add your first note above!</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                        <p className="text-sm text-gray-300 whitespace-pre-wrap mb-2">{note.content}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {new Date(note.created_at).toLocaleString()}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(note)}
                                                    className="p-1 hover:bg-slate-800 rounded transition"
                                                    aria-label="Edit note"
                                                >
                                                    <Edit2 size={14} className="text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="p-1 hover:bg-slate-800 rounded transition"
                                                    aria-label="Delete note"
                                                >
                                                    <Trash2 size={14} className="text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                <button
                    onClick={() => navigate(`/student/course/${courseId}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                >
                    <ArrowLeft size={20} /> Back to Course
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
                >
                    <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {lesson.title}
                    </h1>

                    <div className="prose prose-invert max-w-none mb-12 text-gray-300">
                        {/* Render content safely assuming it's text/markdown, or use a markdown renderer */}
                        <div className="whitespace-pre-wrap leading-relaxed">{lesson.content}</div>
                    </div>

                    <div className="flex justify-end border-t border-slate-800 pt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition transform shadow-lg shadow-green-500/20"
                        >
                            <CheckCircle size={20} />
                            Mark as Completed
                        </motion.button>
                    </div>

                    {/* DISCUSSION FORUM */}
                    <ForumSection courseId={courseId} lessonId={lesson.id} />
                </motion.div>
            </div>
        </div>
    );
};

export default LessonPlayer;
