// pages/datagrid.js
import React, { useState } from 'react';
import axios from 'axios';

const DataGridPage = () => {
  const [data, setData] = useState([
    { id: 1, textValue: 'text 1', dropdownValue: 'Option 1' },
    { id: 2, textValue: 'text 2', dropdownValue: 'Option 2' },
    { id: 3, textValue: 'text 3', dropdownValue: 'Option 3' },
    { id: 4, textValue: 'text 4', dropdownValue: 'Option 4' },
    // Add more rows as needed
  ]);

  const handleTextChange = (id, value) => {
    const newData = data.map(item => (item.id === id ? { ...item, textValue: value } : item));
    setData(newData);
  };

  const handleDropdownChange = (id, value) => {
    const newData = data.map(item => (item.id === id ? { ...item, dropdownValue: value } : item));
    setData(newData);
  };
  
  const handleButtonClick = async (id) => {
    const rowData = data.find(item => item.id === id);
  console.log('handleButtonClick',rowData)
    try {
      // Make a POST request to the Node.js server
      const response = await fetch('http://localhost:3001/writeToFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rowData),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        alert('Data sent to server successfully.');
        console.log('Data written to file successfully.');
      } else {
        console.error('Error writing data to file:', result.error);
      }
    } catch (error) {
      console.error('Error writing data to file:', error.message);
    }
  };
  
  const handleSendAllDataClick = async () => {
    try {
      // Send all data to the server
  console.log('handleSendAllDataClick',data)
  const response = await fetch('http://localhost:3001/writeToFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      alert('All data sent to server successfully.');
      console.log('All data sent to server successfully.');
    } catch (error) {
      console.error('Error sending all data:', error);
    }
  };
  return (
    <div className="container mt-5">
      <div style={{justifyContent: 'space-between',display:' flex'}}>
      <h1>Upload Files</h1>
      <button
        className="btn btn-primary"
        onClick={() => handleSendAllDataClick()}
      >
        Send All Data
      </button>
      </div>
     <br/>
     <br/>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Text Value</th>
            <th>Dropdown Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <input
                className='form-control'
                  type="text"
                  value={item.textValue}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                />
              </td>
              <td>
                <select
                className='form-control'
                value={item.dropdownValue}
                  onChange={(e) => handleDropdownChange(item.id, e.target.value)}
                >
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                  <option value="Option 4">Option 4</option>
                  {/* Add more options as needed */}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleButtonClick(item.id)}
                >
                  Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGridPage;
