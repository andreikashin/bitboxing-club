// src/hooks/useNetboxData.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useNetboxData() {
  const [data, setData] = useState({ roles: [], types: [], sites: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [roles, types, sites] = await Promise.all([
          api.getDeviceRoles(),
          api.getDeviceTypes(),
          api.getSites(),
        ]);
        setData({ roles, types, sites });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, isLoading, error };
}
