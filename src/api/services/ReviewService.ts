import { HttpClient } from "../HttpClient";
import {
  ReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
} from "../dto/ReviewDto";

class ReviewService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/api",
  });

  async getById(reviewId: string): Promise<ReviewDto> {
    return await this.httpClient.get<ReviewDto>(`/reviews/${reviewId}`);
  }

  async getForListing(listingId: string): Promise<ReviewDto[]> {
    return await this.httpClient.get<ReviewDto[]>(`/listings/${listingId}/reviews`);
  }

  async getByUser(userId: string): Promise<ReviewDto[]> {
    return await this.httpClient.get<ReviewDto[]>(`/users/${userId}/reviews`);
  }

  async createForListing(listingId: string, data: Omit<CreateReviewDto, "listingId">): Promise<ReviewDto> {
    return await this.httpClient.post<ReviewDto, Omit<CreateReviewDto, "listingId">>(
      `/listings/${listingId}/reviews`,
      data
    );
  }

  async update(reviewId: string, data: UpdateReviewDto): Promise<ReviewDto> {
    return await this.httpClient.put<ReviewDto, UpdateReviewDto>(`/reviews/${reviewId}`, data);
  }

  async delete(reviewId: string): Promise<void> {
    await this.httpClient.delete<void>(`/reviews/${reviewId}`);
  }
}

export default new ReviewService();