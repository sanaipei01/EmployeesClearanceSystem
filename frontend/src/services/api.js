export const API_URL = 'https://employeesclearancesystem.onrender.com/api';

export const submitRequest = async (token, requestData) => {
  const response = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  });
  return response.json();
};

export const getMyRequests = async (token) => {
  const response = await fetch(`${API_URL}/requests/my`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
