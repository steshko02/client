import axios from "axios";
import AuthService from "../services/auth.service";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Button, Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import UploadService from "../services/UploadService";

const API_URL = "http://localhost:8080/";
 export default function WorkForm({handleUpdate, handleClose, lessId, courseId}){

    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };
    const [deadline, setDeadline] = React.useState(null);
    
    const [work, setWork] = useState({
        workId:"",
        lessonId: lessId,
        title: "",
        description: "",
        deadline: null,
        resource: []
    });
  
    const [res, setRes] = React.useState([]);
    const [newRes, setNewRes] = React.useState([]);
    const [workUpdate, setWorkUpdate] = React.useState(0);

    const changeRes = (ev, newData) => {
      const isChecked = ev.target.checked; // Получаем текущее значение чекбокса
    
      if (newRes.includes(newData)) {
        // Если данные уже есть, удаляем их из массива
        const updatedData = newRes.filter((item) => item !== newData);
        setNewRes(updatedData);
        setWork((prevState) => ({
          ...prevState,
          resource: updatedData,
        }));
      } else {
        // Если данных нет, добавляем их в массив
        const updatedData = [...newRes, newData];
        setNewRes(updatedData);
        setWork((prevState) => ({
          ...prevState,
          resource: updatedData,
        }));
      }
     
      ev.target.checked = !isChecked; // Инвертируем значение чекбокса
    };

    useEffect(() => {
        axios.get("http://localhost:8080/works/byLesson/"+lessId,
        {
              headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
          },
        ).then((response) => {
          console.log(response.data);
          setWork(
            {
            workId : response.data.id,
            title: response.data.title,
            description: response.data.description,
            deadline: response.data.deadline,
            lessonId: lessId,
            resource: response.data.resource
            },
            setRes(response.data.resource),
            setNewRes(response.data.resource)
          );
        });
      },
  [workUpdate]);
  
    const [files, setFiles] = useState({
        selectedFiles: undefined,
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
        UploadService.uploadFiles(currentFile, API_URL + "works/upload-files/"+courseId+"/" + lessId +"/"+ id, (event) => {
          setFiles({
            ...files,
            progress: Math.round((100 * event.loaded) / event.total),
          });
          
      })
        .then((response) => {
          handleClose();
          setFiles({
            ...files,
            message: response.data.message,
          });
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
  
    const pickerChange = (ev) => {
      setDeadline(ev.value);
      setWork({
        ...work,
        deadline: ev.value
      })
  }
    const handleChange = (e) => {
      const value = e.target.value;
      setWork({
        ...work,
        [e.target.name]: value
      });
    };

    const postWork = (e) => {
      e.preventDefault();
      const workData = work;
      axios.post(API_URL + "works", workData, config)
      .then((response) => {
        const workId = response.data;
        setWork({
          ...work,
          workId: workId
        })
      if( files.selectedFiles && files.selectedFiles.length!==0 ){
          upload(workId);
          handleClose();
      }         handleClose();

      }
      );
      
    };
  
    return(
        <Page>
              <div className="mbsc-grid mbsc-grid-fixed">
                  <div className="mbsc-form-group">
                    <Form  
                      onSubmit={postWork}
                        >
                      <div className="mbsc-row mbsc-justify-content-center scroll">
                          <div className="mbsc-col-md-1 mbsc-col-xl-8 mbsc-form-grid">
                              <div className="mbsc-form-group-title">Форма создания задания</div>
                              <div className="mbsc-row">
                                <input hidden type="text "></input>
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                                      <Input onChange={handleChange}
                                      name="title" type="text"
                                      label="Название" placeholder="Название"
                                      inputStyle="box" labelStyle="floating" 
                                      value={work.title}/>
                                  </div>
                              </div>
                              <div className="mbsc-row">
                                  <div className="mbsc-col-md-12 mbsc-col-12">
  
                              <Datepicker
                                  label="Дедлайн" placeholder="Дедлайн"
                                  labelStyle="floating"
                                  name="deadline"
                                  inputStyle="box"
                                  controls={['calendar', 'time']}
                                  touchUi={true}
                                  onChange={pickerChange}
                                  value={work.deadline}
                              />
                              </div>
                            
                              </div>  
  
                              <div className="mbsc-row">
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Textarea name="description" inputStyle="box" 
                                   labelStyle="stacked" startIcon="pencil"
                                   placeholder="Textarea with left icon" label="Description"
                                   onChange={handleChange}
                                   value={work.description}
                                   ></Textarea>
                                  </div>
                                 
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                                  <Input  onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select text files..." label="Files upload"></Input>
                                  </div>
                                  <div>
                                {res &&
                                  <><span>Ресурсы: </span><div>
                                    {res?.map((items) => {
                                      return (<>
                                      <input 
                                       onChange={(ev) => changeRes(ev,items)} type="checkbox"
                                       checked={newRes.includes(items)}
                                       ></input>
                                      <a href={items.url}>
                                        {items.filename}</a><br /></>);
                                    })}
                                  </div></>
                                }
                                  </div>
                              </div>
                              <Button 
                                type="submit">Сохранить</Button>
                          </div>  
  
                      </div>
                      </Form>
                  </div>
              </div>
          </Page>
    );
  }
