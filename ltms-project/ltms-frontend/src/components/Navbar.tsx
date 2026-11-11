import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(next);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-title">{t('app.title')}</div>
      <div className="navbar-actions">
        <button onClick={toggleLanguage} className="lang-btn">
          {i18n.language === 'en' ? 'አማርኛ' : 'English'}
        </button>

        {user ? (
          <>
            <span className="user-info">{user.name}</span>
            <button onClick={handleLogout} className="lang-btn">
              {t('auth.logout')}
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="lang-btn"
          >
            {t('auth.login')}
          </button>
        )}
      </div>
    </header>
  );
}