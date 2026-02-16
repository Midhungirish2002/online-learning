import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            navigate("/");
        } catch {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div
            className="relative min-h-screen pt-16 flex items-center justify-center
                 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')]
                 bg-cover bg-center"
        >
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 transition-colors duration-300"
            ></motion.div>

            {/* Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 w-full max-w-md p-8
                      bg-white/80 dark:bg-white/10 backdrop-blur-lg
                      border border-slate-200 dark:border-white/20
                      rounded-2xl shadow-2xl transition-colors duration-300"
            >
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">
                    Welcome Back
                </h2>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/50
                          text-red-700 dark:text-red-200 rounded-lg text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-slate-700 dark:text-gray-300 mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/50
                         border border-slate-300 dark:border-slate-700 rounded-lg
                         focus:ring-2 focus:ring-blue-500
                         text-slate-900 dark:text-white outline-none transition-colors duration-300"
                            placeholder="Enter your username or email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/50
                         border border-slate-300 dark:border-slate-700 rounded-lg
                         focus:ring-2 focus:ring-blue-500
                         text-slate-900 dark:text-white outline-none transition-colors duration-300"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r
                       from-blue-600 to-purple-600
                       hover:from-blue-700 hover:to-purple-700
                       text-white font-bold rounded-lg shadow-lg"
                    >
                        Sign In
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-gray-400 text-sm">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
