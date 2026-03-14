import { useState } from "react";
import API from "../services/authApi";

function Register() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        dob: "",
        city: "",
        state: "",
        country: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register", form);
            alert("User registered successfully!");
            console.log(res.data);
        } catch (error) {
            alert("Registration failed!");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-6 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-200 bg-clip-text text-transparent">
                    Sign Up for MovieMatrix
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Phone</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Date of Birth</label>
                            <input
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">City</label>
                            <input
                                name="city"
                                type="text"
                                placeholder="Enter your city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">State</label>
                            <input
                                name="state"
                                type="text"
                                placeholder="Enter your state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Country</label>
                            <input
                                name="country"
                                type="text"
                                placeholder="Enter your country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-4">
                    Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Register;