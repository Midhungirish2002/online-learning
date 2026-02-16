import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, updateProfile } from "../api/users";
import { Shield } from "lucide-react";

// Components
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import InstructorStats from "../components/profile/InstructorStats";
import StudentStats from "../components/profile/StudentStats";

const Profile = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get("user_id");

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        loadProfile();
    }, [targetUserId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetchProfile(targetUserId);
            const normalized = {
                ...res.data,
                role: res.data.role_name
            };

            setProfile(normalized);
            setUsername(normalized.username);
            setEmail(normalized.email);
            setPreview(normalized.profile_image);
        } catch (err) {
            console.error("Failed to load profile", err);
            setError(err.response?.data?.detail || "Failed to load profile details.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        if (file) formData.append("profile_image", file);

        try {
            const res = await updateProfile(formData);

            setProfile({
                ...res.data,
                role: res.data.role_name
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            console.error("Update failed", err);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center text-white">Loading Profile...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 px-4 bg-slate-950 text-white flex items-center justify-center">
                <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center text-red-500">
                    <Shield size={48} className="mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen pt-24 px-4 bg-slate-950 text-white pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
                    {targetUserId ? "User Profile" : "My Profile"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT: Header Card */}
                    <ProfileHeader
                        profile={profile}
                        preview={preview}
                        handleFileChange={handleFileChange}
                    />

                    {/* RIGHT: Edit Form */}
                    <ProfileEditForm
                        username={username}
                        email={email}
                        setUsername={setUsername}
                        setEmail={setEmail}
                        handleSubmit={handleSubmit}
                        updating={updating}
                        message={message}
                    />
                </div>
            </div>

            {/* INSTRUCTOR STATS (If applicable) */}
            <InstructorStats profile={profile} />

            {/* STUDENT STATS (If applicable) */}
            <StudentStats profile={profile} />
        </div>
    );
};

export default Profile;
