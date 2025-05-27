import { UserSummaryDto } from "./UserDto";

export interface ListingSummaryDto {
  id: string;
  title: string;
}

export interface FavoriteDto {
  id: string;
  listingId: string;
  listing?: ListingSummaryDto | null;
  users: UserSummaryDto[];
}