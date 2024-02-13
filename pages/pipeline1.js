
// components/PipelinePage.js
import React, { useEffect, useState } from 'react';
import PipelineList from '../components/pipeline/index';
// import CreatePipelineForm from './CreatePipelineForm';

const PipelinePage = () => {
  const [pipelines, setPipelines] = useState([]);

  // Fetch all pipelines on component mount
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await fetch('/api/pipelines/index');
        const data = await response.json();
        setPipelines(data);
      } catch (error) {
        console.error('Error fetching pipelines', error);
      }
    };

    fetchPipelines();
  }, []);

  const handleDelete = async (pipelineId) => {
    try {
      const response = await fetch(`/api/pipelines/delete?id=${pipelineId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPipelines((prevPipelines) => prevPipelines.filter((p) => p.id !== pipelineId));
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error deleting pipeline', error);
    }
  };

  // const handleCreate = async (name) => {
  //   try {
  //     const response = await fetch('/api/pipelines/create', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name }),
  //     });

  //     if (response.ok) {
  //       const createdPipeline = await response.json();
  //       setPipelines((prevPipelines) => [...prevPipelines, createdPipeline]);
  //     } else {
  //       // Handle error
  //     }
  //   } catch (error) {
  //     console.error('Error creating pipeline', error);
  //   }
  // };

  // const handleEdit = async (pipeline) => {
  //   // Implement edit logic
  //   console.log('Edit Pipeline:', pipeline);
  // };

  

  return (
    <div>
      <h1>Pipelines</h1>
      <PipelineList pipelines={pipelines} />
      {/* <PipelineList pipelines={pipelines} onEdit={handleEdit} onDelete={handleDelete} /> */}
      {/* <CreatePipelineForm onSubmit={handleCreate} /> */}
    </div>
  );
};

export default PipelinePage;
