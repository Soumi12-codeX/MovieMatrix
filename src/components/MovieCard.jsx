function MovieCard({movie}) {
    if(!movie) return null;
    const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
    return (
        <div className="min-w-200px hover:scale-105 transition cursor-pointer">
            <img src={`${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} 
            className="rounded-lg"/>

            <p className="text-white mt-2 text-sm">
            {movie.title}
            </p>
        </div>
    );
}

export default MovieCard;