import { Save } from "lucide-react";
import PropTypes from "prop-types";

const ProfileEditForm = ({
    username,
    email,
    setUsername,
    setEmail,
    handleSubmit,
    updating,
    message
}) => {
    return (
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 text-slate-900 dark:text-white shadow-sm dark:shadow-none">
            {message.text && (
                <div
                    className={`mb-4 p-3 rounded ${message.type === "success"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded px-4 py-2 text-slate-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded px-4 py-2 text-slate-900 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold text-white transition-colors"
                >
                    <Save size={18} />
                    {updating ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

ProfileEditForm.propTypes = {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setEmail: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    updating: PropTypes.bool.isRequired,
    message: PropTypes.shape({
        text: PropTypes.string,
        type: PropTypes.string
    }).isRequired
};

export default ProfileEditForm;
