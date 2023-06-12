import axios from "axios";
import AuthService from "../services/auth.service";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody,
} from 'mdb-react-ui-kit';
import { Button, Input, Page, setOptions,Textarea,Datepicker } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import Modal from "react-overlays/Modal";
import UploadService from "../services/UploadService";
import Player from "../components/Player";
import Helper from "../services/Helper"
import AnswerForm from "./AnswerModalForm"
import LessonForm from "../components/LessonForm";
import WorkForm from "../components/WorkForm";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/";

const currentUser = AuthService.getCurrentUser()
const showAdminBoard = currentUser ? currentUser.roles.includes("ROLE_ADMIN") : false
const showUserBoard = currentUser ? currentUser.roles.includes("ROLE_USER") : false
const showMentorBoard = currentUser ? currentUser.roles.includes("ROLE_LECTURER") : false
const showStudentBoard = currentUser ? currentUser.roles.includes("ROLE_STUDENT") : false
function LessonInfo( {datetime}) {

    const token = AuthService.getCurrentJwt()

    const [data, setdata] = useState('');
    const location = useLocation();
 
    const [showModal, setShowModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [showChangeAnswerModal, setShowChangeAnswerModal] = useState(false);
    const [isAdminOrMentor, setIsAdminOrMentor] = useState(false);
    const [showWorkModal, setshowWorkModal] = useState(false);
    const [showLessonModal, setshowLessonModal] = useState(false);
  
    const [addWork, setaddWork] = useState(0);
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    useEffect(() => {
      axios.get("http://localhost:8080/lessons/"+location.state.itemId,
      config
      ).then((response) => {
        console.log(response.data);
        setdata(response.data);
        if(response.data.work){
        setaddWork(response.data.work.id);
        setIsAdminOrMentor(showAdminBoard || (data.userId===null ||  data.mentorId===""));
        }
        });
    },
[addWork]);


var handleClose = () => setShowModal(false);

var handleCloseLesson = () => {
  setshowLessonModal(false);
  handleUpdate(1);
}

var handleAnswerClose = () => setShowAnswerModal(false);

var closeWork = () =>{ 
  setshowWorkModal(false);
  handleUpdate(1);
};

const deleteWork = (id) => {

  if (window.confirm("Press a button!")) {
      axios.delete(API_URL + "works/"+id,config)
      .then((response) => {
        setaddWork(addWork+id);
    })};

}

var handleChangeAnswerClose = () => {
  handleUpdate(1);
  setShowChangeAnswerModal(false);
}

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const handleUpdate = (obj) => {
  setaddWork(addWork+obj);
  handleClose();
};

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;
  const props1 = { placeholder: 'Please Select...', label: 'Calendar' };

  return (
    <>
      <section style={{ backgroundColor: '#eee' }}>
      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header modal-header">
            <div className="modal-title modal-title">Форма создания задания</div>
            <div>
              <span className="close-button course" onClick={handleClose}>
                x
              </span>
            </div>
          </div>

          <WorkFormLocal handleUpdate={handleUpdate} datetime={location.state.datetime}/>

          <div className="modal-footer course">
            <button className="secondary-button course" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal"
        show={showAnswerModal}
        onHide={handleAnswerClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header modal-header">
            <div className="modal-title modal-title">Форма добавления работы</div>
            <div>
              <span className="close-button course" onClick={handleAnswerClose}>
                x
              </span>
            </div>
          </div>

          <AnswerForm handleUpdate={handleUpdate} handleAnswerClose={handleAnswerClose} work={data.work} update={false}/>

          <div className="modal-footer course">
            <button className="secondary-button course" onClick={handleAnswerClose}>
              Закрыть
            </button>
          </div>
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
        <WorkForm 
        courseId= {data.courseId}
        handleUpdate={handleUpdate}
         handleClose ={closeWork} lessId ={data.id} datetime={location.state.datetime}/>
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
        <LessonForm 
         courseId= {data.courseId}
          handleClose ={handleCloseLesson} handleUpdate={handleUpdate} lessonId ={data.id} datetime={location.state.datetime}/>
      </div>
  
    </Modal>

    <Modal
                            className="modal"
                            show={showChangeAnswerModal}
                            onHide={handleChangeAnswerClose}
                            renderBackdrop={renderBackdrop}
                          >
                            <div>
                              <div className="modal-header modal-header">
                                <div className="modal-title modal-title">Modal Heading</div>
                                <div>
                                  <span className="close-button course" onClick={handleChangeAnswerClose}>
                                    x
                                  </span>
                                </div>
                              </div>

                              <AnswerForm handleAnswerClose={handleChangeAnswerClose} handleUpdate={handleUpdate}  work={data.work}  data={data.answer} update={true}/>

                              <div className="modal-footer course">
                                <button className="secondary-button course" onClick={handleChangeAnswerClose}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </Modal>

        <MDBContainer className="py-5">
          <MDBRow  className="mb-4">
            <MDBCol lg="6">
              <MDBCard className="mb-4">
                  <Player 
                    url = {"http://localhost:8082/video/"+location.state.courseId+"/"+location.state.itemId+"/videos"+"/video"}/>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
              { !data.work && data.studentId === null && (data.mentorId !==null || showAdminBoard)  && (
              <button onClick={() => setShowModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                    Добавить задание
                  </button>
              )}
            
              { data.work && (
                <MDBCardBody className="p-0">
                <MDBRow>
                    <MDBCol sm="9" className="mb-4">
                      <h5>Задание - {data.work.title}</h5>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol sm="4">
                      <MDBCardText>Дедлайн</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.work.deadline)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                  <MDBCol sm="4">
                      <MDBCardText>Описание:</MDBCardText>
                  </MDBCol>
                    <MDBCol>
                      <MDBCardText className="text-muted mb-7">
                        <WithLinks text ={data.work.description}></WithLinks>                      
                        </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                  <MDBCol sm="12">
                  <br/>

                      <MDBCardText>Прикрепленные файлы:</MDBCardText>
                  </MDBCol>
                  <>
                    <MDBCol sm="12" >
                    {data.work.resource?.map((items) => {
                      return (<><a href={items.url}>{items.filename}</a><br /></>)
                    })}
                    </MDBCol>
                    </>
                  </MDBRow>
                </MDBCardBody>
                )}
    <hr></hr>
              { data.answer && (
                <MDBCardBody className="p-0">
                <MDBRow>
                    <MDBCol sm="9" className="mb-4">
                      <h5>Ответ</h5>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="5" className="mb-4">
                      <MDBCardText>Время сдачи:</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.answer.dateCreation)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol sm="10" >
                      <MDBCardText>Комментарий:</MDBCardText>
                    </MDBCol>
                    <MDBCol>
                      <MDBCardText className="text-muted">
                        <WithLinks text ={ data.answer.comment}></WithLinks>                      
                        </MDBCardText>
                      
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                  <MDBCol sm="9">
                      <MDBCardText>Прикрепленные файлы:</MDBCardText>
                  </MDBCol>
                  <>
                    <MDBCol sm="9" >
                    {data.answer.resource?.map((items, index) => {
                      return (<><a href={items.url}>
                        {items.filename}</a><br/></>)
                    })}
                    </MDBCol>
                    </>
                  </MDBRow>
                </MDBCardBody>
                )}
                { data.work!==null && data.answer===null && !isAdminOrMentor && data.studentId!==null && 
                (
              <button onClick={() => setShowAnswerModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                    Прикрепить работу
                  </button>
              )}

              </MDBCard>
                
            </MDBCol>
            <MDBCol lg="6" >
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
                      <MDBCardText>Начало занятия</MDBCardText>
                      <MDBCardText>Конец занятия</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                    <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateStart)}</MDBCardText>
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateEnd)}</MDBCardText>
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
                                  //  return <><a href="#" id={items.id}>{items.firstname} {items.lastname}</a><br /></>;
                                   return  <><Link to="/user" state={{ id: items.uuid }}>{items.firstname} {items.lastname}</Link><br /></>
                              })}
                         </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                {
                data.resourceDtos?.length!=0  &&
                  <MDBRow>
                    <MDBCol sm="4">
                      <MDBCardText>Ресурсы</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">{data.resourceDtos?.map((items) => {
                    return (<a href={items.url}>
                      {items.filename}</a>)})}
                         </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                }
                </MDBCardBody>
              </MDBCard>

            </MDBCol>
            {/* <MDBCol lg="6"> */}
           
              {/* </MDBCol> */}
          </MDBRow>
          { data.studentId ===null && data.mentorId !==null &&

          <MDBRow>
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-4">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции ментора</span>  </MDBCardText>
                      <><button onClick={() => setshowLessonModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                      Изменить занятие
                    </button><br /></>
                      { data.work && (
                      <><button  onClick={() => setshowWorkModal(true)}  type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                      Изменить задание к занятию
                    </button></>
                      )}
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
}
{ data.studentId !==null && data.mentorId ===null && !showAdminBoard &&

<MDBRow>
      <MDBCol md="6">
        <MDBCard className="mb-4 mb-md-4">
          <MDBCardBody>
            <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции студента</span>  </MDBCardText>
            <><button onClick={() => setShowChangeAnswerModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
            Изменить выполненную работу
          </button><br /></>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
}
{ showAdminBoard &&
<MDBRow>
      <MDBCol md="6">
        <MDBCard className="mb-4 mb-md-4">
          <MDBCardBody>
            <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции администратора</span>  </MDBCardText>
            <><button onClick={() => setshowLessonModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
            Изменить занятие
          </button><br /></>
            { data.work && (
            <><button  onClick={() => setshowWorkModal(true)}  type="button" class="btn btn-link" data-mdb-ripple-color="dark">
            Изменить задание к занятию
          </button></>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
}
        </MDBContainer>
      </section></>
  );
}

export default LessonInfo;

function WorkFormLocal({handleUpdate, datetime}){

  const location = useLocation();
  const token = AuthService.getCurrentJwt()
  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };
  const [deadline, setDeadline] = React.useState(null);
  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const errorMessages = {
    title: 'Имя пользователя должно быть больше 2 и меньше 30 символов',
    description: 'Описание должно быть больше 10 и меньше 250 символов',
    dateRange: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    // Остальные сообщения об ошибках
  };
  const currentDate = new Date(); // Текущая дата

  const validationRules = {
    title: (value) => value.trim().length <= 2 || value.trim().length > 30,
    description: (value) => value.trim().length <= 10 || value.trim().length > 250,
    dateRange: (value) => value === null

    // Остальные правила валидации
  };

  const [work, setWork] = useState({
      workId: 0,
      lessonId: location.state.itemId,
      title: "",
      description: "",
      deadline: new Date()
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

  const upload = (id) => {
    let currentFile = files.selectedFiles;

    setFiles({
      ...files,
      progress: 0,
      currentFile: currentFile,
    });
      UploadService.uploadFiles(currentFile, API_URL + "works/upload-files/"+location.state.courseId+"/" + location.state.itemId +"/"+ id, (event) => {
        setFiles({
          ...files,
          progress: Math.round((100 * event.loaded) / event.total),
        });
    })
      .then((response) => {
        handleUpdate(2);
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

  const pickerChange = (e) => {
    setDeadline(e.value);
    setWork({
      ...work,
      deadline: e.value
    })
}
  const handleChange = (e) => {
    const value = e.target.value;
    setWork({
      ...work,
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
        if(files.selectedFiles.length!==0){
        upload(workId);
    }
    }
    ).then(resp=>handleUpdate(1));
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
                            <div className="mbsc-form-group-title">Форма задания</div>
                            <div className="mbsc-row">
                              <input hidden type="text "></input>
                                <div className="mbsc-col-md-12 mbsc-col-12">
                                    <Input onChange={handleChange}
                                    name="title" type="text"
                                    error={`${errors.title ? 'true' : ''}`}
                                    label="Название" placeholder="Название"
                                    inputStyle="box" labelStyle="floating" />
                                            {errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{errors.title}</div>}

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
                                min={new Date()}
                                max={datetime}
                                value = {work.deadline}
                                error={`${errors.dateRange ? 'true' : ''}`}
                                required
                            />
                              {errors.dateRange && <div style={{ color: 'red', fontSize: '12px' }}>{errors.dateRange}</div>}

                            </div>
                          
                            </div>  

                            <div className="mbsc-row">
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Поле ввода" label="Описание"
                                 onChange={handleChange}
                                 error={`${errors.description ? 'true' : ''}`}
                                 ></Textarea>
                                {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                              </div>

                                <div className="mbsc-col-md-12 mbsc-col-12">
                                <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Прикрепите файлы..." label="Загрузка файлов"></Input>
                                </div>

                            </div>
                            <Button 
                              disabled={isSaveDisabled || work.title ==="" || work.description ==="" || work.deadline === null}
                              type="submit">Сохранить</Button>
                        </div>  

                    </div>
                    </Form>
                </div>
            </div>
        </Page>
  );
}


function WithLinks({text}) {

    var res = []
    
    text && text.replace(/((?:https?:\/\/|ftps?:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,})|(\n+|(?:(?!(?:https?:\/\/|ftp:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}).)+)/gim, (m, link, text) => {
      res.push(link ? <a href={(link[0]==="w" ? "//" : "") + link} key={res.length}>{link}</a> : text)
    })

    return <div className="user-text">{res}</div>
}