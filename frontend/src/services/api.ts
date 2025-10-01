import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface Pharmacy {
  id?: number;
  name: string;
  distance: number;
  latitude: number;
  longitude: number;
  address?: string;
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/pharmacies`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pharmacyApi = {
  // 약국 등록
  createPharmacy: (pharmacy: Pharmacy) =>
    api.post<Pharmacy>('', pharmacy),

  // 모든 약국 조회
  getAllPharmacies: () =>
    api.get<Pharmacy[]>(''),

  // 특정 거리 이내 약국 조회
  getNearbyPharmacies: (distance: number) =>
    api.get<Pharmacy[]>('/nearby', { params: { distance } }),

  // 약국 상세 조회
  getPharmacy: (id: number) =>
    api.get<Pharmacy>(`/${id}`),

  // 약국 삭제
  deletePharmacy: (id: number) =>
    api.delete(`/${id}`),

  // Health Check
  healthCheck: () =>
    api.get<string>('/health'),
};

export default api;