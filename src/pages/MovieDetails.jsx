import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import reviewAPI from "../services/reviewApi";
import ReviewSection from "../components/ReviewSection";

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie]                       = useState(null);
    const [activeCard, setActiveCard]             = useState(0);
    const [inWatchlist, setInWatchlist]           = useState(false);
    const [inFavorites, setInFavorites]           = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [toast, setToast]                       = useState(null);
    const [castStart, setCastStart]               = useState(0);

    const CAST_PER_PAGE = 3;

    useEffect(() => { fetchMovie(); }, [id]);
    useEffect(() => { if (movie) checkStatus(); }, [movie]);

    const fetchMovie = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/movies/${id}`);
            setMovie(res.data);
        } catch (err) { console.error(err); }
    };

    const checkStatus = async () => {
        if (!localStorage.getItem("token")) return;
        try {
            const res = await reviewAPI.get(`/review/status/${movie.id}`);
            setInWatchlist(res.data.inWatchlist);
            setInFavorites(res.data.inFavorites);
        } catch (err) { console.error(err); }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleWatchlistToggle = async () => {
        if (!localStorage.getItem("token")) { showToast("Please login first", "error"); return; }
        setWatchlistLoading(true);
        try {
            if (inWatchlist) {
                await reviewAPI.delete(`/review/watchlist/${movie.id}`);
                setInWatchlist(false); showToast("Removed from watchlist");
            } else {
                await reviewAPI.post("/review/watchlist", {
                    movieId: movie.id, movieTitle: movie.title,
                    posterPath: movie.poster_path,
                    releaseYear: movie.release_date?.split("-")[0] || "",
                    voteAverage: movie.vote_average,
                });
                setInWatchlist(true); showToast("Added to watchlist ✓");
            }
        } catch { showToast("Something went wrong", "error"); }
        finally { setWatchlistLoading(false); }
    };

    const handleFavoritesToggle = async () => {
        if (!localStorage.getItem("token")) { showToast("Please login first", "error"); return; }
        setFavoritesLoading(true);
        try {
            if (inFavorites) {
                await reviewAPI.delete(`/review/favorites/${movie.id}`);
                setInFavorites(false); showToast("Removed from favorites");
            } else {
                await reviewAPI.post("/review/favorites", {
                    movieId: movie.id, movieTitle: movie.title,
                    posterPath: movie.poster_path,
                    releaseYear: movie.release_date?.split("-")[0] || "",
                    voteAverage: movie.vote_average,
                });
                setInFavorites(true); showToast("Added to favorites ❤️");
            }
        } catch { showToast("Something went wrong", "error"); }
        finally { setFavoritesLoading(false); }
    };

    const getDirector    = () => movie?.credits?.crew?.find((m) => m.job === "Director")?.name || "N/A";
    const getStoryWriter = () => movie?.credits?.crew?.find((m) => ["Story","Story Writer","Writer","Screenplay"].includes(m.job))?.name || "N/A";
    const getNetWorth    = () => movie?.revenue > 0 ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(movie.revenue) : "N/A";
    const getGenres      = () => movie?.genres?.map((g) => g.name).join(", ") || "N/A";

    const factsCards = [
        { label:"Duration",     value: movie?.runtime ? `${movie.runtime} min` : "N/A", icon:"⏱" },
        { label:"Director",     value: getDirector(),    icon:"🎬" },
        { label:"Story Writer", value: getStoryWriter(), icon:"✍️" },
        { label:"Genre",        value: getGenres(),      icon:"🎭" },
        { label:"Release Date", value: movie?.release_date || "N/A", icon:"📅" },
        { label:"Net Worth",    value: getNetWorth(),    icon:"💰" },
    ];

    const onNextCard = () => setActiveCard((prev) => (prev + 1) % factsCards.length);
    const onPrevCard = () => setActiveCard((prev) => (prev - 1 + factsCards.length) % factsCards.length);

    // Cast pagination
    const cast = movie?.credits?.cast?.slice(0, 15) || [];
    const totalCastPages = Math.ceil(cast.length / CAST_PER_PAGE);
    const currentCastPage = Math.floor(castStart / CAST_PER_PAGE);
    const displayedCast = cast.slice(castStart, castStart + CAST_PER_PAGE);

    const nextCast = () => setCastStart((prev) =>
        prev + CAST_PER_PAGE >= cast.length ? 0 : prev + CAST_PER_PAGE
    );
    const prevCast = () => setCastStart((prev) =>
        prev === 0 ? Math.max(0, cast.length - CAST_PER_PAGE) : prev - CAST_PER_PAGE
    );

    if (!movie) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-violet-800 border-t-violet-400 animate-spin" />
        </div>
    );

    // ── Shared facts carousel markup (used in both mobile & desktop) ──────────
    const FactsCarousel = ({ compact = false }) => (
        <div className={`bg-black/70 border border-white/20 rounded-2xl backdrop-blur-md ${compact ? "p-3" : "p-4"}`}>
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className={`font-semibold text-white ${compact ? "text-base" : "text-lg"}`}>Movie Facts</h3>
                    <p className="text-xs text-gray-400">Cycle through key details</p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={onPrevCard}
                        className="text-white bg-violet-600/80 hover:bg-violet-500 rounded-full w-8 h-8 flex items-center justify-center transition text-sm"
                    >
                        ←
                    </button>
                    <button
                        onClick={onNextCard}
                        className="text-white bg-violet-600/80 hover:bg-violet-500 rounded-full w-8 h-8 flex items-center justify-center transition text-sm"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Card stack */}
            <div className={`relative ${compact ? "h-36" : "h-52"}`}>
                {factsCards.map((card, index) => {
                    const progress = (index - activeCard + factsCards.length) % factsCards.length;
                    if (progress > 2) return null;
                    const sizeClass    = progress === 0 ? `${compact ? "h-28" : "h-44"} w-full` : `${compact ? "h-20" : "h-36"} w-11/12`;
                    const opacityClass = progress === 0 ? "opacity-100" : "opacity-60";
                    const zIndex       = 50 - progress;
                    const translate    = progress === 0 ? "translate-x-0" : progress === 1 ? "-translate-x-2" : "-translate-x-4";
                    return (
                        <div
                            key={card.label}
                            className={`absolute top-0 left-0 rounded-xl border border-violet-400/35 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-slate-900/95 p-3 shadow-2xl shadow-violet-900/50 transition-all duration-300 ${sizeClass} ${opacityClass} ${translate}`}
                            style={{ zIndex }}
                        >
                            <div className="flex items-center gap-2 text-sm text-violet-300 mb-1.5">
                                <span>{card.icon}</span>
                                <span className="font-semibold">{card.label}</span>
                            </div>
                            <p className={`text-white font-semibold ${compact ? "text-sm" : "text-base md:text-lg"}`}>
                                {card.value || "N/A"}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-2">
                {factsCards.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveCard(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            i === activeCard ? "w-5 bg-violet-400" : "w-1.5 bg-violet-900"
                        }`}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-black text-white min-h-screen">

            {/* ── TOAST ─────────────────────────────────────────────────────── */}
            {toast && (
                <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:top-6 sm:right-6 sm:w-auto z-[100] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl border ${
                    toast.type === "error"
                        ? "bg-red-900/90 border-red-600"
                        : "bg-violet-900/90 border-violet-500"
                }`}>
                    {toast.message}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                MOBILE HERO  (hidden on lg+)
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:hidden">
                {/* Decorative backdrop banner */}
                <div
                    className="relative h-52 sm:h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
                </div>

                {/* All content below banner — no absolute overlap */}
                <div className="px-4 sm:px-6 pt-2 pb-4 relative z-10">

                    {/* Title — always fully visible */}
                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                        {movie.title}
                    </h1>

                    {/* Rating */}
                    <div className="inline-flex items-center gap-1.5 bg-black/60 border border-violet-900/40 rounded-lg px-3 py-1.5 text-sm mb-4">
                        ⭐ <span className="font-semibold">Rating:</span> {movie.vote_average?.toFixed(1)}
                    </div>

                    {/* Overview — full text */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                        {movie.overview}
                    </p>

                    {/* Facts carousel — same animation as desktop, compact size */}
                    <div className="mb-5">
                        <FactsCarousel compact={true} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleWatchlistToggle}
                            disabled={watchlistLoading}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                                inWatchlist
                                    ? "bg-violet-800 border border-violet-500 text-violet-200"
                                    : "bg-violet-600 text-white hover:bg-violet-500"
                            }`}
                        >
                            {watchlistLoading
                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
                        </button>
                        <button
                            onClick={handleFavoritesToggle}
                            disabled={favoritesLoading}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                                inFavorites
                                    ? "bg-pink-900 border border-pink-600 text-pink-200"
                                    : "bg-pink-700 text-white hover:bg-pink-600"
                            }`}
                        >
                            {favoritesLoading
                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : inFavorites ? "❤️ Favorited" : "♡ Favorites"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                DESKTOP HERO  (hidden below lg)
            ══════════════════════════════════════════════════════════════ */}
            <div
                className="hidden lg:block relative h-[60vh] bg-cover bg-center"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 h-full p-8 flex items-end gap-6">
                    <div className="bg-black/60 p-6 rounded-xl max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4 leading-tight">{movie.title}</h1>
                        <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>
                        <div className="bg-black/50 rounded-md p-2 inline-flex">
                            ⭐ <span className="font-semibold ml-1">Rating:</span>&nbsp;{movie.vote_average?.toFixed(1)}
                        </div>
                    </div>

                    {/* Desktop facts carousel — full size */}
                    <div className="ml-auto mr-4 w-96 shrink-0">
                        <FactsCarousel compact={false} />
                    </div>
                </div>

                {/* Desktop floating action buttons */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    <button
                        onClick={handleWatchlistToggle}
                        disabled={watchlistLoading}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-60 flex items-center gap-2 ${
                            inWatchlist
                                ? "bg-violet-800 border border-violet-500 text-violet-200 hover:bg-violet-900"
                                : "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-violet-500/40 hover:shadow-xl"
                        }`}
                    >
                        {watchlistLoading
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                    </button>
                    <button
                        onClick={handleFavoritesToggle}
                        disabled={favoritesLoading}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-60 flex items-center gap-2 ${
                            inFavorites
                                ? "bg-pink-900 border border-pink-600 text-pink-200 hover:bg-pink-950"
                                : "bg-pink-700 text-white hover:bg-pink-600 hover:shadow-pink-500/40 hover:shadow-xl"
                        }`}
                    >
                        {favoritesLoading
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : inFavorites ? "❤️ Favorited" : "♡ Add to Favorites"}
                    </button>
                </div>
            </div>

            {/* Blobs */}
            <div className="relative overflow-hidden pointer-events-none">
                <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
                <div className="absolute left-1/3 top-24 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute right-10 top-40 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />
            </div>

            {/* ══════════════════════════════════════════════════════════════
                TOP CAST — 3 per row on mobile with arrows, 5 on desktop
            ══════════════════════════════════════════════════════════════ */}
            <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 relative z-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">Top Cast</h2>

                {/* ── Mobile cast row (< lg): 3 cards + arrows ── */}
                <div className="lg:hidden">
                    <div className="flex items-center gap-2">
                        {/* Prev arrow */}
                        <button
                            onClick={prevCast}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-violet-900/40 hover:bg-violet-700/60 text-white transition text-sm"
                            aria-label="Previous cast"
                        >
                            ◀
                        </button>

                        {/* 3-card grid */}
                        <div className="grid grid-cols-3 gap-3 flex-1">
                            {displayedCast.map((actor) => (
                                <CastCard key={actor.id} actor={actor} />
                            ))}
                            {/* Fill empty slots so grid stays stable */}
                            {displayedCast.length < CAST_PER_PAGE &&
                                Array.from({ length: CAST_PER_PAGE - displayedCast.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-[2/3] rounded-2xl bg-violet-900/10 border border-violet-900/20" />
                                ))
                            }
                        </div>

                        {/* Next arrow */}
                        <button
                            onClick={nextCast}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-violet-900/40 hover:bg-violet-700/60 text-white transition text-sm"
                            aria-label="Next cast"
                        >
                            ▶
                        </button>
                    </div>

                    {/* Page dots */}
                    {totalCastPages > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                            {Array.from({ length: totalCastPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCastStart(i * CAST_PER_PAGE)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === currentCastPage ? "w-5 bg-violet-400" : "w-1.5 bg-violet-900"
                                    }`}
                                    aria-label={`Cast page ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Desktop cast grid (lg+): all 10, 5 per row ── */}
                <div className="hidden lg:grid grid-cols-5 gap-4">
                    {movie.credits?.cast?.slice(0, 10).map((actor) => (
                        <CastCard key={actor.id} actor={actor} />
                    ))}
                </div>
            </div>

            {/* Review Section */}
            <ReviewSection
                movieId={movie.id}
                movieTitle={movie.title}
                posterPath={movie.poster_path}
            />
        </div>
    );
}

/* ── Shared cast card component ──────────────────────────────────────────── */
function CastCard({ actor }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-violet-400/40 bg-gradient-to-br from-violet-900/80 via-purple-900/70 to-indigo-900/80 p-1 shadow-lg shadow-violet-900/30">
            <div className="relative w-full overflow-hidden rounded-xl aspect-[2/3]">
                <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "https://via.placeholder.com/300x450?text=No+Photo"}
                    alt={actor.name}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
            <div className="mt-2 px-2 pb-2">
                <p className="font-semibold text-white text-xs sm:text-sm truncate">{actor.name}</p>
                <p className="text-xs text-gray-300 truncate">{actor.character}</p>
            </div>
        </div>
    );
}

export default MovieDetails;