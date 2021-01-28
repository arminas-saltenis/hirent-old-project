const API_URL = 'https://hirent.herokuapp.com/api';

export const GET = async (endPoint) => {
  try {
    const response = await fetch(`${API_URL}/${endPoint}`);
    const data = await response.json();
    return data;
  }
  catch(error) {
    return error;
  }
}

export const MODIFY = async (endPoint, method, properties) => {
  try {
    const response = await fetch(`${API_URL}/${endPoint}`, {
      method: method,
      body: JSON.stringify(properties),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
  catch(error) {
    return error;
  }
}