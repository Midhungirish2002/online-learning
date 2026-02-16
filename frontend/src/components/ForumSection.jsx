import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, CornerDownRight } from "lucide-react";
import { fetchComments, createComment, deleteComment } from "../api/forum";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ForumSection = ({ courseId, lessonId = null }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null); // comment ID
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [courseId, lessonId]);

    const loadComments = async () => {
        try {
            const res = await fetchComments(courseId, lessonId);
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await createComment(courseId, {
                text: newComment,
                lesson: lessonId
            });
            setNewComment("");
            loadComments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to post comment");
        }
    };

    const handlePostReply = async (parentId) => {
        if (!replyText.trim()) return;

        try {
            await createComment(courseId, {
                text: replyText,
                lesson: lessonId,
                parent: parentId
            });
            setReplyText("");
            setReplyTo(null);
            loadComments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to post reply");
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment(commentId);
            loadComments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to delete comment");
        }
    };

    const renderComment = (comment, isReply = false) => (
        <div
            key={comment.id}
            className={`mb-4 ${isReply ? "ml-8 border-l-2 border-slate-700 pl-4" : ""}`}
        >
            <div className="flex gap-3">
                <img
                    src={
                        comment.profile_image ||
                        `https://ui-avatars.com/api/?name=${comment.username}`
                    }
                    alt={comment.username}
                    className="w-8 h-8 rounded-full border border-gray-600"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-cyan-400">
                            {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{comment.text}</p>

                    <div className="flex gap-3 mt-2">
                        {!isReply && (
                            <button
                                onClick={() =>
                                    setReplyTo(replyTo === comment.id ? null : comment.id)
                                }
                                className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1"
                            >
                                <CornerDownRight size={12} /> Reply
                            </button>
                        )}
                        {(user?.username === comment.username ||
                            user?.role === "INSTRUCTOR" ||
                            user?.role === "ADMIN") && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            )}
                    </div>
                </div>
            </div>

            {/* Reply Input */}
            {replyTo === comment.id && !isReply && (
                <div className="ml-11 mt-3 flex gap-2">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-slate-800 border-none rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handlePostReply(comment.id)}
                        className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                    >
                        <Send size={14} />
                    </button>
                </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
        </div>
    );

    return (
        <div className="mt-8 bg-slate-900/50 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                {lessonId ? "Lesson Discussion" : "Course Forum"}
            </h3>

            {/* New Comment Form */}
            <form onSubmit={handlePostComment} className="mb-8 flex gap-3">
                <img
                    src={
                        user?.profile_image || `https://ui-avatars.com/api/?name=${user?.username}`
                    }
                    alt="Me"
                    className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div className="flex-1 relative">
                    <textarea
                        placeholder="Ask a question or share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-slate-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 pr-12 resize-none h-24"
                    />
                    <button
                        type="submit"
                        className="absolute bottom-3 right-3 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition"
                        disabled={!newComment.trim()}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="text-center text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 italic py-4">
                    No comments yet. Be the first to start the discussion!
                </div>
            ) : (
                <div className="space-y-6">{comments.map((comment) => renderComment(comment))}</div>
            )}
        </div>
    );
};

ForumSection.propTypes = {
    courseId: PropTypes.number.isRequired,
    lessonId: PropTypes.number
};

export default ForumSection;
