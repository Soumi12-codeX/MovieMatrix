import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../services/movieApi";

function SearchBar({ onSearch }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const res = await searchMovies(value);
            setSuggestions(res.data.slice(0, 5));
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            if (suggestions.length > 0) {
                const first = suggestions[0];
                navigate(`/movies/${first.id}`);
                setSuggestions([]);
                return;
            }
            if (query.trim()) {
                onSearch(query);
                setSuggestions([]);
            }
        }
    };

    const selectSuggestion = (movie) => {
        setQuery(movie.title);
        setSuggestions([]);
        navigate(`/movies/${movie.id}`);
    };

    return (

        <div className="relative">

            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleEnter}
                className="w-full px-5 py-3 rounded-lg text-white bg-transparent border border-purple-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 placeholder:text-white"
            />

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (

                <div className="absolute w-full bg-white text-black rounded-md mt-2 shadow-lg">

                    {suggestions.map((movie) => (

                        <div
                            key={movie.id}
                            onClick={() => selectSuggestion(movie)}
                            className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {movie.poster_path ? (<img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-10 h-14 object-cover mr-2" />) : (<div className="w-10 h-14 bg-gray-400 rounded"></div>)}

                            
                                <p className="font semi-bold">
                                    {movie.title}
                            
                                <span className="text-gray-500 ml-2 text-xs">
                                    ({movie.release_date?.slice(0,4)})
                                </span>
                                </p>
                
                            </div>
                            
                    

                    ))}

                </div>

            )}

        </div>

    );
}

export default SearchBar;

