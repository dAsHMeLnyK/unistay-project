import api from "../HttpClient";
import { ListingDto, CreateListingDto } from "../dto/ListingDto";

export const ListingService = {
  // Отримати всі оголошення
  getAll: async (): Promise<ListingDto[]> => {
    return await api.get("/listings");
  },

  // Отримати одне за ID
  getById: async (id: string): Promise<ListingDto> => {
    return await api.get(`/listings/${id}`);
  },

  // Пошук за ключовим словом
  search: async (keyword: string): Promise<ListingDto[]> => {
    return await api.get("/listings/search", {
      params: { keyword }
    });
  },

  // Отримати оголошення конкретного користувача
  getByUserId: async (userId: string): Promise<ListingDto[]> => {
    return await api.get(`/listings/user/${userId}`);
  },

  // Отримати список усіх зручностей
  getAmenities: async (): Promise<any[]> => {
    return await api.get("/amenities");
  },

  // Створити оголошення
  create: async (data: CreateListingDto): Promise<ListingDto> => {
    return await api.post("/listings", data);
  },

  // Додати зображення до оголошення
  addImage: async (listingId: string, imageUrl: string): Promise<any> => {
    return await api.post(`/listings/${listingId}/images`, { imageUrl });
  },

  // Видалити зображення
  deleteImage: async (imageId: string): Promise<void> => {
    return await api.delete(`/listingimages/${imageId}`);
  },

  // Видалити оголошення
  delete: async (id: string): Promise<void> => {
    return await api.delete(`/listings/${id}`);
  },

  // Порівняти два оголошення
  compare: async (listing1Id: string, listing2Id: string): Promise<any> => {
    return await api.get(`/listings/compare`, {
      params: { listing1Id, listing2Id }
    });
  }
};

export default ListingService;