import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername]     = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token    = localStorage.getItem("token");
        const uname    = localStorage.getItem("username");
        setIsLoggedIn(!!token);
        setUsername(uname || "");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-violet-900/25 text-white flex justify-between items-center py-4 px-8">

            {/* Logo */}
            <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-300 bg-clip-text text-transparent cursor-pointer tracking-wide">
                    MovieMatrix
                </h1>
            </Link>

            {/* Centre nav */}
            <div className="hidden md:flex space-x-1 text-sm">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/watchlist">Watchlist</NavLink>
                <NavLink to="/favorites">Favorites</NavLink>
                <NavLink to="/profile">Profile</NavLink>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {isLoggedIn ? (
                    <>
                        <Link to="/profile" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-white font-bold text-sm border border-violet-500/40 group-hover:border-violet-400 transition">
                                {username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-sm text-violet-300 hidden md:block group-hover:text-white transition">
                                {username}
                            </span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-violet-800/60 rounded-full text-violet-400 hover:bg-violet-800/40 hover:text-white transition text-sm"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="px-4 py-2 border border-violet-700/60 rounded-full text-violet-300 hover:bg-violet-800/40 hover:text-white transition text-sm">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-2 bg-violet-700 rounded-full text-white hover:bg-violet-600 transition hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-sm">
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link to={to}
            className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-violet-900/30 transition text-sm font-medium">
            {children}
        </Link>
    );
}

export default Navbar;