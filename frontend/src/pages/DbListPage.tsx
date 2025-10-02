import React, { useState, useEffect } from 'react';
import { pharmacyApi, Pharmacy } from '../services/api';

const DbListPage: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 약국 목록 불러오기
  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pharmacyApi.getAllPharmacies();
      setPharmacies(response.data);
    } catch (err) {
      setError('저장된 약국 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  // 약국 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말로 이 약국 정보를 삭제하시겠습니까?")) return;

    setLoading(true);
    setError(null);
    try {
      await pharmacyApi.deletePharmacy(id);
      alert('약국이 삭제되었습니다.');
      await fetchPharmacies(); // 삭제 후 목록 갱신
    } catch (err) {
      setError('약국 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="db-list-page content-area-full">
      <h2>DB 저장된 전체 약국 목록 ({pharmacies.length}개)</h2>

      {loading ? (
        <div className="loading">로딩중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pharmacies.length === 0 ? (
        <div className="empty-message">저장된 약국이 없습니다. 검색 페이지에서 약국을 저장하세요.</div>
      ) : (
        <div className="pharmacy-grid">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="pharmacy-card saved-card">
              <h3>{pharmacy.name}</h3>
              <p><strong>주소:</strong> {pharmacy.address}</p>
              <p><strong>거리:</strong> {pharmacy.distance.toFixed(2)} m</p>
              <p><strong>위도/경도:</strong> {pharmacy.latitude.toFixed(6)}, {pharmacy.longitude.toFixed(6)}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(pharmacy.id!)}
                disabled={loading}
              >
                삭제 🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DbListPage;