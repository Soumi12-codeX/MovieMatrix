import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  if (!movie) return null;
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  return (
    <Link to={`/movies/${movie.id}`}>
      <div className="min-w-200px hover:scale-105 transition cursor-pointer hover:shadow-lg shadow-indigo-500/50">
        <img
          src={`${IMAGE_BASE}${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg"
        />
        <p className="text-white mt-2 text-sm">{movie.title}</p>
      </div>
    </Link>
  );
}

export default MovieCard;