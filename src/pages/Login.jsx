import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/authApi";

function Login() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", form);

            const token = res.data.token;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username || form.username);
            alert("Login successful!");
            navigate("/");
        } catch (error) {
            alert("Login failed!");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white text-center mb-6 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-200 bg-clip-text text-transparent">
                    Login to MovieMatrix
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Username or Email</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter your username or email"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-4">
                    Don't have an account? <a href="/register" className="text-purple-400 hover:text-purple-300">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;