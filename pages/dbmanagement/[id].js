// pages/view/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../utility/styles/PipelineList.module.css'; // Import your CSS module
import Textarea from '@mui/joy/Textarea';
import api from '../api/dbmanagement';
import Stack from '@mui/material/Stack';
var stringify = require('json-stringify');
const ViewPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [queryData, setQueryData] = useState([]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if(query.toLowerCase().startsWith('delete')) {
        const updatedQuery = replaceDeleteWithSelect(query);
        const data = await api.executeQuery(updatedQuery);
        if (data && data.length) {
          const confirmed = window.confirm(`Are you sure you want to delete ${data[0].count} records?`);
          if (!confirmed) { 
            // const data = await api.executeQuery(query);
            // window.alert('delete successfull')
            return ;
          }
        }
      }
      const data = await api.executeQuery(query);
      setQueryData(data);
    } catch (error) {
      console.error('Error executing query', error);
    }
  };
  const replaceDeleteWithSelect = (query) => {
    return query.replace(/^delete/i, 'Select count(*) ')
  }
  return (
    <div >
      <h2>
        Execute Query
      </h2>

      <br />
      <br />
      <Stack spacing={3}>
      <form onSubmit={handleSave}>
        <label>
          Query:
        </label>
        <Textarea
          placeholder="Type here..."
          sx={{ mb: 1 }}
          minRows = {10}
          id='txtArea'
          value={query}
          onChange={(ev)=>setQuery(ev.target.value)}
        />
        <br />
        <div style={{float:'right'}}>
          <button
            className={styles.addButton}
            type="submit">Execute</button>
          <button
          type='button'
            className={styles.backButton}
            onClick={() => { router.push(`/dbmanagement`) }}>
            Back
          </button>
        </div>
       
      </form>
        <label>
          Result:
        </label>
        <Textarea
          placeholder="Type here..."
          sx={{ mb: 1 }}
          minRows = {20}
          id='txtArea'
          value={JSON.stringify(queryData)}
          onChange={(ev)=>setQuery(ev.target.value)}
        />
      </Stack>

    </div>
//     <pre>
// {JSON.stringify(queryData)}
// </pre>

  );
};

export default ViewPage;
