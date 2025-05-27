import { HttpClient } from "../HttpClient";
import {
  ListingDto,
  CreateListingDto,
  UpdateListingDto,
} from "../dto/ListingDto";

class ListingService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/api/listings",
  });

  async getAll(): Promise<ListingDto[]> {
    return await this.httpClient.get<ListingDto[]>("/");
  }

  async search(keyword: string): Promise<ListingDto[]> {
    return await this.httpClient.get<ListingDto[]>(`/search?keyword=${encodeURIComponent(keyword)}`);
  }

  async getByUserId(userId: string): Promise<ListingDto[]> {
    return await this.httpClient.get<ListingDto[]>(`/user/${userId}`);
  }

  async getById(listingId: string): Promise<ListingDto> {
    return await this.httpClient.get<ListingDto>(`/${listingId}`);
  }

  async create(data: CreateListingDto): Promise<ListingDto> {
    return await this.httpClient.post<ListingDto, CreateListingDto>("/", data);
  }

  async update(listingId: string, data: UpdateListingDto): Promise<ListingDto> {
    return await this.httpClient.put<ListingDto, UpdateListingDto>(`/${listingId}`, data);
  }

  async delete(listingId: string): Promise<void> {
    await this.httpClient.delete<void>(`/${listingId}`);
  }
}

export default new ListingService();