import { UserSummaryDto } from "./UserDto";


export interface ReviewDto {
  id: string;
  listingId: string;
  userId: string;
  user?: UserSummaryDto | null;
  rating: number;
  comment: string;
  publicationDate: string; // ISO string
}

export interface CreateReviewDto {
  listingId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating: number;
  comment: string;
}