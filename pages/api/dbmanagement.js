// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001'; // Update with your Node.js backend URL

const api = {
    getAllTables: async () => {
        try {
          const response = await fetch(`${BASE_URL}/getAllTables`).then((res) => res.json());
          return response;
        } catch (error) {
          console.error('Failed to get tables', error);
          throw error;
        }
      },
      getRowsCount: async (tableName) => {
        try {
          const response = await fetch(`${BASE_URL}/api/getSelectCount/${tableName}`).then((res) => res.json());
          return response;
        } catch (error) {
          console.error('Failed to get tables', error);
          throw error;
        }
      },
      truncateTable: async (tableName) => {
        try {
            const response = await fetch(`${BASE_URL}/truncateTable/${tableName}`, {
                method: 'DELETE',
              });
          
              if (!response.ok) {
                throw new Error(`Failed to truncate Table`);
              }
          
              return response;
        } catch (error) {
          console.error('Failed to get tables', error);
          throw error;
        }
      },
      backupTableData: async (data) => {
        try {

            const response = await fetch(`${BASE_URL}/takeBackup/true`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            // const response = await fetch(`${BASE_URL}/takeBackup/${tableName}/${bkpTableName}`);
            if (!response.ok) {
                throw new Error(`Failed to take backup`);
              }
          
              return response;
          } catch (error) {
            console.error('Failed to take backup', error);
            throw error;
          }
      },
      deleteDataGetDtFields: async (tableName) => {
        try {
            const response = await fetch(`${BASE_URL}/getDatetimeFields/${tableName}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data`);
              }
          
              return response.json();
          } catch (error) {
            console.error('Failed to fetch data', error);
            throw error;
          }
      },
      deleteDataByDtFilter: async (filter) => {
        try {
            const response = await fetch(`${BASE_URL}/deleteTableData/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(filter),
              });
          
              if (!response.ok) {
                throw new Error(`Failed to delete data`);
              }
          
              return response;
          } catch (error) {
            console.error('Failed to delete data', error);
            throw error;
          }
      },
      executeQuery: async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/executeQuery/${query}`).then((res) => res.json())
            // const response = await fetch(`${BASE_URL}/executeQuery/true`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: query,
            // });
            console.log('response',response);
            // if (!response.ok) {
            //   throw new Error(`Failed to execute query`);
            // }
            return response;
          } catch (error) {
            console.error('Failed to execute query', error);
            throw error;
          }
      },
      getAllColumnsByTable: async (table) => {
        try {
          const response = await fetch(`${BASE_URL}/getAllColumnsByTable/${table}`).then((res) => res.json());
          return response;
        } catch (error) {
          console.error('Failed to get tables', error);
          throw error;
        }
      },
};


export default api;
