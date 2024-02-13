
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../api/pipieline_apies';
import styles from '../../utility/styles/PipelineList.module.css'; // Import your CSS module
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PipelinePage = () => {
  const router = useRouter();
  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
      const data = await api.getAllPipelines();
      console.log('pipelinesData', data)
      setPipelines(data);
    } catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');

    if (confirmed) {
      try {
        await api.deletePipeline(id);
        fetchPipelines();
      } catch (error) {
        console.error('Error deleting record', error);
      }
    }
  };

  return (
    // <div>
    //   <Link href="/pipeline/add" passHref>
    //     <button>Add Pipeline</button>
    //   </Link>
    //   <h2>Pipeline List</h2>
    //   <ul>
    //     {pipelines.map((record) => (
    //       <li key={record.id}>
    //         {record.name}{' '}
    //         <Link href={`/pipeline/${record.id}?mode=view`}>
    //           View
    //         </Link>{' '}
    //         <Link href={`/pipeline/${record.id}?mode=edit`}>
    //           Edit
    //         </Link>{' '}
    //         <button onClick={() => handleDelete(record.id)}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>


    <div className={styles.pipelineList}>
    <div className={styles.header}>
      <h2>Pipeline List</h2>
      <Link href="/pipeline/add">
      <button className={styles.addButton}>Add Pipeline</button>
        {/* <a className={styles.addButton}>Add Pipeline</a> */}
      </Link>
    </div>
    <table className={styles.pipelineTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Connection Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {pipelines.map((pipeline) => (
          <tr key={pipeline.id}>
            <td>{pipeline.name}</td>
            <td>{pipeline.connection_name}</td>
            <td>
              <IconButton onClick={() => {
                 router.push('/pipeline/${record.id}?mode=view',
                 `/pipeline/${pipeline.id}?mode=view`)
              }}>
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => {
                 router.push('/pipeline/${record.id}?mode=edit',
                 `/pipeline/${pipeline.id}?mode=edit`)
              }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(pipeline.id)}>
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
export default PipelinePage;
