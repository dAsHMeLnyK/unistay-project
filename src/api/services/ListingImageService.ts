import { HttpClient } from "../HttpClient";
import {
  ListingImageDto,
  CreateListingImageDto,
  UpdateListingImageDto,
} from "../dto/ListingImageDto";

class ListingImageService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/api",
  });

  async getById(imageId: string): Promise<ListingImageDto> {
    return await this.httpClient.get<ListingImageDto>(`/listingimages/${imageId}`);
  }

  async getAll(): Promise<ListingImageDto[]> {
    return await this.httpClient.get<ListingImageDto[]>(`/listingimages`);
  }

  async getForListing(listingId: string): Promise<ListingImageDto[]> {
    return await this.httpClient.get<ListingImageDto[]>(`/listings/${listingId}/images`);
  }

  async addToListing(listingId: string, data: Omit<CreateListingImageDto, "listingId">): Promise<ListingImageDto> {
    return await this.httpClient.post<ListingImageDto, Omit<CreateListingImageDto, "listingId">>(
      `/listings/${listingId}/images`,
      data
    );
  }

  async update(imageId: string, data: UpdateListingImageDto): Promise<ListingImageDto> {
    return await this.httpClient.put<ListingImageDto, UpdateListingImageDto>(`/listingimages/${imageId}`, data);
  }

  async delete(imageId: string): Promise<void> {
    await this.httpClient.delete<void>(`/listingimages/${imageId}`);
  }
}

export default new ListingImageService();