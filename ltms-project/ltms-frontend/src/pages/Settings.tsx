import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('nav.settings')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="page-card">
        <p>{t('settings.placeholder')}</p>
      </div>
    </div>
  );
}