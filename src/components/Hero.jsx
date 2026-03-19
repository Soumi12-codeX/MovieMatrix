import { useEffect, useState } from "react";
import { getTop5Movies } from "../services/movieApi";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Hero({ onSearch }) {
    const [movies, setMovies] = useState([]);
    const [index, setIndex]   = useState(0);

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

    if (movies.length === 0) return null;

    const movie = movies[index];

    return (
        <div className="relative min-h-[90vh] bg-black text-white flex flex-col">

            {/* Background image */}
            <img
                src={`${IMAGE_BASE}${movie.backdrop_path}`}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            {/* Gradient overlay so bottom content is readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* ── SEARCH BAR — top section, never overlaps content ── */}
            <div className="relative z-20 flex justify-center pt-8 sm:pt-10 px-4">
                <div className="w-full max-w-xl">
                    <SearchBar onSearch={onSearch} />
                </div>
            </div>

            {/* ── MOVIE CONTENT — flows naturally below search bar ── */}
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
                        <button className="bg-black/60 text-white px-5 sm:px-6 py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base font-medium border border-white/20">
                            + Add to Watchlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide indicator dots */}
            {movies.length > 1 && (
                <div className="relative z-20 flex justify-center gap-2 pb-4">
                    {movies.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === index ? "w-6 bg-red-500" : "w-1.5 bg-white/40"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Hero;