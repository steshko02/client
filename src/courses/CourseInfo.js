import "./card.scss"
import axios from "axios";
import AuthService from "../services/auth.service";
import React, { useEffect, useState } from 'react';
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
import CourseForm from "./CourceForm";

const API_URL = "http://localhost:8080/";

  const currentUser = AuthService.getCurrentUser()
  const showAdminBoard = currentUser ? currentUser.roles.includes("ROLE_ADMIN") : false
  const showUserBoard = currentUser ? currentUser.roles.includes("ROLE_USER") : false
  const showMentorBoard = currentUser ? currentUser.roles.includes("ROLE_LECTURER") : false
  const showStudentBoard = currentUser ? currentUser.roles.includes("ROLE_STUDENT") : false

  function LessonForm({datetime, handleUpdate, handleClose}){

  const location = useLocation();
  const token = AuthService.getCurrentJwt()
  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };
  const [range, setRange] = React.useState(null);
  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const errorMessages = {
    title: 'Имя пользователя должно быть больше 2 и меньше 30 символов',
    description: 'Описание должно быть больше 10 и меньше 100 символов',
    dateRange: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    selectMentors: 'Поле не должно быть пустым'
    // Остальные сообщения об ошибках
  };
  const currentDate = new Date(); // Текущая дата

  const validationRules = {
    title: (value) => value.trim().length <= 2 || value.trim().length > 30,
    description: (value) => value.trim().length <= 10 || value.trim().length > 100,
    selectMentors:  (value) =>  value.length < 1 ||  value.length > 5
    // Остальные правила валидации
  };

  const [checkedFiles, setcheckedFiles] = useState(false);

  const [checkedVideo, setcheckedVideo] = useState(false);

  const [users, setUsers] = useState([]);

  const handleCheckedFiles = () => {
    setcheckedFiles(!checkedFiles);
  };

  const handleCheckedVideo = () => {
    setcheckedVideo(!checkedVideo);
  };

  
  const selectedChange = (e) => {
      setLesson({
        ...lesson,
        userIds: e.value
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

  const [lesson, setLesson] = useState({
      courseId: location.state.itemId,
      title: "",
      description: "",
      dateStart: null,
      dateEnd: null,
      userIds: "" ,
      order:""
  });

  const [video, setvideo] = useState({
    courseId: location.state.itemId,
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
    const userData = [];
    getUsers(location.state.itemId)
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
      UploadService.uploadFiles(currentFile, API_URL + "lessons/upload-files/"+location.state.itemId+"/" + id, (event) => {
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
        if(files.selectedFiles.length!==0){
        upload(LessId);
        }
      }

      if(checkedVideo){
        if(files.selectVideoFile.length!==0){
        let ext= getExtension(files.selectVideoFile[0].name);
        setvideo(
          {
            extension: ext,
            lessonId: LessId,
            courseId: location.state.itemId
          }
        )
        getLinkForUploadVideo(LessId,ext).then((res)=>
          uploadVideo(res.data)
        );
      }
    }
      handleUpdate(1);
      handleClose();
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
                                    error={`${errors.title ? 'true' : ''}`}
                                    />
                                     {errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{errors.title}</div>}

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
                            value={range}
                            min = {new Date()}
                            max = {datetime}
                            onChange={pickerChange}
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
                                    error={`${errors.selectMentors ? 'true' : ''}`}
                                    />
                                    {errors.selectMentors && <div style={{ color: 'red', fontSize: '12px' }}>{errors.selectMentors}</div>}
    
                                </div>
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Введите описание" label="Описание"
                                 onChange={handleChange}
                                 error={`${errors.description ? 'true' : ''}`}
                                 ></Textarea>
                                  {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                                </div>

                                <div className="mbsc-col-md-6 mbsc-col-6"><input type="checkbox"
                                checked={checkedFiles}
                                  onChange={handleCheckedFiles}
                                /> <spa>Добавить файлы</spa>
                                { checkedFiles && (
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select text files..." label="Files upload"></Input>
                                </div>
                          )} </div> 
                         <div className="mbsc-col-md-6 mbsc-col-6"><input type="checkbox"
                                checked={checkedVideo}
                                  onChange={handleCheckedVideo}
                                /> <spa>Добавить видео</spa>
                                { checkedVideo && (
                               <div className="mbsc-col-md-12 mbsc-col-10">
                               <Input 
                               required
                               accept=".mp4"
                               onChange={selectVideoFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select video files..." label="Video upload"></Input>
                               </div>
                          )} </div> 
                            </div>
                            <Button 
                               disabled={isSaveDisabled || lesson.title==="" || lesson.description ==="" || 
                              lesson.dateStart===null || lesson.dateEnd === "" || lesson.userIds.length ===0 || !files.selectVideoFile}
                              type="submit">Сохранить</Button>
                        </div>  
                    </div>
                    </Form>
                </div>
            </div>
        </Page>
  );
}


 function CourseInfo() {

    const token = AuthService.getCurrentJwt()

    const [data, setdata] = useState('');
    const location = useLocation();
 
    const [showModal, setShowModal] = useState(false);
    const [showModalCourse, setshowModalCourse] = useState(false);

    const [addLesson, setaddLesson] = useState(0);
    const [lessArray, setLessArray] = useState([]);
    const [book, setBook] = useState(false);
    const [isAdminOrMentor, setIsAdminOrMentor] = useState(false);


    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    useEffect(() => {
      axios.get("http://localhost:8080/courses/"+location.state.itemId,
      config
      ).then((response) => {
        console.log(response.data);
        setdata(response.data);
        setaddLesson(response.data.lessons.length);
        setIsAdminOrMentor((showAdminBoard|| response.data.mentorId!==null));
        console.log(isAdminOrMentor);
        setLessArray( response.data.lessons.reduce((group, lesson) => {
          const { status } = lesson;
          group[status] = group[status] ?? [];
          group[status].push(lesson);
          return group;
        }, {}));

        console.log(lessArray);
      });

    },
[addLesson]);

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const handleUpdate = (obj) => {
  setaddLesson(addLesson+obj);
};

  var handleClose = () => setShowModal(false);


  const renderBackdrop = (props) => <div className="backdrop" {...props} />;
  const props1 = { placeholder: 'Please Select...', label: 'Calendar' };

  const deleteLesson = (ev) => {
    if (window.confirm("Press a button!")) {
     deleteLessonHandler(ev.target.id);
    } else {
    }
  }

  const bookCourse = () => {
    bookCourseTest(location.state.itemId);
    handleUpdate(1);
  }

  const bookCourseTest = (id) =>{
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();

    var config = {
      method: 'post',
      url: 'http://localhost:8080/bookings/'+id,
      headers: { 
        'Authorization' : `Bearer ${token}`
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const deleteCourse = () => {

    if (window.confirm("Press a button!")) {
        axios.delete(API_URL + "courses/"+location.state.itemId,config)
        .then((_response) => {
          nav("/courses");
      })};
  }

  const deleteLessonHandler = (id) => {

    axios.delete(API_URL + "lessons/"+id,config)
    .then((response) => {
      const LessId = response.data;
      setaddLesson(addLesson-LessId);
  }
    )};


    const nav = useNavigate();
    const redirectLesson = (id) => {
      nav("/lesson",{
        state: {
          itemId: id,
          courseId: data.id,
          datetime: data.dateEnd
        }
        });
    };

    const closeCourse = () => {
      setshowModalCourse(false);
      handleUpdate(2);
    }

  return (
    <>
      <section style={{ backgroundColor: '#eee' }}>
      <Modal
        className="modal customcourse"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header modal-header">
            <div className="modal-title modal-title">Форма занятия</div>
            <div>
              <span className="close-button course" onClick={handleClose}>
                x
              </span>
            </div>
          </div>

          <LessonForm datetime = {data.dateEnd}  handleUpdate={handleUpdate} handleClose ={handleClose}/>
        </div>
      </Modal>

      <Modal
        className="modal customcourse"
        show={showModalCourse}
        onHide={()=>setshowModalCourse(false)}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header modal-header">
            <div className="modal-title modal-title">Форма курса</div>
            <div>
              <span className="close-button course" onClick={()=>setshowModalCourse(false)}>
                x
              </span>
            </div>
          </div>

          <CourseForm handleUpdate={handleUpdate} handleClose={()=>closeCourse} courseId ={location.state.itemId}/>
        </div>
      </Modal>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={data?.resource?.url}
                    alt="avatar"
                    style={{ width: '500px' }}
                    fluid />
                </MDBCardBody>
              {!data.studentId && !showAdminBoard && data.mentorId === null &&  data.bookingStatus === null && data.status === 'NOT_STARTED' &&  data.busy<data.size &&           
                <Button onClick={() => bookCourse()} btnStyle="primary">Записаться на курс</Button>
                
              }
                {data.bookingStatus === 'CONSIDERED' &&
                  <Button btnStyle="primary" disabled>Ваша заявка на рассмотрении</Button>
                }
                {data.bookingStatus === 'CANCELLED' &&
                  <Button btnStyle="primary" disabled>Ваша заявка отклонена</Button>
                }
                { data.busy>=data.size && !showAdminBoard && data.mentorId === null &&
                    <Button btnStyle="primary" disabled>Набор на курс завершен</Button>
                }
                { (data.status === 'DURING' || data.dateStart < new Date()) && !showAdminBoard && data.mentorId === null &&
                    <Button btnStyle="primary" disabled>Курс уже начался</Button>
                }
                { data.status === 'FINISHED' && !showAdminBoard && data.mentorId === null && 
                    <Button btnStyle="primary" disabled>Курс закончен</Button>
                }
              </MDBCard>
              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                { isAdminOrMentor &&
                  <button onClick={() => setShowModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                    Добавить занятие
                  </button>
              }
              
              {data.lessons && data.lessons.length > 0 &&
                  <Tabs>
                    <TabList> 
                      <Tab><span className="small_font">Активные</span></Tab>
                      <Tab><span className="small_font">Завершенные</span></Tab>
                      <Tab><span className="small_font">Не начатые</span></Tab>
                    </TabList>

                    <TabPanel>
                        <MDBListGroup flush className="rounded-3 scrollLesson">
                        {lessArray['DURING']?.map((items,index) => {
                            return (
                          <MDBListGroupItem className="d-flex  align-items-center p-3 first_block">
                            <MDBIcon fas icon="globe fa-lg text-warning" />
                            <a class="sidenav-link" onClick= {() => {redirectLesson(items.id)}} ><span> Занятие: </span> {items.title} </a>
                            {showAdminBoard && data.studentId==null &&
                            <Button className="second_block  ml-2" id={items.id}  startIcon="ion-close-circled" onClick={deleteLesson} >Удалить</Button>
                            }                          </MDBListGroupItem>
                            )
                        })}  
                      </MDBListGroup>
                    </TabPanel>
                    <TabPanel>
                    <MDBListGroup flush className="rounded-3 scrollLesson">
                        {lessArray['FINISHED']?.map((items,index) => {
                            return (
                          <MDBListGroupItem className="d-flex  align-items-center p-3 first_block">
                            <MDBIcon fas icon="globe fa-lg text-warning" />
                            <a class="sidenav-link" onClick= {() => {redirectLesson(items.id)}}><span>Занятие: </span> {items.title}</a>
                            {showAdminBoard && data.studentId==null &&
                            <Button className="second_block  ml-2" id={items.id}  startIcon="ion-close-circled" onClick={deleteLesson} >Удалить</Button>
                            }
                            </MDBListGroupItem>
                            )
                        })}
                      </MDBListGroup>
                    </TabPanel>
                    <TabPanel>
                    <MDBListGroup flush className="rounded-3 scrollLesson">
                        {lessArray['NOT_STARTED']?.map((items,index) => {
                            return (
                          <MDBListGroupItem className="d-flex  align-items-center p-3 first_block">
                            <MDBIcon fas icon="globe fa-lg text-warning" />
                            <a class="sidenav-link" onClick= {() => {redirectLesson(items.id)}}><span>Занятие: </span> {items.title}</a>
                            {showAdminBoard && data.studentId==null &&
                            <Button className="second_block  ml-2" id={items.id}  startIcon="ion-close-circled" onClick={deleteLesson} >Удалить</Button>
                            }                          </MDBListGroupItem>
                            )
                        })}  
                      </MDBListGroup>
                    </TabPanel>
                  </Tabs>
                    }
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Название</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{data.title}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Начало курса</MDBCardText>
                      <MDBCardText>Конец курса</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateStart)}</MDBCardText>
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateEnd)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Занято мест</MDBCardText>
                      <MDBCardText>Набор</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="3">
                      <MDBCardText className="text-muted">{data.busy}</MDBCardText>
                      <MDBCardText className="text-muted">{data.size}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Статус</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{Helper.statusByFormat(data.status)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Описание</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{data.description}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Менторы</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{data.mentors?.map((items) => {
                                   return <><Link to="/user" state={{ id: items.uuid }}>{items.firstname} {items.lastname}</Link><br /></>;
                              })}
                         </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
              {showAdminBoard &&
              <MDBRow>
                <MDBCol md="12">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции администратора</span>  </MDBCardText>
                      <button onClick={() => deleteCourse(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Удалить курс
                      </button><br/>
                      <button onClick={()=>setshowModalCourse(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Редактировать информацию о курсе
                      </button>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                      </button>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
              }
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section></>
  );
}
  

export default CourseInfo;
