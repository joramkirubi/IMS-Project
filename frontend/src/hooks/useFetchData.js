import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

// useFetchData(endpoint, options)
// options: { pollInterval: number (ms) }
export default function useFetchData(endpoint, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(endpoint);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();

    let timer;
    if (options.pollInterval && Number(options.pollInterval) > 0) {
      timer = setInterval(fetchData, Number(options.pollInterval));
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [fetchData, options.pollInterval]);

  // expose a refetch helper
  const refetch = async () => {
    setLoading(true);
    await fetchData();
  };

  return { data, setData, loading, error, refetch };
}
