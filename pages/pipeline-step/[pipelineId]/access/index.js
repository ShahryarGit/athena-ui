
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import apiPL from '../../../api/pipieline_apies';
import api from '../../../api/pipieline_steps_apies';
import styles from '../../../../utility/styles/PipelineList.module.css'; // Import your CSS module
// import styles from '../../../../utility'; // Import your CSS module
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const PipelineRow = ({ id, name, pipelineId, index, moveRow, handleDelete }) => {
  
  const router = useRouter();
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'row',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const [, drag] = useDrag({
  //   type: 'row',
  //   item: () => {
  //     return { id, index };
  //   },
  //   // collect: (monitor) => ({
  //   //   isDragging: monitor.isDragging(),
  //   // }),
  // });

  drag(drop(ref));

  return (
    <tr ref={ref}
    className={`${styles.draggableRow} ${isDragging  ? styles.dragging : ''}`}
    >
      {/* <td>{id}</td> */}
      <td>{name}</td>
      <td className={styles.pipelineActions}>
        <IconButton onClick={() => {
          router.push(`/pipeline-step/${pipelineId}/access/crud?id=${id}&mode=view`,
            `/pipeline-step/${pipelineId}/access/crud?id=${id}&mode=view`)
        }}>
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={() => {
          router.push(`/pipeline-step/${pipelineId}/access/crud?id=${id}&mode=edit`,
            `/pipeline-step/${pipelineId}/access/crud?id=${id}&mode=edit`)
        }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </td>
    </tr>
  );
};

const PipelineStepPage = () => {
  const router = useRouter();
  console.log('router', router)
  const { pipelineId } = router.query
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineSteps, setPipelineSteps] = useState([]);

  const [rows, setRows] = useState([]);

  console.log('pipelineId', pipelineId)

  const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  function getCurrentDateTime() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  const [startdate, setStartdate] = React.useState(dayjs(getCurrentDateTime()));
  const [enddate, setEnddate] = React.useState(dayjs(getCurrentDateTime()));
  const handleStartdateChange = (newValue) => {
    setStartdate(newValue);
    console.log('setStartdate', newValue)
  };

  const handleEnddateChange = (newValue) => {
    setEnddate(newValue);
  };


  useEffect(() => {
    fetchPipeline();
    fetchPipelineStepsByPipelineId();
  }, []);

  const fetchPipelineStepsByPipelineId = async () => {
    try {
      console.log('fetchPipelineStepsByPipelineId', pipelineId)
      const data = await api.getPipelineStepByPipelineId(pipelineId);
      console.log('fetchPipelineStepsByPipelineId', data)
      setPipelineSteps(data);
      setRows(data);
    } catch (error) {
      console.error('Error fetching pipelineSteps', error);
    }
  };

  const fetchPipeline = async () => {
    try {
      const data = await apiPL.getPipelineById(pipelineId);
      console.log('pipelinesData', data)
      setPipelineName(data[0].name)
    } catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');

    if (confirmed) {
      try {
        await api.deletePipelineStep(id);
        fetchPipelineStepsByPipelineId();
      } catch (error) {
        console.error('Error deleting record', error);
      }
    }
  };
  const moveRow = (dragIndex, hoverIndex) => {
    const draggedRow = rows[dragIndex];
    const updatedRows = [...rows];
    updatedRows.splice(dragIndex, 1);
    updatedRows.splice(hoverIndex, 0, draggedRow);
    setRows(updatedRows);
    setPipelineSteps(updatedRows);
    console.log(updatedRows)
    // You can save the updated order to the server here
  };

  const handleSave = async (e) => {
    try {
      const confirmed = window.confirm('Are you sure you want update the positions?');
      if (confirmed) {
        const obj = await api.updateIndexPipelineStep(pipelineSteps);
        console.log('handleSave', obj)
        alert('Position updated successfully');
      }
    }
    catch (error) {
      console.error('Error saving record', error);
    }
  };

  return (
    // <div>
    //  <h1>Pipeline Title: {pipelineName}</h1>
    //   <Link href={`/pipeline-step/${pipelineId}/access/crud?id=0&mode=add`} passHref>
    //     <button>Add Pipeline Step</button>
    //   </Link>
    //   <h2>Pipeline Step List</h2>
    //   <ul>
    //     {pipelineSteps.map((record) => (
    //       <li key={record.id}>
    //         {record.name}{' '}
    //         <Link href={`/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=view`}>
    //           View
    //         </Link>{' '}
    //         <Link href={`/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=edit`}>
    //           Edit
    //         </Link>{' '}
    //         <button onClick={() => handleDelete(record.id)}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>


    <DndProvider backend={HTML5Backend}>
      <div className={styles.pipelineList}>
        <div className={styles.header}>
          <h2>Pipeline steps for <strong>{pipelineName}</strong> </h2>
          <Link href={`/pipeline-step/${pipelineId}/access/crud?id=0&mode=add&startdate=${startdate}&enddate=${enddate}`} passHref>
            <button className={styles.addButton} type='button'>Add Pipeline Step</button>
            {/* <a className={styles.addButton}>Add Pipeline</a> */}
          </Link>
        </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}> 
              <DateTimePicker
                label="<Start Date>"
                value={startdate}
                onChange={handleStartdateChange}
                renderInput={(params) => <TextField {...params} />}
              />

              <DateTimePicker
                label="<End Date>"
                value={enddate}
                onChange={handleEnddateChange}
                renderInput={(params) => <TextField {...params} />}
              />
          </div>
          </LocalizationProvider>

        <table className={styles.pipelineTable}>
          <thead>
            <tr>
              {/* <th>id</th> */}
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pipelineSteps.map((record, index) => (
              // <tr key={record.id}>
              //   <td>{record.name}</td>
              //   <td>
              //     <IconButton onClick={() => {
              //        router.push(`/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=view`,
              //        `/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=view`)
              //     }}>
              //       <VisibilityIcon />
              //     </IconButton>
              //     <IconButton onClick={() => {
              //      router.push(`/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=edit`,
              //      `/pipeline-step/${pipelineId}/access/crud?id=${record.id}&mode=edit`)
              //     }}>
              //       <EditIcon />
              //     </IconButton>
              //     <IconButton onClick={() => handleDelete(record.id)}>
              //       <DeleteIcon />
              //     </IconButton>
              //   </td>
              // </tr>


              <PipelineRow
                key={record.id}
                id={record.id}
                name={record.name}
                pipelineId={pipelineId}
                index={index}
                moveRow={moveRow}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

<br/>
<br/>
        <div style={{ float: 'right' }}>
          <button className={styles.addButton} style={{}} onClick={handleSave}>Save</button>
          <button
            className={styles.backButton}
            onClick={() => {
              router.push('/pipeline-step',
                `/pipeline-step`)
            }}>
            Back
          </button>
        </div>

      </div>


    </DndProvider>

  );
};
export default PipelineStepPage;
