import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IMAGE_BASE_URL } from '../../services/api';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-primary-100 px-4 lg:px-8 py-3 flex items-center justify-between">
      <button className="lg:hidden text-gray-600" onClick={onMenuClick}>
        <Menu className="w-6 h-6" />
      </button>
      <div className="hidden lg:block">
        <p className="text-sm text-gray-500">Welcome back,</p>
        <p className="font-semibold text-gray-800">{user?.name}</p>
      </div>
      <Link to="/profile" className="flex items-center gap-2">
        {user?.profilePicture ? (
          <img
            src={`${IMAGE_BASE_URL}${user.profilePicture}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
        )}
      </Link>
    </header>
  );
};

export default Topbar;
