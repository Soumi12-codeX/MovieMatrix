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
        // Guard against null, "null", "undefined"
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
        // ── FETCH EACH SEPARATELY ─────────────────────────────────────────────
        // Never use Promise.all for cross-service calls — one failure kills all.
        // Fetch each independently so partial data still shows.

        // 1. Auth profile (port 8080)
        try {
            console.log("[Profile] Fetching auth profile...");
            const res = await API.get("/auth/profile");
            console.log("[Profile] User:", res.data);
            setUser(res.data);
        } catch (err) {
            console.error("[Profile] Auth profile failed:", err.response?.status, err.message);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
        }

        // 2. Watchlist (port 8081)
        try {
            console.log("[Profile] Fetching watchlist...");
            const res = await reviewAPI.get("/review/watchlist");
            console.log("[Profile] Watchlist count:", res.data?.length);
            setWatchlist(res.data || []);
        } catch (err) {
            console.error("[Profile] Watchlist failed:", err.response?.status, err.message);
            setWatchlist([]); // show empty, don't crash
        }

        // 3. Favorites (port 8081)
        try {
            console.log("[Profile] Fetching favorites...");
            const res = await reviewAPI.get("/review/favorites");
            console.log("[Profile] Favorites count:", res.data?.length);
            setFavorites(res.data || []);
        } catch (err) {
            console.error("[Profile] Favorites failed:", err.response?.status, err.message);
            setFavorites([]); // show empty, don't crash
        }

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
        try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }); }
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
            <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-violet-900/8 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

                {/* Hero Card */}
                <div className="bg-gradient-to-br from-[#0d0d18] to-[#0a0a12] border border-violet-900/40 rounded-3xl p-8 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 opacity-40 blur-md" />
                            <div
                                className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border border-violet-500/40"
                                onClick={() => fileInputRef.current?.click()}
                                onMouseEnter={() => setImageHover(true)}
                                onMouseLeave={() => setImageHover(false)}
                            >
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-700 to-purple-900 flex items-center justify-center text-4xl font-black text-white">
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

                        {/* Name + info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white">{user?.name || "—"}</h1>
                            <p className="text-violet-400 text-lg mt-0.5 mb-4">@{user?.username || "—"}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {user?.email && <InfoPill>✉ {user.email}</InfoPill>}
                                {user?.city  && <InfoPill>📍 {[user.city, user.state, user.country].filter(Boolean).join(", ")}</InfoPill>}
                                {user?.phone && <InfoPill>📞 {user.phone}</InfoPill>}
                            </div>
                            <p className="text-gray-700 text-xs mt-3">Click avatar to upload photo</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 md:flex-col">
                            <StatBadge label="Watchlist" value={watchlist.length} to="/watchlist" />
                            <StatBadge label="Favorites" value={favorites.length} to="/favorites" />
                        </div>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="bg-[#0d0d18] border border-violet-900/30 rounded-3xl p-8 mb-6">
                    <SectionHeading>Personal Details</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
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

                {/* Tabs */}
                <div className="bg-[#0d0d18] border border-violet-900/30 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex bg-black/60 border border-violet-900/30 rounded-2xl p-1 gap-1">
                            <TabBtn active={activeTab === "watchlist"} onClick={() => setActiveTab("watchlist")}>
                                🎬 Watchlist ({watchlist.length})
                            </TabBtn>
                            <TabBtn active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")}>
                                ❤️ Favorites ({favorites.length})
                            </TabBtn>
                        </div>
                        <Link to={activeTab === "watchlist" ? "/watchlist" : "/favorites"}
                            className="text-sm text-violet-400 hover:text-violet-300 transition">
                            View all →
                        </Link>
                    </div>

                    {displayList.length === 0 ? (
                        <div className="text-center py-14">
                            <p className="text-5xl mb-3">{activeTab === "watchlist" ? "🎬" : "❤️"}</p>
                            <p className="text-gray-500">Your {activeTab} is empty</p>
                            <Link to="/" className="mt-3 inline-block text-violet-400 hover:underline text-sm">Browse Movies →</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {displayList.slice(0, 6).map((item) => (
                                <div key={item.id}
                                    className="group relative rounded-xl overflow-hidden border border-violet-900/30 hover:border-violet-500/50 transition-all hover:scale-105 cursor-pointer aspect-[2/3]">
                                    {getPoster(item.posterPath) ? (
                                        <img src={getPoster(item.posterPath)} alt={item.movieTitle} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-violet-950/50 flex items-center justify-center text-3xl">🎬</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <p className="text-white text-xs font-medium line-clamp-2">{item.movieTitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoPill({ children }) {
    return <span className="px-3 py-1 bg-violet-900/25 border border-violet-800/40 rounded-full text-violet-300 text-xs">{children}</span>;
}
function StatBadge({ label, value, to }) {
    return (
        <Link to={to} className="flex flex-col items-center bg-violet-900/20 border border-violet-800/30 rounded-2xl px-5 py-3 hover:bg-violet-800/30 transition min-w-[80px]">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-violet-400 text-xs mt-0.5">{label}</span>
        </Link>
    );
}
function SectionHeading({ children }) {
    return (
        <h2 className="text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-1 h-5 bg-gradient-to-b from-violet-400 to-purple-700 rounded-full" />
            {children}
        </h2>
    );
}
function DetailRow({ label, value }) {
    return (
        <div className="bg-black/40 border border-violet-900/20 rounded-xl px-4 py-3">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white font-medium text-sm">{value || "—"}</p>
        </div>
    );
}
function TabBtn({ active, onClick, children }) {
    return (
        <button onClick={onClick}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${active ? "bg-violet-700 text-white shadow-lg shadow-violet-900/40" : "text-gray-500 hover:text-gray-300"}`}>
            {children}
        </button>
    );
}

export default Profile;