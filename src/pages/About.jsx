import { Link } from "react-router-dom";
import myPhoto from "../assets/dev-photo.jpeg"

const devPhoto = myPhoto; 

const GITHUB_URL   = "https://github.com/Soumi12-codeX";        
const LINKEDIN_URL = "https://linkedin.com/in/soumi-das-831105308";    

const features = [
    {
        icon: "🔍",
        title: "Smart Movie Search",
        desc: "Instantly search across thousands of movies powered by the TMDB API. Get results in real-time as you type.",
    },
    {
        icon: "🎬",
        title: "Rich Movie Details",
        desc: "Explore full cast, crew, director, story writer, genres, revenue, runtime, and ratings — all in one place.",
    },
    {
        icon: "📋",
        title: "Personal Watchlist",
        desc: "Save movies you want to watch later. Your watchlist is tied to your account and synced across sessions.",
    },
    {
        icon: "❤️",
        title: "Favorites Collection",
        desc: "Mark movies you love and build your personal favorites collection that reflects your taste.",
    },
    {
        icon: "⭐",
        title: "Reviews & Ratings",
        desc: "Write reviews, share opinions, and rate movies. Read what other users think before you watch.",
    },
    {
        icon: "🔐",
        title: "Secure Authentication",
        desc: "JWT-based login and registration keeps your data private. Every action is tied to your secure account.",
    },
    {
        icon: "🎭",
        title: "Genre Browsing",
        desc: "Browse movies by Action, Comedy, Sci-Fi, Romance, Thriller, and more — curated rows for every mood.",
    },
    {
        icon: "📱",
        title: "Fully Responsive UI",
        desc: "Designed to look and feel great on every device — mobile, tablet, and desktop.",
    },
];

const techStack = [
    { label: "Frontend",    value: "React + Vite + Tailwind CSS" },
    { label: "Auth Service",value: "Spring Boot (JWT, port 8080)" },
    { label: "Movie Service",value: "Spring Boot + TMDB API (port 8082)" },
    { label: "Review Service",value: "Spring Boot + MySQL (port 8081)" },
    { label: "Database",    value: "MySQL" },
    { label: "Movie Data",  value: "TMDB (The Movie Database) API" },
];

function About() {
    return (
        <div className="bg-black text-white min-h-screen">

            {/* Background blobs */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[350px] h-[350px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            
            <div className="relative overflow-hidden border-b border-violet-900/30">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-black to-black" />
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-violet-900/40 border border-violet-700/40 text-violet-300 text-xs font-semibold tracking-widest uppercase mb-6">
                        About MovieMatrix
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        Your Universe of{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                            Movies
                        </span>
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        MovieMatrix is a full-stack movie discovery platform that brings together
                        search, reviews, watchlists, and favorites — all in one beautifully crafted,
                        interactive experience.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20">

                
                <section>
                    <SectionHeading
                        tag="What We Offer"
                        title="Everything you need to explore movies"
                        subtitle="MovieMatrix simplifies how you discover, track, and engage with the films you love."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                        {features.map((f) => (
                            <div key={f.title}
                                className="group bg-gradient-to-br from-[#0d0d18] to-[#0a0a12] border border-violet-900/30 hover:border-violet-600/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/20 hover:-translate-y-1">
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <SectionHeading
                        tag="Architecture"
                        title="Built on a microservice backbone"
                        subtitle="Three independent Spring Boot services work together behind a React frontend."
                    />
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {techStack.map((t) => (
                            <div key={t.label}
                                className="flex items-start gap-4 bg-black/40 border border-violet-900/25 rounded-xl px-4 py-3">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-violet-500 shrink-0" />
                                <div>
                                    <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider">{t.label}</p>
                                    <p className="text-white text-sm mt-0.5">{t.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>

                {/* ── DEVELOPER */}
                <section>
                    <SectionHeading
                        tag="The Developer"
                        title="Built with passion"
                        subtitle="A solo full-stack project from concept to deployment."
                    />
                    <div className="mt-10 bg-gradient-to-br from-[#0d0d18] to-[#0a0a12] border border-violet-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">

                        {/* Photo */}
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 opacity-40 blur-md" />
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-violet-500/40">
                                {devPhoto ? (
                                    <img src={devPhoto} alt="Developer" className="w-full h-full object-cover" />
                                ) : (
                                    
                                    <div className="w-full h-full bg-gradient-to-br from-violet-700 to-purple-900 flex items-center justify-center text-4xl font-black text-white select-none">
                                        S
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-2xl font-bold text-white mb-1">Soumi</h3>
                            <p className="text-violet-400 text-sm mb-4">Full-Stack Developer · React · Spring Boot · MySQL</p>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xl">
                                Designed and developed MovieMatrix end-to-end — from architecting the
                                three-service Spring Boot backend to crafting the responsive React frontend.
                                This project was built to explore microservice design, JWT authentication,
                                third-party API integration, and modern UI/UX patterns.
                            </p>

                            {/* Social links */}
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl text-sm text-gray-300 hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                    GitHub
                                </a>
                                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800/30 hover:border-blue-500/50 rounded-xl text-sm text-blue-300 hover:text-blue-200 transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    LinkedIn
                                </a>
                                <a href={`${GITHUB_URL}/MovieMatrix`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-900/20 hover:bg-violet-900/30 border border-violet-800/30 hover:border-violet-500/50 rounded-xl text-sm text-violet-300 hover:text-violet-200 transition-all">
                                    ⭐ Star the Repo
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="text-center pb-4">
                    <div className="bg-gradient-to-br from-violet-950/60 to-purple-950/40 border border-violet-800/30 rounded-3xl px-6 py-10 sm:py-14">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to explore?</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                            Browse trending movies, discover new genres, and start building your personal collection.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link to="/"
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] text-sm">
                                Browse Movies →
                            </Link>
                            <Link to="/register"
                                className="px-6 py-3 border border-violet-700/60 hover:bg-violet-900/30 text-violet-300 hover:text-white font-semibold rounded-xl transition text-sm">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}


function SectionHeading({ tag, title, subtitle }) {
    return (
        <div className="text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-900/30 border border-violet-800/30 text-violet-400 text-xs font-semibold tracking-widest uppercase mb-3">
                {tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 text-sm max-w-xl">{subtitle}</p>
        </div>
    );
}

function FlowBox({ label, sub, color }) {
    const colors = {
        violet: "border-violet-700/50 bg-violet-900/20 text-violet-300",
        blue:   "border-blue-700/50   bg-blue-900/20   text-blue-300",
        purple: "border-purple-700/50 bg-purple-900/20 text-purple-300",
        pink:   "border-pink-700/50   bg-pink-900/20   text-pink-300",
    };
    return (
        <div className={`border rounded-xl px-3 py-2 text-center ${colors[color]}`}>
            <p className="font-semibold text-xs">{label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{sub}</p>
        </div>
    );
}

function Arrow() {
    return <span className="text-violet-600 text-lg shrink-0">→</span>;
}

export default About;