import axios from "axios";
import AuthService from "../services/auth.service";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress, MDBProgressBar, MDBIcon,MDBListGroup,MDBListGroupItem, MDBCardLink
} from 'mdb-react-ui-kit';
import { Button, Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import Modal from "react-overlays/Modal";
import UploadService from "../services/UploadService";
import Player from "../components/Player";
import Helper from "../services/Helper"

const API_URL = "http://localhost:8080/";
export default function AnswerForm({handleAnswerClose, handleUpdate, work, data, update}){

    const location = useLocation();
    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    const [answer, setAnswer] = useState({
        id: data?.id,
        workId: work.id,
        comment: data?.comment,
        resource: data?.resource
    });

    const [res, setRes] = React.useState([]);
    const [newRes, setNewRes] = React.useState(data?.resource);

    const changeRes = (ev, newData) => {
      const isChecked = ev.target.checked; // Получаем текущее значение чекбокса
    
      if (answer.resource.includes(newData)) {
        // Если данные уже есть, удаляем их из массива
        const updatedData =  answer.resource.filter((resource) => resource !== newData)
        // setNewRes(updatedData);
        setAnswer((prevState) => ({
          ...prevState,
          resource: updatedData,
        }));
      } else {
        // Если данных нет, добавляем их в массив
        const updatedData = [...answer.resource, newData];
        setAnswer((prevState) => ({
          ...prevState,
          resource: updatedData,
        }));
      }
     
      ev.target.checked = !isChecked; // Инвертируем значение чекбокса
    };
  
    const [files, setFiles] = useState({
        selectedFiles: undefined ,
        // data?.resource[0].url,
        selectVideoFile: undefined,
        videoLink: "",
        currentFile: undefined,
        progress: 0,
        message: '',
        fileInfos: [],
    });
  
  
    const upload = (id) => {
      let currentFile = files.selectedFiles;
  
      setFiles({
        ...files,
        progress: 0,
        currentFile: currentFile,
      });
        UploadService.uploadFiles(currentFile, API_URL + "answer/upload-files/"+ id, (event) => {
          setFiles({
            ...files,
            progress: Math.round((100 * event.loaded) / event.total),
          });
      })
        .then((response) => {
          handleAnswerClose();
          handleUpdate();
          return UploadService.getFiles();
        })
        .then((files) => {
          setFiles({
            ...files,
            fileInfos: files.data,
          });
        })
        .catch(() => {
          setFiles({
            ...files,
            progress: 0,
            message: "Could not upload the file!",
            currentFile: undefined,
          });
        });
    }
  
    const selectFile = (ev) => {
      setFiles({
        ...files,
        selectedFiles: ev.target.files,
      });
    }
  
    const handleChange = (e) => {
      const value = e.target.value;
      setAnswer({
        ...answer,
        [e.target.name]: value
      });
    };
  

  const postOrUpdateAnswer = (e) =>{
    if(!update){
      postAnswer(e);
    } else {
      updateAnswer(e);
    }
    // handleAnswerClose();
  }

  const updateAnswer = (e) =>{
    e.preventDefault();
    const answerData = answer;
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    setAnswer({
      ...answer,
      workId: work
    })

    var config = {
      method: 'put',
      url: API_URL + "answer",
      headers: { 
        'Authorization' : `Bearer ${token}`
      },
      data : answer
    };
    axios(config)
    .then((response) => {
      const answerId = response.data;
        setAnswer({
          ...answer,
          answerId: answerId
        })
          if(files.selectedFiles && files.selectedFiles.length!==0 ){
          upload(answerId);
          handleAnswerClose();
      }else{      handleAnswerClose();
      }});
  }

    const postAnswer = (e) =>{
        e.preventDefault();
        const answerData = answer;
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        setAnswer({
            ...answer,
            workId: work
          })
        var config = {
          method: 'post',
          url: API_URL + "answer",
          headers: { 
            'Authorization' : `Bearer ${token}`
          },
          data : answerData
        };
        axios(config)
        .then((response) => {
            const answerId = response.data;
            setAnswer({
              ...answer,
              answerId: answerId
            })
              if(files.selectedFiles && files.selectedFiles.length!==0 ){
               upload(answerId);
               handleAnswerClose();
          } else{
            handleAnswerClose();
          }
        });
      }
    
    return(
        <Page>
              <div className="mbsc-grid mbsc-grid-fixed">
                  <div className="mbsc-form-group">
                    <Form  
                      onSubmit={postOrUpdateAnswer}
                        >
                      <div className="mbsc-row mbsc-justify-content-center scroll">
                          <div className="mbsc-col-md-1 mbsc-col-xl-8 mbsc-form-grid">
                              <div className="mbsc-form-group-title">Форма ответа</div>
                              <div className="mbsc-row">
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Textarea name="comment" inputStyle="box" 
                                   labelStyle="stacked" startIcon="pencil"
                                   placeholder="Комментарии" label="Комментарии"
                                   onChange={handleChange}
                                   value = {answer.comment}
                                   ></Textarea>
                                  </div>
                                <input type="hidden" value={work.id}></input>
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                                  <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Выберите файлы..." label="Загрузка файлов"></Input>
                                  {newRes &&
                                  <><span className = "ml-3">Ресурсы: </span><div>
                                    {newRes?.map((items) => {
                                      return (<>
                                      <input 
                                       className = "ml-3"
                                       onChange={(ev) => changeRes(ev,items)} type="checkbox"
                                       checked={answer.resource.includes(items)}
                                       ></input>
                                      <a href={items.url}>
                                        {items.filename}</a><br /></>);
                                    })}
                                  </div></>
                                }
                                  </div>
                              </div>
                              <Button 
                               disabled={answer.comment==="" || !answer.comment}
                                type="submit">Сохранить</Button>
                          </div>  
                      </div>
                      </Form>
                  </div>
              </div>
          </Page>
    );
  }
  