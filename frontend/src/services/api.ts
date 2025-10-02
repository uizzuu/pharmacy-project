import axios, { AxiosResponse } from 'axios'; // AxiosResponse 임포트 추가

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// --- [추가된 DTO 타입] ---
// 백엔드에서 검색 결과를 받을 때 사용하는 DTO
export interface OutputDto {
  pharmacyName: string;
  pharmacyAddress: string;
  distance: string; // "100.54 m" 형태
  latitude: number;
  longitude: number;
  directionURL: string;
}

// 백엔드에 주소 검색 요청 시 사용하는 DTO
export interface SearchRequestDto {
  address: string;
}
// -------------------------

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
  createPharmacy: (pharmacy: Pharmacy): Promise<AxiosResponse<Pharmacy>> =>
    api.post<Pharmacy>('', pharmacy),

  // 모든 약국 조회
  getAllPharmacies: (): Promise<AxiosResponse<Pharmacy[]>> =>
    api.get<Pharmacy[]>(''),

  // 특정 거리 이내 약국 조회
  getNearbyPharmacies: (distance: number): Promise<AxiosResponse<Pharmacy[]>> =>
    api.get<Pharmacy[]>('/nearby', { params: { distance } }),

  // 약국 상세 조회
  getPharmacy: (id: number): Promise<AxiosResponse<Pharmacy>> =>
    api.get<Pharmacy>(`/${id}`),

  // 약국 삭제
  deletePharmacy: (id: number): Promise<AxiosResponse<any>> => // delete는 보통 응답 본문이 비어있을 수 있습니다.
    api.delete(`/${id}`),

  // Health Check
  healthCheck: (): Promise<AxiosResponse<string>> =>
    api.get<string>('/health'),

  // --- [SearchPage.tsx에서 누락되어 있던 핵심 함수 1] ---
  // 주소 검색 및 DB 일괄 저장 (SearchPage의 handleSearch에서 사용)
  searchAndSavePharmacies: (request: SearchRequestDto): Promise<AxiosResponse<OutputDto[]>> =>
    api.post<OutputDto[]>('/search', request),

  // --- [SearchPage.tsx에서 누락되어 있던 핵심 함수 2] ---
  // 개별 약국 저장 (OutputDto -> Pharmacy 변환된 데이터를 DB에 저장)
  savePharmacyFromOutput: (pharmacy: Omit<Pharmacy, 'id'>): Promise<AxiosResponse<Pharmacy>> =>
    api.post<Pharmacy>('', pharmacy),
  // --------------------------------------------------------
};

export default api;