
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
        //     <h2>Pipeline List</h2>
        //     <ul>
        //         {pipelines.map((record) => (
        //             <li key={record.id}>
        //                 {record.name}{' '}
        //                 <button onClick={() => {
        //                     router.push('/pipeline-step/[pipelineId]/access',
        //                         `/pipeline-step/${record.id}/access`)
        //                 }}>
        //                     view pipeline steps
        //                 </button>
        //             </li>
        //         ))}
        //     </ul>
        // </div>



        <div className={styles.pipelineList}>
    <div className={styles.header}>
      <h2>Pipeline Step List</h2>
    </div>
    <table className={styles.pipelineTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {pipelines.map((record) => (
          <tr key={record.id}>
            <td>{record.name}</td>
            <td>
              <IconButton onClick={() => {
                            router.push('/pipeline-step/[pipelineId]/access',
                                `/pipeline-step/${record.id}/access`)
                        }}>
                <EditIcon />
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
