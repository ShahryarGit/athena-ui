
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../api/dbmanagement';
import styles from '../../utility/styles/PipelineList.module.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BackupIcon from '@mui/icons-material/Backup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import moment from 'moment';
const DBManagementPage = () => {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [dtFields, setDtFields] = useState([]);
  const [selectedField, setSelectedField] = useState();
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [openBkpModal, setOpenBkpModal] = React.useState(false);
  const [numOfDays, setNumOfDays] = React.useState(0);

  const [bkpTableName, setBkpTableName] = React.useState("");
  const [selectedTable, setSelectedTable] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenBkpModal = () => {
    setOpenBkpModal(true);
  };
  const handleCloseBkpModal = () => {
    setOpenBkpModal(false);
  };
  const handleChange = (id) => {
    setSelectedField(id);
  };
  useEffect(() => {
    fetchTables();
  }, []);

  const handleChangeDatetimeStart = (newValue) => {
    setStartDate(newValue);
  };
  const handleChangeDatetimeEnd = (newValue) => {
    setEndDate(newValue);
  };
  const fetchTables = async () => {
    try {
      const data = await api.getAllTables();
      if(data && data.length) {
        setTables(data);
      }
      else {
        setTables([]);
      }
      // setTables(data);
    } catch (error) {
      console.error('Error fetching tables', error);
    }
  };

  const handleTruncate = async (tableName) => {
    const confirmed = window.confirm('Are you sure you want to truncate this record?');

    if (confirmed) {
      try {
        await api.truncateTable(tableName);
        fetchTables();
      } catch (error) {
        console.error('Error truncating record', error);
      }
    }
  };
  const handleBackup = async () => {
      try {
        console.error('takebackp');
        const dtFilter = {
          tableName:selectedTable,
          bkpTableName:`${selectedTable}_bkp${moment.now()}`
      };
        await api.backupTableData(dtFilter);
      } catch (error) {
        console.error('Error taking backup', error);
      }
  };

  const handleGetDtRows = async (tableName) => {
      try {
       const data =  await api.deleteDataGetDtFields(tableName);
        setDtFields(data);
      } catch (error) {
        console.error('Error fetching fields', error);
      }
  };
  const handleDeleteDataByDtFilter = async () => {
      try {
        const dtFilter = {
            dtStart: startDate,
            dtEnd: endDate,
            dtRow:selectedField,
            tableName:selectedTable
        };
        console.log('dtFilter',dtFilter);
       const data =  await api.deleteDataByDtFilter(dtFilter);
        fetchTables();
      } catch (error) {
        console.error('Error deleting data', error);
      }
  };
  return (
    <>
 <div className={styles.pipelineList}>
    <div className={styles.header}>
      <h2>Tables List</h2>
      <Link href="/dbmanagement/executequery">
      <button className={styles.addButton}>Execute Query</button>
      </Link>
    </div>
    <table className={styles.pipelineTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <tr key={table.id}>
            <td>{`${table.schemaname}.${table.tablename}`}</td>
            <td>
            <IconButton onClick={() => {
                setSelectedTable(`${table.tablename}`);
                handleClickOpenBkpModal()
                // setBkpTableName(`${table.tablename}`)
            }}>
                <BackupIcon />
            </IconButton>
            <IconButton onClick={() => handleTruncate(table.tablename)}>
                <DeleteOutlineIcon />
            </IconButton>
            <IconButton onClick={() => {
              handleGetDtRows(`${table.tablename}`)
              setSelectedTable(`${table.tablename}`);
              handleClickOpen()
              
              }}>
                <DeleteIcon />
            </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

    <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleDeleteDataByDtFilter();
            handleClose();
          },
        }}
      >
        <DialogTitle>Date Time Fields</DialogTitle>
        <DialogContent>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
          <DialogContentText>
            Pls select date-time field
          </DialogContentText>

          <FormControl fullWidth>
            <DateTimePicker
            label="dtStart"
            value={startDate}
            onChange={handleChangeDatetimeStart}
            renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
          <FormControl fullWidth>
          <DateTimePicker
            label="dtEnd"
            value={endDate}
            onChange={handleChangeDatetimeEnd}
            renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          <FormControl fullWidth>
          <InputLabel id="lblDt">Select Date Filed</InputLabel>
          <Select
            labelId="lblDt"
            id="lblDtSelect"
            onChange={(ev)=>{handleChange(ev.target.value)}}
            value={selectedField}
            >
             {dtFields.map((item , i) => (
                <MenuItem key={item.column_name} value={item.column_name}>
                    {item.column_name}
                </MenuItem>
                ))}
        </Select>
          </FormControl>
          
          </Stack>
         
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button type='button' onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openBkpModal}
        onClose={handleCloseBkpModal}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleBackup()
            handleCloseBkpModal();
          },
        }}
      >
        <DialogTitle>Take Backup</DialogTitle>
        <DialogContent>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
          <DialogContentText>
            {`Are you sure to take back-up of table ${selectedTable}_bkp${moment.now()}`} 
          </DialogContentText>

          <FormControl fullWidth>
          <TextField
            label="period"
            value={numOfDays}
            type='number'
            onChange={(ev) => setNumOfDays(ev.target.value)}
            />
          </FormControl>       
          </Stack>
         
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBkpModal}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>


    </>
  );
};
export default DBManagementPage;
