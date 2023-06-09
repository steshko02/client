import "./up.css"
import React, { useEffect, useState,useMemo, useRef } from 'react';
import axios from "axios";
import AuthService from "../services/auth.service";
import http from "../http-common";

const API_URL = "http://localhost:8080/";


export default function UserProfile() {
 
    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    const inputFile = useRef(null);

    const [show, setshow] = useState(false);
    const [update, setUpdate] = useState(0);
    const [isChange, setIsChange] = useState(false);
    const [state, setState] = useState({ disabled: true });
    const [hasProfile, sethasProfile] = useState(false);
    const [errors, setErrors] = useState({}); // Состояние для хранения ошибок
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);


    const [files, setFiles] = useState({
        selectedFiles: undefined,
        currentFile: undefined
    });

    const [profile, setProfile] = useState({ 
        id: undefined,
        department: '',
        phoneNumber:  '',
        githubUrl: '',
        jobTitle: '',
        other : '',
        experience: '',
        firstname: '',  
        lastname:'',
        email:'',
        photoUrl: 'https://bootdey.com/img/Content/avatar/avatar7.png'
      });

    //   department experience other githubUrl jobTitle

      const errorMessages = {
        firstname: 'Имя пользователя должно быть больше 2 и меньше 30 символов',
        lastname: 'Фамилия пользователя должна быть больше 2 и меньше 30 символов',
        email: 'Некорректный формат электронной почты',
        phoneNumber: 'Некорректный формат номера телефона',
        department: 'Департамент должен быть не больше 30 символов',
        experience: 'Опты может состоять только из цифр',
        other: 'Информация должнф быть не больше 100 символов',
        githubUrl: 'Некорректный формат GitHub URL',
        jobTitle: 'Поле должно быть не более 40 символов',
        // Остальные сообщения об ошибках
      };

      const validationRules = {
        firstname: (value) => value.trim().length <= 2 || value.trim().length > 30,
        lastname: (value) => value.trim().length <= 2 || value.trim().length > 30,
        email: (value) => !/^\S+@\S+\.\S+$/.test(value),
        phoneNumber: (value) => !(/^\+[\d]{12}$/.test(value)),
        githubUrl: (value) => !/^https:\/\/github\.com/.test(value),
        experience: (value) => !/^\d+$/.test(value),
        jobTitle: (value) => value.trim().length <= 3 || value.trim().length > 40,
        other: (value) => value.trim().length <= 3 || value.trim().length > 100,
        department: (value) => value.trim().length <= 3 || value.trim().length > 30,
        // Остальные правила валидации
      };

      const handleChange = (e) => {
        const value = e.target.value;
        setProfile({
          ...profile,
          [e.target.name]: value
        });
        setIsChange(true);
        const hasErrors = Object.values(errors).some((error) => error !== '');
              setIsSaveDisabled(hasErrors);
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

      };

      const handleShowButton = (e) => {
        setState({disabled: false});
      };

      const handleChangeCansel = (e) => {
        setState({disabled: true});
        setIsChange(false);
        setUpdate(update+1);
      }

      const uploadPicture = () => {
        let currentFile = files.selectedFiles[0];
    
        setFiles({
          ...files,
          progress: 0,
          currentFile: currentFile,
        });
    
        const token = AuthService.getCurrentJwt();
        const config = {
            headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*","Content-Type": "multipart/form-data"}};
    
        let picture = new FormData();
    
        picture.append("picture", currentFile);
    
        return http.post("http://localhost:8080/profile/avatar", picture, config).then(setshow(false)).then(setUpdate(update+1));
      }
    

    const postProfile = (e) =>{
        e.preventDefault();
        const profileData = profile;

        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        var config = {
          method: !hasProfile? 'post' : 'put',
          url: API_URL + "profile",
          headers: { 
            'Authorization' : `Bearer ${token}`
          },
          data : profileData
        };
        axios(config)
        .then((response) => {
            const respId = response.data;
            setProfile({
                ...profile,
                id: respId
              });
              setState({disabled: true});
              setIsChange(false);
            },
          )
          setUpdate(update+2)
    }
    

    useEffect(() => {
        axios.get("http://localhost:8080/profile",
        {
            headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
          },
        ).then((response) => {
            setProfile({
                ...profile,
                id: response.data.id,
                department: response.data.department,
                phoneNumber: response.data.number,
                githubUrl: response.data.githubUrl,
                other: response.data.other,
                experience: response.data.experience,
                lastname: response.data.lastname,
                firstname: response.data.firstname,
                email: response.data.email,
                lastname: response.data.lastname,
                jobTitle: response.data.jobTitle,
                photoUrl: response.data.photoUrl!==null ?  response.data.photoUrl : 'https://bootdey.com/img/Content/avatar/avatar7.png'
              });
              if(response.data.id!=null){
              sethasProfile(true);
              }
        });
      },  
    [update]);

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
      };

      const selectFile = (ev) => {
        setFiles({
          ...files,
          selectedFiles: ev.target.files,
        });

        setshow(true);
        console.log(files.selectedFiles);
      }
      return (
        <><br /><br /><br />
            <div className="container">
              <div className="row gutters">
                  <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                      <div className="card h-100">
                          <div className="card-body">
                              <div className="account-settings">
                                  <div className="user-profile">
                                      <div className="user-avatar">
                                      <a href="#" onClick={onButtonClick}>
                                        <div>
                                            <img  className="image" 
                                            src = {files.selectedFiles ? URL.createObjectURL(files?.selectedFiles[0]) : profile.photoUrl}
                                            alt="Photo" />
                                        </div>
                                        </a>
                                        {show && <a onClick={uploadPicture} href="#">Сохранить</a>}
                                      </div>
                                      <h5 className="user-name">{profile.firstname + " " + profile.lastname}</h5>
                                      <h6 className="user-email">{profile.email}</h6>
                                      <h6 className="user-email">{profile.phoneNumber}</h6>
                                  </div>
                                  <div className="about">
                                  <h5>О себе</h5>
                                      <p>{profile.other}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <input  accept=".jpg,.jpeg,.png" onChange={selectFile} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                  <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                      <div className="card h-100">
                          <div className="card-body">
                              <div className="row gutters">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                      <h6 className="mb-2 text-primary">Персональные данные</h6>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="fullName">Имя</label>
                                          <input 
                                        className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}

                                          disabled = {state.disabled}
                                           onChange={handleChange} 
                                           value={profile.firstname}
                                            type="text" name="firstname"
                                              id="fullName" placeholder="Имя" />
                                      </div>
                                      {errors.firstname && <div style={{ color: 'red', fontSize: '12px' }}>{errors.firstname}</div>}

                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="fullName">Фамилия</label>
                                          <input
                                          className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}

                                          disabled = {state.disabled} onChange={handleChange} value={profile.lastname} type="text" name="lastname"  id="fullName" placeholder="Фамилия"/>
                                      </div>
                                      {errors.lastname && <div style={{ color: 'red', fontSize: '12px' }}>{errors.lastname}</div>}
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="eMail">Email</label>
                                          <input
                                   className={`form-control ${errors.email ? 'is-invalid' : ''}`}

                                          disabled = {state.disabled} onChange={handleChange} value={profile.email} type="email" name="email" id="eMail" placeholder="Email"/>
                                      </div>
                                      {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>}

                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="phone">Телефон</label>
                                          <input 
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                          disabled = {state.disabled} onChange={handleChange} value={profile.phoneNumber} type="text"
                                           name="phoneNumber"  id="phone" placeholder="Телефон" />
                                             {errors.phoneNumber && <div style={{ color: 'red', fontSize: '12px' }}>{errors.phoneNumber}</div>}

                                      </div>    
                                  </div>
                              </div>
                              <div className="row gutters">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                      <h6 className="mt-3 mb-2 text-primary">Рабочие данные</h6>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="website">GitHub URL</label>
                                          <input
                                           className={`form-control ${errors.githubUrl ? 'is-invalid' : ''}`}
                                           disabled = {state.disabled} onChange={handleChange}
                                            value={profile.githubUrl} type="url" name="githubUrl"  
                                             id="website" placeholder="Github" />
                                              {errors.githubUrl && <div style={{ color: 'red', fontSize: '12px' }}>{errors.githubUrl}</div>}
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="Street">Должность</label>
                                          <input 
                                           className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`}
                                          disabled = {state.disabled} 
                                          onChange={handleChange} value={profile.jobTitle}
                                           type="name" name="jobTitle" id="Street" placeholder="Должность" />
                                           {errors.jobTitle && <div style={{ color: 'red', fontSize: '12px' }}>{errors.jobTitle}</div>}

                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="ciTy">Департамент</label>
                                          <input
                                             className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                           disabled = {state.disabled} onChange={handleChange} 
                                           value={profile.department}  type="name" name="department"  id="ciTy" placeholder="Департамент" />
                                    {errors.department && <div style={{ color: 'red', fontSize: '12px' }}>{errors.department}</div>}

                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="sTate">Опыт (лет)</label>
                                          <input 
                                            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                                          disabled = {state.disabled} onChange={handleChange} value={profile.experience} type="text" name="experience"
                                           id="sTate" placeholder="Опыт (лет)" />
                                          {errors.experience && <div style={{ color: 'red', fontSize: '12px' }}>{errors.experience}</div>}

                                      </div>
                                  </div>  
                              </div>
                              <div className="row gutters">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                      <h6 className="mb-2 text-primary">О себе</h6>
                                  </div>
                                  <div className="col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <textarea
                                          className={`form-control ${errors.other ? 'is-invalid' : ''}`}
                                          disabled = {state.disabled} onChange={handleChange} value={profile.other} type="text" name="other"
                                           id="fullName" placeholder="О себе" />
                                          {errors.other && <div style={{ color: 'red', fontSize: '12px' }}>{errors.other}</div>}

                                      </div>
                                  </div>
                                </div>
                              <div className="row gutters">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                      <div className="text-left">
                                        {!isChange && 
                                          <><button onClick={handleShowButton}  type="button" id="submit" name="submit" className="btn btn-primary">Изменить</button>
                                          <span>   </span></>
                                        }
                                         {isChange && 
                                          <><button   disabled={isSaveDisabled}
                                          onClick={postProfile} type="button" id="submit" name="submit" className="btn btn-primary">Сохранить</button><span>   </span></>
                                         }
                                          <button onClick={handleChangeCansel} type="button" id="submit" name="submit" className="btn btn-secondary">Отменить</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div></>
    );
}
  