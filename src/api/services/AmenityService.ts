import { HttpClient } from "../HttpClient";
import {
  AmenityDto,
  CreateAmenityDto,
  UpdateAmenityDto,
} from "../dto/AmenityDto";

class AmenityService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5113/api/amenities",
  });

  async getAll(): Promise<AmenityDto[]> {
    return await this.httpClient.get<AmenityDto[]>("/");
  }

  async getById(amenityId: string): Promise<AmenityDto> {
    return await this.httpClient.get<AmenityDto>(`/${amenityId}`);
  }

  async getByTitle(title: string): Promise<AmenityDto> {
    return await this.httpClient.get<AmenityDto>(`/by-title?title=${encodeURIComponent(title)}`);
  }

  async create(data: CreateAmenityDto): Promise<AmenityDto> {
    return await this.httpClient.post<AmenityDto, CreateAmenityDto>("/", data);
  }

  async update(amenityId: string, data: UpdateAmenityDto): Promise<AmenityDto> {
    return await this.httpClient.put<AmenityDto, UpdateAmenityDto>(`/${amenityId}`, data);
  }

  async delete(amenityId: string): Promise<void> {
    await this.httpClient.delete<void>(`/${amenityId}`);
  }
}

export default new AmenityService();