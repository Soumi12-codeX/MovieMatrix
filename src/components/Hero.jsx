import { useEffect, useState } from "react";
import { getTop5Movies } from "../services/movieApi";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import reviewAPI from "../services/reviewApi";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Hero({ onSearch }) {
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getTop5Movies().then((res) => setMovies(res.data));
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % movies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [movies]);

    const flashMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleWatchlist = async (movie) => {
        if (!localStorage.getItem("token")) {
            flashMessage("Please login first");
            return;
        }

        setLoading(true);
        try {
            await reviewAPI.post("/review/watchlist", {
                movieId: movie.id,
                movieTitle: movie.title,
                posterPath: movie.poster_path,
                releaseYear: movie.release_date?.split("-")[0] || "",
                voteAverage: movie.vote_average,
            });
            flashMessage("Added to Watchlist ✓");
        } catch (err) {
            console.error(err);
            flashMessage("Error adding to watchlist");
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
                            onClick={() => handleWatchlist(movie)}
                            disabled={loading}
                            className="bg-black/60 text-white px-5 sm:px-6 py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base font-medium border border-white/20 disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "+ Add to Watchlist"}
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
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === index ? "w-6 bg-red-500" : "w-1.5 bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Hero;