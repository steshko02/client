import axios from "axios";
import "./modal.css";
import http from "../http-common";
import AuthService from "../services/auth.service";
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBIcon,MDBListGroup,MDBListGroupItem
} from 'mdb-react-ui-kit';
import "./modal.css";
import {Input, Page, setOptions,Textarea,Datepicker, Select,} from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import Modal from "react-overlays/Modal";
import UploadService from "../services/UploadService";
import { useNavigate } from "react-router-dom";
import Helper from "../services/Helper"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Button, ButtonGroup, ButtonToolbar } from '@trendmicro/react-buttons';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import { Link } from "react-router-dom";
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

const [course, setCourse] = useState({
    id: data.id,
    title: data.title,
    description: data.description,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
    ids: data.mentors?.map((item) => {return item.uuid }),
    imgUrl: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    size: data.size
  });

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setCourse({
//       ...course,
//       [e.target.name]: value
//     });
//   };
  
  const [range, setRange] = React.useState(null);

  
  const pickerChange = (ev) => {
    setRange(ev.value);
    const rangeLocal = ev.value;
    setCourse({
      ...course,
      dateStart: rangeLocal[0],
      dateEnd: rangeLocal[1]
    })
  }
  
  const selectedChange = (ev) => {
    setCourse({
      ...course,
      ids: ev.value
    })
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setCourse({
        ...course,
      [e.target.name]: value
    });
  };


     const postCourse = (e) => {
      e.preventDefault();
      const courseData = course;
      const response = axios.put(API_URL + "courses", courseData,config)
      .then(()=>
        {
            handleUpdate(1);
            handleClose();
        }
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
  
      return http.post("http://localhost:8080/courses/picture", picture, config, {
        params: {
          "courseId": id 
          }
      });
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
        <Page className="scroll">
              <div className="mbsc-grid mbsc-grid-fixed">
                  <div className="mbsc-form-group">
                    <Form  
                      onSubmit={postCourse}
                        >
                      <div className="mbsc-row mbsc-justify-content-center">
                          <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                              <div className="mbsc-row">
                              <div className="course-setting center">
                              <div className="user-profile">
                                      <div className="user-avatar">
                                      <a 
                                       onClick={onButtonClick}>
                                    
                                        <div>
                                            <img  className="image" 
                                            //  src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                            src = {files.selectedFiles ? URL.createObjectURL(files?.selectedFiles[0]) : course?.imgUrl}
                                            alt="Photo" />
                                        </div><br></br>
                                        </a>
                                        <div className="butt_save">
                                            {show && 
                                            <Button   onClick={uploadPicture(course.id)}
                                            type="submit">Обновить фото курса</Button>
                                          }
                                         </div>
                                         
                                      </div>
                                        
                                </div>
                                </div>
                                <input hidden type="text "></input>
                                  <div className="mbsc-col-md-12 mbsc-col-12">
                                      <Input
                                       onChange={handleChange}
                                      name="title" type="text"
                                      label="Название" placeholder="Название"
                                      inputStyle="box" labelStyle="floating" 
                                      value={course.title}/>
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
                              value = {[course.dateStart,course.dateEnd]}
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
                                      onFilter={userFilter}
                                      value = {course.ids}
                                  />  
                                  </div>
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Textarea name="description" inputStyle="box" 
                                   labelStyle="stacked" startIcon="pencil"
                                   placeholder="Textarea with left icon" label="Description"
                                   onChange={handleChange}
                                   value={course.description}
                                   ></Textarea>
                                  </div>
                                
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Input value={course.size} name="size" min="1" max = "100" onChange={handleChange} multiple inputStyle="box" labelStyle="stacked" type="number" placeholder="Input size..." label="Size"></Input>
                                  </div>
                                


                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  {/* <Input style={{display: 'none'}} onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select photo..." label="File upload"></Input> */}
                                  <input onChange={selectFile} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>

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