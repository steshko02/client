import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import useOnClickOutside from './hooks/onClickOutside';
import { MenuContext } from '../context/navState';
import HamburgerButton from './HamburgerButton';
import { SideMenu } from './SideMenu';
import { Routes, Route, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import "../App.css";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/login.component";
import {  useLocation } from 'react-router-dom';


const Navbar = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  box-sizing: border-box;
  outline: currentcolor none medium;
  max-width: 100%;
  margin: 0px;
  align-items: center;
  background: #082bff none repeat scroll 0% 0%;
  color: rgb(248, 248, 248);
  min-width: 0px;
  min-height: 0px;
  flex-direction: row;
  justify-content: flex-start;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;
  z-index: 500;
`;
 //  padding: 6px 60px;

const MainMenu = () => {
  const node = useRef();
  const { isMenuOpen, toggleMenuMode } = useContext(MenuContext);

  const [currentUser, setcurrentUser] = useState(null);

  // const currentUser = AuthService.getCurrentUser()
  //  showAdminBoard = false
  //  showUserBoard = false
  // if(currentUser){
  //   showAdminBoard = currentUser.roles.includes("ROLE_ADMIN")
  //   showUserBoard = currentUser.roles.includes("ROLE_USER")
  // }
  

 function logOut() {
    AuthService.logout();
      currentUser =  undefined
  };

  useOnClickOutside(node, () => {
    // Only if menu is open
    if (isMenuOpen) {
      toggleMenuMode();
    }
  });

  const nav = useNavigate();
  const location = useLocation();

  useEffect (()=>{
     const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
     setcurrentUser(currentUser);
     }
     else if(location.pathname!=="/register"){
      nav("/login")
     }
  }, [])


  return (
    <header ref={node}>
      <Navbar>

     {currentUser ? (
           <><><HamburgerButton /><div>
            <h1>Senla Courses</h1>
          </div></>
          <div className="goLeft"><Link to={"/logout"} onClick={logOut} className="nav-link">
              LogOut
            </Link>
            </div>
            </> 
          ) : (
          <><h1>Senla Courses</h1><div>
            </div></>
          )} 
      </Navbar>
      <SideMenu />
    </header>
  );
};

export default MainMenu;