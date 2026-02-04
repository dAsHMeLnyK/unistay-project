import { UserSummaryDto } from "./UserDto";
import { AmenityDto } from "./AmenityDto";
import { ReviewDto } from "./ReviewDto";
import { ListingImageDto } from "./ListingImageDto";

// Енуми мають збігатися з порядком у C# файлі ListingEnums
export enum ListingType { House = 0, Apartment = 1, Room = 2 }
export enum CommunalService { Included = 0, Separate = 1 }
export enum OwnershipType { With = 0, Without = 1 }
export enum NeighbourType { With = 0, Without = 1 }

export interface ListingDto {
  id: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  type: ListingType;
  userId: string;
  user?: UserSummaryDto | null;
  communalServices: CommunalService[];
  owners: OwnershipType;
  neighbours: NeighbourType;
  publicationDate: string;
  amenities: AmenityDto[];
  reviews: ReviewDto[];
  listingImages: ListingImageDto[];
  favoriteCount: number;
}

export interface CreateListingDto {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  type: ListingType;
  communalServices: CommunalService[];
  owners: OwnershipType;
  neighbours: NeighbourType;
  amenityIds: string[];
}