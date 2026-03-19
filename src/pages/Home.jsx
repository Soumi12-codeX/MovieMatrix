import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { useState } from "react";
import { getTrendingMovies, getMoviesByGenre, searchMovies } from "../services/movieApi";

const genres = [
    { label: "Trending",     id: null  },   // null = show all rows (default view)
    { label: "Action",       id: 28    },
    { label: "Comedy",       id: 35    },
    { label: "Sci-Fi",       id: 878   },
    { label: "Romance",      id: 10749 },
    { label: "Thriller",     id: 53    },
    { label: "Kids",         id: 16    },
    { label: "Family",       id: 10751 },
    { label: "Documentary",  id: 99    },
];

function Home() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery]     = useState("");
    const [selectedGenre, setSelectedGenre] = useState(null); // { id, label } or null

    const genreRows = [
        { title: "Action",        id: 28    },
        { title: "Comedy",        id: 35    },
        { title: "Sci-Fi",        id: 878   },
        { title: "Romance",       id: 10749 },
        { title: "Thriller",      id: 53    },
        { title: "Kids",          id: 16    },
        { title: "Family",        id: 10751 },
        { title: "Documentaries", id: 99    },
    ];

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setSelectedGenre(null);         // clear genre filter on new search
        try {
            const res = await searchMovies(query);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre.id === null ? null : genre); // "Trending" resets to default
        setSearchQuery("");             // clear search when genre is picked
        setSearchResults([]);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col">
            <Hero onSearch={handleSearch} />

            {/* ── GENRE FILTER BAR — hidden during search */}
            {!searchQuery && (
                <div className="px-4 sm:px-8 lg:px-10 pt-6 pb-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {genres.map((g) => {
                            const isActive =
                                g.id === null
                                    ? selectedGenre === null
                                    : selectedGenre?.id === g.id;
                            return (
                                <button
                                    key={g.label}
                                    onClick={() => handleGenreSelect(g)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-700/30"
                                            : "border-violet-800/50 text-violet-400 hover:bg-violet-900/40 hover:text-white hover:border-violet-600"
                                    }`}
                                >
                                    {g.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── SEARCH RESULTS */}
            {searchQuery && (
                searchResults.length > 0 ? (
                    <MovieRow
                        title={`Search Results for "${searchQuery}"`}
                        movies={searchResults}
                    />
                ) : (
                    <div className="text-white text-center text-2xl mt-20">
                        😞 Movie Not Found
                    </div>
                )
            )}

            {/* ── SINGLE GENRE RESULT */}
            {!searchQuery && selectedGenre && (
                <MovieRow
                    key={selectedGenre.id}          // key forces remount on genre switch
                    title={`${selectedGenre.label} Movies`}
                    fetchMovies={() => getMoviesByGenre(selectedGenre.id)}
                />
            )}

            {/* ── DEFAULT VIEW: trending + all genre rows */}
            {!searchQuery && !selectedGenre && (
                <>
                    <MovieRow
                        title="Trending Movies"
                        fetchMovies={getTrendingMovies}
                    />
                    {genreRows.map((genre) => (
                        <MovieRow
                            key={genre.id}
                            title={genre.title}
                            fetchMovies={() => getMoviesByGenre(genre.id)}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

export default Home;