import { HttpClient } from "../HttpClient";
import {
  FavoriteDto,
  ListingSummaryDto,
} from "../dto/FavoriteDto";

class FavoriteService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/api",
  });

  async addToFavorites(listingId: string): Promise<FavoriteDto> {
    return await this.httpClient.post<FavoriteDto, void>(`/listings/${listingId}/favorite`, undefined);
  }

  async removeFromFavorites(listingId: string): Promise<void> {
    await this.httpClient.delete<void>(`/listings/${listingId}/favorite`);
  }

  async getMyFavorites(): Promise<ListingSummaryDto[]> {
    return await this.httpClient.get<ListingSummaryDto[]>(`/me/favorites`);
  }

  async getFavoriteInfoForListing(listingId: string): Promise<FavoriteDto> {
    return await this.httpClient.get<FavoriteDto>(`/listings/${listingId}/favorites-info`);
  }

  async getFavoriteById(favoriteId: string): Promise<FavoriteDto> {
    return await this.httpClient.get<FavoriteDto>(`/favorites/${favoriteId}`);
  }
}

export default new FavoriteService();