import axios from 'axios';

// Hooks
import { useState, useEffect } from 'react';

function useFetch(method, url, params, body, options) {
  const [data, setData] = useState([]);

  async function fetchUrl() {
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
            "Content-Type": "application/json",
            'Authorization': options.accessToken,
        },
        params: params,
        data: body
      });

      setData(response.data);

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  return [data];
}

export { useFetch };