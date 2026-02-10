import api from "../HttpClient";
import { ReviewDto } from "../dto/ReviewDto";

const ReviewService = {
  getForListing: async (listingId: string): Promise<ReviewDto[]> => {
    return await api.get(`/listings/${listingId}/reviews`);
  },

  createForListing: async (listingId: string, data: { rating: number; comment: string }): Promise<ReviewDto> => {
    // Синхронізовано з CreateReviewCommand на бекенді
    const payload = {
      ListingId: listingId,
      Rating: data.rating,
      Comment: data.comment
    };
    
    return await api.post(`/listings/${listingId}/reviews`, payload);
  },

  delete: async (reviewId: string): Promise<void> => {
    // Відповідає DeleteReviewCommand
    await api.delete(`/reviews/${reviewId}`);
  }
};

export default ReviewService;