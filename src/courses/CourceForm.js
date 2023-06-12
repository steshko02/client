import axios from "axios";
import "./modal.css";
import http from "../http-common";
import AuthService from "../services/auth.service";
import React, { useEffect, useState, useRef } from 'react';
import "./modal.css";
import {Input, Page, setOptions,Textarea,Datepicker, Select,} from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";

import 'react-tabs/style/react-tabs.css';
import { Button, ButtonGroup, ButtonToolbar } from '@trendmicro/react-buttons';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import "../components/up.css"

const API_URL = "http://localhost:8080/";

export default function CourseForm({handleUpdate, handleClose, courseId}){

    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };
  
    
    const [users, setUsers] = useState([]);
        const [show, setshow] = useState(false);

    useEffect(() => {
      remoteFiltering('');
    }, []);
  
  
  const getUsers = (filterText) => {
    const response = axios.get("http://localhost:8080/users",
    {
    params: {
      "username":filterText
    },
    headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  }
    );
    return response;
  }
  
  const [data, setdata] = useState('');
  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const errorMessages = {
    title: 'Имя пользователя должно быть больше 2 и меньше 30 символов',
    description: 'Описание должно быть больше 10 и меньше 100 символов',
    size: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    dateRange: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    selectMentors: 'Поле не должно быть пустым'
    // Остальные сообщения об ошибках
  };
  const currentDate = new Date(); // Текущая дата

  const validationRules = {
    title: (value) => value.trim().length < 2 || value.trim().length > 30,
    description: (value) => value.trim().length < 10 || value.trim().length > 100,
    size: (value) =>  value > 100 || value < 5,
    selectMentors:  (value) =>  value.length < 1 ||  value.length > 5
    // Остальные правила валидации
  };

  const [course, setCourse] = useState({
    id: data.id,
    title: data.title,
    description: data.description,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
    ids: data.mentors?.map((item) => {return item.uuid }),
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjr__O2vAvx27W_uzYxtssdgDugdZNnAKxeA&usqp=CAU',
    size: data.size
  });

  useEffect(() => {
    axios.get("http://localhost:8080/courses/"+courseId,
    config
    ).then((response) => {
      console.log(response.data);
      setdata(response.data);
      setCourse({
        ...course,
        id: response.data.id,
        imgUrl: response.data.resource.url,
        title: response.data.title,
        description: response.data.description,
        dateStart: response.data.dateStart,
        dateEnd: response.data.dateEnd,
        ids: response.data.mentors?.map((item) => {return item.uuid }),
        size: response.data.size
      });    
    });

  },
[]);


