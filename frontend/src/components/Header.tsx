import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <h1><span>Pharmacy</span></h1>
      <nav className="nav-links">
        {/* / 경로: 검색(main) 페이지 */}
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          약국 검색
        </NavLink>
        {/* /db 경로: 저장 목록(db) 페이지 */}
        <NavLink to="/db" className={({ isActive }) => isActive ? 'active' : ''}>
          저장 목록
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;