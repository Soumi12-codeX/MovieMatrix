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
                className="w-full px-5 py-3 rounded-lg text-black"
            />

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (

                <div className="absolute w-full bg-white text-black rounded-md mt-2 shadow-lg">

                    {suggestions.map((movie) => (

                        <div
                            key={movie.id}
                            onClick={() => selectSuggestion(movie)}
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {movie.title}
                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default SearchBar;

