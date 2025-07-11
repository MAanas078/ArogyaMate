// services/api.js

const apiUrl = process.env.REACT_APP_API_URL;  // Using the environment variable for the API URL

// General function to make GET requests
export const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw for handling in the component
  }
};

// Function for making POST requests
export const postRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error; // Re-throw for handling in the component
  }
};

// You can add more functions for PUT, DELETE requests as needed.
