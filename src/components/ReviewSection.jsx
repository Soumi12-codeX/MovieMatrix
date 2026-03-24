import { useState, useEffect, useCallback, useMemo } from "react";
import reviewAPI from "../services/reviewApi";

// Move constants outside to prevent re-creation on every render
const AVATAR_COLORS = [
    "from-violet-600 to-purple-800",
    "from-indigo-600 to-violet-800",
    "from-purple-600 to-pink-800",
    "from-fuchsia-600 to-violet-800",
    "from-violet-500 to-indigo-700",
];

const ReviewSection = ({ movieId, movieTitle, posterPath }) => {
    const [reviews, setReviews] = useState([]);
    const [myReview, setMyReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const isLoggedIn = useMemo(() => !!localStorage.getItem("token"), []);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await reviewAPI.get(`/review/reviews/movie/${movieId}`);
            setReviews(res.data || []);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [movieId]);

    const fetchMyReview = useCallback(async () => {
        try {
            const res = await reviewAPI.get(`/review/reviews/movie/${movieId}/mine`);
            if (res.status === 200 && res.data) {
                setMyReview(res.data);
                setRating(res.data.rating);
                setContent(res.data.content);
            }
        } catch (err) {
            if (err.response?.status !== 404) console.error(err);
        }
    }, [movieId]);

    useEffect(() => {
        setLoading(true);
        fetchReviews();
        if (isLoggedIn) fetchMyReview();
    }, [movieId, isLoggedIn, fetchReviews, fetchMyReview]);

    const handleSubmit = async () => {
        if (rating === 0) return showToast("Please select a star rating", "error");
        if (!content.trim()) return showToast("Please write your review", "error");

        setSubmitting(true);
        try {
            const res = await reviewAPI.post("/review/reviews", {
                movieId,
                movieTitle,
                posterPath,
                rating,
                content: content.trim()
            });
            
            const isUpdate = !!myReview;
            setMyReview(res.data);
            showToast(isUpdate ? "Review updated!" : "Review posted! ✓");
            setShowForm(false);
            fetchReviews();
        } catch (err) {
            showToast("Failed to submit review", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!myReview || !window.confirm("Delete your review?")) return;
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

    const getAvatarColor = (username) =>
        AVATAR_COLORS[(username?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

    const StarRating = ({ value, onSelect, onHover, onLeave, interactive = false }) => (
        <div className="flex gap-1">
            {[...Array(10)].map((_, i) => {
                const star = i + 1;
                return (
                    <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} out of 10`}
                        onClick={() => interactive && onSelect(star)}
                        onMouseEnter={() => interactive && onHover(star)}
                        onMouseLeave={() => interactive && onLeave()}
                        className={`text-xl transition-all duration-150 ${
                            interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"
                        } ${star <= (hoverRating || value) ? "text-yellow-400 scale-110" : "text-gray-700"}`}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );

    return (
        <section className="px-6 md:px-10 pb-16 relative z-10 max-w-6xl mx-auto">
            {/* Toast remains the same but with better z-index management */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl border animate-in fade-in slide-in-from-top-4 ${
                    toast.type === "error" ? "bg-red-900/90 border-red-600" : "bg-violet-900/90 border-violet-500"
                }`}>
                    {toast.message}
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-violet-400 to-purple-700 rounded-full" />
                    Reviews
                    <span className="text-base font-normal text-gray-500">({reviews.length})</span>
                </h2>

                {isLoggedIn && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-5 py-2 bg-violet-700/30 border border-violet-600/40 rounded-xl text-violet-200 hover:bg-violet-600/60 hover:text-white transition-all text-sm font-medium"
                    >
                        {showForm ? "✕ Close" : myReview ? "✏️ Edit Your Review" : "✍️ Write Review"}
                    </button>
                )}
            </div>

            {/* Form Section */}
            {isLoggedIn && showForm && (
                <div className="mb-10 bg-[#0d0d14] border border-violet-900/40 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">
                            {myReview ? "Refine your thoughts" : "What did you think?"}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">Rating</label>
                            <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
                                <StarRating 
                                    value={rating} 
                                    onSelect={setRating} 
                                    onHover={setHoverRating} 
                                    onLeave={() => setHoverRating(0)} 
                                    interactive 
                                />
                                <span className="text-yellow-400 font-bold text-lg w-12">{rating}/10</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">Your Review</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            maxLength={2000}
                            placeholder="I loved the cinematography in this one..."
                            className="w-full bg-black/40 border border-violet-900/40 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all outline-none"
                        />
                        <div className="flex justify-end mt-2">
                            <span className={`text-xs ${content.length > 1900 ? "text-red-500" : "text-gray-600"}`}>
                                {content.length} / 2000
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 md:flex-none px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20"
                        >
                            {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {myReview ? "Update Review" : "Publish Review"}
                        </button>
                        {myReview && (
                            <button
                                onClick={handleDelete}
                                className="px-6 py-3 bg-red-950/20 border border-red-900/50 text-red-500 rounded-xl hover:bg-red-900/30 transition-all"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* My Review Preview */}
            {isLoggedIn && myReview && !showForm && (
                <div className="mb-10 group relative p-1 rounded-2xl bg-gradient-to-r from-violet-600/20 to-transparent">
                    <div className="bg-[#0a0a0f] rounded-[14px] p-6 border border-violet-500/20">
                         <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(myReview.username)} flex items-center justify-center text-white font-bold shadow-lg`}>
                                {myReview.username?.slice(0,2).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-bold text-lg">Your Review</span>
                                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] uppercase font-black tracking-widest">Logged In</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <StarRating value={myReview.rating} />
                                    <span className="text-gray-500 text-xs ml-2">{new Date(myReview.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                         </div>
                         <p className="text-gray-300 leading-relaxed italic">"{myReview.content}"</p>
                    </div>
                </div>
            )}

            {/* Community Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-violet-900/30 border-t-violet-500 animate-spin" />
                        <p className="text-gray-500 text-sm animate-pulse">Loading community thoughts...</p>
                    </div>
                ) : (
                    reviews.filter(r => r.username !== myReview?.username).map(review => (
                        <ReviewCard key={review.id} review={review} getAvatarColor={getAvatarColor} />
                    ))
                )}
                
                {!loading && reviews.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-4xl mb-4 opacity-50">🍿</p>
                        <h3 className="text-white font-medium">No reviews yet</h3>
                        <p className="text-gray-500 text-sm">Be the first to share your take on this movie!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

// Sub-component for individual cards
const ReviewCard = ({ review, getAvatarColor }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.content?.length > 300;
    const text = expanded || !isLong ? review.content : `${review.content.slice(0, 300)}...`;

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(review.username)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-inner`}>
                    {review.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="text-white font-semibold text-sm group-hover:text-violet-400 transition-colors">{review.username}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-[10px] text-yellow-500">
                                    {[...Array(10)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? "opacity-100" : "opacity-20"}>★</span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{review.rating}/10</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                    {isLong && (
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className="text-violet-500 hover:text-violet-400 text-xs mt-3 font-bold uppercase tracking-widest"
                        >
                            {expanded ? "Show Less ↑" : "Read Full Review ↓"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;