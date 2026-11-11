import { useTranslation } from 'react-i18next';

export default function Letters() {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('nav.letters')}</h1>
        <p className="page-subtitle">{t('letters.subtitle')}</p>
      </div>

      <div className="page-card">
        <p>{t('letters.placeholder')}</p>
      </div>
    </div>
  );
}