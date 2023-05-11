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
import AnswerForm from "./AnswerModalForm"

const API_URL = "http://localhost:8080/";


function LessonInfo() {

    const token = AuthService.getCurrentJwt()

    const [data, setdata] = useState('');
    const location = useLocation();
 
    const [showModal, setShowModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);

  
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
        setaddWork(response.data.work.id);
            });
    },
[addWork]);

// /mentors/lesson/{id}

var handleClose = () => setShowModal(false);

var handleAnswerClose = () => setShowAnswerModal(false);

const deleteWork = (id) => {

  if (window.confirm("Press a button!")) {
      axios.delete(API_URL + "works/"+id,config)
      .then((response) => {
        setaddWork(addWork+id);
    })};

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
            <div className="modal-title modal-title">Modal Heading</div>
            <div>
              <span className="close-button course" onClick={handleClose}>
                x
              </span>
            </div>
          </div>

          <WorkForm handleUpdate={handleUpdate}/>

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
            <div className="modal-title modal-title">Modal Heading</div>
            <div>
              <span className="close-button course" onClick={handleAnswerClose}>
                x
              </span>
            </div>
          </div>

          <AnswerForm handleUpdate={handleUpdate} workId={data.work}/>

          <div className="modal-footer course">
            <button className="secondary-button course" onClick={handleAnswerClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>

        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="6">
              <MDBCard className="mb-4">
                  <Player 
                    url = {"http://localhost:8082/video/"+location.state.courseId+"/"+location.state.itemId+"/videos"+"/video"}/>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
              { !data.work && (
              <button onClick={() => setShowModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                    Добавить задание
                  </button>
              )}
            
              { data.work && (
                <MDBCardBody className="p-0">
                <MDBRow>
                    <MDBCol sm="9">
                      <h5>{data.work.title}</h5>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="5">
                      <MDBCardText>Дедлайн</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.work.deadline)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="5">
                      <MDBCardText>Описание</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{data.work.description}</MDBCardText>
                    </MDBCol>
                    <hr/>
                    <>
                    <MDBCol sm="9">
                    {data.work.resource?.map((items, index) => {
                      return (<a href={items.url}><img src="http://s1.iconbird.com/ico/2013/2/634/w42h50139292027210.png"/><br/> Файл - {index + 1} </a>)
                    })}
                    </MDBCol>
                    </>
                  </MDBRow>
                </MDBCardBody>
                )}

              { data.answer && (
                <MDBCardBody className="p-0">
                <MDBRow>
                    <MDBCol sm="9">
                      <h5>Ответ</h5>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="5">
                      <MDBCardText>Время сдачи</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.answer.dateCreation)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="5">
                      <MDBCardText>Комментарий</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="7">
                      <MDBCardText className="text-muted">{data.answer.comment}</MDBCardText>
                    </MDBCol>
                    <hr/>
                    <>
                    <MDBCol sm="9">
                    {data.answer.resource?.map((items, index) => {
                      return (<a href={items.url}><img src="http://s1.iconbird.com/ico/2013/2/634/w42h50139292027210.png"/><br/> Файл - {index+1} </a>)
                    })}
                    </MDBCol>
                    </>
                  </MDBRow>
                </MDBCardBody>
                )}
                { data.work && 
                // data.studentId && 
                (
              <button onClick={() => setShowAnswerModal(true)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                    Ответить на задание
                  </button>
              )}

              </MDBCard>
                  


            </MDBCol>
            <MDBCol lg="6">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Название</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data.title}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Начало занятия</MDBCardText>
                      <MDBCardText>Конец занятия</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                    <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateStart)}</MDBCardText>
                      <MDBCardText className="text-muted">{Helper.dateByFormat(data.dateEnd)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Статус</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Helper.statusByFormat(data.status)}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Описание</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data.description}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Менторы</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data.mentors?.map((items) => {
                                   return <a href="#" id = {items.id}>{items.firstname} {items.lastname}</a>;
                              })}
                         </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

            </MDBCol>
            {/* <MDBCol lg="6"> */}
           
              {/* </MDBCol> */}
          </MDBRow>
          <MDBRow>
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции администратора</span>  </MDBCardText>
                      <button onClick={() => deleteWork(data.work.id)} type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Удалить задание
                      </button>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Изменить задание
                      </button>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                      </button>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Функции ментора</span>  </MDBCardText>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Изменить описание
                      </button>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                        Назначить ментора
                      </button>
                      <button type="button" class="btn btn-link" data-mdb-ripple-color="dark">
                      </button>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
        </MDBContainer>
      </section></>
  );
}

export default LessonInfo;

function WorkForm({handleUpdate}){

  const location = useLocation();
  const token = AuthService.getCurrentJwt()
  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };
  const [deadline, setDeadline] = React.useState(null);
  
  const [work, setWork] = useState({
      workId: 0,
      lessonId: location.state.itemId,
      title: "",
      description: "",
      deadline: null
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

  // useEffect(() => {
  //   const userData = [];
  //   getUsers(location.state.itemId)
  //   .then(response =>
  //     setUsers(response.data?.map((items) => {
  //        return {text: items.firstname +" "+ items.lastname, value: items.uuid}
  // })
  //   ))
  //   .then(setUsers(userData))
  //   .then(console.log(users))
  // }, []);

  const upload = (id) => {
    let currentFile = files.selectedFiles[0];

    setFiles({
      ...files,
      progress: 0,
      currentFile: currentFile,
    });
      UploadService.upload(currentFile, API_URL + "works/upload/"+location.state.courseId+"/" + location.state.itemId +"/"+ id, (event) => {
        setFiles({
          ...files,
          progress: Math.round((100 * event.loaded) / event.total),
        });
    })
      .then((response) => {
        handleUpdate(1);
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
                            <div className="mbsc-form-group-title">New lesson form</div>
                            <div className="mbsc-row">
                              <input hidden type="text "></input>
                                <div className="mbsc-col-md-12 mbsc-col-12">
                                    <Input onChange={handleChange}
                                    name="title" type="text"
                                    label="Название" placeholder="Название"
                                    inputStyle="box" labelStyle="floating" />
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
                            />
                            </div>
                          
                            </div>  

                            <div className="mbsc-row">
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Textarea with left icon" label="Description"
                                 onChange={handleChange}
                                 ></Textarea>
                                </div>

                                <div className="mbsc-col-md-12 mbsc-col-12">
                                <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select text files..." label="Files upload"></Input>
                                </div>

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
