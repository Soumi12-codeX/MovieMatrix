import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import reviewAPI from "../services/reviewApi";


function Favorites() {
    const [items, setItems]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [processingIds, setProcessingIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/login"); return; }
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await reviewAPI.get("/review/favorites");
            setItems(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const setProcessing = (movieId, val) => {
        setProcessingIds((prev) => {
            const next = new Set(prev);
            val ? next.add(movieId) : next.delete(movieId);
            return next;
        });
    };

    const handleRemove = async (movieId) => {
        setProcessing(movieId, true);
        setItems((prev) => prev.filter((i) => i.movieId !== movieId));
        try {
            await reviewAPI.delete(`/review/favorites/${movieId}`);
        } catch (err) {
            console.error(err);
            fetchFavorites();
        } finally {
            setProcessing(movieId, false);
        }
    };

    const getPoster = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w300${path}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-violet-800 border-t-violet-400 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="fixed bottom-0 left-0 w-80 h-80 bg-purple-900/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <span className="w-1.5 h-10 bg-gradient-to-b from-pink-400 to-violet-700 rounded-full" />
                            My Favorites
                        </h1>
                        <p className="text-gray-600 text-sm mt-2 ml-5">
                            {items.length} movie{items.length !== 1 ? "s" : ""} you love
                        </p>
                    </div>
                    <Link to="/">
                        <button className="px-5 py-2.5 bg-violet-700/30 border border-violet-700/50 rounded-xl text-violet-300 hover:bg-violet-700/50 transition text-sm font-medium">
                            + Browse Movies
                        </button>
                    </Link>
                </div>

                {/* Empty state */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <p className="text-7xl mb-6">❤️</p>
                        <h2 className="text-2xl font-semibold text-white mb-2">No favorites yet</h2>
                        <p className="text-gray-600 mb-8">Heart movies you love to collect them here</p>
                        <Link to="/">
                            <button className="px-7 py-3 bg-violet-700 rounded-xl text-white hover:bg-violet-600 transition hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                                Browse Movies →
                            </button>
                        </Link>
                    </div>
                ) : (
                    // Responsive poster grid — 2 cols on mobile, up to 5 on desktop
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {items.map((item) => (
                            <FavoriteCard
                                key={item.id}
                                item={item}
                                getPoster={getPoster}
                                onRemove={handleRemove}
                                processing={processingIds.has(item.movieId)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Poster card — hover reveals title + remove button
function FavoriteCard({ item, getPoster, onRemove, processing }) {
    return (
        // `group` = Tailwind parent hover class
        // children use `group-hover:opacity-100` to appear on hover
        <div className="group relative rounded-2xl overflow-hidden border border-violet-900/30 hover:border-violet-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-900/30 aspect-[2/3] cursor-pointer">

            {/* Poster */}
            {getPoster(item.posterPath) ? (
                <img src={getPoster(item.posterPath)}
                    alt={item.movieTitle}
                    className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-violet-950/60 flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">🎬</span>
                    <span className="text-gray-600 text-xs text-center px-2">{item.movieTitle}</span>
                </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-1">
                    {item.movieTitle}
                </p>
                <div className="flex items-center justify-between mb-2">
                    {item.releaseYear && (
                        <span className="text-gray-400 text-xs">{item.releaseYear}</span>
                    )}
                    {item.voteAverage && (
                        <span className="text-yellow-400 text-xs">
                            ⭐ {Number(item.voteAverage).toFixed(1)}
                        </span>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        // stopPropagation prevents click from bubbling to parent
                        e.stopPropagation();
                        onRemove(item.movieId);
                    }}
                    disabled={processing}
                    className="w-full py-1.5 bg-red-950/70 border border-red-800/50 rounded-lg text-red-400 hover:bg-red-900/70 text-xs transition disabled:opacity-50"
                >
                    {processing ? "Removing..." : "✕ Remove"}
                </button>
            </div>

            {/* Heart badge — always visible */}
            <div className="absolute top-2 right-2 w-7 h-7 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-sm border border-pink-900/40">
                ❤️
            </div>
        </div>
    );
}

export default Favorites;