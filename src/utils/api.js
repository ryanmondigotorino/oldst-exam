import axios from 'axios';

const SERVER_URL = 'http://localhost:8000';

const api = () => {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  return axios.create({
    baseURL: SERVER_URL,
    ...headers
  });
}

export { api };
