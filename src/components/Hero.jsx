import { useEffect, useState } from "react";
import { getTop5Movies } from "../services/movieApi";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import reviewAPI from "../services/reviewApi";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Hero({ onSearch }) {
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTop5Movies().then((res) => setMovies(res.data));
    }, []);

    // Check status whenever the slide index changes
    useEffect(() => {
        if (movies.length > 0) {
            checkWatchlistStatus(movies[index].id);
        }
    }, [index, movies]);

    const checkWatchlistStatus = async (movieId) => {
        if (!localStorage.getItem("token")) return;
        try {
            const res = await reviewAPI.get(`/review/status/${movieId}`);
            setInWatchlist(res.data.inWatchlist);
        } catch (err) {
            console.error("Status check failed", err);
        }
    };

    const handleWatchlistToggle = async (movie) => {
        if (!localStorage.getItem("token")) return;
        setLoading(true);
        try {
            if (inWatchlist) {
                await reviewAPI.delete(`/review/watchlist/${movie.id}`);
                setInWatchlist(false);
            } else {
                await reviewAPI.post("/review/watchlist", {
                    movieId: movie.id,
                    movieTitle: movie.title,
                    posterPath: movie.poster_path,
                    releaseYear: movie.release_date?.split("-")[0] || "",
                    voteAverage: movie.vote_average,
                });
                setInWatchlist(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (movies.length === 0) return null;
    const movie = movies[index];

    return (
        <div className="relative min-h-[90vh] bg-black text-white flex flex-col">
            {/* Toast Message */}
            {message && (
                <div className="fixed top-20 right-5 z-50 bg-red-600 px-4 py-2 rounded shadow-lg text-sm animate-bounce">
                    {message}
                </div>
            )}

            <img
                src={`${IMAGE_BASE}${movie.backdrop_path}`}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            <div className="relative z-20 flex justify-center pt-8 sm:pt-10 px-4">
                <div className="w-full max-w-xl">
                    <SearchBar onSearch={onSearch} />
                </div>
            </div>

            <div className="relative z-10 flex-1 flex items-end pb-10 sm:pb-14 px-4 sm:px-10">
                <div className="max-w-xl">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                        {movie.title}
                    </h1>
                    <p className="text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {movie.overview}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link to={`/movies/${movie.id}`}>
                            <button className="bg-red-500 text-white px-5 sm:px-6 py-2 rounded-md hover:bg-red-700 transition text-sm sm:text-base font-medium">
                                Explore Now
                            </button>
                        </Link>
                        <button
                            onClick={() => handleWatchlistToggle(movie)}
                            disabled={loading}
                            className={`px-5 sm:px-6 py-2 rounded-md transition text-sm sm:text-base font-medium border ${inWatchlist
                                    ? "bg-green-600 border-green-500 text-white"
                                    : "bg-black/60 text-white border-white/20 hover:bg-gray-800"
                                }`}
                        >
                            {loading ? "..." : inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            {movies.length > 1 && (
                <div className="relative z-20 flex justify-center gap-2 pb-4">
                    {movies.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-red-500" : "w-1.5 bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Hero;