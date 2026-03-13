import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

function MovieRow({ title, fetchMovies }) {
    const [movies, setMovies] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    const moviesPerSet = 6;

    useEffect(() => {
        fetchMovies().then(res => {
            setMovies(res.data);
        });
    }, [fetchMovies]);

    const nextMovies = () => {
        if (startIndex + moviesPerSet >= movies.length) {
            setStartIndex(0);
        }
        else {
            setStartIndex(startIndex + moviesPerSet);
        }
    };

    const prevMovies = () => {
        if (startIndex === 0) {
            setStartIndex(movies.length - moviesPerSet);
        }
        else {
            setStartIndex(startIndex - moviesPerSet);
        }
    };

    const displayedMovies = movies.slice(startIndex, startIndex + moviesPerSet);

    return (
        <div className="text-white px-10 py-10">
            <h2 className="text-2xl font-bold mb-6">
                {title}
            </h2>
            <div className="flex items-center gap-4">
                <button onClick={prevMovies} className="text-3xl hover:text-purple-400">
                    ◀
                </button>
                <div className="grid grid-cols-6 gap-6 w-full">
                    {movies.length === 0 ? (
                        <p className="text-gray-400">Loading movies...</p>
                    ) : (
                        displayedMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    )}
                </div>
                <button onClick={nextMovies} className="text-3xl hover:text-purple-400">
                    ▶
                </button>
            </div>
        </div>
    );
}

export default MovieRow;