import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, toggleUserStatus } from "../../api/users";
import {
    Search,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Shield,
    ShieldAlert,
    Edit
} from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [toggleLoading, setToggleLoading] = useState(null); // Track which user is being toggled
    const [successMessage, setSuccessMessage] = useState(null); // Success feedback
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            // Fetch ALL users once for frontend filtering
            const res = await fetchUsers("ALL");
            console.log("✅ Loaded users:", res.data.length);
            setUsers(res.data);
            setError(null);
        } catch (err) {
            console.error("❌ Failed to load users:", err);
            // Fallback for demo if endpoint is missing
            setError("Could not load users. Ensure '/admin-api/users/' endpoint exists.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (userId) => {
        // Prevent multiple clicks while toggle is in progress
        if (toggleLoading === userId) {
            console.warn("⚠️ Toggle already in progress for user:", userId);
            return;
        }

        const targetUser = users.find(u => u.id === userId);
        const previousStatus = targetUser?.is_active;

        console.log(`🔄 Toggling user ${userId} status from ${previousStatus ? 'Active' : 'Inactive'} to ${!previousStatus ? 'Active' : 'Inactive'}`);

        // Set loading state for this specific user
        setToggleLoading(userId);

        // Optimistic UI update
        const previousUsers = [...users];
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
        );

        try {
            const response = await toggleUserStatus(userId);
            console.log("✅ Toggle successful:", response.data);

            // Show success message
            const actionText = response.data.action_performed || (previousStatus ? "deactivated" : "activated");
            setSuccessMessage(`User successfully ${actionText}`);
        } catch (err) {
            console.error("❌ Failed to toggle status:", err);
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            // Revert on failure
            setUsers(previousUsers);

            // Better error message
            const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to update user status. Please try again.";
            setError(errorMsg);

            // Auto-hide error after 5 seconds
            setTimeout(() => setError(null), 5000);
        } finally {
            setToggleLoading(null);
        }
    };

    const handleEditUser = (userId) => {
        navigate(`/profile?user_id=${userId}`);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole =
            filterRole === "ALL" || (user.role && user.role.toUpperCase() === filterRole);

        const matchesStatus =
            filterStatus === "ALL" ||
            (filterStatus === "ACTIVE" ? user.is_active : !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-8">
            {/* Header & Controls */}
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-blue-500" size={24} />
                        User Management
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Manage system access and roles</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none w-full sm:w-64 transition-all"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-slate-900 transition-colors"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="STUDENT">Students</option>
                        <option value="INSTRUCTOR">Instructors</option>
                        <option value="ADMIN">Admins</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-slate-900 transition-colors"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="p-4 bg-green-500/10 border-b border-green-500/20 flex items-center gap-3 text-green-400 animate-pulse">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                            <th className="p-4 font-semibold">User Info</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                                        Loading users...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    {user.username}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {user.email || "No email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${user.role === "ADMIN"
                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                : user.role === "INSTRUCTOR"
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                }`}
                                        >
                                            {user.role === "ADMIN" && <ShieldAlert size={12} />}
                                            {user.role === "INSTRUCTOR" && <Shield size={12} />}
                                            {user.role === "STUDENT" && <User size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${user.is_active
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                                }`}
                                        >
                                            {user.is_active ? (
                                                <CheckCircle size={12} />
                                            ) : (
                                                <XCircle size={12} />
                                            )}
                                            {user.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEditUser(user.id)}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                                title="Edit User Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {user.role === "ADMIN" ? (
                                                // Disabled toggle for admin users
                                                <div className="relative inline-flex items-center opacity-40 cursor-not-allowed" title="Cannot modify admin status">
                                                    <div className={`w-11 h-6 bg-slate-700 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 ${user.is_active ? 'after:translate-x-full bg-slate-600' : ''
                                                        }`}></div>
                                                    <ShieldAlert size={14} className="ml-1.5 text-red-400" />
                                                </div>
                                            ) : (
                                                // Normal toggle for non-admin users
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={user.is_active}
                                                        onChange={() => handleToggle(user.id)}
                                                        disabled={toggleLoading === user.id}
                                                    />
                                                    <div
                                                        className={`w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${toggleLoading === user.id ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                                                            }`}
                                                        title={toggleLoading === user.id ? 'Updating...' : 'Toggle user status'}
                                                    ></div>
                                                </label>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-slate-950/30 border-t border-slate-800 text-center text-xs text-slate-500">
                Showing {filteredUsers.length} users
            </div>
        </div>
    );
};

export default UserManagement;
