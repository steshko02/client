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
import Paper from '@mui/material/Paper';
import Form from "react-validation/build/form";
import "./status.css"
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress, MDBProgressBar, MDBIcon,MDBListGroup,MDBListGroupItem, MDBCardLink
} from 'mdb-react-ui-kit';
import { Button, Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
const API_URL = "http://localhost:8080/";

let PageSize = 10;
export default function WorksTable({lessonId}) {

    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    const [data, setdata] = useState('');
    const [openFilter, setOpenFilter] = useState(false);

    const [addLesson, setaddLesson] = useState(0);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
    });
    
    const [filter, setfilter] = useState({
      user: '',
      status: ''
    });
    
    const handleUpdate = (obj) => {
        setaddLesson(addLesson+obj);
      };
      
      const handleChange = (e) => {
        const value = e.target.value;
        setfilter({
          ...filter,
          [e.target.name]: value
        });
      };

    useEffect(() => {
        axios.get("http://localhost:8080/answer/byLesson/"+lessonId,
        {
            params: {
              "number": pagination.currentPage-1,
              "size": PageSize,
              "user": filter.user,
              "status": filter.status
            },
            headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
          },
        ).then((response) => {
          console.log(response.data);
          setdata(response.data);
          setPagination({
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
            totalCount: response.data.totalCount
          });
          setaddLesson(response.data.answers.length);
        });
      },
  [pagination.currentPage, addLesson,filter]);

    return (
      <>
      <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenFilter(!openFilter)}
            className = "left-filter-button"
          >   Поиск
            {openFilter ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Collapse in={openFilter} timeout="auto" unmountOnExit>
           <div className="filter">
           <span> Пользователь </span><input name="user" onChange={handleChange}></input>
            <span> Статус </span><select name="status" onChange={handleChange}>
            <option value="All">Все</option>
              <option value="DURING">В срок</option>
              <option value="FINISHED">Просрочено</option>
            </select>
           </div>
           </Collapse>
      
        <div className="scroll-605">
      <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell><b><span>Ученик</span></b></TableCell>
                        <TableCell><b>Статус</b></TableCell>
                        <TableCell><b>Задание</b></TableCell>
                        <TableCell><b>Время сдачи</b></TableCell>
                        <TableCell><b>Отметка</b></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.answers?.map((row) => (
                        <AnswerRow rowData={row} handleUpdate={handleUpdate} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer><Pagination
                className="pagination-bar fixed"
                currentPage={pagination.currentPage}
                totalCount={pagination?.totalCount}
                pageSize={PageSize}
                onPageChange={page => setPagination({
                    ...pagination,
                    currentPage: page
                })} /></div></>
    );
  }

  function AnswerRow({rowData,handleUpdate}) {
    const [open, setOpen] = React.useState(false);

    const [show, setShow] = React.useState(false);


    const [makr, setMark] = useState({
        id: 0,
        comment: rowData.result!==null? rowData.result.comment : '',
        answerId: rowData.id!==null? rowData.id : '',
        date: '',
        mark: rowData.result!==null? rowData.result.mark : ''
      });
    
      const token = AuthService.getCurrentJwt()
      const config = {
          headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
      };

    const handleChange = (e) => {
        const value = e.target.value;
        setMark({
          ...makr,
          [e.target.name]: value
        });
      };

    const postMark = (e) =>{
        e.preventDefault();
        const markData = makr;
        setShow(false);

        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        var config = {
          method: 'post',
          url: API_URL + "check_work",
          headers: { 
            'Authorization' : `Bearer ${token}`
          },
          data : markData
        };
        axios(config)
        .then((response) => {
            const respId = response.data;
            setMark({
                ...makr,
                id: respId
              });
              setShow(false);
            }
          )
          .then(resp=>handleUpdate(1));
      }
    
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
        <TableCell><a href="#">{rowData.user.firstname} {rowData.user.lastname}</a></TableCell>
          <TableCell><b><span className={rowData.timeStatus}>{Helper.statusByFormatForTask(rowData.timeStatus)}</span></b></TableCell>
          <TableCell>{rowData.workTitle}</TableCell>
          <TableCell>{Helper.dateByFormat(rowData.date)}</TableCell>
          <TableCell><b>{rowData.result &&  rowData.result.mark}</b></TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Работа
                </Typography>
                <p><WithLinks text ={rowData.comment}></WithLinks></p>              
                    {rowData.resource?.map((items) => {
                      return (<a href={items.url}>
                        {items.filename}</a>)
                    })}
                    <br/>
                    <br/>
                    <span>Комментарий:</span><br/>
                    <span><WithLinks text ={rowData.result?.comment}></WithLinks></span>   
                    {!rowData.result && <Button  onClick={() => setShow(!show)}>Оценить работу</Button>}
                    {rowData.result && <Button  onClick={() => setShow(!show)}>Редактировать отзыв к работе</Button>}
                    {show &&
                <Form  onSubmit={postMark}  >
                                <Input name="mark" 
                                onChange={handleChange} 
                                multiple inputStyle="box" labelStyle="stacked" type="number" placeholder="Отметка" label="Отметка"
                                value={makr.mark}></Input>
                                {/* </div> */}

                  <Textarea name="comment" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Комментарий" label="Комментарий к работе"
                                 value={makr.comment}
                                 onChange={handleChange}
                                 ></Textarea>
                <Button type="submit">Save</Button>
              </Form>
                }
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  function WithLinks({text}) {

    var res = []
    
    text && text.replace(/((?:https?:\/\/|ftps?:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,})|(\n+|(?:(?!(?:https?:\/\/|ftp:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}).)+)/gim, (m, link, text) => {
      res.push(link ? <a href={(link[0]==="w" ? "//" : "") + link} key={res.length}>{link}</a> : text)
    })
  
    return <div className="user-text">{res}</div>
  }