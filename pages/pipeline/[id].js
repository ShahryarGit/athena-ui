// pages/view/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../api/pipieline_apies';
import apiCon from '../api/connection_apies';
import styles from '../../utility/styles/PipelineList.module.css'; // Import your CSS module
import GenericDropdown from '../../components/GenericDropdown';

const ViewPage = () => {
  const router = useRouter();
  console.log('router', router)
  const { id, mode } = router.query;
  // const { id } = router.query;
  // const isEditing = router.query.edit === 'true';

  const [pipelineId, setPipelineId] = useState(0);
  const [pipelineName, setPipelineName] = useState('');
  const [connectionId, setConnectionId] = useState('');
  const [connectionList, setConnectionList] = useState([]);
  // const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await api.getPipelineById(id);
        setPipelineId(data[0].id)
        setPipelineName(data[0].name)
        setConnectionId(data[0].connection_id)
        console.log('data', data)
        // setRecord(data);
      } catch (error) {
        console.error(`Error fetching record with ID ${id}`, error);
      }
    };

    if (id && (mode === 'edit' || mode === 'view')) {
      fetchRecord();
    }
    fetchConnections();
    // if (mode === 'add') {
    //   if (connectionList && connectionList.length > 0) {
    //     setConnectionId(connectionList[0].value)
    //   }
    // }
  }, [id, mode]);

  const fetchConnections = async () => {
    try {
      const data = await apiCon.getAllConnections();
      console.log('connectionsData', data)
      const conList = [];
      if (data && data.length > 0) {
        data.map((item) => {
          conList.push({
            value: item.id,
            label: item.connection_id
          })
        });
        setConnectionList(conList)
      }
      console.log('conList', conList)
    } catch (error) {
      console.error('Error fetching connections', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (mode === 'view') {
      return;
    }
    if (!pipelineName || pipelineName == '') {
      alert('Name should not be empty!')
      return;
    }
    try {
      const dataObj = {
        name: pipelineName,
        connectionId: connectionId
      };
      if (id && mode === 'edit') {
        const obj = await api.updatePipeline(id, dataObj);
        console.log('record updated successfully', dataObj)
        router.push(`/pipeline`);
      } else {
        const obj = await api.createPipeline(dataObj);
        console.log('record saved successfully', dataObj)
        router.push(`/pipeline`);
      }
    } catch (error) {
      console.error('Error saving record', error);
    }
  };

  return (
    <div className={styles.addPipeline}>
      <h2>
        {mode === 'edit' ? 'Edit Pipeline' :
          mode === 'view' ? 'View Pipeline'
            : 'Create Pipeline'}
      </h2>

      <br />
      <br />
      <form onSubmit={handleSave}>
        <label>
          Name: <span className={styles.impField}>*</span>
        </label>
        <input
          className='form-control'
          type="text"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
          readOnly={mode === 'view'}
          required
        />

        <br />
        <GenericDropdown
          label="Connection Id"
          defaultValue={connectionId}
          options={connectionList}
          disabled={false} // Set to true to disable the dropdown
          onChange={(e) => {
            setConnectionId(e);
            console.log('setConnectionId', e)
          }}
          style={{ marginTop: '5px' }}
        />


        <br />
        <br />
        <div style={{ float: 'right' }}>
          {mode !== 'view' && <button
            className={styles.addButton}
            type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>}
          <button
            className={styles.backButton}
            onClick={() => { router.push(`/pipeline`) }}>
            Back
          </button>
        </div>

      </form>
    </div>


  );
};

export default ViewPage;
