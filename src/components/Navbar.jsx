import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const syncAuth = () => {
            const token = localStorage.getItem("token");
            const uname = localStorage.getItem("username");
            setIsLoggedIn(!!token);
            setUsername(uname || "");
        };

        syncAuth(); // run on mount

        // listen for login/logout events
        window.addEventListener("authChange", syncAuth);
        return () => window.removeEventListener("authChange", syncAuth);
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setMenuOpen(false);
        window.dispatchEvent(new Event("authChange")); 
        navigate("/login");
    };


    return (
        <nav ref={menuRef} className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-violet-900/25 text-white">
            <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-8">

                {/* Logo */}
                <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-300 bg-clip-text text-transparent tracking-wide">
                        MovieMatrix
                    </h1>
                </Link>

                {/* Centre nav — desktop */}
                <div className="hidden md:flex space-x-1 text-sm">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/watchlist">Watchlist</NavLink>
                    <NavLink to="/favorites">Favorites</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    <NavLink to="/about">About</NavLink>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {isLoggedIn ? (
                        <>
                            {/* Avatar + username — always on navbar */}
                            <Link to="/profile" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-white font-bold text-sm border border-violet-500/40 group-hover:border-violet-400 transition shrink-0">
                                    {username?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="text-xs sm:text-sm text-violet-300 group-hover:text-white transition max-w-[72px] sm:max-w-[120px] truncate">
                                    {username}
                                </span>
                            </Link>

                            {/* Logout — desktop only */}
                            <button onClick={handleLogout}
                                className="hidden md:block px-4 py-2 border border-violet-800/60 rounded-full text-violet-400 hover:bg-violet-800/40 hover:text-white transition text-sm">
                                Logout
                            </button>

                            {/* Hamburger — mobile only, true toggle */}
                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg hover:bg-violet-900/30 transition shrink-0"
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={menuOpen}
                            >
                                <span className={`block h-0.5 w-5 bg-violet-300 rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                                <span className={`block h-0.5 w-5 bg-violet-300 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                                <span className={`block h-0.5 w-5 bg-violet-300 rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-violet-700/60 rounded-full text-violet-300 hover:bg-violet-800/40 hover:text-white transition text-xs sm:text-sm">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-violet-700 rounded-full text-white hover:bg-violet-600 transition hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-xs sm:text-sm">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile dropdown — shown when logged in */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="bg-black/95 border-t border-violet-900/30 px-4 py-3 flex flex-col gap-1">
                    <MobileNavLink to="/" onClick={() => setMenuOpen(false)} icon="🏠">Home</MobileNavLink>
                    <MobileNavLink to="/profile" onClick={() => setMenuOpen(false)} icon="👤">Profile</MobileNavLink>
                    <MobileNavLink to="/watchlist" onClick={() => setMenuOpen(false)} icon="🎬">Watchlist</MobileNavLink>
                    <MobileNavLink to="/favorites" onClick={() => setMenuOpen(false)} icon="❤️">Favorites</MobileNavLink>
                    <MobileNavLink to="/about" onClick={() => setMenuOpen(false)} icon="ℹ️">About</MobileNavLink>

                    <button onClick={handleLogout}
                        className="mt-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition text-left border border-red-900/20">
                        <span>🚪</span> Logout
                    </button>
                </div>
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

function MobileNavLink({ to, children, onClick, icon }) {
    return (
        <Link to={to} onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-violet-900/30 transition">
            <span>{icon}</span>{children}
        </Link>
    );
}

export default Navbar;