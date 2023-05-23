import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { useEffect, useState,useMemo } from 'react';
import Pagination from "../services/Pagination";
import axios from "axios";
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
import Modal from "react-overlays/Modal";
import WorksTable from "./WoksTable";
import WorkForm from "./WorkForm"
import LessonForm from './LessonForm';
import {Input, Page, setOptions,Textarea,Datepicker } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

let PageSize = 3;
export default function BoardMentors() {
 
  const token = AuthService.getCurrentJwt()

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
});
const [post, setPost] = useState([]);
const [addLesson, setaddLesson] = useState(0);
const [filter, setfilter] = useState({
  course: ''
});

const config = {
  headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
};

const handleUpdate = (obj) => {
  setaddLesson(addLesson+obj);
};

  useEffect(() => {
    axios.get("http://localhost:8080/courses/byRole",
    {
      params: {
        "number": pagination.currentPage-1,
        "size": PageSize,
        "role": 'LECTURER'
      },
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    },

    ).then((response) => {
      setPost(response.data.courses);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      });
      setaddLesson(response.data.totalCount);
    });
  },  
[pagination.currentPage, addLesson,filter]);

const handleChange = (e) => {
  const value = e.target.value;
  setfilter({
    ...filter,
    [e.target.name]: value
  });
};

    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
      <Tabs>
      <TabList>
        <Tab>Ваши занятия</Tab>
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
        <TableCell><a>{rowData.title}</a></TableCell>
        <TableCell>{Helper.statusByFormat(rowData.status)}</TableCell>
        <TableCell>{Helper.dateByFormat(rowData.dateStart)} - {Helper.dateByFormat(rowData.dateEnd)}</TableCell>
        <TableCell>{rowData.mentors?.map((item) => (
            <><a href="#">{item.firstname} {item.lastname}</a><br /></>
          ))}</TableCell>
      
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
                    <TableCell ><b>Занятие</b></TableCell>
                    <TableCell ><b>Статус</b></TableCell>
                    <TableCell ><b>Время прохождения занятия</b></TableCell>
                    <TableCell ><b>Менторы</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowData.lessons?.map((item) => (
                   <TableRow key={item.id}>
                   <TableCell component="th" scope="row">
                   {item.title}
                   </TableCell>
                   <TableCell>{Helper.statusByFormat(item.status)}</TableCell>
                   <TableCell >{Helper.dateByFormat(item.dateStart)} - {Helper.dateByFormat(item.dateEnd)}</TableCell>
                   <TableCell>{item.mentors?.map((item) => (
                    <><a href="#">{item.firstname} {item.lastname}</a><br /></>
                  ))}</TableCell>
                    <TableCell><div><MenuListComposition courseId={rowData.id} id={rowData.id} lessId ={item.id} handleUpdate ={handleUpdate}/></div></TableCell>
                 </TableRow>  
                  ))}
                  
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
            <TableCell><b>Курс</b></TableCell>
            <TableCell><b>Статус</b></TableCell>
            <TableCell><b>Время</b></TableCell>
            <TableCell><b>Менторы</b></TableCell>
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

 function MenuListComposition({courseId,lessId, handleUpdate}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const token = AuthService.getCurrentJwt()
  const [showModal, setShowModal] = useState(false);
  const [showWorkModal, setshowWorkModal] = useState(false);
  const [selectLesson, setSelectLesson] = useState(0);
  const [showLessonModal, setshowLessonModal] = useState(false);


  console.log(lessId);

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;
  const props1 = { placeholder: 'Please Select...', label: 'Calendar' };

  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };

  const canceled = () =>{
    setshowWorkModal(true);
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setSelectLesson(lessId);
  };


  var handleCloseModal = () => setShowModal(false);

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
    <> 
     <section style={{ backgroundColor: '#eee' }}>
      <Modal
      className="modal"
      show={showModal}
      onHide={() => setShowModal(false)}
      renderBackdrop={renderBackdrop}
    >
      <div className='scroll' >
        <div className="modal-header modal-header">
          <div className="modal-title modal-title">Modal Heading</div>
          <div>
            <span className="close-button course" onClick={() => setShowModal(false)}>
              x
            </span>
          </div>
        </div>
        <WorksTable lessonId ={lessId} />
      </div>
  
    </Modal>

      <Modal
      className="modal"
      show={showWorkModal}
      onHide={() => setshowWorkModal(false)}
      renderBackdrop={renderBackdrop}
    >
      <div className='scroll' >
        <div className="modal-header modal-header">
          <div className="modal-title modal-title">Форма задания</div>
          <div>
            <span className="close-button course" onClick={() => setshowWorkModal(false)}>
              x
            </span>
          </div>
        </div>
        <WorkForm courseId= {courseId} handleClose ={() => setshowWorkModal(false)} lessId ={lessId} />
      </div>
  
    </Modal>

    <Modal
      className="modal"
      show={showLessonModal}
      onHide={() => setshowLessonModal(false)}
      renderBackdrop={renderBackdrop}
    >
      <div className='scroll' >
        <div className="modal-header modal-header">
          <div className="modal-title modal-title">Форма занятия</div>
          <div>
            <span className="close-button course" onClick={() => setshowLessonModal(false)}>
              x
            </span>
          </div>
        </div>
        <LessonForm  courseId= {courseId} handleClose ={() => setshowLessonModal(false)} handleUpdate={handleUpdate} lessonId ={lessId} />
      </div>
  
    </Modal>

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
            Изменить
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
                      <MenuItem onClick={() => setShowModal(true)}>Выполненные работы</MenuItem>
                      <MenuItem onClick={() => setshowLessonModal(true)}>Изменить занятие</MenuItem>
                      <MenuItem onClick={canceled}>Изменить задание</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Stack>
      </section>
      </>
  );
}

function WithLinks({text}) {

  var res = []
  
  text && text.replace(/((?:https?:\/\/|ftps?:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,})|(\n+|(?:(?!(?:https?:\/\/|ftp:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}).)+)/gim, (m, link, text) => {
    res.push(link ? <a href={(link[0]==="w" ? "//" : "") + link} key={res.length}>{link}</a> : text)
  })

  return <div className="user-text">{res}</div>
}