// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001'; // Update with your Node.js backend URL

const api = {
  createPipeline: async (name) => {
    try {
      const response = await axios.post(`${BASE_URL}/createPipeline`, { name });
      return response.data;
    } catch (error) {
      console.error('Failed to create pipeline', error);
      throw error;
    }
  },

  getAllPipelines: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllPipelines`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pipelines', error);
      throw error;
    }
  },

  updatePipeline: async (id, newName) => {
    try {
      const response = await axios.put(`${BASE_URL}/updatePipeline/${id}`, { newName });
      return response.data;
    } catch (error) {
      console.error('Failed to update pipeline', error);
      throw error;
    }
  },

  deletePipeline: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deletePipeline/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete pipeline', error);
      throw error;
    }
  },
};

export default api;
