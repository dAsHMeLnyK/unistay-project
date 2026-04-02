import api from "../HttpClient";
import { ReviewDto } from "../dto/ReviewDto";

const ReviewService = {
    // Отримати відгуки для конкретного оголошення
    getForListing: async (listingId: string): Promise<ReviewDto[]> => {
        return await api.get(`/listings/${listingId}/reviews`);
    },

    // Створити відгук
    createForListing: async (listingId: string, data: { rating: number; comment: string }): Promise<ReviewDto> => {
        // Відправляємо об'єкт, який відповідає CreateReviewDto на бекенді
        const payload = {
            listingId: listingId, // Хоча він є в URL, бекенд може чекати його і в тілі
            rating: data.rating,
            comment: data.comment
        };
        
        return await api.post(`/listings/${listingId}/reviews`, payload);
    },

    delete: async (reviewId: string): Promise<void> => {
        await api.delete(`/reviews/${reviewId}`);
    }
};

export default ReviewService;