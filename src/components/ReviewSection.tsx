
import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const initialReviews = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely amazing bundle! These premium items helped me launch two new digital products in just a few days.',
    date: '2 days ago'
  },
  {
    id: '2',
    name: 'Rohan Mehta',
    rating: 5,
    comment: 'Totally worth it! The commercial license is a huge plus — no issues using these for client projects.',
    date: '1 week ago'
  },
  {
    id: '3',
    name: 'Aisha Khan',
    rating: 4,
    comment: 'Loved most of the items. A few templates weren’t quite what I needed, but overall a great collection.',
    date: '2 weeks ago'
  }
];


const ReviewSection = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const review = {
        id: Date.now().toString(),
        ...newReview,
        date: 'Just now'
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer <span className="highlight">Reviews</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about our digital products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id}
                  className="glass-card p-5 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl h-fit">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    id="name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-6 w-6 ${rating <= newReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">Comment</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full btn-gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
