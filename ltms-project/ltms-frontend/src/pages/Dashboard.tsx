import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <p>Phase One placeholder page. Statistics and letter overview will be integrated later.</p>
    </div>
  );
}