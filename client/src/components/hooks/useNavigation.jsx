// Hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useNavigation(url, state) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  async function navigateUrl() {
    try {
        setData(state);
        navigate(url, { state: state });
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    navigateUrl();
  }, [state]);

  return [data];
}

export { useNavigation };