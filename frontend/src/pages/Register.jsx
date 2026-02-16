import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "STUDENT"
    });
    const [error, setError] = useState("");
    const [emailWarning, setEmailWarning] = useState("");
    const [usernameWarning, setUsernameWarning] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear warnings
        if (e.target.name === "email") setEmailWarning("");
        if (e.target.name === "username") setUsernameWarning("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Custom Validation for Email
        if (!formData.email.includes("@")) {
            setEmailWarning("Please include '@' in your email address.");
            return;
        }

        setError("");
        setUsernameWarning(""); // Clear previous username errors

        try {
            await register(formData);
            navigate("/login");
        } catch (err) {
            console.error("Registration validation error:", err.response); // Debug log
            const data = err.response?.data;

            // Robust Username Error Handling
            if (data?.username) {
                // Ensure we get a string even if it's an array
                const msg = Array.isArray(data.username) ? data.username[0] : data.username;
                setUsernameWarning(msg);
            }
            // Fallback: Check if 'username' is mentioned in any generic error
            else if (
                JSON.stringify(data || "")
                    .toLowerCase()
                    .includes("username")
            ) {
                setUsernameWarning(
                    "Username entered already in use. Please choose a different name."
                );
            } else {
                const msg = data ? JSON.stringify(data) : "Registration failed.";
                setError(msg);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-950/70"></div>
            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm truncate">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-slate-900/50 border ${usernameWarning ? "border-red-500" : "border-slate-700"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 outline-none`}
                            placeholder="Choose a username"
                            required
                        />
                        {/* Inline Username Error */}
                        {usernameWarning && (
                            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-top-1">
                                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                                <span>{usernameWarning}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-slate-900/50 border ${emailWarning ? "border-yellow-500" : "border-slate-700"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 outline-none`}
                            placeholder="you@example.com"
                            required
                        />
                        {/* Inline Email Warning Box */}
                        {emailWarning && (
                            <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-center gap-2 text-yellow-200 text-sm animate-in fade-in slide-in-from-top-1">
                                <AlertTriangle size={16} className="shrink-0 text-yellow-400" />
                                <span>{emailWarning}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 outline-none"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-900"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
