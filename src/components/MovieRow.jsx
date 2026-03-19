import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

function MovieRow({ title, fetchMovies, movies: providedMovies }) {
    const [movies, setMovies]       = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    // Detect mobile (3 cards) vs desktop (6 cards)
    const getMoviesPerSet = () => (window.innerWidth < 640 ? 3 : 6);
    const [moviesPerSet, setMoviesPerSet] = useState(getMoviesPerSet);

    // Re-calculate on resize and reset startIndex so we don't end up out of bounds
    useEffect(() => {
        const onResize = () => {
            setMoviesPerSet(getMoviesPerSet());
            setStartIndex(0);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (fetchMovies) {
            fetchMovies().then((res) => setMovies(res.data));
        }
        if (providedMovies) {
            setMovies(providedMovies);
        }
    }, [fetchMovies, providedMovies]);

    const nextMovies = () => {
        setStartIndex((prev) =>
            prev + moviesPerSet >= movies.length ? 0 : prev + moviesPerSet
        );
    };

    const prevMovies = () => {
        setStartIndex((prev) =>
            prev === 0
                ? Math.max(0, movies.length - moviesPerSet)
                : prev - moviesPerSet
        );
    };

    const displayedMovies = movies.slice(startIndex, startIndex + moviesPerSet);

    return (
        <div className="text-white px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Prev button */}
                <button
                    onClick={prevMovies}
                    className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-violet-900/40 hover:bg-violet-700/60 text-white transition text-sm sm:text-xl"
                    aria-label="Previous"
                >
                    ◀
                </button>

                {/* Movie grid */}
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 w-full">
                    {movies.length === 0 ? (
                        /* Skeleton placeholders */
                        Array.from({ length: moviesPerSet }).map((_, i) => (
                            <div key={i} className="rounded-lg bg-violet-900/20 animate-pulse aspect-[2/3]" />
                        ))
                    ) : (
                        displayedMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    )}
                </div>

                {/* Next button */}
                <button
                    onClick={nextMovies}
                    className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-violet-900/40 hover:bg-violet-700/60 text-white transition text-sm sm:text-xl"
                    aria-label="Next"
                >
                    ▶
                </button>
            </div>

            {/* Pagination dots */}
            {movies.length > 0 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: Math.ceil(movies.length / moviesPerSet) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setStartIndex(i * moviesPerSet)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === Math.floor(startIndex / moviesPerSet)
                                    ? "w-6 bg-violet-400"
                                    : "w-1.5 bg-violet-900"
                            }`}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MovieRow;