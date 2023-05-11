import React, { useEffect } from "react";
import { withRouter } from "./with-router";

const parseJwt = (auth) => {
  try {
    // return JSON.parse(atob(token.split('.')[1]));
      const token = auth.replace("Bearer ", "");
      return JSON.parse(atob(token.split('.')[1]));
      // const rolesUser = JSON.stringify(decodedJwt);
    
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  let location = props.router.location;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userToken"));

    if (user) {
      const decodedJwt = parseJwt(user);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  }, [location]);

  return <div></div>;
};

export default withRouter(AuthVerify);
