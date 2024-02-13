// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = {
  
  getAllConnections: async () => {
    const response = await fetch(`${BASE_URL}/getAllConnections`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Connections`);
    }

    return response.json();
  },

  getConnectionById: async (id) => {
    const response = await fetch(`${BASE_URL}/getConnectionById/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Connection`);
    }

    return response.json();
  },

//   getConnectionStepByConnectionId: async (id) => {
//     console.log('getConnectionStepByConnectionId',id)
//     var ids=id
//     const response = await fetch(`${BASE_URL}/getConnectionStepByConnectionId/${ids}`);
// console.log('getConnectionStepByConnectionId-response',response)
//     if (!response.ok) {
//       throw new Error(`Failed to fetch ConnectionStep by pipeline id`);
//     }

//     return response.json();
//   },

  createConnection: async (data) => {
    console.log('createConnection',data)
    const response = await fetch(`${BASE_URL}/createConnection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Connection`);
    }
console.log('response',response)
    return response;
  },

  updateConnection: async (id, data) => {
    const response = await fetch(`${BASE_URL}/updateConnection/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Connection`);
    }

    return response;
  },

  deleteConnection: async (id) => {
    const response = await fetch(`${BASE_URL}/deleteConnection/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Connection`);
    }

    return response;
  },
};

export default api;
