import { useState, useEffect } from "react";
import reviewAPI from "../services/reviewApi";

function ReviewSection({ movieId, movieTitle, posterPath }) {
    const [reviews, setReviews]         = useState([]);  // All community reviews
    const [myReview, setMyReview]       = useState(null); // Logged-in user's review
    const [loading, setLoading]         = useState(true);
    const [submitting, setSubmitting]   = useState(false);
    const [showForm, setShowForm]       = useState(false);
    const [toast, setToast]             = useState(null);

    // Form state
    const [rating, setRating]   = useState(0);      // 1–10 selected by stars
    const [content, setContent] = useState("");
    const [hoverRating, setHoverRating] = useState(0); // For star hover effect

    const isLoggedIn = !!localStorage.getItem("token");

    // Fetch reviews when component mounts or movieId changes
    useEffect(() => {
        fetchReviews();
        if (isLoggedIn) fetchMyReview();
    }, [movieId]);

    const fetchReviews = async () => {
        try {
            const res = await reviewAPI.get(`/review/reviews/movie/${movieId}`);
            setReviews(res.data || []);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    // Pre-fill the form if user already reviewed this movie
    const fetchMyReview = async () => {
        try {
            const res = await reviewAPI.get(`/review/reviews/movie/${movieId}/mine`);
            // 200 = found, 404 = no review yet
            if (res.status === 200 && res.data) {
                setMyReview(res.data);
                setRating(res.data.rating);
                setContent(res.data.content);
            }
        } catch (err) {
            // 404 is expected when user hasn't reviewed yet — not a real error
            if (err.response?.status !== 404) console.error(err);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── SUBMIT REVIEW ─────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (rating === 0) { showToast("Please select a star rating", "error"); return; }
        if (!content.trim()) { showToast("Please write your review", "error"); return; }

        setSubmitting(true);
        try {
            // POST /review/reviews — creates or updates (upsert)
            const res = await reviewAPI.post("/review/reviews", {
                movieId,
                movieTitle,
                posterPath,
                rating,
                content: content.trim()
            });
            setMyReview(res.data);
            showToast(myReview ? "Review updated!" : "Review posted! ✓");
            setShowForm(false);
            // Refresh the community list to show the new review
            fetchReviews();
        } catch (err) {
            showToast("Failed to submit review", "error");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // ── DELETE REVIEW ─────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!myReview) return;
        if (!window.confirm("Delete your review?")) return;
        try {
            await reviewAPI.delete(`/review/reviews/${myReview.id}`);
            setMyReview(null);
            setRating(0);
            setContent("");
            showToast("Review deleted");
            fetchReviews();
        } catch (err) {
            showToast("Failed to delete review", "error");
        }
    };

    // ── STAR RATING COMPONENT ─────────────────────────────────────────────────
    // Renders 10 clickable stars. Filled = gold, empty = gray.
    const StarRating = ({ value, onSelect, onHover, onLeave, interactive = false }) => (
        <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && onSelect(star)}
                    onMouseEnter={() => interactive && onHover(star)}
                    onMouseLeave={() => interactive && onLeave()}
                    className={`text-xl transition-transform ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"} ${
                        star <= (hoverRating || value)
                            ? "text-yellow-400"
                            : "text-gray-700"
                    }`}
                >
                    ★
                </button>
            ))}
        </div>
    );

    // Format ISO date to "Mar 17, 2026"
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric"
            });
        } catch { return dateStr; }
    };

    // Build avatar initials from username
    const getInitials = (username) =>
        username ? username.slice(0, 2).toUpperCase() : "??";

    // Avatar color based on username (deterministic, same color every time)
    const avatarColors = [
        "from-violet-600 to-purple-800",
        "from-indigo-600 to-violet-800",
        "from-purple-600 to-pink-800",
        "from-fuchsia-600 to-violet-800",
        "from-violet-500 to-indigo-700",
    ];
    const getAvatarColor = (username) =>
        avatarColors[(username?.charCodeAt(0) || 0) % avatarColors.length];

    return (
        <section className="px-10 pb-16 relative z-10">

            {/* ── TOAST ──────────────────────────────────────────────────────── */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl border ${
                    toast.type === "error"
                        ? "bg-red-900/90 border-red-600"
                        : "bg-violet-900/90 border-violet-500"
                }`}>
                    {toast.message}
                </div>
            )}

            {/* ── SECTION HEADER ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1 h-8 bg-gradient-to-b from-violet-400 to-purple-700 rounded-full" />
                    Reviews
                    {reviews.length > 0 && (
                        <span className="text-base font-normal text-gray-500">
                            ({reviews.length})
                        </span>
                    )}
                </h2>

                {/* Show "Write a Review" button only if logged in */}
                {isLoggedIn && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-5 py-2 bg-violet-700/50 border border-violet-600/60 rounded-xl text-violet-200 hover:bg-violet-600/60 hover:text-white transition text-sm font-medium"
                    >
                        {showForm ? "✕ Cancel" : myReview ? "✏️ Edit Review" : "✍️ Write Review"}
                    </button>
                )}
            </div>

            {/* ── WRITE / EDIT REVIEW FORM ────────────────────────────────────
                Slides in when showForm = true.
                Hidden when not writing.                                    */}
            {isLoggedIn && showForm && (
                <div className="mb-8 bg-[#0d0d14] border border-violet-900/50 rounded-2xl p-6 shadow-xl shadow-violet-950/30">
                    <h3 className="text-lg font-semibold text-white mb-5">
                        {myReview ? "Update Your Review" : "Write Your Review"}
                    </h3>

                    {/* Star selector */}
                    <div className="mb-5">
                        <label className="block text-gray-400 text-sm mb-2">
                            Your Rating
                        </label>
                        <div className="flex items-center gap-3">
                            <StarRating
                                value={rating}
                                onSelect={setRating}
                                onHover={setHoverRating}
                                onLeave={() => setHoverRating(0)}
                                interactive={true}
                            />
                            {rating > 0 && (
                                <span className="text-yellow-400 font-semibold text-sm">
                                    {rating}/10
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Review text */}
                    <div className="mb-5">
                        <label className="block text-gray-400 text-sm mb-2">
                            Your Review
                        </label>
                        {/*
                            textarea: `value` is controlled by `content` state.
                            `onChange` updates state every keystroke.
                            rows={5} = height of the textarea.
                        */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            maxLength={2000}
                            placeholder="Share your thoughts about this movie..."
                            className="w-full bg-black/60 border border-violet-900/40 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 resize-none transition"
                        />
                        {/* Character counter */}
                        <p className="text-gray-600 text-xs text-right mt-1">
                            {content.length}/2000
                        </p>
                    </div>

                    {/* Submit + Delete buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-500 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {submitting ? "Submitting..." : myReview ? "Update Review" : "Post Review"}
                        </button>

                        {/* Only show Delete if user already has a review */}
                        {myReview && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2.5 bg-red-900/40 border border-red-800/50 text-red-400 rounded-xl text-sm hover:bg-red-800/50 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── USER'S OWN REVIEW (shown when form is closed) ─────────────── */}
            {isLoggedIn && myReview && !showForm && (
                <div className="mb-6 bg-gradient-to-br from-violet-950/60 to-black/60 border border-violet-700/40 rounded-2xl p-5 relative">
                    {/* "Your Review" badge */}
                    <div className="absolute top-4 right-4">
                        <span className="text-xs px-2 py-1 bg-violet-700/50 border border-violet-600/40 rounded-full text-violet-300">
                            Your Review
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(myReview.username)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {getInitials(myReview.username)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-semibold text-sm">
                                    {myReview.username}
                                </span>
                                <StarRating value={myReview.rating} interactive={false} />
                                <span className="text-yellow-400 text-sm font-semibold">
                                    {myReview.rating}/10
                                </span>
                                <span className="text-gray-600 text-xs">
                                    {formatDate(myReview.createdAt)}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {myReview.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── COMMUNITY REVIEWS LIST ─────────────────────────────────────── */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-4 border-violet-900 border-t-violet-400 animate-spin" />
                </div>
            ) : reviews.filter(r => r.username !== myReview?.username).length === 0 && !myReview ? (
                // Empty state
                <div className="text-center py-16 border border-violet-900/20 rounded-2xl bg-[#0d0d14]/40">
                    <p className="text-5xl mb-4">🎬</p>
                    <p className="text-gray-400 text-lg">No reviews yet</p>
                    <p className="text-gray-600 text-sm mt-1">Be the first to review this movie</p>
                    {isLoggedIn && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 px-5 py-2 bg-violet-700/40 border border-violet-600/50 rounded-xl text-violet-300 hover:bg-violet-600/40 text-sm transition"
                        >
                            ✍️ Write a Review
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Filter out the current user's review from community list
                        (already shown above as "Your Review")               */}
                    {reviews
                        .filter((r) => r.username !== myReview?.username)
                        .map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                formatDate={formatDate}
                                getInitials={getInitials}
                                getAvatarColor={getAvatarColor}
                                StarRating={StarRating}
                            />
                        ))
                    }
                </div>
            )}

            {/* Not logged in prompt */}
            {!isLoggedIn && (
                <div className="mt-6 text-center py-6 border border-violet-900/20 rounded-xl bg-black/30">
                    <p className="text-gray-500 text-sm">
                        <a href="/login" className="text-violet-400 hover:text-violet-300 underline">
                            Login
                        </a>{" "}
                        to write a review
                    </p>
                </div>
            )}
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReviewCard — a single community review card
// ─────────────────────────────────────────────────────────────────────────────
function ReviewCard({ review, formatDate, getInitials, getAvatarColor, StarRating }) {
    const [expanded, setExpanded] = useState(false);
    // Truncate long reviews — show full text on click
    const isLong    = review.content?.length > 300;
    const displayed = expanded || !isLong
        ? review.content
        : review.content?.slice(0, 300) + "...";

    return (
        <div className="bg-[#0d0d14] border border-violet-900/30 rounded-2xl p-5 hover:border-violet-700/40 transition-all duration-200">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(review.username)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getInitials(review.username)}
                </div>
                <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-white font-semibold text-sm">
                            {review.username}
                        </span>
                        {/* Star display */}
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                                <span key={s} className={`text-sm ${s <= review.rating ? "text-yellow-400" : "text-gray-700"}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-yellow-400 text-xs font-semibold">
                            {review.rating}/10
                        </span>
                        <span className="text-gray-600 text-xs ml-auto">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                    {/* Review text */}
                    <p className="text-gray-300 text-sm leading-relaxed">{displayed}</p>
                    {isLong && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-violet-400 hover:text-violet-300 text-xs mt-1 transition"
                        >
                            {expanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReviewSection;