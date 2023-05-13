import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { MenuContext } from '../context/navState';
import arrow from '../arrow.svg';
import { Routes, Route, Link } from "react-router-dom";

import AuthService from "../services/auth.service";
const Menu = styled.nav`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 293;
  display: block;
  width: 250px;
  max-width: 100%;
  margin-top: 0px;
  padding-top: 100px;
  padding-right: 0px;
  align-items: stretch;
  background-color: #001698;
  transform: translateX(-100%);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  ${(props) =>
    props.open &&
    css`
      transform: translateX(0);
    `}
`;

export const MenuLink = styled.a`
  position: relative;
  display: block;
  text-align: left;
  max-width: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 16%;
  background-image: url(${arrow});
  background-position: 69% 55%;
  background-size: 26px;
  background-repeat: no-repeat;
  transition: background-position 300ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  line-height: 120%;
  font-weight: 500;
  :hover {
    background-position: 90% 50%;
  }
`;

export const SideMenu = ({ children }) => {
  const { isMenuOpen } = useContext(MenuContext);
  return <Menu open={isMenuOpen}>{children}</Menu>;
};

const currentUser = AuthService.getCurrentUser()
const showAdminBoard = currentUser ? currentUser.roles.includes("ROLE_ADMIN") : false
const showUserBoard = currentUser ? currentUser.roles.includes("ROLE_USER") : false
const showMentorBoard = currentUser ? currentUser.roles.includes("ROLE_LECTURER") : false
const showStudentBoard = currentUser ? currentUser.roles.includes("ROLE_STUDENT") : false


SideMenu.propTypes = {
  children: PropTypes.node,
};

SideMenu.defaultProps = {


  children: (
    <>
     { showUserBoard && (
      <>
      <MenuLink href="/">Главная</MenuLink>
      <MenuLink href="/courses">Курсы</MenuLink>
      <MenuLink href="/profile">Профиль</MenuLink>
      </>
     )} 
     { showAdminBoard && (
      <>
      <MenuLink href="/admin">Админитратор</MenuLink>
      <MenuLink href="/users">Пользователи</MenuLink>
      <MenuLink href="/courses">Курсы</MenuLink>
      <MenuLink href="/profile">Профиль</MenuLink>
      </>
     )} 
          { showMentorBoard && (
      <>
      <MenuLink href="/mentors">Ментор</MenuLink>
      </>
     )} 
          { showStudentBoard && (
      <>
      <MenuLink href="/learn-process">Учебный процесс</MenuLink>
      </>
     )} 
    </>
  ),
};