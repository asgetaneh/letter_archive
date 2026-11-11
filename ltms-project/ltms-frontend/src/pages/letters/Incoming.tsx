import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/api';

interface Letter {
  id: number;
  reference_number: string;
  sender_name: string;
  priority: string;
  status: string;
  letter_date?: string;
  translations: { locale: string; subject: string }[];
}

interface FormState {
  sender_name: string;
  subject_en: string;
  subject_am: string;
  letter_date: string;
  priority: string;
  body: string;
}

const initialForm: FormState = {
  sender_name: '',
  subject_en: '',
  subject_am: '',
  letter_date: new Date().toISOString().split('T')[0],
  priority: 'normal',
  body: '',
};

const PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;

export default function IncomingLetters() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeLocale = i18n.language?.split('-')[0] || 'en';

  const loadLetters = () => {
    setLoadingList(true);
    apiFetch<{ data: Letter[] }>('/api/letters/incoming')
      .then((res) => setLetters(res.data))
      .catch(() => setError(t('letters.error.loadFailed')))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => { loadLetters(); }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await apiFetch('/api/letters', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      setSuccess(t('letters.success.saved'));
      loadLetters();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('letters.error.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = useMemo(
    () => letters.filter((l) => l.status !== 'archived').length,
    [letters]
  );

  return (
    <div className="letter-page">
      {/* Page header */}
      <div className="letter-page-header">
        <div>
          <h1>{t('letters.incoming.title')}</h1>
          <p className="letter-page-subtitle">
            {t('letters.incoming.subtitle')}
          </p>
        </div>
        <div className="letter-page-stats">
          <div className="stat">
            <span className="stat-value">{letters.length}</span>
            <span className="stat-label">{t('letters.stats.total')}</span>
          </div>
          <div className="stat">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">{t('letters.stats.pending')}</span>
          </div>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {success && <div className="form-success" role="status">{success}</div>}

      <div className="letter-grid">
        {/* Left: registration form */}
        <form onSubmit={handleSubmit} className="letter-form-card">
          <h2>{t('letters.incoming.registerNew')}</h2>

          {/* Sender + Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sender_name">{t('letters.fields.sender')}</label>
              <input
                id="sender_name"
                name="sender_name"
                value={form.sender_name}
                onChange={handleChange}
                placeholder={t('letters.placeholders.sender')}
                required
                maxLength={255}
              />
            </div>
            <div className="form-group">
              <label htmlFor="letter_date">{t('letters.fields.date')}</label>
              <input
                id="letter_date"
                type="date"
                name="letter_date"
                value={form.letter_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="form-group">
            <label htmlFor="subject_en">
              {t('letters.fields.subjectEn')}
              <span className="label-hint">EN</span>
            </label>
            <input
              id="subject_en"
              name="subject_en"
              value={form.subject_en}
              onChange={handleChange}
              placeholder={t('letters.placeholders.subjectEn')}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject_am">
              {t('letters.fields.subjectAm')}
              <span className="label-hint">አማ</span>
            </label>
            <input
              id="subject_am"
              name="subject_am"
              value={form.subject_am}
              onChange={handleChange}
              placeholder={t('letters.placeholders.subjectAm')}
              maxLength={255}
            />
          </div>

          {/* Priority chips */}
          <div className="form-group">
            <label>{t('letters.fields.priority')}</label>
            <div className="priority-chips">
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  className={`priority-chip ${p} ${form.priority === p ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={form.priority === p}
                    onChange={handleChange}
                    hidden
                  />
                  {t(`priority.${p}`)}
                </label>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="form-group">
            <label htmlFor="body">
              {t('letters.fields.body')}
              <span className="char-count">
                {form.body.length.toLocaleString()} / 50,000
              </span>
            </label>
            <textarea
              id="body"
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={6}
              maxLength={50000}
              placeholder={t('letters.placeholders.body')}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setForm(initialForm)}
              disabled={submitting}
            >
              {t('common.reset')}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? t('common.saving') : t('letters.incoming.registerButton')}
            </button>
          </div>
        </form>

        {/* Right: recent letters list */}
        <aside className="letter-list-card">
          <div className="letter-list-header">
            <h2>{t('letters.incoming.recent')}</h2>
            <button className="btn-ghost" onClick={loadLetters} disabled={loadingList}>
              {t('common.refresh')}
            </button>
          </div>

          {loadingList ? (
            <div className="empty-state">{t('common.loading')}</div>
          ) : letters.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>{t('letters.incoming.empty')}</p>
            </div>
          ) : (
            <ul className="letter-list">
              {letters.map((letter) => {
                const subject =
                  letter.translations.find((tr) => tr.locale === activeLocale)?.subject ||
                  letter.translations[0]?.subject ||
                  '—';

                return (
                  <li key={letter.id} className="letter-item">
                    <div className="letter-item-top">
                      <span className="ref">{letter.reference_number}</span>
                      <span className={`badge priority-${letter.priority}`}>
                        {t(`priority.${letter.priority}`)}
                      </span>
                    </div>
                    <div className="letter-item-subject">{subject}</div>
                    <div className="letter-item-meta">
                      <span>{letter.sender_name}</span>
                      {letter.letter_date && (
                        <span>{new Date(letter.letter_date).toLocaleDateString()}</span>
                      )}
                      <span className={`badge status-${letter.status}`}>
                        {t(`status.${letter.status}`, letter.status)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}