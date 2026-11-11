import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface Permission {
  id: number;
  name: string;
}

export default function RolesPage() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch<{ data: Role[] }>('/api/roles'),
      apiFetch<{ data: Permission[] }>('/api/permissions'),
    ])
      .then(([r, p]) => {
        setRoles(r.data);
        setPermissions(p.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t('roles.confirmDelete'))) return;
    try {
      await apiFetch(`/api/roles/${id}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h1>{t('roles.title')}</h1>
        {can('roles.create') && (
          <button className="btn-primary" onClick={() => setCreating(true)}>
            {t('roles.create')}
          </button>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div>{t('common.loading')}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('roles.name')}</th>
              <th>{t('roles.permissions')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.permissions?.join(', ') || '—'}</td>
                <td className="actions">
                  {can('roles.edit') && role.name !== 'admin' && (
                    <button onClick={() => setEditing(role)}>{t('common.edit')}</button>
                  )}
                  {can('roles.delete') && role.name !== 'admin' && (
                    <button className="danger" onClick={() => handleDelete(role.id)}>
                      {t('common.delete')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(creating || editing) && (
        <RoleForm
          role={editing}
          permissions={permissions}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function RoleForm({
  role, permissions, onClose, onSaved,
}: {
  role: Role | null;
  permissions: Permission[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const isEdit = role !== null;
  const [name, setName] = useState(role?.name ?? '');
  const [selected, setSelected] = useState<string[]>(role?.permissions ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const path = isEdit ? `/api/roles/${role!.id}` : '/api/roles';
      const method = isEdit ? 'PUT' : 'POST';
      await apiFetch(path, {
        method,
        body: JSON.stringify({ name, permissions: selected }),
      });
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <h2>{isEdit ? t('roles.editTitle') : t('roles.createTitle')}</h2>
        {error && <div className="form-error">{error}</div>}

        <label>{t('roles.name')}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <fieldset>
          <legend>{t('roles.permissions')}</legend>
          {permissions.map((p) => (
            <label key={p.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={selected.includes(p.name)}
                onChange={(e) =>
                  setSelected(
                    e.target.checked
                      ? [...selected, p.name]
                      : selected.filter((x) => x !== p.name)
                  )
                }
              />
              {p.name}
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