import { useEffect, useState } from "react";
import { getTop5Movies } from "../services/movieApi";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Hero() {
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        getTop5Movies().then(res => {
            setMovies(res.data);
        })
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
        <div className="relative h-[90vh] bg-clack text-white flex items-center justify-center">
            <img src={`${IMAGE_BASE}${movie.backdrop_path}`} alt={movie.title} className="absolute w-full h-full object-cover opacity-40" />

            <div className="relative z-10 px-10 max-w-xl">
                <h1 className="text-5xl font-bold mb-4">
                    {movie.title}
                </h1>
                <p className="text-gray-300 mb-6">
                    {movie.overview}
                </p>
                <div>
                    <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-800">
                        Explore Now
                    </button>

                    <button className="bg-black/60 text-white px-6 py-2 rounded-md hover:bg-gray-800 ml-4">
                        + Add to Watchlist
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Hero;