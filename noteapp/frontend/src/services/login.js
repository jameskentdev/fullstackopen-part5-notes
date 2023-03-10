import axios from 'axios';
const baseURL = '/api/login';

const login = async (credentials) => {
  console.log('Logging in');
  const response = await axios.post(baseURL, credentials);
  return response.data;
};

export default { login };
