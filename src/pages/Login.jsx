import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/authApi";

function Login() {
    const [form, setForm]       = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/login", form);

            console.log("=== LOGIN RESPONSE ===");
            console.log("typeof res.data:", typeof res.data);
            console.log("res.data:", res.data);
            let token = null;
            let username = form.username;

            if (typeof res.data === "string") {
               
                token = res.data.trim();
            } else if (typeof res.data === "object" && res.data !== null) {
               
                token    = res.data.token || res.data.jwt || res.data.accessToken;
                username = res.data.username || form.username;
            }

            console.log("Extracted token:", token ? token.substring(0, 30) + "..." : "NULL");
            console.log("Extracted username:", username);

            if (!token || token === "null" || token === "undefined") {
                setError("Login failed — server did not return a token");
                console.error("No token found in response:", res.data);
                return;
            }

            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);

            // Verify save worked
            console.log("Saved to localStorage:");
            console.log("  token:", localStorage.getItem("token")?.substring(0, 30) + "...");
            console.log("  username:", localStorage.getItem("username"));

            navigate("/");

        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(
                err.response?.status === 401 || err.response?.status === 403
                    ? "Invalid username or password"
                    : "Login failed. Is auth-service running on port 8080?"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white text-center mb-6 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-200 bg-clip-text text-transparent">
                    Login to MovieMatrix
                </h2>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Username or Email</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter your username or email"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-purple-400 hover:text-purple-300">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;