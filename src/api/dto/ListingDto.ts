import { UserSummaryDto } from "./UserDto";
import { AmenityDto } from "./AmenityDto";
import { ReviewDto } from "./ReviewDto";
import { ListingImageDto } from "./ListingImageDto";

// Енуми (для логіки)
export enum ListingType { House = 0, Apartment = 1, Room = 2 }
export enum CommunalService { Included = 0, Separate = 1 }
export enum OwnershipType { With = 0, Without = 1 }
export enum NeighbourType { With = 0, Without = 1 }

// Масиви для UI (замість тих, що були в .js)
export const LISTING_TYPES = [
    { value: ListingType.House, label: "Будинок" },
    { value: ListingType.Apartment, label: "Квартира" },
    { value: ListingType.Room, label: "Кімната" }
];

export const COMMUNAL_SERVICES = [
    { value: CommunalService.Included, label: "Включено у вартість" },
    { value: CommunalService.Separate, label: "Оплачуються окремо" }
];

export const OWNERSHIP_TYPES = [
    { value: OwnershipType.With, label: "З господарями" },
    { value: OwnershipType.Without, label: "Без господарів" }
];

export const NEIGHBOUR_TYPES = [
    { value: NeighbourType.With, label: "З сусідами" },
    { value: NeighbourType.Without, label: "Без сусідів" }
];

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