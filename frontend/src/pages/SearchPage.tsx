import React, { useState, useEffect } from 'react';
import { pharmacyApi, OutputDto, SearchRequest } from '../services/api';

// window 객체에 카카오 맵 타입이 있음을 TypeScript에 알림
declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAP_CONTAINER_ID = 'kakao-map-container';

const SearchPage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<OutputDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchAddress, setSearchAddress] = useState('서울특별시 강남구 테헤란로 405');

    // 지도의 중심 좌표 (기본값: 서울 시청)
    const [mapCenter, setMapCenter] = useState({ lat: 37.566826, lng: 126.9786567 });

    // 지도 로드 및 마커 표시 로직
    useEffect(() => {
        // 카카오 맵 라이브러리가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById(KAKAO_MAP_CONTAINER_ID);
                if (!mapContainer) return;

                // 1. 지도 초기화
                const options = {
                    // mapCenter 상태를 사용하여 중심을 잡습니다.
                    center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
                    level: 5 // 지도 확대 레벨
                };
                const map = new window.kakao.maps.Map(mapContainer, options);

                // 2. 검색된 약국 마커 표시
                searchResults.forEach((pharmacy) => {
                    const position = new window.kakao.maps.LatLng(pharmacy.latitude, pharmacy.longitude);

                    // 마커 생성
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: position,
                        title: pharmacy.pharmacyName,
                    });

                    // 인포윈도우 (약국 이름 표시)
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;color:#333;white-space:nowrap;">${pharmacy.pharmacyName}</div>`,
                        removable: true,
                    });

                    // 마커에 이벤트 리스너 등록
                    window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                        infowindow.close();
                    });
                });
            });
        }
    }, [mapCenter, searchResults]); // 중심 좌표나 검색 결과가 바뀔 때마다 맵 갱신

    // 주소 검색 및 DB 일괄 저장 (백엔드 /api/pharmacies/search 호출)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            const request: SearchRequest = { address: searchAddress };

            // 1. 서버에 검색 요청 (검색 후 DB 저장 완료)
            const response = await pharmacyApi.searchAndSavePharmacies(request);
            const results = response.data;
            setSearchResults(results);

            // 2. 맵 중심점 업데이트
            // 약국 결과가 있다면 첫 번째 약국의 좌표를 중심점으로 사용
            if (results.length > 0) {
                setMapCenter({ lat: results[0].latitude, lng: results[0].longitude });
            } else {
                 alert(`[${searchAddress}] 주변 약국을 찾을 수 없습니다.`);
            }

            alert(`[${searchAddress}] 주변 약국 ${results.length}곳 검색 완료 및 DB에 저장되었습니다!`);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || '주소 검색 및 약국 저장에 실패했습니다. (API 키/백엔드 엔드포인트 확인 필요)';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 개별 약국 저장 로직 (백엔드 /api/pharmacies 호출)
    const handleSaveOne = async (result: OutputDto) => {
        setLoading(true);
        setError(null);

        try {
            // "100.54 m" 에서 숫자만 추출
            const distanceValue = parseFloat(result.distance.split(' ')[0]);

            // DB에 저장할 Pharmacy 객체 (id 제외)
            const pharmacyData = {
                name: result.pharmacyName,
                address: result.pharmacyAddress,
                distance: distanceValue,
                latitude: result.latitude,
                longitude: result.longitude,
            };

            await pharmacyApi.savePharmacyFromOutput(pharmacyData);
            alert(`${result.pharmacyName}이(가) DB에 저장되었습니다!`);

        } catch (err) {
            setError(`[${result.pharmacyName}] 저장에 실패했습니다. 이미 저장된 약국일 수 있습니다.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="content-area">
            {/* 왼쪽 80% 구역 */}
            <section className="map-section">
                <h2>주소 검색 및 지도</h2>
                {error && <div className="error-message">{error}</div>}

                {/* 검색바 그룹 */}
                <form onSubmit={handleSearch} className="search-bar-group">
                    <input
                        type="text"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        placeholder="주소를 입력하세요"
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? '검색 중...' : '검색'}
                    </button>
                    <button type="button" disabled={loading} onClick={() => alert('현재 위치 기능은 GeoLocation API 연동이 필요합니다.')}>
                        현재 위치
                    </button>
                </form>

                {/* ⭐ 지도 구역 (카카오 맵 렌더링 DIV) */}
                <div id={KAKAO_MAP_CONTAINER_ID} className="map-placeholder">
                    {/* 카카오 맵 로딩 상태 표시 */}
                    {!(window.kakao && window.kakao.maps) && <div className="loading">카카오 맵 API를 로드 중입니다...</div>}
                </div>
            </section>

            {/* 오른쪽 20% 구역 (검색 결과 목록) */}
            <section className="results-sidebar">
                <h2>검색 결과 ({searchResults.length}개)</h2>

                {searchResults.length === 0 && !loading && (
                    <div className="empty-message">주소를 검색하여 주변 약국 3곳을 찾으세요.</div>
                )}

                <div className="result-list">
                    {searchResults.map((result, index) => (
                        <div key={index} className="result-card">
                            <h3>{result.pharmacyName}</h3>
                            <p><strong>주소:</strong> {result.pharmacyAddress}</p>
                            <p><strong>거리:</strong> {result.distance}</p>
                            <div className="result-actions">
                                <a href={result.directionURL} target="_blank" rel="noopener noreferrer">길찾기</a>
                                <button onClick={() => handleSaveOne(result)} disabled={loading}>
                                    저장
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SearchPage;