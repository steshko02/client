import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Confirm.css";
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import Cards from "./courses/Card";
import { useNavigate } from "react-router-dom";

import AuthVerify from "./common/auth-verify";

import NavState from "./context/navState"
import MainMenu from "./menu/MainMenu"

import EventBus from "./common/EventBus";
import CourseInfo from "./courses/CourseInfo";
import Lessoninfo from "./lessons/LessonInfo"


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showUserBoard: false,
      showAdminBoard: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
        const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("ROLE_USER"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    else{}
    
    EventBus.on("logout", () => {
      const nav = useNavigate();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showUserBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showUserBoard, showAdminBoard } = this.state;

    // const { currentUser } = this.state;

    return (
    <div>
      <div>
      <NavState>
        <MainMenu />
      </NavState>
      </div>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/courses" element={<Cards />} />
            <Route path="/course-info" element={<CourseInfo />} />
            <Route path="/lesson" element={<Lessoninfo />} />
          </Routes>
           <AuthVerify logOut={this.logOut} />

       </div>
    );

  }
}

export default App;