import React, { useState, useEffect, useCallback } from 'react';
import { pharmacyApi, OutputDto, SearchRequestDto } from '../services/api';

// [NOTE] 카카오 지도 API를 동적으로 로드하고 지오코딩을 수행하는 컴포넌트
interface KakaoMapProps {
    searchAddress: string;
    searchResults: OutputDto[];
}

// Kakao Maps API 로드 상태를 관리하는 전역 타입 선언 (window 객체에 추가될 kakao 객체)
declare global {
    interface Window {
        kakao: any;
    }
}

// [NOTE] 현재 사용 중인 키
const KAKAO_APP_KEY = '3117fed0f314317d3270cd28f431d4f4'; 

const KakaoMap: React.FC<KakaoMapProps> = ({ searchAddress, searchResults }) => {
    const [mapInitialized, setMapInitialized] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);

    // 1. 카카오 지도 API 동적 로드
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setMapInitialized(true);
            setMapLoading(false);
            return;
        }

        const script = document.createElement('script');
        // services 라이브러리 (지오코딩, 장소 검색용)를 포함하여 로드
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
        script.async = true;
        
        // 로드가 완료되면 지도를 초기화하는 함수 호출
        script.onload = () => {
            window.kakao.maps.load(() => {
                setMapInitialized(true);
                setMapLoading(false);
            });
        };
        
        // **********************************************
        // *********** 에러 로그 개선: API 로드 실패 ***********
        // **********************************************
        script.onerror = (e) => {
             console.error('*** 카카오 지도 API 로드 실패 (HTTP 401/404 등) ***');
             console.error('원인 확인: JavaScript 키와 웹 플랫폼 도메인(http://localhost 등)이 카카오 개발자센터에 정확히 등록되었는지 확인하세요.', e);
             setMapLoading(false);
        };
        // **********************************************

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 2. 지도 초기화 및 주소 검색 (지오코딩)
    const initializeMap = useCallback((address: string) => {
        if (!mapInitialized || !window.kakao || !window.kakao.maps) return;

        const geocoder = new window.kakao.maps.services.Geocoder();
        const mapContainer = document.getElementById('kakao-map');
        if (!mapContainer) return;

        // 주소로 좌표를 검색
        geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                // 지도 옵션 설정
                const mapOption = {
                    center: coords,
                    level: 3, // 지도 확대 레벨
                };

                // 지도 생성
                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                // 검색된 주소에 마커 표시
                new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });
                
            } else {
                // **********************************************
                // ********* 에러 로그 개선: 지오코딩 실패 **********
                // **********************************************
                const errorMessage = `주소 검색(지오코딩) 실패! [주소: ${address}] - 상태: ${status}`;
                console.error('*** 지도 지오코딩 에러 ***');
                console.error(errorMessage);
                
                if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    console.error("추가 정보: 주소 검색 결과가 없습니다. (주소가 잘못되었거나 존재하지 않음)");
                } else if (status === window.kakao.maps.services.Status.ERROR) {
                    console.error("추가 정보: API 서버 문제 또는 잘못된 요청 형식");
                } else if (status === window.kakao.maps.services.Status.INVALID_REQUEST) {
                    console.error("추가 정보: 요청 파라미터가 잘못되었습니다.");
                }
                // **********************************************

                // 지도 중심을 기본 좌표로 설정
                const defaultCoords = new window.kakao.maps.LatLng(33.450701, 126.570667); // 제주 카카오 본사
                const mapOption = { center: defaultCoords, level: 7 };
                new window.kakao.maps.Map(mapContainer, mapOption);
            }
        });
    }, [mapInitialized]);

    // searchAddress가 변경될 때마다 지도를 다시 그림
    useEffect(() => {
        if (mapInitialized) {
            initializeMap(searchAddress);
        }
    }, [searchAddress, mapInitialized, initializeMap]);


    return (
        <div className="map-placeholder">
            {mapLoading && <p>지도 API 로드 중...</p>}
            {!mapLoading && !mapInitialized && <p>카카오 지도 API 로드에 실패했거나 키가 잘못되었습니다. (콘솔 확인)</p>}
            
            <div id="kakao-map" style={{ width: '100%', height: '400px', display: mapInitialized ? 'block' : 'none' }}>
                {/* 지도가 로드되면 여기에 그려집니다 */}
            </div>
            
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                지도 영역: **{searchAddress}** 주변
            </p>
        </div>
    );
};


// ---------------------------------------------------------------------------------------
// SearchPage 컴포넌트는 변경된 KakaoMap 컴포넌트를 사용합니다.
// ---------------------------------------------------------------------------------------


const SearchPage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<OutputDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchAddress, setSearchAddress] = useState('서울특별시 강남구 테헤란로 405'); // 예시 주소

    // 주소 검색 및 DB 일괄 저장 (searchAndSavePharmacies)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            const request: SearchRequestDto = { address: searchAddress };
            
            // 1. 서버에 검색 요청 (이때 서버는 검색 후 DB에 저장까지 완료)
            const response = await pharmacyApi.searchAndSavePharmacies(request);
            setSearchResults(response.data); 
            
            alert(`[${searchAddress}] 주변 약국 ${response.data.length}곳 검색 완료 및 DB에 저장되었습니다!`);

        } catch (err) {
            setError('주소 검색 및 약국 저장에 실패했습니다. (API 키/백엔드 엔드포인트 확인 필요)');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // 개별 약국 정보를 DB에 저장 (OutputDto -> Pharmacy)
    const handleSaveOne = async (result: OutputDto) => {
        setLoading(true);
        setError(null);
        
        try {
            // 거리 문자열 "150.00 m" -> 숫자 150.00으로 변환
            const distanceValue = parseFloat(result.distance.split(' ')[0]);
            
            // [!!! API 수정 필요 지점 !!!]
            // OutputDto에 위도/경도 필드가 없으므로, 현재는 임의의 좌표 (0,0)을 넣어 컴파일 에러를 막습니다. 
            // 실제로는 백엔드 API를 수정하여 위도/경도 정보를 프론트로 받아와야 합니다.
            
            const pharmacyData = {
                name: result.pharmacyName,
                address: result.pharmacyAddress,
                distance: distanceValue,
                latitude: 0.0, 
                longitude: 0.0, 
            };

            await pharmacyApi.savePharmacyFromOutput(pharmacyData);
            alert(`${result.pharmacyName}이(가) DB에 저장되었습니다!`);
            
        } catch (err) {
            setError(`[${result.pharmacyName}] 저장에 실패했습니다.`);
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

                {/* 검색바 그룹 (위쪽) */}
                <form onSubmit={handleSearch} className="search-bar-group">
                    <input
                        type="text"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        placeholder="주소를 입력하거나 지도에서 선택하세요"
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? '검색 중...' : '검색'}
                    </button>
                    <button type="button" disabled={loading} onClick={() => alert('현재 위치 기능은 구현 예정입니다.')}>
                        현재 위치
                    </button>
                </form>

                {/* 지도 구역 (아래쪽) - KakaoMap 컴포넌트로 변경됨 */}
                <KakaoMap searchAddress={searchAddress} searchResults={searchResults} />
            </section>

            {/* 오른쪽 20% 구역 (검색 결과 목록) */}
            <section className="results-sidebar">
                <h2>검색 결과 ({searchResults.length}개)</h2>

                {searchResults.length === 0 && !loading && (
                    <div className="empty-message">주소를 검색하여 주변 약국 3곳을 찾으세요.</div>
                )}
                
                {/* 검색 결과 카드 */}
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