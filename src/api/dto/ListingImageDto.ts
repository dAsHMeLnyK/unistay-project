export interface ListingImageDto {
  id: string;
  listingId: string;
  imageUrl: string;
}

export interface CreateListingImageDto {
  listingId: string;
  imageUrl: string;
}

export interface UpdateListingImageDto {
  imageUrl: string;
}