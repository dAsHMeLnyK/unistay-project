import { UserSummaryDto } from "./UserDto";

export interface ReviewDto {
  id: string;
  listingId: string;
  userId: string;
  user?: UserSummaryDto | null;
  rating: number;
  comment: string;
  publicationDate: string;
}

export interface CreateReviewDto {
  ListingId: string;  // Велика літера для відповідності C# record
  Rating: number;
  Comment: string;
}

export interface UpdateReviewDto {
  Rating?: number;
  Comment?: string;
}