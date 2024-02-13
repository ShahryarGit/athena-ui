// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = {

  getAllPipelineSteps: async () => {
    const response = await fetch(`${BASE_URL}/getAllPipelineSteps`);

    if (!response.ok) {
      throw new Error(`Failed to fetch PipelineSteps`);
    }

    return response.json();
  },

  getPipelineStepById: async (id) => {
    console.log('getPipelineStepById', id)
    const response = await fetch(`${BASE_URL}/getPipelineStepById/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch PipelineStep`);
    }

    return response.json();
  },

  createPipelineStep: async (data) => {
    console.log('createPipelineStep', data)
    const response = await fetch(`${BASE_URL}/createPipelineStep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create PipelineStep`);
    }
    console.log('response', response)
    return response;
  },

  updatePipelineStep: async (id, data) => {
    const response = await fetch(`${BASE_URL}/updatePipelineStep/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update PipelineStep`);
    }

    return response;
  },

  deletePipelineStep: async (id) => {
    const response = await fetch(`${BASE_URL}/deletePipelineStep/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete PipelineStep`);
    }

    return response;
  },

  getPipelineStepByPipelineId: async (id) => {
    console.log('getPipelineStepByPipelineId', id)
    var ids = id
    const response = await fetch(`${BASE_URL}/getPipelineStepByPipelineId/${id}`);
    console.log('getPipelineStepByPipelineId-response', response)
    if (!response.ok) {
      throw new Error(`Failed to fetch PipelineStep by pipeline id`);
    }
    return response.json();
  },


  updateIndexPipelineStep: async (data) => {
    console.log('updateIndexPipelineStep', data)
    const response = await fetch(`${BASE_URL}/updatePipelineStepIndex`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to updateIndexPipelineStep`);
    }
    console.log('response', response)
    return response;
  },

};



export default api;