const handleChange = (e) => {
  const value = e.target.value;
  setCourse({
    ...course,
    [e.target.name]: value
  });

  if (validationRules[e.target.name](value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: errorMessages[e.target.name],
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: '', // Сброс ошибки, если данные валидны
      }));
    }
    const hasErrors = Object.values(errors).some((error) => error !== '');
    setIsSaveDisabled(hasErrors);
};
  
  const [range, setRange] = React.useState(null);

  const pickerChange = (ev) => {
    console.log(ev.value)
    setCourse({
      ...course,
      dateStart: ev.value[0],
      dateEnd: ev.value[1]
    })
}
 
  const selectedChange = (e) => {
    setCourse({
      ...course,
      ids: e.value
    })
      if (validationRules.selectMentors(e.value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["selectMentors"]: errorMessages.selectMentors,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["selectMentors"]: '', // Сброс ошибки, если данные валидны
        }));
      }
      const hasErrors = Object.values(errors).some((error) => error !== '');
      setIsSaveDisabled(hasErrors);
  };

     const postCourse = (e) => {
      e.preventDefault();
      const courseData = course;
       axios.put(API_URL + "courses", courseData,config)
      .then(
        
            handleClose()
        
      )};
  
      const selectFile = (ev) => {
        setFiles({
          ...files,
          selectedFiles: ev.target.files,
        });
        setshow(true);
      }
  
      const [files, setFiles] = useState({
        selectedFiles: undefined,
        currentFile: undefined,
        progress: 0,
        message: "",
        fileInfos: [],
  
    });
  
    const uploadPicture = (id) => {
      let currentFile = files.selectedFiles[0];
  
      setFiles({
        ...files,
        progress: 0,
        currentFile: currentFile,
      });
  
      const token = AuthService.getCurrentJwt();
      const config = {
          headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*","Content-Type": "multipart/form-data",},
          params: { 'courseId': id }
      };

      let picture = new FormData();
  
      picture.append("file", currentFile);
  
     http.post("http://localhost:8080/courses/picture", picture, config, {
        params: {
          "courseId": id 
          }
      }).then(      handleClose()      );
    }
  
    const remoteFiltering = React.useCallback((filterText) => {
      const userData = [];
      getUsers(filterText)
      .then(response =>
        setUsers(response.data?.map((items) => {
           return {text: items.firstname +" "+ items.lastname, value: items.uuid}
    })
      ))
      .then(console.log(users))
  }, []);
  
    const userFilter = React.useCallback((ev) => {
      remoteFiltering(ev.filterText);
      return false;
  }, [remoteFiltering]);


  const inputFile = useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

    return(
        <Page className="scrollCourseForm">
              <div className="mbsc-grid mbsc-grid-fixed">
                  <div className="mbsc-form-group">
                  <div className="course-setting center">
                              <div className="user-profile">
                                      <div className="user-avatar">
                                      <a 
                                       onClick={onButtonClick}>
                                        <div>
                                            <img  className="image" 
                                            src = {files.selectedFiles ? URL.createObjectURL(files?.selectedFiles[0]) : course?.imgUrl}
                                            alt="Photo"/>
                                        </div><br></br>
                                        </a>
                                        <div className="butt_save">
                                            {show && 
                                            <Button onClick={() => uploadPicture(course.id)}
                                            type="submit">Обновить фото курса</Button>
                                          }
                                         </div>
                                      </div>
                                </div>
                                </div>
                                <input hidden type="text "></input>
                    <Form  
                      onSubmit={postCourse}
                        >
                      <div className="mbsc-row mbsc-justify-content-center">
                          <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                              <div className="mbsc-row">
                              
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                                      <Input
                                       onChange={handleChange}
                                      name="title" type="text"
                                      error={`${errors.title ? 'true' : ''}`}
                                      label="Название" placeholder="Название"
                                      inputStyle="box" labelStyle="floating" 
                                      value={course.title}/>
                                      {errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{errors.title}</div>}
                                  </div>
                              </div>
                              <div className="mbsc-row">
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                              <Datepicker
                              label="Временные рамки" placeholder="Временные рамки"
                              labelStyle="floating"
                              controls={['calendar', 'time']}
                              select="range"
                              inputStyle="box"
                              touchUi={true}
                              onChange={pickerChange}
                              min = {new Date()}
                              value = {[course.dateStart, course.dateEnd]}
                              error={`${errors.dateRange ? 'true' : ''}`}
                              />
                                {errors.dateRange && <div style={{ color: 'red', fontSize: '12px' }}>{errors.dateRange}</div>}

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
                                      error={`${errors.selectMentors ? 'true' : ''}`}
                                      filter = {true}
                                      onFilter={userFilter}
                                      value = {course.ids}
                                  />  
                                  {errors.selectMentors && <div style={{ color: 'red', fontSize: '12px' }}>{errors.selectMentors}</div>}
                                  </div>
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Textarea name="description" inputStyle="box" 
                                   labelStyle="stacked" startIcon="pencil"
                                   placeholder="Textarea with left icon" label="Описание курса"
                                   onChange={handleChange}
                                   value={course.description}
                                   error={`${errors.description ? 'true' : ''}`}
                                   ></Textarea>
                                  {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                                  </div>
                                
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Input 
                                  error={`${errors.size ? 'true' : ''}`}
                                  value={course.size} name="size" min="1" max = "100" onChange={handleChange} multiple inputStyle="box" labelStyle="stacked" type="number" placeholder="Введите количество мест..." label="Места"></Input>
                                  {errors.size && <div style={{ color: 'red', fontSize: '12px' }}>{errors.size}</div>}
                                  </div>
                                
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <input accept=".jpg,.jpeg,.png" onChange={selectFile} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                                  </div>
                              </div>
                              <Button 
                              disabled={isSaveDisabled}
                                type="submit">Сохранить</Button>
                          </div>  
  
                      </div>
                      </Form>
                  </div>
              </div>
          </Page>
    );
  }