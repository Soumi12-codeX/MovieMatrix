import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/login"      element={<Login />} />
                <Route path="/register"   element={<Register />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/movie/:id"  element={<MovieDetails />} />
                <Route path="/profile"    element={<Profile />} />
                <Route path="/watchlist"  element={<Watchlist />} />
                <Route path="/favorites"  element={<Favorites />} />
            </Routes>
        </Router>
    );
}

export default App;