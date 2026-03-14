import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { useState } from "react";
import { getTrendingMovies, getMoviesByGenre, searchMovies } from "../services/movieApi";

function Home() {

    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const genreRows = [
        { title: "Action", id: 28 },
        { title: "Comedy", id: 35 },
        { title: "Sci-Fi", id: 878 },
        { title: "Romance", id: 10749 },
        { title: "Thriller", id: 53 },
        { title: "Kids", id: 16 },
        { title: "Family", id: 10751 },
        { title: "Documentaries", id: 99 }
    ];

    const handleSearch = async (query) => {
        setSearchQuery(query);

        try {
            const res = await searchMovies(query);
            setSearchResults(res.data);
        }
        catch (error) {
            console.error("Search error:", error);
        }
    }

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <Hero onSearch={handleSearch} />
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
            {!searchQuery && (
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