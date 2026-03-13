import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { getTrendingMovies, getMoviesByGenre } from "../services/movieApi";

function Home() {
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

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <Hero />
            <MovieRow
                title="Trending Movies"
                fetchMovies={getTrendingMovies}
            />
            {genreRows.map((genre)=>(
                <MovieRow 
                    key={genre.id}
                    title={genre.title}
                    fetchMovies={()=>getMoviesByGenre(genre.id)}
                />
            ))}
        </div>
    );
}

export default Home;