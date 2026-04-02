export interface UserSummaryDto {
    id: string;
    fullName: string;
}

export interface ReviewDto {
    id: string;
    listingId: string;
    userId: string;
    user: UserSummaryDto | null; // Ось тут лежить ім'я автора
    rating: number;
    comment: string;
    publicationDate: string;
}