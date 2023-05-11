import "./card.scss"
import axios from "axios";
import "./modal.css";
import http from "../http-common";

import AuthService from "../services/auth.service";
import React, { useEffect, useState,useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from "../services/Pagination";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress, MDBProgressBar, MDBIcon,MDBListGroup,MDBListGroupItem, MDBCardLink
} from 'mdb-react-ui-kit';
import "./modal.css";
import { Button, Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import Modal from "react-overlays/Modal";
import UploadService from "../services/UploadService";
import Helper from "../services/Helper"

const API_URL = "http://localhost:8080/";


let PageSize = 4;
function Cards() {

    const token = AuthService.getCurrentJwt()

    // const [number, setNumber] = useState(0);

    const [pagination, setPagination] = useState({
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
  });

    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    const [post, setPost] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [addLesson, setaddLesson] = useState(0);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
      axios.get("http://localhost:8080/courses/filter/" + filter,
      {
        params: {
          "number": pagination.currentPage-1,
          "size": PageSize
        },
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
      },

      ).then((response) => {
        setPost(response.data.courseDtos);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount
        });
        setaddLesson(response.data.courseDtos.totalCount);
      });
    },  

[pagination.currentPage, addLesson,filter]);


const handleUpdate = (obj) => {
  setaddLesson(addLesson+obj);
  handleClose();
};

  var handleClose = () => setShowModal(false);

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;
  const props1 = { placeholder: 'Please Select...', label: 'Calendar' };

  const filter_data = [
    { text: 'Все', value: 'ALL' },
    { text: 'Неначатые', value: 'NOT_STARTED' },
    { text: 'Законченные', value: 'FINISHED' },
    { text: 'Начатые', value: 'DURING' },
    { text: 'Удаленные', value: 'DELETED' },
]

  return (
    
   <>
   <div>
   <div className="wrapper">

      {post.map((items) => {
        return <Card
          img={items.resource ? items.resource.url : 'https://ultimateqa.com/wp-content/uploads/2020/12/Java-logo-icon-1.png'}
          title={items.title}
          description={items.description}
          id={items.id} />;
      })}
    </div>
    <div>
    <Select
        placeholder="Отобразить ..."
        data={filter_data}
        selectMultiple={false}
        touchUi={false}
        inputStyle="box"
        defaultValue='ALL'
        onChange={(item) => setFilter(item.value)}
        filter = {true}
      />
    </div>
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

          <CourseForm handleUpdate={handleUpdate}/>

          <div className="modal-footer course">
            <button className="secondary-button course" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
      </section>
    <Pagination
        className="pagination-bar fixed"
        currentPage= {pagination.currentPage}
        totalCount= {pagination?.totalCount}
        pageSize= {PageSize}
        onPageChange={page => setPagination({
          ...pagination,
        currentPage: page })} />
        <button onClick={() => setShowModal(true)} type="button" class="btn btn-link fixed" data-mdb-ripple-color="dark">
                    Добавить курс
        </button>
        </div>
        </>
  );
}


function Card(props) {

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
    
    <div className="card_c">
      <div className="card_c__body">
        <img src={props.img} class="card_c__image" />
        <h2 className="card_c__title">{props.title}</h2>
        <p className="card_c__description">{props.description}</p>
      </div>
      <button className="card_c__btn" id={props.id} 
      onClick= {() => {redirectCourse(props.id,props.img)}}
      >View</button>
    </div>
  );
}

export default Cards;
// ReactDOM.render(<Cards />, document.getElementById("root"));


function CourseForm({handleUpdate}){

  const token = AuthService.getCurrentJwt()
  const config = {
      headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
  };

  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const userData = [];
    getUsers()
    .then(response =>
      setUsers(response.data?.map((items) => {
         return {text: items.firstname +" "+ items.lastname, value: items.uuid}
  })
    ))
    .then(setUsers(userData))
    .then(console.log(users))
  }, []);


const getUsers = () => {
  const response = axios.get("http://localhost:8080/users",
    config
  );
  return response;
}

const handleChange = (e) => {
  const value = e.target.value;
  setCourse({
    ...course,
    [e.target.name]: value
  });
};

const [range, setRange] = React.useState(null);


const [course, setCourse] = useState({
  title: "",
  description: "",
  dateStart: null,
  dateEnd: null,
  ids: []
});

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

   const postCourse = (e) => {
    e.preventDefault();
    const courseData = course;
    const response = axios.post(API_URL + "courses", courseData,config).then(
    ).then(response => uploadPicture(response.data).then(resp=>handleUpdate(1)));
    };

    const selectFile = (ev) => {
      setFiles({
        ...files,
        selectedFiles: ev.target.files,
      });
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

  return(
      <Page>
            <div className="mbsc-grid mbsc-grid-fixed">
                <div className="mbsc-form-group">
                  <Form  
                    onSubmit={postCourse}
                      >
                    <div className="mbsc-row mbsc-justify-content-center scroll">
                        <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                            <div className="mbsc-form-group-title">New lesson form</div>
                            <div className="mbsc-row">
                              <input hidden type="text "></input>
                                <div className="mbsc-col-md-12 mbsc-col-12">
                                    <Input
                                     onChange={handleChange}
                                    name="title" type="text"
                                    label="Название" placeholder="Название"
                                    inputStyle="box" labelStyle="floating" />
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
                                />  
                                </div>
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Textarea with left icon" label="Description"
                                 onChange={handleChange}
                                 ></Textarea>
                                </div>
                              
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Input name="size" onChange={handleChange} multiple inputStyle="box" labelStyle="stacked" type="number" placeholder="Input size..." label="Size"></Input>
                                </div>

                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Input onChange={selectFile} multiple inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Select photo..." label="File upload"></Input>
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
