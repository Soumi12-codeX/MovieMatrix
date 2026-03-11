import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <Hero />

            <div className="text-white p-10">
                <h2 className="text-2xl font-bold">
                    Trending Movies
                </h2>

                <p className="text-gray-400 mt-2">
                    Movies will appear here tomorrow when we fetch from API.
                </p>
            </div>
        </div>
    );
}
export default Home;