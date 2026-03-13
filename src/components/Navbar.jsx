function Navbar() {
  return (
    <nav className="bg-black text-white flex justify-between items-center py-4 px-8">

      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-blue-200 bg-clip-text text-transparent">
        MovieMatrix
      </h1>

      <div className="hidden md:flex space-x-6 text-sm">

        <button className="px-4 py-2 oklch(0.2 0.07 308.26) rounded-md hover:bg-purple-700">
          Home
        </button>

        <button className="px-4 py-2 oklch(0.2 0.07 308.26) rounded-md hover:bg-purple-700">
          Watchlist
        </button>

        <button className="px-4 py-2 oklch(0.2 0.07 308.26) rounded-md hover:bg-purple-700">
          Favorites
        </button>

        <button className="px-4 py-2 oklch(0.2 0.07 308.26) rounded-md hover:bg-purple-700">
          Profile
        </button>

        <button className="px-4 py-2 oklch(0.2 0.07 308.26) rounded-md hover:bg-purple-700">
          About
        </button>

      </div>

      <div className="space-x-4">

        <button className="px-4 py-2 bg-green-700 rounded-full hover:bg-green-600 hover:scale-120 transition hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
          Login
        </button>

        <button className="px-4 py-2 bg-red-700 rounded-full hover:bg-red-600 hover:scale-120 transition hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          Sign Up
        </button>

      </div>

    </nav>
  );
}

export default Navbar;