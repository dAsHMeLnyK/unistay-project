export interface UserSummaryDto {
    id: string;
    fullName: string;
}

export interface ReviewDto {
    id: string;
    listingId: string;
    userId: string;
    user: UserSummaryDto | null;
    rating: number;
    comment: string;
    publicationDate: string;
}