import api from "../HttpClient";

export const FavoriteService = {
  // Отримати список обраних оголошень (Бекенд повертає ListingSummaryDto: Id, Title)
  getMyFavorites: async (): Promise<any[]> => {
    return await api.get("/me/favorites");
  },

  // Додати в обране: POST api/listings/{id}/favorite
  addToFavorites: async (listingId: string): Promise<void> => {
    await api.post(`/listings/${listingId}/favorite`, {});
  },

  // Видалити з обраного: DELETE api/listings/{id}/favorite
  removeFromFavorites: async (listingId: string): Promise<void> => {
    await api.delete(`/listings/${listingId}/favorite`);
  }
};