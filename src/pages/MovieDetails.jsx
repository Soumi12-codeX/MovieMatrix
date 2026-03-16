import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [activeCard, setActiveCard] = useState(0);

    useEffect(() => {
        fetchMovie();
    }, [id]);

    const fetchMovie = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/movies/${id}`);
            console.log(res.data);
            setMovie(res.data);
        }
        catch (err) {
            console.error(err);
        }
    };

    const getDirector = () => {
        return movie?.credits?.crew?.find((member) => member.job === "Director")?.name || "N/A";
    };

    const getStoryWriter = () => {
        return (
            movie?.credits?.crew?.find((member) => ["Story", "Story Writer", "Writer", "Screenplay"].includes(member.job))?.name || "N/A"
        );
    };

    const getNetWorth = () => {
        if (movie?.revenue && movie.revenue > 0) {
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(movie.revenue);
        }
        return "N/A";
    };

    const getGenres = () => {
        return movie?.genres?.map((g) => g.name).join(", ") || "N/A";
    };

    const factsCards = [
        { label: "Duration", value: movie?.runtime ? `${movie.runtime} min` : "N/A", icon: "⏱" },
        { label: "Director", value: getDirector(), icon: "🎬" },
        { label: "Story Writer", value: getStoryWriter(), icon: "✍️" },
        { label: "Genre", value: getGenres(), icon: "🎭" },
        { label: "Release Date", value: movie?.release_date || "N/A", icon: "📅" },
        { label: "Net Worth", value: getNetWorth(), icon: "💰" },
    ];

    const onNextCard = () => {
        setActiveCard((prev) => (prev + 1) % factsCards.length);
    };
    if (!movie) return (
        <p className="text-white">Loading...</p>
    );

    return (
        <div className="bg-black text-white min-h-screen">
            <div
                className="relative h-[60vh] bg-cover bg-center"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 h-full p-8 flex items-end gap-6">
                    <div className="bg-black/60 p-6 rounded-xl max-w-4xl">
                        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                        <p className="text-gray-300 leading-relaxed mb-8">{movie.overview}</p>

                        <div className="flex flex-wrap items-end gap-6 text-sm md:text-base text-white/90">
                            <div className="bg-black/50 rounded-md p-2">
                                ⭐ <span className="font-semibold">Rating:</span> {movie.vote_average}
                            </div>
                            
                        </div>
                    </div>

                    <div className="hidden lg:block ml-auto mr-4 bg-black/70 border border-white/20 rounded-2xl p-4 w-96 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Movie Facts</h3>
                                <p className="text-xs text-gray-300">Swipe through key details</p>
                            </div>
                            <button
                                onClick={onNextCard}
                                className="text-white bg-violet-600/80 hover:bg-violet-500 rounded-full p-2 transition"
                                aria-label="Next card"
                            >
                                ➜
                            </button>
                        </div>

                        <div className="relative h-52">
                            {factsCards.map((card, index) => {
                                const progress = (index - activeCard + factsCards.length) % factsCards.length;
                                if (progress > 2) return null;

                                const sizeClass = progress === 0 ? "h-44 w-full" : "h-36 w-11/12";
                                const opacityClass = progress === 0 ? "opacity-100" : "opacity-70";
                                const zIndex = 50 - progress;
                                const translate = progress === 0 ? "translate-x-0" : progress === 1 ? "-translate-x-2" : "-translate-x-4";

                                return (
                                    <div
                                        key={card.label}
                                        className={`absolute top-0 left-0 rounded-xl border border-violet-400/35 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-slate-900/95 p-4 shadow-2xl shadow-violet-900/50 transition-all duration-300 ${sizeClass} ${opacityClass} ${translate}`}
                                        style={{ zIndex }}
                                    >
                                        <div className="flex items-center gap-2 text-sm text-violet-300 mb-2">
                                            <span>{card.icon}</span>
                                            <span className="font-semibold">{card.label}</span>
                                        </div>
                                        <p className="text-white text-base md:text-lg font-semibold">{card.value || "N/A"}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    <button className="bg-[#991f50] text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition">
                        + Add to Watchlist
                    </button>
                    <button className="bg-[#027cb9] text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition">
                        Add Review
                    </button>
                    <button className="bg-[#c41313] text-white px-4 py-2 rounded shadow-lg hover:bg-purple-700 transition">
                        Add to Favorites
                    </button>
                    
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
                <div className="absolute left-1/3 top-24 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute right-10 top-40 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />
            </div>

            <div className="p-10 relative z-10">
                <h2 className="text-3xl font-semibold mb-6">Top Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {movie.credits?.cast?.slice(0, 10).map((actor) => (
                        <div key={actor.id} className="group overflow-hidden rounded-2xl border border-violet-400/40 bg-gradient-to-br from-violet-900/80 via-purple-900/70 to-indigo-900/80 p-1 shadow-lg shadow-violet-900/30">
                            <div className="relative h-52 w-full overflow-hidden rounded-xl">
                                <img
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : "https://via.placeholder.com/300x450"}
                                    alt={actor.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                            <div className="mt-2 px-2 pb-2">
                                <p className="font-semibold text-white text-sm truncate">{actor.name}</p>
                                <p className="text-xs text-gray-300 truncate">{actor.character}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-10">
                <h2 className="text-3xl font-semibold">User Reviews</h2>
                <p className="text-gray-400 mt-3">Reviews will appear here after review-service is implemented.</p>
            </div>
        </div>
    );
}

export default MovieDetails;