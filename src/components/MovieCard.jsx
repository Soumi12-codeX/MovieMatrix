import { Link } from "react-router-dom";

function MovieCard({ movie }) {
    if (!movie) return null;
    const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

    return (
        <Link to={`/movies/${movie.id}`} className="block group">
            <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/40">
                <img
                    src={
                        movie.poster_path
                            ? `${IMAGE_BASE}${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                    loading="lazy"
                />
                {/* Hover overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-2">
                    <p className="text-white text-xs font-medium leading-tight line-clamp-2">{movie.title}</p>
                </div>
            </div>
            {/* Title below card (always visible) */}
            <p className="text-white mt-1.5 text-xs sm:text-sm leading-tight line-clamp-1">{movie.title}</p>
        </Link>
    );
}

export default MovieCard;