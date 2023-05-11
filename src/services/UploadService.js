import http from "../http-common";
import AuthService from "./auth.service";

class UploadFilesService {

  upload(file,path, onUploadProgress) {

    const token = AuthService.getCurrentJwt();
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*","Content-Type": "multipart/form-data",}
    };

    let formData = new FormData();

    formData.append("file", file);

    return http.post(path, formData,config, {
      config,
      onUploadProgress,
    });
  }

  upload(file,path) {

    const token = AuthService.getCurrentJwt();
    const config = {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*","Content-Type": "multipart/form-data",}
    };

    let formData = new FormData();

    formData.append("file", file);

    return http.post(path, formData,config, {
      config,
    });
  }

  uploadVideo(file,path) {

    // let formData = new FormData();

    // formData.append("file", file);

    return http.put(path, file,{
      headers:{
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new UploadFilesService();
