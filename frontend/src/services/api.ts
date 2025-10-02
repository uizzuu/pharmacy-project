import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

=======
// 백엔드 URL 설정 (환경 변수 사용 권장)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 백엔드 Pharmacy 엔티티 인터페이스 (DB 저장용)
>>>>>>> 84520fc (수정 #1)
export interface Pharmacy {
  id?: number;
  name: string;
  distance: number;
  latitude: number;
  longitude: number;
  address?: string;
}

<<<<<<< HEAD
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/pharmacies`,
=======
// 백엔드에서 받아오는 약국 검색 결과 DTO (지도 연동 필수)
export interface OutputDto {
  pharmacyName: string;
  pharmacyAddress: string;
  directionURL: string;
  roadViewURL: string;
  distance: string;
  // ⭐ 추가된 좌표 필드
  latitude: number;
  longitude: number;
}

// 백엔드 POST /search 요청 시 사용하는 DTO
export interface SearchRequest {
  address: string;
}

// API 통신을 위한 인스턴스 생성
const api = axios.create({
  // PharmacyController의 @RequestMapping("/api/pharmacies")에 맞춥니다.
  baseURL: `${API_BASE_URL}/api/pharmacies`, 
>>>>>>> 84520fc (수정 #1)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pharmacyApi = {
<<<<<<< HEAD
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
=======
  // 1. 주소 검색 및 DB 일괄 저장 (백엔드에서 처리)
  searchAndSavePharmacies: (request: SearchRequest) =>
    // ⭐ URL 중복 해결: baseURL에 /api/pharmacies가 포함되어 있으므로, 여기는 /search만 사용
    api.post<OutputDto[]>('/search', request), 
    
  // 2. 개별 약국 저장 (검색 결과에서 선택적으로 저장 시)
  savePharmacyFromOutput: (pharmacy: Omit<Pharmacy, 'id'>) =>
    api.post<Pharmacy>('', pharmacy),

  // 3. 모든 약국 조회 (DB 목록 페이지에서 사용)
  getAllPharmacies: () =>
    api.get<Pharmacy[]>(''),

  // 4. 약국 삭제 (DB 목록 페이지에서 사용)
  deletePharmacy: (id: number) =>
    api.delete(`/${id}`),

  // Health Check (선택 사항)
  healthCheck: () =>
    api.get<string>('/health'),
};
>>>>>>> 84520fc (수정 #1)
