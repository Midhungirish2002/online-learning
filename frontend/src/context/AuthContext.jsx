import { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";
import { fetchProfile } from "../api/users";
import PropTypes from "prop-types";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const normalizeUser = (data) => ({
        ...data,
        role: (data.role_name || "").toUpperCase()
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetchProfile();
                setUser(normalizeUser(res.data));
            } catch (err) {
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        const res = await loginApi({ username, password });
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);

        const profileRes = await fetchProfile();
        setUser(normalizeUser(profileRes.data));
    };

    const register = async (formData) => {
        const res = await registerApi(formData);
        // Automatically login after register (optional, but good UX if backend returns tokens, otherwise redirect to login)
        // Based on Register.jsx: await register(formData); navigate('/login');
        // So register function just needs to POST.
        // If the backend /register/ endpoint returns tokens, we could store them.
        // But generic RegisterView usually just returns 201 Created and maybe user data.
        // Checking LoginView, it returns tokens. RegisterView usually just creates user.
        // So we just return the response.
        return res;
    };

    const logout = () => clearAuth();

    const clearAuth = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
