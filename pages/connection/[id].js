// pages/view/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../api/connection_apies';
import styles from '../../utility/styles/PipelineList.module.css'; // Import your CSS module
import GenericDropdown from '../../components/GenericDropdown';

const ViewPage = () => {
  const router = useRouter();
  console.log('router', router)
  const { id, mode } = router.query;
  // const { id } = router.query;
  // const isEditing = router.query.edit === 'true';

  // const [connectionId, setConnectionId] = useState(0);
  const [connectionId, setConnectionId] = useState('');
  const [connectionType, setConnectionType] = useState('mysql');
  const [database, setDatabase] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [port, setPort] = useState('');
  // const [formData, setFormData] = useState({ name: '' });

  const options = [
    { value: 'mysql', label: 'MySql' },
    { value: 'postgres', label: 'PostgresSql' },
  ];

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await api.getConnectionById(id);
        setConnectionId(data[0].connection_id)
        setConnectionType(data[0].connection_type)
        setDatabase(data[0].database)
        setDescription(data[0].description)
        setHost(data[0].host)
        setUserName(data[0].username)
        setPassword(data[0].password)
        setPort(data[0].port)
        console.log('data', data)
        // setRecord(data);
      } catch (error) {
        console.error(`Error fetching record with ID ${id}`, error);
      }
    };

    if (id && (mode === 'edit' || mode === 'view')) {
      fetchRecord();
    }
  }, [id, mode]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (mode === 'view') {
      return;
    }
    if (!connectionId || connectionId == '') {
      alert('Name should not be empty!')
      return;
    }
    try {
      const dataObj = {
        connectionId: connectionId,
        connectionType: connectionType,
        database: database,
        description: description,
        host: host,
        username: username,
        password: password,
        port: port,
      };
      console.log('dataObj',dataObj)
      if (id && mode === 'edit') {
        const obj = await api.updateConnection(id, dataObj);
        console.log('record updated successfully', dataObj)
        router.push(`/connection`);
      } else {
        const obj = await api.createConnection(dataObj);
        console.log('record saved successfully', dataObj)
        router.push(`/connection`);
      }
    } catch (error) {
      console.error('Error saving record', error);
    }
  };

  return (
    <div>
      <h2>
        {mode === 'edit' ? 'Edit Connection' :
          mode === 'view' ? 'View Connection'
            : 'Create Connection'}
      </h2>

      <br />
      <br />
      <form onSubmit={handleSave}>

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">

              {/* Connection ID */}
              <label>
                Connection ID:<span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="text"
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
                readOnly={mode === 'view'}
                required
              />

              {/* Host */}
              <br />
              <label>
                Host:<span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                readOnly={mode === 'view'}
                required
              />

              {/* User */}
              <br />
              <label>
                User:<span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                readOnly={mode === 'view'}
                required
              />
             
              {/* Port */}
              <br />
              <label>
                Port:<span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                readOnly={mode === 'view'}
                required
              />

            </div>

            <div className="col-md-6">
              {/* Connection Type */}
              <GenericDropdown
                label="Connection Type"
                defaultValue={connectionType}
                options={options}
                disabled={false} // Set to true to disable the dropdown
                onChange={(e) => { setConnectionType(e);
                console.log('setConnectionType',e) }}
                style={{marginTop:'5px'}}
              />





              {/* password */}
              <br />
              <br />
              <label>
                Password: <span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly={mode === 'view'}
                required
              />


               {/* Database */}
               <br />
              <label>
                Database: <span className={styles.impField}>*</span>
              </label>
              <input
                className='form-control'
                type="database"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                readOnly={mode === 'view'}
                required
              />

               {/* Description */}
               <br />
                <label>
                  Description:
                </label>
                <textarea
                  className='form-control'
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  readOnly={mode === 'view'}

                />

            </div>
          


          </div>
        </div>




        <br />
        <div style={{ float: 'right' }}>
          {mode !== 'view' && <button
            className={styles.addButton}
            type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>}
          <button
            className={styles.backButton}
            onClick={() => { router.push(`/connection`) }}>
            Back
          </button>
        </div>

      </form>
    </div>


  );
};

export default ViewPage;
