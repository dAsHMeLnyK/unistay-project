import { UserSummaryDto } from "./UserDto";
import { AmenityDto } from "./AmenityDto";
import { ReviewDto } from "./ReviewDto";
import { ListingImageDto } from "./ListingImageDto";

export interface ListingDto {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  type: string; // ListingType
  userId: string;
  user?: UserSummaryDto | null;
  communalServices: string[]; // CommunalService[]
  owners: string; // OwnershipType
  neighbours: string; // NeighbourType
  publicationDate: string; // ISO string
  amenities: AmenityDto[];
  reviews: ReviewDto[];
  listingImages: ListingImageDto[];
  favoriteCount: number;
}

export interface CreateListingDto {
  title: string;
  description: string;
  address: string;
  price: number;
  type: string; // ListingType
  communalServices: string[]; // CommunalService[]
  owners: string; // OwnershipType
  neighbours: string; // NeighbourType
  amenityIds: string[];
}

export interface UpdateListingDto {
  title: string;
  description: string;
  address: string;
  price: number;
  type: string; // ListingType
  communalServices: string[]; // CommunalService[]
  owners: string; // OwnershipType
  neighbours: string; // NeighbourType
  amenityIds: string[];
}