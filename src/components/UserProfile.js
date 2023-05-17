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


      const handleChange = (e) => {
        const value = e.target.value;
        setProfile({
          ...profile,
          [e.target.name]: value
        });
        setIsChange(true);
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
                                            //  src="https://bootdey.com/img/Content/avatar/avatar7.png"
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
                  <input onChange={selectFile} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
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
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.firstname} type="text" name="firstname" className="form-control" id="fullName" placeholder="Enter full name" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="fullName">Фамилия</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.lastname} type="text" name="lastname"  className="form-control" id="fullName" placeholder="Enter full name" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="eMail">Email</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.email} type="email" name="email" className="form-control" id="eMail" placeholder="Enter email ID" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="phone">Телефон</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.phoneNumber} type="text" name="phoneNumber"  className="form-control" id="phone" placeholder="Enter phone number" />
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
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.githubUrl} type="url" name="githubUrl"  className="form-control" id="website" placeholder="Website url" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="Street">Должность</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.jobTitle} type="name" name="jobTitle"  className="form-control" id="Street" placeholder="Enter Street" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="ciTy">Департамент</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.department}  type="name" name="department"  className="form-control" id="ciTy" placeholder="Enter City" />
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <label for="sTate">Опыт</label>
                                          <input disabled = {state.disabled} onChange={handleChange} value={profile.experience} type="text" name="experience" className="form-control" id="sTate" placeholder="Enter State" />
                                      </div>
                                  </div>  
                              </div>
                              <div className="row gutters">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                      <h6 className="mb-2 text-primary">О себе</h6>
                                  </div>
                                  <div className="col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="form-group">
                                          <textarea disabled = {state.disabled} onChange={handleChange} value={profile.other} type="text" name="other" className="form-control" id="fullName" placeholder="Enter full name" />
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
                                          <><button onClick={postProfile} type="button" id="submit" name="submit" className="btn btn-primary">Сохранить</button><span>   </span></>
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
  