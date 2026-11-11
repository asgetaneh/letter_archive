import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { AuthUser } from '../context/AuthContext';

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
}

export function useUsers() {
  const [data, setData] = useState<Paginated<AuthUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState({ page: 1, search: '', role: '' });

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({
      page: String(params.page),
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
    });
    apiFetch<Paginated<AuthUser>>(`/api/users?${qs}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, params, setParams, reload: load };
}