import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Navbar from '../components/Navbar.tsx';

export default function DashboardLayout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <main className="layout-content">
          <Outlet />  {/* 子路由页面在这里渲染 */}
        </main>
      </div>
    </div>
  );
}