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
  );
}

export default App;