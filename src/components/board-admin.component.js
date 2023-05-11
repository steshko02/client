import EventBus from "../common/EventBus";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { useEffect, useState,useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from "../services/Pagination";
import axios from "axios";
import http from "../http-common";
import AuthService from "../services/auth.service";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Helper from "../services/Helper"
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Stack } from "@mui/material";

let PageSize = 6;
export default function BoardAdmin() {
 
  const token = AuthService.getCurrentJwt()


  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
});
const [post, setPost] = useState([]);
const [addLesson, setaddLesson] = useState(0);
const [filter, setFilter] = useState('ALL');

const config = {
  headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
};

const handleUpdate = (obj) => {
  setaddLesson(addLesson+obj);
};

  useEffect(() => {
    axios.get("http://localhost:8080/bookings/all/",
    {
      params: {
        "number": pagination.currentPage-1,
        "size": PageSize
      },
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    },

    ).then((response) => {
      setPost(response.data.bookings);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      });
      setaddLesson(response.data.totalCount);
    });
  },  
[pagination.currentPage, addLesson,filter]);

    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
      <Tabs>
      <TabList>
        <Tab>Заявки на курсы</Tab>
        <Tab>Список пользователей</Tab>
      </TabList>
      <TabPanel>
         <CollapsibleTable data = {post} handleUpdate={handleUpdate}/>
         <Pagination
        className="pagination-bar fixed"
        currentPage= {pagination.currentPage}
        totalCount= {pagination?.totalCount}
        pageSize= {PageSize}
        onPageChange={page => setPagination({
            ...pagination,
          currentPage: page })} />
      </TabPanel>
      <TabPanel>
      </TabPanel>
    </Tabs>
    </div>
    );
  }
  
function Row({rowData, handleUpdate}) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} id={rowData.id}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{rowData.id}</TableCell>
        <TableCell>{Helper.dateByFormat(rowData.dateCreation)}</TableCell>
        <TableCell><a href="#">{rowData.course.title}</a></TableCell>
        <TableCell><a href="#">{rowData.user.firstname + " "+ rowData.user.lastname}</a></TableCell>
        <TableCell>{Helper.statusByFormat(rowData.status)}</TableCell>
        <TableCell><div><MenuListComposition id={rowData.id} handleUpdate ={handleUpdate}/></div></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Пользователь
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell >Id пользователя</TableCell>
                    <TableCell >Id курса</TableCell>
                    <TableCell >Email</TableCell>
                    <TableCell >Свободных мест/всего мест</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={rowData.user.uuid}>
                      <TableCell component="th" scope="row">
                        {rowData.user.uuid}
                      </TableCell>
                      <TableCell>{rowData.course.id}</TableCell>
                      <TableCell >{rowData.user.email}</TableCell>
                      <TableCell>
                        {rowData.course.count ==='null' ? 0 +"/"+rowData.course.size: rowData.course.count +"/"+rowData.course.size}
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

 function CollapsibleTable({data,handleUpdate}) {

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
          <TableCell />
            <TableCell>ID заявки</TableCell>
            <TableCell>Время</TableCell>
            <TableCell>Курс</TableCell>
            <TableCell>Пользователь</TableCell>
            <TableCell>Статус заявки</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <Row rowData={row} handleUpdate = {handleUpdate} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
const API_URL = "http://localhost:8080/";

 function MenuListComposition({id, handleUpdate}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const token = AuthService.getCurrentJwt()

  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };

  // const approve = () => {
  //   const response = axios.post(API_URL + "bookings/approve/"+id,config);
  // };

  const approve = () =>{
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();

    var config = {
      method: 'post',
      url: 'http://localhost:8080/bookings/approve/'+id,
      headers: { 
        'Authorization' : `Bearer ${token}`
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      handleUpdate();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const canceled = () =>{
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();

    var config = {
      method: 'post',
      url: 'http://localhost:8080/bookings/canceled/'+id,
      headers: { 
        'Authorization' : `Bearer ${token}`
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      handleUpdate();
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (ev) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(ev.target)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={1}>
      <div>
      <Button
      ref={anchorRef}
      id="composition-button"
      aria-controls={open ? 'composition-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={handleToggle}
    >
      Выполнить
    </Button>
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={approve}>Подтвердить</MenuItem>
                  <MenuItem onClick={canceled}>Отклонить</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      </div>
      </Stack>
  );
}