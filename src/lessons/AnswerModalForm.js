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

const API_URL = "http://localhost:8080/";
export default function AnswerForm({handleUpdate, workId}){

    const location = useLocation();
    const token = AuthService.getCurrentJwt()
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
    };

    const [answer, setAnswer] = useState({
        answerId: 0,
        workId: workId.id,
        comment: ""
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
      let currentFile = files.selectedFiles[0];
  
      setFiles({
        ...files,
        progress: 0,
        currentFile: currentFile,
      });
        UploadService.upload(currentFile, API_URL + "answer/upload/"+ id, (event) => {
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
  
    const handleChange = (e) => {
      const value = e.target.value;
      setAnswer({
        ...answer,
        [e.target.name]: value
      });
    };
  
    const postAnswer = (e) =>{
        e.preventDefault();
        const answerData = answer;
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        setAnswer({
            ...answer,
            workId: workId
          })
        var config = {
          method: 'post',
          url: API_URL + "answer",
          headers: { 
            'Authorization' : `Bearer ${token}`
          },
          data : answerData
        };
        axios(config)
        .then((response) => {
            const answerId = response.data;
            setAnswer({
              ...answer,
              answerId: answerId
            })
              if(files.selectedFiles.length!==0){
              upload(answerId);
          }
          }
          ).then(resp=>handleUpdate(1));
      }
    
    return(
        <Page>
              <div className="mbsc-grid mbsc-grid-fixed">
                  <div className="mbsc-form-group">
                    <Form  
                      onSubmit={postAnswer}
                        >
                      <div className="mbsc-row mbsc-justify-content-center scroll">
                          <div className="mbsc-col-md-1 mbsc-col-xl-8 mbsc-form-grid">
                              <div className="mbsc-form-group-title">Форма ответа</div>
                              <div className="mbsc-row">
                                  <div className="mbsc-col-md-12 mbsc-col-10">
                                  <Textarea name="comment" inputStyle="box" 
                                   labelStyle="stacked" startIcon="pencil"
                                   placeholder="Комментарии" label="Комментарии"
                                   onChange={handleChange}
                                   ></Textarea>
                                  </div>
                                <input type="hidden" value={workId.id}></input>
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
  