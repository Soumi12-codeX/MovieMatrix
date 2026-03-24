import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import reviewAPI from "../services/reviewApi";


function Watchlist() {
    const [items, setItems]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [processingIds, setProcessingIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/login"); return; }
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const res = await reviewAPI.get("/review/watchlist");
        
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

    // Remove a movie
    const handleRemove = async (movieId) => {
        setProcessing(movieId, true);
        setItems((prev) => prev.filter((i) => i.movieId !== movieId));
        try {
            await reviewAPI.delete(`/review/watchlist/${movieId}`);
        } catch (err) {
            console.error(err);
            fetchWatchlist(); // Re-sync if it failed
        } finally {
            setProcessing(movieId, false);
        }
    };

    // Toggle watched — optimistic: flip boolean immediately
    const handleToggleWatched = async (movieId) => {
        setProcessing(movieId, true);
        // .map() creates a new array — never mutate state directly
        setItems((prev) =>
            prev.map((i) =>
                i.movieId === movieId ? { ...i, watched: !i.watched } : i
            )
        );
        try {
            await reviewAPI.put(`/review/watchlist/${movieId}/toggle-watched`);
        } catch (err) {
            console.error(err);
            fetchWatchlist();
        } finally {
            setProcessing(movieId, false);
        }
    };

    const getPoster = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w300${path}`;
    };

    const toWatch = items.filter((i) => !i.watched);
    const watched = items.filter((i) => i.watched);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-violet-800 border-t-violet-400 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="fixed top-0 right-0 w-96 h-96 bg-violet-900/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <span className="w-1.5 h-10 bg-gradient-to-b from-violet-400 to-purple-700 rounded-full" />
                            My Watchlist
                        </h1>
                        <p className="text-gray-600 text-sm mt-2 ml-5">
                            {items.length} total · {watched.length} watched · {toWatch.length} remaining
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
                        <p className="text-7xl mb-6">🎬</p>
                        <h2 className="text-2xl font-semibold text-white mb-2">Your watchlist is empty</h2>
                        <p className="text-gray-600 mb-8">Add movies you want to watch</p>
                        <Link to="/">
                            <button className="px-7 py-3 bg-violet-700 rounded-xl text-white hover:bg-violet-600 transition hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                                Browse Movies →
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">

                        {/* Up Next section */}
                        {toWatch.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
                                    Up Next — {toWatch.length} movies
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {toWatch.map((item) => (
                                        <WatchlistCard
                                            key={item.id}
                                            item={item}
                                            getPoster={getPoster}
                                            onRemove={handleRemove}
                                            onToggle={handleToggleWatched}
                                            processing={processingIds.has(item.movieId)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Watched section */}
                        {watched.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">
                                    Watched — {watched.length} movies
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {watched.map((item) => (
                                        <WatchlistCard
                                            key={item.id}
                                            item={item}
                                            getPoster={getPoster}
                                            onRemove={handleRemove}
                                            onToggle={handleToggleWatched}
                                            processing={processingIds.has(item.movieId)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Individual watchlist card
function WatchlistCard({ item, getPoster, onRemove, onToggle, processing }) {
    return (
        <div className={`bg-[#0d0d18] border rounded-2xl overflow-hidden transition-all hover:shadow-xl ${
            item.watched
                ? "border-emerald-900/40 opacity-75"
                : "border-violet-900/30 hover:border-violet-700/50 hover:shadow-violet-900/20"
        }`}>
            <div className="flex gap-4 p-4">
                {/* Poster */}
                <div className="flex-shrink-0 w-16 rounded-xl overflow-hidden bg-violet-950/50 aspect-[2/3]">
                    {getPoster(item.posterPath) ? (
                        <img src={getPoster(item.posterPath)} alt={item.movieTitle}
                            className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                        {item.movieTitle}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {item.releaseYear && (
                            <span className="text-gray-600 text-xs">{item.releaseYear}</span>
                        )}
                        {item.voteAverage && (
                            <span className="text-yellow-400 text-xs">
                                ⭐ {Number(item.voteAverage).toFixed(1)}
                            </span>
                        )}
                        {item.watched && (
                            <span className="text-emerald-400 text-xs font-medium">✓ Watched</span>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onToggle(item.movieId)}
                            disabled={processing}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                                item.watched
                                    ? "bg-gray-900 text-gray-500 hover:bg-gray-800 border border-gray-800"
                                    : "bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-800/30"
                            }`}
                        >
                            {item.watched ? "↩ Unwatch" : "✓ Mark Watched"}
                        </button>
                        <button
                            onClick={() => onRemove(item.movieId)}
                            disabled={processing}
                            className="px-3 py-1.5 bg-red-950/40 border border-red-900/40 rounded-lg text-red-500 hover:bg-red-900/40 text-xs transition disabled:opacity-50"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Watchlist;