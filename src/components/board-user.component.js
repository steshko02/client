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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import AnswerForm from '../lessons/AnswerModalForm'
import "./status.css"

let PageSize = 3;
export default function BoardUser() {
 
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
    axios.get("http://localhost:8080/courses/byRole",
    {
      params: {
        "number": pagination.currentPage-1,
        "size": PageSize,
        "role": 'STUDENT'
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

    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
      <Tabs>
      <TabList>
        <Tab>Ваши курсы</Tab>
        {/* <Tab>Учебный процесс</Tab> */}
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
      {/* <TabPanel>
      </TabPanel> */}
    </Tabs>
    </div>
    );
  }
  
function Row({rowData, handleUpdate}) {
  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();

  const redirectCourse = (id,pictureUrl) => {
    nav("/course-info",{
      state: {
        itemId: id,
        img :pictureUrl ? pictureUrl :'https://ultimateqa.com/wp-content/uploads/2020/12/Java-logo-icon-1.png'
      }
      });
  };

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
        <TableCell><a href='' onClick={()=> redirectCourse(rowData.id)}>{rowData.title}</a></TableCell>
        <TableCell>{Helper.statusByFormat(rowData.status)}</TableCell>
        <TableCell>{Helper.dateByFormat(rowData.dateStart)} - {Helper.dateByFormat(rowData.dateEnd)}</TableCell>
        <TableCell>{rowData.mentors?.map((item) => (
            // <><a href="#">{item.firstname} {item.lastname}</a><br /></>
            <><Link to="/user" state={{ id: item.uuid }}>{item.firstname} {item.lastname}</Link><br /></>
          ))}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Занятия
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow >
                  <TableCell ></TableCell>
                    <TableCell ><b>Занятие</b></TableCell>
                    <TableCell ><b>Статус</b></TableCell>
                    <TableCell ><b>Время занятия</b></TableCell>
                    <TableCell ><b>Менторы</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                
                {rowData.lessons?.map((item) => (  
                    <LessonCollapsibleTable courseId={rowData.id} item={item}/>
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


function LessonCollapsibleTable({item, courseId,handleUpdate}) {

  const [open, setOpen] = React.useState(false)
  const [post, setPost] = useState('');
  const [addLesson, setaddLesson] = useState(0);
  const token = AuthService.getCurrentJwt()
  const [openCloseTask, setOpenCloseTask] = React.useState(false)
  const [openCloseWork, setOpenCloseWork] = React.useState(false)
  const [task, setTask] = useState('');
  const [changeOnOff, setChangeOnOff] = React.useState(false)

  const [showAnswerModal, setShowAnswerModal] = useState(false);
  var handleUpdateInfo = () => setaddLesson(addLesson+2);
  
  var handleAnswerClose = () => {
    handleUpdateInfo();
    setShowAnswerModal(false);
    setOpen(true)
  }
  const nav = useNavigate();

  const redirectLesson = (id) => {
    nav("/lesson",{
      state: {
        itemId: item.id,
        courseId: courseId
      }
      });
  };

  useEffect(() => {
    if(open){
    axios.get("http://localhost:8080/lessons/" + item.id,
    {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    },
    ).then((response) => {
      setPost(response.data);
      setTask(response.data.answer);
    });
    }
  },  
[addLesson, open]);

const renderBackdrop = (props) => <div className="backdrop" {...props} />;
const props1 = { placeholder: 'Please Select...', label: 'Calendar' };


  return (       
      <>
      <TableRow key={item.id}>
         <TableCell>
           <IconButton
             aria-label="expand row"
             size="small"
             onClick={() => setOpen(!open)}>
             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
           </IconButton>
         </TableCell>
         <TableCell component="th" scope="row">
           <a href='' onClick={()=>redirectLesson()}>{item.title}</a>
         </TableCell>
         {item.status === 'FINISHED' && <TableCell className='finish'>{Helper.statusByFormat(item.status)}</TableCell>}
         {item.status !== 'FINISHED' && <TableCell>{Helper.statusByFormat(item.status)}</TableCell>}
         <TableCell>{Helper.dateByFormat(item.dateStart)} - {Helper.dateByFormat(item.dateEnd)}</TableCell>
         <TableCell>{item.mentors?.map((item) => (
           <><Link to="/user" state={{ id: item.uuid }}>{item.firstname} {item.lastname}</Link><br /></>
         ))}</TableCell>
       </TableRow>
       <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
           <Collapse in={open} timeout="auto" unmountOnExit>
             <Box sx={{ margin: 1 }}>
                  {post.answer &&
                   <><>
                                  <Typography variant="h6" gutterBottom component="div">
                 Результат
               </Typography>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Статус</b></TableCell>
                    <TableCell><b>Время сдачи</b></TableCell>
                    <TableCell><b>Отметка</b></TableCell>
                    <TableCell><b>Оценил</b></TableCell>
                    <TableCell><b>Комментарий к работе</b></TableCell>
                    <MenuListComposition openCloseTask={openCloseTask} setOpenCloseTask ={setOpenCloseTask}
                                         openCloseWork = {openCloseWork} setOpenCloseWork ={setOpenCloseWork}/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><span className={post.work.status}>
                      <b>{Helper.statusByFormatForTask(post.answer.timeStatus)}</b></span>
                    </TableCell>
                    <TableCell>{Helper.dateByFormat(post.answer.date)}</TableCell>
                    <TableCell><b>{post?.checkWork?.mark}</b></TableCell>
                    <TableCell>
                      <><a href="#">{post?.checkWork?.mentor.firstname} {post?.checkWork?.mentor.lastname}</a><br /></>
                    </TableCell>
                    <TableCell>{post?.checkWork?.comment}</TableCell>
                    </TableRow>
                  </TableBody>
              </>
              </>
                  }
                  {openCloseTask &&  post.work &&
                               <Box sx={{ margin: 1 }}>
                  <>
                  <span><b>Задание: </b></span><span>{post.work.title}</span><br/>
                  <span><b>Дедлайн: </b> </span><span >{Helper.dateByFormat(post.work.deadline)}</span><br/>
                  <span><b>Статус: </b> </span><span className={post.work.status}>{Helper.statusByFormat(post.work.status)}</span><br/>
                  <span><b>Описание: </b> </span><span><WithLinks text={post.work.description}/></span><br/>
                  <span><b>Прикрепленные файлы: </b></span><br/>
                  {post.work.resource?.map((res) => (
                      <><span><a href={res.url}>{res.filename}</a></span><br/></>
                    ))}<br/><hr/>
                  </>
                  </Box>
                  }
                   {openCloseWork && post.answer &&
                        <Box sx={{ margin: 1 }}>
                        <>
                        <span><b>Ваша работа</b></span><br/>
                        <span><b>Сдано: </b></span><span>{Helper.dateByFormat(post.answer.date)}</span><br/>
                        <span><b>Статус:</b> </span><span className={post.answer.timeStatus}>{Helper.statusByFormatForTask(post.answer.timeStatus)}</span><br/>
                        <>
                          <span><b>Описание: </b></span><span><WithLinks text={post.answer.comment} /> </span><br />
                          <span><b>Прикрепленные файлы:</b></span><br />

                        {post.answer.resource?.map((res) => (
                            <><span><a href={res.url}>{res.filename}</a></span><br /></>
                          ))}<br/>

                        <Button onClick={()=> setShowAnswerModal(true)}>Изменить</Button>
                        </>
                        <>
                          <Modal
                            className="modal"
                            show={showAnswerModal}
                            onHide={handleAnswerClose}
                            renderBackdrop={renderBackdrop}
                          >
                            <div>
                              <div className="modal-header modal-header">
                                <div className="modal-title modal-title">Modal Heading</div>
                                <div>
                                  <span className="close-button course" onClick={handleAnswerClose}>
                                    x
                                  </span>
                                </div>
                              </div>

                              <AnswerForm handleAnswerClose={handleAnswerClose} handleUpdate={handleUpdateInfo} work={post.work} data={post.answer} update={true}/>

                              <div className="modal-footer course">
                                <button className="secondary-button course" onClick={handleAnswerClose}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </Modal>
                        </>
                        </>                
                        </Box>
                  }
             </Box>
           </Collapse>
         </TableCell>
         </>
  )
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


function WithLinks({text}) {

  var res = []
  
  text && text.replace(/((?:https?:\/\/|ftps?:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,})|(\n+|(?:(?!(?:https?:\/\/|ftp:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}).)+)/gim, (m, link, text) => {
    res.push(link ? <a href={(link[0]==="w" ? "//" : "") + link} key={res.length}>{link}</a> : text)
  })

  return <span>{res}</span>
}


 function MenuListComposition({lessId, setOpenCloseTask, setOpenCloseWork}) {
  const anchorRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);

  const [openTask, setOpenTask] = React.useState(false);
  const [openWork, setOpenWork] = React.useState(false);

  const workHandler = () =>{
    setOpenWork(!openWork);
    setOpenCloseWork(openWork);
  }

  const taskHandler = () =>{
    setOpenTask(!openTask)
    setOpenCloseTask(openTask);
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
            Просмотреть
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
                      <MenuItem onClick={taskHandler}>Задание</MenuItem>
                      <MenuItem onClick={workHandler}>Выполненная работа</MenuItem>
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