import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/settings')}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-sm"
      aria-label="Settings"
    >
      <Settings className="w-5 h-5" />
    </button>
  );
};

export default SettingsButton;