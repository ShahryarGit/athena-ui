// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = {
  
  getAllPipelines: async () => {
    const response = await fetch(`${BASE_URL}/getAllPipelines`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pipelines`);
    }

    return response.json();
  },

  getPipelineById: async (id) => {
    const response = await fetch(`${BASE_URL}/getPipelineById/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pipeline`);
    }

    return response.json();
  },

//   getPipelineStepByPipelineId: async (id) => {
//     console.log('getPipelineStepByPipelineId',id)
//     var ids=id
//     const response = await fetch(`${BASE_URL}/getPipelineStepByPipelineId/${ids}`);
// console.log('getPipelineStepByPipelineId-response',response)
//     if (!response.ok) {
//       throw new Error(`Failed to fetch PipelineStep by pipeline id`);
//     }

//     return response.json();
//   },

  createPipeline: async (data) => {
    console.log('createPipeline',data)
    const response = await fetch(`${BASE_URL}/createPipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Pipeline`);
    }
console.log('response',response)
    return response;
  },

  updatePipeline: async (id, data) => {
    const response = await fetch(`${BASE_URL}/updatePipeline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Pipeline`);
    }

    return response;
  },

  deletePipeline: async (id) => {
    const response = await fetch(`${BASE_URL}/deletePipeline/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Pipeline`);
    }

    return response;
  },
};

export default api;
