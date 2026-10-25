import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, PenTool, CheckCircle, X } from 'lucide-react';
import { Review, User } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  currentUser: User | null;
  onSubmitReview: (data: {
    rating: number;
    title: string;
    comment: string;
    dishRecommended?: string;
    visitDate: string;
  }) => void;
  onOpenAuth: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  currentUser,
  onSubmitReview,
  onOpenAuth
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [dishRecommended, setDishRecommended] = useState('Imperial A5 Wagyu Tenderloin');
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [submittedToast, setSubmittedToast] = useState(false);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    onSubmitReview({
      rating,
      title: title.trim(),
      comment: comment.trim(),
      dishRecommended: dishRecommended.trim() || undefined,
      visitDate
    });

    setModalOpen(false);
    setTitle('');
    setComment('');
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  return (
    <section id="reviews" className="relative bg-[#070d14] py-24 border-b border-[#c5a880]/15">
      
      {/* Toast Alert */}
      {submittedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a111a] border border-[#c5a880] text-[#f8f5f0] px-5 py-3.5 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-5 h-5 text-[#c5a880]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c5a880]">Review Submitted</p>
            <p className="text-[11px] text-[#ded6cc]">Thank you! Your verified dining review has been recorded.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold mb-2">
              <span>✦</span>
              <span>Patron Testimonials</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
              DISTINGUISHED WORDS
            </h2>
          </div>

          <div>
            {currentUser ? (
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.18em] uppercase rounded-sm flex items-center gap-2 transition-all active:scale-95 shadow-md"
              >
                <PenTool className="w-4 h-4" />
                <span>Write Dining Review</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 border border-[#c5a880]/40 hover:border-[#c5a880] text-[#c5a880] hover:text-[#f8f5f0] font-cinzel text-xs font-semibold tracking-[0.18em] uppercase rounded-sm transition-all"
              >
                Sign in to Leave a Review
              </button>
            )}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0a111a] border border-[#c5a880]/20 p-8 rounded-sm relative flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300"
            >
              <div>
                {/* Star rating & verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#c5a880] text-[#c5a880]" />
                    ))}
                  </div>
                  {rev.isVerifiedVisit && (
                    <span className="flex items-center gap-1 text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Patron</span>
                    </span>
                  )}
                </div>

                <Quote className="w-8 h-8 text-[#c5a880]/20 mb-3" />

                <h3 className="font-cinzel text-base font-bold text-[#f8f5f0] mb-2">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-[#a89b8d] leading-relaxed mb-6 font-normal">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#c5a880]/15">
                {rev.dishRecommended && (
                  <p className="text-[11px] text-[#c5a880] font-medium mb-1 truncate">
                    ✦ Recommends: {rev.dishRecommended}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#ded6cc]">{rev.userName}</span>
                  <span className="text-[11px] text-[#8e8275]">{rev.visitDate}</span>
                </div>
                {rev.userRole && (
                  <span className="text-[10px] text-[#8e8275] italic block">{rev.userRole}</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* SUBMIT REVIEW MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880]/40 rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-cinzel text-xl font-bold text-[#f5efeb] mb-2 uppercase tracking-wider">
              Share Your Royal Experience
            </h3>
            <p className="text-xs text-[#a89b8d] mb-6">
              Your impression helps us preserve our culinary heritage. Verified reviews are showcased on our public salon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Star Rating Selection */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Your Gastronomic Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#8e8275] hover:text-[#c5a880] transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-[#c5a880] text-[#c5a880]'
                            : 'text-[#423930]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#c5a880] font-bold ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. An exquisite symphony of Awadhi spice and Wagyu"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Dish Recommended */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Dish Recommended:
                </label>
                <input
                  type="text"
                  value={dishRecommended}
                  onChange={(e) => setDishRecommended(e.target.value)}
                  placeholder="e.g. Imperial A5 Wagyu Tenderloin"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Detailed Experience:
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the hospitality, culinary presentation, wine pairing, or overall ambiance..."
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Visit Date */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Date of Dining:
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#a89b8d] hover:text-[#f8f5f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
