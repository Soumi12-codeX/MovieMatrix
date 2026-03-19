import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/authApi";
import reviewAPI from "../services/reviewApi";

function Profile() {
    const [user, setUser]           = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [activeTab, setActiveTab] = useState("watchlist");
    const [profileImage, setProfileImage] = useState(null);
    const [imageHover, setImageHover]     = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "null" || token === "undefined") {
            navigate("/login");
            return;
        }
        fetchAll();
    }, []);

    useEffect(() => {
        if (user?.username) {
            const saved = localStorage.getItem(`profileImage_${user.username}`);
            if (saved) setProfileImage(saved);
        }
    }, [user]);

    const fetchAll = async () => {
        try {
            const res = await API.get("/auth/profile");
            setUser(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
        }
        try {
            const res = await reviewAPI.get("/review/watchlist");
            setWatchlist(res.data || []);
        } catch { setWatchlist([]); }
        try {
            const res = await reviewAPI.get("/review/favorites");
            setFavorites(res.data || []);
        } catch { setFavorites([]); }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
        if (file.size > 2 * 1024 * 1024) { alert("Image must be smaller than 2MB"); return; }
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            setProfileImage(base64);
            localStorage.setItem(`profileImage_${user.username}`, base64);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setProfileImage(null);
        localStorage.removeItem(`profileImage_${user?.username}`);
    };

    const formatDate = (d) => {
        if (!d) return "—";
        try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
        catch { return d; }
    };

    const getPoster = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w200${path}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-violet-800 border-t-violet-400 animate-spin mx-auto mb-4" />
                <p className="text-violet-400 text-sm">Loading your profile...</p>
            </div>
        </div>
    );

    const displayList = activeTab === "watchlist" ? watchlist : favorites;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background blobs */}
            <div className="fixed top-0 left-1/3 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-900/8 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-900/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* ── HERO CARD ─────────────────────────────────────────────── */}
                <div className="bg-gradient-to-br from-[#0d0d18] to-[#0a0a12] border border-violet-900/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 relative">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 opacity-40 blur-md" />
                            <div
                                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer border border-violet-500/40"
                                onClick={() => fileInputRef.current?.click()}
                                onMouseEnter={() => setImageHover(true)}
                                onMouseLeave={() => setImageHover(false)}
                            >
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-700 to-purple-900 flex items-center justify-center text-3xl sm:text-4xl font-black text-white">
                                        {user?.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}
                                {imageHover && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                        <span className="text-2xl">📷</span>
                                        <span className="text-white text-[10px] mt-1">Change</span>
                                    </div>
                                )}
                            </div>
                            {profileImage && (
                                <button onClick={handleRemoveImage}
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-700 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center border border-red-500 z-10">
                                    ✕
                                </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*"
                                onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Name + info + stats — stacked on mobile, row on sm+ */}
                        <div className="flex-1 w-full flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">

                            {/* Text info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name || "—"}</h1>
                                <p className="text-violet-400 text-base sm:text-lg mt-0.5 mb-3 sm:mb-4">@{user?.username || "—"}</p>

                                {/* Pills — wrap nicely on small screens */}
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    {user?.email && <InfoPill>✉ {user.email}</InfoPill>}
                                    {user?.city  && <InfoPill>📍 {[user.city, user.state, user.country].filter(Boolean).join(", ")}</InfoPill>}
                                    {user?.phone && <InfoPill>📞 {user.phone}</InfoPill>}
                                </div>
                                <p className="text-gray-600 text-xs mt-3">Click avatar to upload photo</p>
                            </div>

                            {/* Stats — row on mobile (side by side), column on md+ */}
                            <div className="flex flex-row sm:flex-row md:flex-col gap-3 shrink-0">
                                <StatBadge label="Watchlist" value={watchlist.length} to="/watchlist" />
                                <StatBadge label="Favorites" value={favorites.length} to="/favorites" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PERSONAL DETAILS ──────────────────────────────────────── */}
                <div className="bg-[#0d0d18] border border-violet-900/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6">
                    <SectionHeading>Personal Details</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5">
                        <DetailRow label="Full Name"     value={user?.name} />
                        <DetailRow label="Username"      value={user?.username ? `@${user.username}` : null} />
                        <DetailRow label="Email"         value={user?.email} />
                        <DetailRow label="Phone"         value={user?.phone} />
                        <DetailRow label="Date of Birth" value={formatDate(user?.dob)} />
                        <DetailRow label="City"          value={user?.city} />
                        <DetailRow label="State"         value={user?.state} />
                        <DetailRow label="Country"       value={user?.country} />
                    </div>
                </div>

                {/* ── TABS ──────────────────────────────────────────────────── */}
                <div className="bg-[#0d0d18] border border-violet-900/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8">

                    {/* Tab header — stacks on very small screens */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex bg-black/60 border border-violet-900/30 rounded-2xl p-1 gap-1 w-full xs:w-auto">
                            <TabBtn active={activeTab === "watchlist"} onClick={() => setActiveTab("watchlist")}>
                                🎬 <span className="hidden xs:inline">Watchlist </span>({watchlist.length})
                            </TabBtn>
                            <TabBtn active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")}>
                                ❤️ <span className="hidden xs:inline">Favorites </span>({favorites.length})
                            </TabBtn>
                        </div>
                        <Link
                            to={activeTab === "watchlist" ? "/watchlist" : "/favorites"}
                            className="text-sm text-violet-400 hover:text-violet-300 transition shrink-0"
                        >
                            View all →
                        </Link>
                    </div>

                    {displayList.length === 0 ? (
                        <div className="text-center py-10 sm:py-14">
                            <p className="text-4xl sm:text-5xl mb-3">{activeTab === "watchlist" ? "🎬" : "❤️"}</p>
                            <p className="text-gray-500 text-sm">Your {activeTab} is empty</p>
                            <Link to="/" className="mt-3 inline-block text-violet-400 hover:underline text-sm">
                                Browse Movies →
                            </Link>
                        </div>
                    ) : (
                        /* 3 cols on mobile → 6 on sm+ */
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                            {displayList.slice(0, 6).map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/movies/${item.movieId}`}
                                    className="group relative rounded-xl overflow-hidden border border-violet-900/30 hover:border-violet-500/50 transition-all hover:scale-105 cursor-pointer aspect-[2/3] block"
                                >
                                    {getPoster(item.posterPath) ? (
                                        <img
                                            src={getPoster(item.posterPath)}
                                            alt={item.movieTitle}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-violet-950/50 flex items-center justify-center text-2xl sm:text-3xl">🎬</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <p className="text-white text-xs font-medium line-clamp-2">{item.movieTitle}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function InfoPill({ children }) {
    return (
        <span className="px-3 py-1 bg-violet-900/25 border border-violet-800/40 rounded-full text-violet-300 text-xs break-all sm:break-normal">
            {children}
        </span>
    );
}

function StatBadge({ label, value, to }) {
    return (
        <Link to={to} className="flex flex-col items-center bg-violet-900/20 border border-violet-800/30 rounded-2xl px-4 sm:px-5 py-3 hover:bg-violet-800/30 transition min-w-[72px] sm:min-w-[80px]">
            <span className="text-xl sm:text-2xl font-bold text-white">{value}</span>
            <span className="text-violet-400 text-xs mt-0.5">{label}</span>
        </Link>
    );
}

function SectionHeading({ children }) {
    return (
        <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-1 h-5 bg-gradient-to-b from-violet-400 to-purple-700 rounded-full" />
            {children}
        </h2>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="bg-black/40 border border-violet-900/20 rounded-xl px-3 sm:px-4 py-3">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white font-medium text-sm break-all sm:break-normal">{value || "—"}</p>
        </div>
    );
}

function TabBtn({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 xs:flex-none px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-center ${
                active ? "bg-violet-700 text-white shadow-lg shadow-violet-900/40" : "text-gray-500 hover:text-gray-300"
            }`}
        >
            {children}
        </button>
    );
}

export default Profile;