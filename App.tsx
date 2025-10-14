
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import { Sidebar, SidebarItem } from './components/Sidebar';
import { LayoutDashboard, User, CreditCard, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-brand-dark text-brand-light">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/" />
        <SidebarItem icon={<User size={20} />} text="Profile" to="/profile" />
        <SidebarItem icon={<CreditCard size={20} />} text="Payments" to="/payments" />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-brand-secondary/50 backdrop-blur-sm border-b border-gray-700 md:justify-end">
            <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, Edgtec User</span>
                <img src="https://picsum.photos/40" alt="User Avatar" className="w-8 h-8 rounded-full" />
            </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-6 md:p-10">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
