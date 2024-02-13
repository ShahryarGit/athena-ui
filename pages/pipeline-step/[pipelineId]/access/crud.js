// pages/view/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiPLS from '../../../api/pipieline_steps_apies';
import apiPL from '../../../api/pipieline_apies';
import styles from '../../../../utility/styles/PipelineList.module.css'; // Import your CSS module
import GenericDropdown from '../../../../components/GenericDropdown';
import apiDb from '../../../api/dbmanagement';

import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Select, MenuItem, InputLabel, TextareaAutosize } from '@mui/material';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ViewPage = () => {
  const router = useRouter();
  console.log('router', router)
  const { pipelineId, id, mode,startdate,enddate } = router.query;
  console.log('pipelineId,id, mode', pipelineId, id, mode,startdate,enddate)
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineStepId, setPipelineStepId] = useState(0);
  const [pipelineStepName, setPipelineStepName] = useState('');
  // const [formData, setFormData] = useState({ name: '' });

  const [showDiv1, setShowDiv1] = React.useState(true);
  const [showDiv2, setShowDiv2] = React.useState(false);


  const operationList = [
    { value: '', label: 'None' },
    { value: 'remove_nulls', label: 'Remove NULLS' },
    { value: 'dedope', label: 'Dedope' },
  ];



  
  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);

    if (event.target.value === 'table') {
      setShowDiv1(true);
      setShowDiv2(false);
    } else if (event.target.value === 'sql') {
      setShowDiv1(false);
      setShowDiv2(true);
    }
  };

  const [showColumnDDL, setShowColumnDDL] = React.useState(false);
  const [showOperationDDL, setShowOperationDDL] = React.useState(false);


  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  function convertToCustomFormat(dateString) {
    const dateObject = new Date(dateString);
  
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getSeconds().toString().padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    console.log('formattedDateTime',formattedDateTime)
    return formattedDateTime;
  }

  // const [startDate, setStartDate] = useState(convertToCustomFormat(startdate));
  // const [endDate, setEndDate] = useState(convertToCustomFormat(enddate));
  const [selectedMode, setSelectedMode] = React.useState('table');

  const [modeType, setModeType] = useState('');
  const [table, setTable] = useState('');
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('');
  // const [operation, ] = useState('');
  const [dedopeColumn, setDedopeColumn] = useState('');
  const [createOutputTable, setCreateOutputTable] = useState(true);
  const [query, setQuery] = useState('');
  const [tableList, setTableList] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const [columnArr, setColumnArr] = useState([]);

  

 
  

  const [showDedopeColumnList, setShowDedopeColumnList] = React.useState(false);
  const handleTableChange = (event) => {
    console.log('handleTableChange',event)
    setTable(event);
    fatchDateTimeFieldsByTable(event)
    fetchColumnsByTable(event)
    if (event=== '') {
      setShowColumnDDL(false);
      setShowOperationDDL(false);
    } else {
      setShowColumnDDL(true);
      setShowOperationDDL(true);
    }
  };
  
  const handleColumnChange = (event) => {
    setColumn(event);
  };

  const handleOperationChange = (event) => {
    setOperation(event);
    if (event === 'dedope') {
      setShowDedopeColumnList(true);
    } else {
      setShowDedopeColumnList(false);
    }
  };

  


  useEffect(() => {
    const fetchgetPipelineStepById = async () => {
      try {
        console.log('getPipelineStepById', id)
        const data = await apiPLS.getPipelineStepById(id);
        console.log('data', data)
        setPipelineStepId(data[0].id)
        setPipelineStepName(data[0].name)
        setSelectedMode(data[0].mode)
        handleModeChange(data[0].mode)
        // if(data[0].selectedMode==table){
        //   setShowColumnDDL(true);
        // }
        setTable(data[0].table)
        setColumn(data[0].column)
        setOperation(data[0].operation)
        setDedopeColumn(data[0].dedopeColumn)
        setCreateOutputTable(data[0].createOutputTable)
        setQuery(data[0].query)
        setPipelineStepName(data[0].name)
        setPipelineStepName(data[0].name)
        // setRecord(data);
      } catch (error) {
        console.error(`Error fetching record with ID ${id}`, error);
      }
    };

    if (id && (mode === 'edit' || mode === 'view')) {
      fetchgetPipelineStepById();
    }
    fetchPipeline();
    fetchTable();
    
  }, [id, mode]);
 

  const fetchPipeline = async () => {
    try {
      const data = await apiPL.getPipelineById(pipelineId);
      console.log('pipelinesData', data)
      setPipelineName(data[0].name)
    } catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };

  const fetchTable = async () => {
    try {
      const data = await apiDb.getAllTables();
      console.log('fetchTable', data)
      const objList = [];
      if (data && data.length > 0) {
        data.map((item) => {
          objList.push({
            value: item.tablename,
            label: item.tablename
          })
        });
      setTableList(objList);
    }
    } 
    catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };


  const fetchColumnsByTable = async (tableName) => {
    try {
      const data = await apiDb.getAllColumnsByTable(tableName);
      console.log('fetchColumnsByTable', data)
      const objList = [];
      const objArr = [];
      if (data && data.length > 0) {
        data.map((item) => {
          objList.push({
            value: item.column_name,
            label: item.column_name
          })
          objArr.push(item.column_name)
        });
      console.log('objArr', objArr)
      // setColumnList(objList);
      setColumnArr(objArr);
      setLeft(objArr);
    }
    } catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };


  const fatchDateTimeFieldsByTable = async (tableName) => {
    try {
      const data = await apiDb.deleteDataGetDtFields(tableName);
      console.log('fatchDateTimeFieldsByTable', data)
      const objList = [];
      const objArr = [];
      if (data && data.length > 0) {
        data.map((item) => {
          objList.push({
            value: item.column_name,
            label: item.column_name
          })
          objArr.push(item.column_name)
        });
      console.log('objArr 22', objArr)
      setColumnList(objList);
      // setColumnArr(objArr);
    }
    } catch (error) {
      console.error('Error fetching pipelines', error);
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (mode === 'view') {
      return;
    }
    if (!pipelineStepName || pipelineStepName == '') {
      alert('Name should not be empty!')
      return;
    }
    try {
      const dataObj = {
        pipelineId: pipelineId,
        name: pipelineStepName,
        startDate: convertToCustomFormat(startdate),
        endDate: convertToCustomFormat(enddate),
        mode: selectedMode,
        table: table,
        column: column,
        operation: operation,
        dedopeColumn: right.join(),
        createOutputTable: createOutputTable,
        query: query,
      };
      if (id && mode === 'edit') {
        const obj = await apiPLS.updatePipelineStep(id, dataObj);
        console.log('record updated successfully', obj)
        router.push('/pipeline-step/[pipelineId]/access',
          `/pipeline-step/${pipelineId}/access`)
      } else {
        const obj = await apiPLS.createPipelineStep(dataObj);
        console.log('record saved successfully', obj)
        router.push('/pipeline-step/[pipelineId]/access',
          `/pipeline-step/${pipelineId}/access`)
      }
    } catch (error) {
      console.error('Error saving record', error);
    }
  };

  const handleStartdateChange = (newValue) => {
    setStartDate(newValue);
    console.log('setStartdate', newValue)
  };

  const handleEnddateChange = (newValue) => {
    setEndDate(newValue);
    console.log('setEndDate', newValue)
  };

  // Transfer List Events
  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(columnArr);
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log('newChecked',newChecked,right)
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    // <div>
    //  <h1>Pipeline Title: {pipelineName}</h1>
    //   <h2>
    //     {mode === 'edit' ? 'Edit Pipeline Step' :
    //       mode === 'view' ? 'View Pipeline Step'
    //         : 'Create Pipeline Step'}
    //   </h2>
    //   <form onSubmit={handleSave}>
    //     <label>
    //       Name:
    //       <input
    //         type="text"
    //         value={pipelineStepName}
    //         onChange={(e) => setPipelineStepName(e.target.value)}
    //         readOnly={mode === 'view'}
    //       />
    //     </label>
    //     {mode !== 'view' && <button type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>}
    //   </form>
    // </div>

    <div className={styles.addPipeline}>
      <h2>
        {mode === 'edit' ? 'Edit Pipeline Step' :
          mode === 'view' ? 'View Pipeline Step'
            : 'Create Pipeline Step'}
       &nbsp;{'for'}  <strong> {pipelineName}</strong>
      </h2>

      <br />
      <br />
      <form onSubmit={handleSave}>
        <label>
          Name:
        </label>
        <input
          className='form-control'
          type="text"
          value={pipelineStepName}
          onChange={(e) => setPipelineStepName(e.target.value)}
          readOnly={mode === 'view'}
          required
        />
        <br />

        <label>
          Mode:
        </label>
        <FormControl component="fieldset">
          <FormLabel component="legend"></FormLabel>
          <RadioGroup
            aria-label="mode"
            name="mode"
            value={selectedMode}
            onChange={handleModeChange}
            row
          >
            <FormControlLabel value="table" control={<Radio />} label="Table" />
            <FormControlLabel value="sql" control={<Radio />} label="Sql" />
          </RadioGroup>

          {/* Table Mode Div */}
          {showDiv1 && (
            <div>
               {/* Table */}
               {/* <FormControl fullWidth sx={{ marginBottom: '20px', marginTop: '20px'}} >
                  <InputLabel id="demo-simple-select-label">Select Table</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTable}
                    onChange={handleTableChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="option1">Table 1</MenuItem>
                    <MenuItem value="option2">Table 2</MenuItem>
                    <MenuItem value="option3">Table 3</MenuItem>
                  </Select>
                </FormControl> */}
                <br/>
              <GenericDropdown
                label="Select Table"
                defaultValue={table}
                options={tableList}
                disabled={false} // Set to true to disable the dropdown
                onChange={(e) => {
                  handleTableChange(e)
                  console.log('e',e)
                }}
                style={{ marginTop: '5px' }}
              />

                {/* Column */}
                {showColumnDDL && (
                // <FormControl fullWidth  sx={{ marginBottom: '20px'}}>
                // <InputLabel id="demo-simple-select-label">Select Column</InputLabel>
                // <Select
                //   labelId="demo-simple-select-label"
                //   id="demo-simple-select"
                //   value={selectedColumn}
                //   onChange={handleColumnChange}
                // >
                //   <MenuItem value="option1">Column 1</MenuItem>
                //   <MenuItem value="option2">Column 2</MenuItem>
                //   <MenuItem value="option3">Column 3</MenuItem>
                // </Select>
                // </FormControl>
<><br/><br/>
                <GenericDropdown
                label="Select Column"
                defaultValue={column}
                options={columnList}
                disabled={false} // Set to true to disable the dropdown
                onChange={(e) => {
                  handleColumnChange(e)
                  console.log('e',e)
                }}
                style={{ marginTop: '5px' }}
                /></>
                )}

                
                {/* Operation */}
                
                 {showOperationDDL && (
                // <FormControl fullWidth  sx={{ marginBottom: '20px'}}>
                // <InputLabel id="demo-simple-select-label">Select Operation</InputLabel>
                // <Select
                //   labelId="demo-simple-select-label"
                //   id="demo-simple-select"
                //   value={selectedOperation}
                //   onChange={handleOperationChange}
                // >
                //   <MenuItem value="">None</MenuItem>
                //   <MenuItem value="remove_nulls">Remove NULLS</MenuItem>
                //   <MenuItem value="dedope">Dedope</MenuItem>
                // </Select>
                // </FormControl>
              <><br/><br/>
                <GenericDropdown
                label="Select operation"
                defaultValue={operation}
                options={operationList}
                disabled={false} // Set to true to disable the dropdown
                onChange={(e) => {
                  handleOperationChange(e)
                  console.log('e',e)
                }}
                style={{ marginTop: '5px' }}
              /></>
                )}


                {/* Dedope Column List */}
                {showDedopeColumnList && (
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item>{customList('Choices', left)}</Grid>
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                      >
                        &lt;
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item>{customList('Chosen', right)}</Grid>
                </Grid>
                )}
              <FormControlLabel control={
                <Checkbox defaultChecked
                  defaultValue={createOutputTable}
                  onChange={(e) => {
                    setCreateOutputTable(e.target.checked)
                    console.log('setCreateOutputTable', e.target.checked)
                  }
                  }
                />
              } label="Create Output Table"
              />

              </div>
          )}
          
          {/* SQL Mode Div */}
          {showDiv2 && (
            <div>
                 <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
                    <Grid item xs={6}>
                      <TextField
                        id="start-date"
                        label="<Start Date>"
                        fullWidth
                        defaultValue={startdate}
                        disabled // Make the field read-only
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="end-date"
                        label="<End Date>"
                        fullWidth
                        defaultValue={enddate}
                        disabled // Make the field read-only
                      />
                    </Grid>
                  </Grid>
                     
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <DateTimePicker
                    label="Start Date"
                    value={startDate}
                    // disabled={true}
                    onChange={handleStartdateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DateTimePicker
                    label="End Date"
                    value={endDate}
                    // disabled={true}
                    onChange={handleEnddateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
              </LocalizationProvider> */}
                  <FormControl fullWidth sx={{ marginBottom: '10px'}} >
                    <FormLabel htmlFor="textarea">Query</FormLabel>
                    <TextareaAutosize
                      id="textarea"
                      minRows={6}
                      maxRows={20}
                      placeholder="Enter your query here"
                      style={{ width: '500px', resize: 'vertical' }}
                    />
                  </FormControl>

                  <div style={{ float: 'right', marginBottom: '10px' }}>
                  <button
                    onClick={() => {
                      router.push('/pipeline-step/[pipelineId]/access',
                          `/pipeline-step/${pipelineId}/access`)
                  }}>
                    Execute
                  </button>
                  </div>
            </div>
          )}
        </FormControl>

        <br />

        <div style={{ float: 'right' }}>
          {mode !== 'view' && <button
            className={styles.addButton}
            type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>}
          <button
            className={styles.backButton}
            onClick={() => {
              router.push('/pipeline-step/[pipelineId]/access',
                  `/pipeline-step/${pipelineId}/access`)
          }}>
            Back
          </button>
        </div>

      </form>
    </div>
  );
};

export default ViewPage;
