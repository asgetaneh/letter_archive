import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/api';

interface Role { id: number; name: string }

export default function UserForm({
  userId, onClose, onSaved,
}: { userId: number | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const isEdit = userId !== null;
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    office_id: 1, locale: 'en', is_active: true, roles: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ data: Role[] }>('/api/roles').then((r) => setRoles(r.data));
    if (isEdit) {
      apiFetch<{ data: any }>(`/api/users/${userId}`).then(({ data }) => {
        setForm({
          name: data.name, email: data.email, password: '', password_confirmation: '',
          office_id: data.office?.id ?? 1, locale: data.locale,
          is_active: data.is_active, roles: data.roles ?? [],
        });
      });
    }
  }, [userId, isEdit]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setErrors({});
    try {
      const path = isEdit ? `/api/users/${userId}` : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';
      const payload: any = { ...form };
      if (isEdit && !payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      await apiFetch(path, { method, body: JSON.stringify(payload) });
      onSaved();
    } catch (e: any) {
      if (e.errors) setErrors(e.errors);
      else setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <h2>{isEdit ? t('users.editTitle') : t('users.createTitle')}</h2>
        {error && <div className="form-error">{error}</div>}

        <label>{t('users.name')}
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          {errors.name && <span className="field-error">{errors.name[0]}</span>}
        </label>

        <label>{t('users.email')}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {errors.email && <span className="field-error">{errors.email[0]}</span>}
        </label>

        <label>{isEdit ? t('users.newPasswordOptional') : t('users.password')}
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!isEdit} />
          {errors.password && <span className="field-error">{errors.password[0]}</span>}
        </label>

        <label>{t('users.confirmPassword')}
          <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required={!isEdit} />
        </label>

        <label>{t('users.locale')}
          <select value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })}>
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </label>

        <label>{t('users.status')}
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        </label>

        <fieldset>
          <legend>{t('users.roles')}</legend>
          {roles.map((r) => (
            <label key={r.id} className="checkbox-row">
              <input type="checkbox"
                checked={form.roles.includes(r.name)}
                onChange={(e) => setForm({
                  ...form,
                  roles: e.target.checked
                    ? [...form.roles, r.name]
                    : form.roles.filter((x) => x !== r.name),
                })} />
              {r.name}
            </label>
          ))}
        </fieldset>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>{t('common.cancel')}</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}