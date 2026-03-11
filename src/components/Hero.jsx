import inter from '../assets/interstellar.avif';
function Hero() {
    return (
        <div className="relative h-[80vh] bg-black text-white flex items-center justify-center">
            <img src={inter} alt="movie" className="absolute w-full h-full object-cover opacity-40" />

            <div className="relative z-10 px-10 max-w-xl">
                <h1>Interstellar</h1>
                <p className="text-gray-300 mb-6">
                    A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
                </p>
                <div>
                    <button className="border-white bg-red-500 text-white px-6 py-2 rounded-3 hover:bg-red-800 hover:text-white">Explore Now</button>
                    <button className="border-white bg-transparent text-white px-6 py-2 rounded-3 hover:bg-gray-800 hover:text-white ml-4">Add to Watchlist</button>
                </div>
            </div>
        </div>
    );
}
export default Hero;