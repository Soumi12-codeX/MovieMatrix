function Navbar() {
    return (
        <nav className="bg-blue-500 text-white flex justify-between items-center py-4 px-8">
            <h1 className="text-2xl font-bold text-purple-500">MovieMatrix</h1>

            <div className="hidden md:flex space-x-6 text-sm">
                <button className="hover:text-cyan-400">Home</button>
                <button className="hover:text-cyan-400">Movies</button>
                <button className="hover:text-cyan-400">Watchlist</button>
                <button className="hover:text-cyan-400">Favorites</button>
            </div>

            <div className="space-x-4">
                <button className="px-4 py-1 border bg-green-400 border-green-950 rounded-7 hover:bg-white hover:text-black">
                    Login
                </button>
                <button className="px-4 py-1 border bg-blue-500 border-blue-950 rounded-7 hover:bg-white hover:text-black">
                    Sign Up
                </button>
            </div>

        </nav>
    );
}

export default Navbar;