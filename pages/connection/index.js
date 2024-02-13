
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../api/connection_apies';
import styles from '../../utility/styles/PipelineList.module.css'; // Import your CSS module
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ConnectionPage = () => {
  const router = useRouter();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const data = await api.getAllConnections();
      console.log('connectionsData', data)
      setConnections(data);
    } catch (error) {
      console.error('Error fetching connections', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');

    if (confirmed) {
      try {
        await api.deleteConnection(id);
        fetchConnections();
      } catch (error) {
        console.error('Error deleting record', error);
      }
    }
  };

  return (
    <div className={styles.pipelineList}>
    <div className={styles.header}>
      <h2>Connection List</h2>
      <Link href="/connection/add">
      <button className={styles.addButton}>Add Connection</button>
      </Link>
    </div>
    <table className={styles.pipelineTable}>
      <thead>
        <tr>
          <th>Connection Id</th>
          <th>Connection Type</th>
          <th>host</th>
          <th>User</th>
          <th>Port</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {connections.map((connection) => (
          <tr key={connection.id}>
            <td>{connection.connection_id}</td>
            <td>{connection.connection_type}</td>
            <td>{connection.host}</td>
            <td>{connection.username}</td>
            <td>{connection.port}</td>
            <td>
              <IconButton onClick={() => {
                 router.push('/connection/${record.id}?mode=view',
                 `/connection/${connection.id}?mode=view`)
              }}>
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => {
                 router.push('/connection/${record.id}?mode=edit',
                 `/connection/${connection.id}?mode=edit`)
              }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(connection.id)}>
                <DeleteIcon />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};
export default ConnectionPage;
