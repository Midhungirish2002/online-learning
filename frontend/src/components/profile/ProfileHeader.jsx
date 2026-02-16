import { User, Camera, Shield } from "lucide-react";
import PropTypes from "prop-types";

const ProfileHeader = ({ profile, preview, handleFileChange }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-900 dark:text-white shadow-sm dark:shadow-none">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center relative group">
                {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={64} className="text-slate-400 dark:text-slate-600" />
                )}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Camera className="text-white" />
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{profile.email}</p>

            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-blue-600 dark:text-blue-400">
                <Shield size={12} />
                {profile.role}
            </div>
        </div>
    );
};

ProfileHeader.propTypes = {
    profile: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string
    }).isRequired,
    preview: PropTypes.string,
    handleFileChange: PropTypes.func.isRequired
};

export default ProfileHeader;
