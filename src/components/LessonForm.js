
import axios from "axios";
import AuthService from "../services/auth.service";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import Form from "react-validation/build/form";
import UploadService from "../services/UploadService";
import 'react-tabs/style/react-tabs.css';
import { Button, ButtonGroup, ButtonToolbar } from '@trendmicro/react-buttons';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import { Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

const API_URL = "http://localhost:8080/";

  const currentUser = AuthService.getCurrentUser()
  const showAdminBoard = currentUser ? currentUser.roles.includes("ROLE_ADMIN") : false
  const showUserBoard = currentUser ? currentUser.roles.includes("ROLE_USER") : false
  const showMentorBoard = currentUser ? currentUser.roles.includes("ROLE_LECTURER") : false
  const showStudentBoard = currentUser ? currentUser.roles.includes("ROLE_STUDENT") : false

export default function LessonForm({handleClose, handleUpdate, courseId, lessonId}){

  const location = useLocation();
  const token = AuthService.getCurrentJwt()
  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };
  const [range, setRange] = React.useState(null);


  const [checkedFiles, setcheckedFiles] = useState(false);

  const [checkedVideo, setcheckedVideo] = useState(false);

  const [users, setUsers] = useState([]);

  const [res, setRes] = React.useState([]);
  const [newRes, setNewRes] = React.useState([]);



  const handleCheckedFiles = () => {
    setcheckedFiles(!checkedFiles);
  };

  const handleCheckedVideo = () => {
    setcheckedVideo(!checkedVideo);
  };

  
  const selectedChange = (ev) => {
      setLesson({
        ...lesson,
        userIds: ev.value
      })
     };

  const [lesson, setLesson] = useState({
      courseId: courseId,
      title: "",
      description: "",
      dateStart: null,
      dateEnd: null,
      userIds: "",
      id: lessonId,
      resourceDtos: []
  });


  const changeRes = (ev, newData) => {
    const isChecked = ev.target.checked; // Получаем текущее значение чекбокса
  
    if (newRes.includes(newData)) {
      // Если данные уже есть, удаляем их из массива
      const updatedData = newRes.filter((item) => item !== newData);
      setNewRes(updatedData);
      setLesson((prevState) => ({
        ...prevState,
        resourceDtos: updatedData,
      }));
    } else {
      // Если данных нет, добавляем их в массив
      const updatedData = [...newRes, newData];
      setNewRes(updatedData);
      setLesson((prevState) => ({
        ...prevState,
        resourceDtos: updatedData,
      }));
    }
   
    ev.target.checked = !isChecked; // Инвертируем значение чекбокса
  };

  const [video, setvideo] = useState({
    courseId: courseId,
    lessonId: 0,
    extension:""
  });

  const [files, setFiles] = useState({
      selectedFiles: undefined,
      selectVideoFile: undefined,
      videoLink: "",
      currentFile: undefined,
      progress: 0,
      message: '',
      fileInfos: [],

  });

  const uploadVideo = (link) => {
    let currentFile = files.selectVideoFile[0];

    setFiles({
      ...files,
      progress: 0,
      currentFile: currentFile,
    });

      UploadService.uploadVideo(currentFile, link)
      .then((response) => {
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
        handleClose();
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

  useEffect(() => {

    axios.get("http://localhost:8080/lessons/"+lessonId,
    {
          headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
      },
    ).then((response) => {
      setLesson(
        {
            id: lessonId,
            courseId: courseId,
            title: response.data.title,
            description: response.data.description,
            dateStart: response.data.dateStart,
            dateEnd: response.data.dateEnd,
            resourceDtos: response.data.resourceDtos,
            userIds: response.data.mentors?.map((item)=>{
                return item.uuid;
            })
        },
        setRes(response.data.resourceDtos),
        setNewRes(response.data.resourceDtos)
      );
    });

    const userData = [];
    getUsers(courseId)
    .then(response =>
      setUsers(response.data?.map((items) => {
         return {text: items.firstname +" "+ items.lastname, value: items.uuid}
  })
    ))
    .then(setUsers(userData))
    .then(console.log(users))
  }, []);


  const upload = (id) => {
    let currentFile = files.selectedFiles;

    setFiles({
      ...files,
      progress: 0,
      currentFile: currentFile,
    });
      UploadService.uploadFiles(currentFile, API_URL + "lessons/upload-files/"+courseId+"/" + id, (event) => {
        setFiles({
          ...files,
          progress: Math.round((100 * event.loaded) / event.total), 
        });
    })
      .then((response) => {
        setFiles({
          ...files,
          message: response.data.message,
        });
        handleClose();
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


  const selectVideoFile = (ev) => {
    setFiles({
      ...files,
      selectVideoFile: ev.target.files,
    });
  }

  const pickerChange = (ev) => {
    setRange(ev.value);
    const rangeLocal = ev.value;

    console.log(ev.value)
    setLesson({
      ...lesson,
      dateStart: rangeLocal[0],
      dateEnd: rangeLocal[1]
    })
}
  const handleChange = (e) => {
    const value = e.target.value;
    setLesson({
      ...lesson,
      [e.target.name]: value
    });
  };

  function getExtension(filename) {
    return filename.split('.').pop()
  }

  const postLesson = (e) => {
    e.preventDefault();
    const lessonData = lesson;
    axios.post(API_URL + "lessons", lessonData,config)
    .then((response) => {
      const LessId = response.data;
      if(checkedFiles){
        if(files.selectedFiles && files.selectedFiles.length!==0){
        upload(LessId);
        handleClose();
        }
      } else {
        handleClose();
      }

      if(checkedVideo){
        if(files.selectVideoFile.length!==0){
        let ext= getExtension(files.selectVideoFile[0].name);
        setvideo(
          {
            extension: ext,
            lessonId: LessId,
            courseId: courseId
          }
        )
        getLinkForUploadVideo(LessId,ext).then((res)=>
          uploadVideo(res.data)
        );
      }
    } else {
      handleClose();
    }
    });
  };

  const getLinkForUploadVideo = (lessonId, ext) => {
    const response = axios.get("http://localhost:8080/upload/presigned-aws-url/" + video.courseId + "/" + lessonId + "/" + ext,
      config
    );
    setFiles({
      ...files,
      videoLink: response.data
    });
    return response
  };

const getUsers = (id) => {
  const response = axios.get("http://localhost:8080/users/mentors/"+id,
    config
  );
  return response;
}

  return(
      <Page >
            <div className="mbsc-grid mbsc-grid-fixed scroll">
                <div className="mbsc-form-group">
                  <Form  
                    onSubmit={postLesson}
                      >
                    <div className="mbsc-row mbsc-justify-content-center">
                        <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                            <div className="mbsc-form-group-title">Форма создания занятия</div>
                            <div className="mbsc-row">
                              <input hidden type="text "></input>
                                <div className="mbsc-col-md-12 mbsc-col-12">
                                    <Input onChange={handleChange}
                                    name="title" type="text"
                                    label="Название" placeholder="Название"
                                    inputStyle="box" labelStyle="floating" 
                                    value={lesson.title}
                                    />
                                </div>
                            </div>
                            <div className="mbsc-row">
                                <div className="mbsc-col-md-12 mbsc-col-12">
                            <Datepicker
                            label="Временные рамки" placeholder="Временные рамки"
                            labelStyle="floating"
                            controls={['calendar', 'time']}
                            name="dateRange"
                            select="range"
                            inputStyle="box"
                            touchUi={true}
                            onChange={pickerChange}
                            value = {[lesson.dateStart,lesson.dateEnd]}
                            />
                            </div>
                            </div>  

                            <div className="mbsc-row">
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Select
                                    placeholder="Менторы"
                                    data={users}
                                    selectMultiple={true}
                                    touchUi={false}
                                    inputStyle="box"
                                    onChange={selectedChange}
                                    filter = {true}
                                    value = {lesson.userIds}
                                />
                                </div>
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Textarea with left icon" label="Description"
                                 onChange={handleChange}
                                 value={lesson.description}
                                 ></Textarea>
                                </div>

                                <div className="mbsc-col-md-6 mbsc-col-6"><input type="checkbox"
                                checked={checkedFiles}
                                  onChange={handleCheckedFiles}
                                /> <spa>Добавить файлы</spa>
                                { checkedFiles && (
                                <><div className="mbsc-col-md-12 mbsc-col-10">
                        <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select text files..." label="Files upload"></Input>
                      </div><span>Ресурсы: </span><div>
                          {res?.map((items) => {
                            return (<>
                              <input
                                onChange={(ev) => changeRes(ev, items)} type="checkbox"
                                checked={newRes.includes(items)}
                              ></input>
                              <a href={items.url}>
                                {items.filename}</a><br /></>);
                          })}
                        </div></>
                          )} </div> 
                         <div className="mbsc-col-md-6 mbsc-col-6"><input type="checkbox"
                                checked={checkedVideo}
                                  onChange={handleCheckedVideo}
                                /> <spa>Добавить видео</spa>
                                { checkedVideo && (
                               <div className="mbsc-col-md-12 mbsc-col-10">
                               <Input onChange={selectVideoFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select video files..." label="Video upload"></Input>
                               </div>
                          )} </div> 
                            </div>
                            <Button 
                              type="submit">Save</Button>
                        </div>  
                    </div>
                    </Form>
                </div>
            </div>
        </Page>
  );
}
