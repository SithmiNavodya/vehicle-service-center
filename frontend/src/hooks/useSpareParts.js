// src/hooks/useSpareParts.js
import { useState, useEffect } from 'react';
//import sparePartService from '../services/sparePartService'; // REMOVE the curly braces
import { sparePartService } from '../services/sparePartService';
const useSpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const response = await sparePartService.getAllSpareParts(); // Use the default import
      setSpareParts(response || []); // Response is already the data
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch spare parts');
      console.error('Error fetching spare parts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  return { spareParts, loading, error, fetchSpareParts };
};

export default useSpareParts;