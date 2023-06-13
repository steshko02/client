import "./card.scss"
import axios from "axios";
import "./modal.css";
import http from "../http-common";

import AuthService from "../services/auth.service";
import React, { useEffect, useState,useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from "../services/Pagination";
import "./modal.css";
import { Button, Dropdown, Input, Page, setOptions,Textarea,Datepicker,Stepper, Select, Checkbox } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import Form from "react-validation/build/form";
import Modal from "react-overlays/Modal";
const API_URL = "http://localhost:8080/";


let PageSize = 8;
function Cards() {

    const token = AuthService.getCurrentJwt()
    const currentUser = AuthService.getCurrentUser()
    const showAdminBoard = currentUser ? currentUser.roles.includes("ROLE_ADMIN") : false
    const showUserBoard = currentUser ? currentUser.roles.includes("ROLE_USER") : false
    const showMentorBoard = currentUser ? currentUser.roles.includes("ROLE_LECTURER") : false
    const showStudentBoard = currentUser ? currentUser.roles.includes("ROLE_STUDENT") : false
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
    const filter_data = [
      { text: 'Все', value: 'ALL' },
      { text: 'Неначатые', value: 'NOT_STARTED' },
      { text: 'Законченные', value: 'FINISHED' },
      { text: 'Начатые', value: 'DURING' },
      // { text: 'Удаленные', value: 'DELETED' },
  ]
  
  const filter_data_user = [
    { text: 'Доступные', value: 'NOT_STARTED' },
    { text: 'Мои', value: 'FOR_USER' }
    // { text: 'Удаленные', value: 'DELETED' },
  ]
  
  const filter_data_MENTOR = [
    { text: 'Менторские', value: 'FOR_MENTOR' },
    { text: 'Все', value: 'ALL' },
    { text: 'Неначатые', value: 'NOT_STARTED' },
    { text: 'Законченные', value: 'FINISHED' },
    { text: 'Начатые', value: 'DURING' },
    // { text: 'Удаленные', value: 'DELETED' },
  ]

    const filter_final = mergeFilterData();

    const [filter, setFilter] = useState(filter_final[0].value);


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

function mergeFilterData() {
  let mergedData = new Set();

  if (showAdminBoard) {
     filter_data.forEach(item => mergedData.add(item));
     return Array.from(mergedData);
  }  if (showUserBoard || showStudentBoard) {
    filter_data_user.forEach(item => mergedData.add(item));
  }  if (showMentorBoard) {
    filter_data_MENTOR.forEach(item => mergedData.add(item));
  } 

  return Array.from(mergedData);
}



  return (
    
   <>
   <div>
   <div className="wrapper">

      {post.map((items) => {
        return <Card
          img={items.resource ? items.resource.url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjr__O2vAvx27W_uzYxtssdgDugdZNnAKxeA&usqp=CAU'}
          title={items.title}
          description={items.description}
          id={items.id} />;
      })}
    </div>
    <div className="course_filter">
    <Select
        placeholder="Отобразить ..."
        data={filter_final}
        selectMultiple={false}
        touchUi={false}
        inputStyle="box"
        defaultValue= {filter}
        onChange={(item) => setFilter(item.value)}
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
            <div className="modal-title modal-title">Форма</div>
            <div>
              <span className="close-button course" onClick={handleClose}>
                x
              </span>
            </div>
          </div>

          <CourseForm  handleUpdate={handleUpdate}/>

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
        {showAdminBoard &&
        <button onClick={() => setShowModal(true)} type="button" class="btn btn-link fixed" data-mdb-ripple-color="dark">
                    Добавить курс
        </button>
        }
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
        img :pictureUrl ? pictureUrl :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjr__O2vAvx27W_uzYxtssdgDugdZNnAKxeA&usqp=CAU'
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
      >Подробнее</button>
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
  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const errorMessages = {
    title: 'Имя пользователя должно быть больше 2 и меньше 30 символов',
    description: 'Описание должно быть больше 10 и меньше 100 символов',
    size: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    dateRange: 'Количество мест является обязаельным полем, должно бьть больше 5 и не должно превышать 100',
    selectMentors: 'Поле не должно быть пустым',
    files: 'Фото курса является обязательным'
    // Остальные сообщения об ошибках
  };
  const currentDate = new Date(); // Текущая дата

  const validationRules = {
    title: (value) => value.trim().length <= 2 || value.trim().length > 30,
    description: (value) => value.trim().length <= 10 || value.trim().length > 100,
    size: (value) =>  value > 100 || value <= 5,
    selectMentors:  (value) =>  value.length < 1 ||  value.length > 5,
    files: (value) =>  value.length < 1 ||  value.length > 1,
    // Остальные правила валидации
  };
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
    setIsSaveDisabled(false);
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: '', // Сброс ошибки, если данные валидны
    }));
    setIsSaveDisabled(true);
  }
  // const hasErrors = Object.values(errors).some((error) => error !== '');
  // setIsSaveDisabled(hasErrors);
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
    setIsSaveDisabled(false);
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      ["selectMentors"]: '', // Сброс ошибки, если данные валидны
    }));
    // const hasErrors = Object.values(errors).some((error) => error !== '');
    // setIsSaveDisabled(hasErrors);
    setIsSaveDisabled(true);
  }
};

   const postCourse = (e) => {
    e.preventDefault();
    const courseData = course;
    const response = axios.post(API_URL + "courses", courseData,config)
    .then(handleUpdate(1)
    ).then(response => uploadPicture(response.data).then(resp=>handleUpdate(1)));
    };

    const selectFile = (e) => {
      setFiles({
        ...files,
        selectedFiles: e.target.files,
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

  return(
      <Page className="scroll">
            <div className="mbsc-grid mbsc-grid-fixed">
                <div className="mbsc-form-group">
                  <Form  
                    onSubmit={postCourse}
                      >
                    <div className="mbsc-row mbsc-justify-content-center">
                        <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                            <div className="mbsc-form-group-title">Форма создания курса</div>
                            <div className="mbsc-row">
                              <input hidden type="text "></input>
                                <div className="mbsc-col-md-12 mbsc-col-12">
                                    <Input
                                     onChange={handleChange}
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
                            label="Временные рамки" placeholder="Временные рамки"
                            labelStyle="floating"
                            controls={['calendar', 'time']}
                            name="dateRange"
                            select="range"
                            inputStyle="box"
                            touchUi={true}
                            value={range}
                            min = {new Date()}
                            onChange={pickerChange}
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
                                    filter = {true}
                                    onFilter={userFilter}
                                    error={`${errors.selectMentors ? 'true' : ''}`}
                                    required 
                                />  
                                  {errors.selectMentors && <div style={{ color: 'red', fontSize: '12px' }}>{errors.selectMentors}</div>}

                                </div>
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Textarea name="description" inputStyle="box" 
                                 labelStyle="stacked" startIcon="pencil"
                                 placeholder="Введите описание курса" label="Описание"
                                 onChange={handleChange}
                                 error={`${errors.description ? 'true' : ''}`}
                                 ></Textarea>
                                {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}

                                </div>
                              
                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Input 
                                error={`${errors.size ? 'true' : ''}`}
                                name="size" min="1" max = "100" onChange={handleChange} multiple inputStyle="box" labelStyle="stacked" type="number" placeholder="Введите количество мест..." label="Места"></Input>
                                {errors.size && <div style={{ color: 'red', fontSize: '12px' }}>{errors.size}</div>}
                                </div>

                                <div className="mbsc-col-md-12 mbsc-col-10">
                                <Input
                                accept=".jpg,.jpeg,.png"
                                hasError={`${errors.files ? 'true' : ''}`}
                                onChange={selectFile} inputStyle="box" labelStyle="stacked" type="file" startIcon="folder" placeholder="Выберите фото..." label="Загрузка фото" required ></Input>
                                {errors.files && <div style={{ color: 'red', fontSize: '12px' }}>{errors.files}</div>}
                                </div>
                            </div>
                            <Button 
                               disabled={isSaveDisabled &&  course.dateStart === null
                               || course.dateEnd ===null || course.ids.length === 0 || !files.selectedFiles}
                              type="submit">Сохранить</Button>
                        </div>  

                    </div>
                    </Form>
                </div>
            </div>
        </Page>
  );
}
