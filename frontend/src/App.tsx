<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { pharmacyApi, Pharmacy } from './services/api';
import './App.css';

function App() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Pharmacy>({
    name: '',
    distance: 0,
    latitude: 0,
    longitude: 0,
    address: '',
  });

  // 약국 목록 불러오기
  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pharmacyApi.getAllPharmacies();
      setPharmacies(response.data);
    } catch (err) {
      setError('약국 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 약국 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await pharmacyApi.createPharmacy(formData);
      setFormData({
        name: '',
        distance: 0,
        latitude: 0,
        longitude: 0,
        address: '',
      });
      await fetchPharmacies();
      alert('약국이 등록되었습니다!');
    } catch (err) {
      setError('약국 등록에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 약국 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await pharmacyApi.deletePharmacy(id);
      await fetchPharmacies();
      alert('약국이 삭제되었습니다.');
    } catch (err) {
      setError('약국 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>🏥 약국 관리 시스템</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* 등록 폼 */}
      <section className="form-section">
        <h2>약국 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>약국명:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="약국 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>거리 (km):</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>위도:</label>
            <input
              type="number"
              step="0.000001"
              required
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
              placeholder="37.123456"
            />
          </div>

          <div className="form-group">
            <label>경도:</label>
            <input
              type="number"
              step="0.000001"
              required
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
              placeholder="127.123456"
            />
          </div>

          <div className="form-group">
            <label>주소:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="서울특별시 강남구..."
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '처리중...' : '등록하기'}
          </button>
        </form>
      </section>

      {/* 약국 목록 */}
      <section className="list-section">
        <h2>등록된 약국 목록 ({pharmacies.length}개)</h2>

        {loading ? (
          <div className="loading">로딩중...</div>
        ) : pharmacies.length === 0 ? (
          <div className="empty-message">등록된 약국이 없습니다.</div>
        ) : (
          <div className="pharmacy-grid">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="pharmacy-card">
                <h3>{pharmacy.name}</h3>
                <p><strong>거리:</strong> {pharmacy.distance.toFixed(2)} km</p>
                <p><strong>위도:</strong> {pharmacy.latitude.toFixed(6)}</p>
                <p><strong>경도:</strong> {pharmacy.longitude.toFixed(6)}</p>
                {pharmacy.address && <p><strong>주소:</strong> {pharmacy.address}</p>}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(pharmacy.id!)}
                  disabled={loading}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import DbListPage from './pages/DbListPage';
import './App.css'; // 수정된 CSS 파일 임포트

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          {/* 메인 검색 페이지 */}
          <Route path="/" element={<SearchPage />} />
          {/* DB 저장 목록 페이지 */}
          <Route path="/db" element={<DbListPage />} />
        </Routes>
      </div>
    </Router>
>>>>>>> 84520fc (수정 #1)
  );
}

export default App;