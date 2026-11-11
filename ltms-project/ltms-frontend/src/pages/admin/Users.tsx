import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import UserForm from './UserForm';

export default function UsersPage() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const { data, loading, error, params, setParams, reload } = useUsers();
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const handleToggleActive = async (id: number) => {
    await apiFetch(`/api/users/${id}/toggle-active`, { method: 'PATCH' });
    reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('users.confirmDelete'))) return;
    await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h1>{t('users.title')}</h1>
        {can('users.create') && (
          <button className="btn-primary" onClick={() => setCreating(true)}>
            {t('users.create')}
          </button>
        )}
      </div>

      <div className="filter-bar">
        <input
          placeholder={t('users.searchPlaceholder')}
          value={params.search}
          onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div>{t('common.loading')}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('users.name')}</th>
              <th>{t('users.email')}</th>
              <th>{t('users.roles')}</th>
              <th>{t('users.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(', ')}</td>
                <td>
                  <span className={u.is_active ? 'badge active' : 'badge inactive'}>
                    {u.is_active ? t('users.active') : t('users.inactive')}
                  </span>
                </td>
                <td className="actions">
                  {can('users.edit') && (
                    <>
                      <button onClick={() => setEditing(u.id)}>{t('common.edit')}</button>
                      <button onClick={() => handleToggleActive(u.id)}>
                        {u.is_active ? t('users.deactivate') : t('users.activate')}
                      </button>
                    </>
                  )}
                  {can('users.delete') && (
                    <button className="danger" onClick={() => handleDelete(u.id)}>
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
        <UserForm
          userId={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }}
        />
      )}
    </div>
  );
}