import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import LockIcon from "@material-ui/icons/Lock";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import QueueIcon from "@material-ui/icons/Queue";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "./Home.css";

const Header = () => {
  return (
    <Paper elevation="10" className="headercard">
      <Wrapper>
        <li>
          <HomeIcon className="icon" />
          <Link to="/">Home</Link>
        </li>
        <li>
          <FingerprintIcon className="icon" />
          <Link to="/create-identifier">Create Identifier </Link>
        </li>
        <li>
          <LockIcon className="icon" />
          <Link to="/add-authentication">Add Authentication</Link>
        </li>
        <li>
          <LibraryAddCheckIcon className="icon" />
          <Link to="/add-service">Add Service</Link>
        </li>
        <li>
          <QueueIcon className="icon" />
          <Link to="/create-service">Create Service</Link>
        </li>
        <li>
          <InfoIcon className="icon" />
          <Link to="/info">Information</Link>
        </li>
      </Wrapper>
    </Paper>
  );
};
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    align-items: center;
    justify-content: center;
    display: inline-flex;
    margin-left: 40px;
    font-family: roboto;
    hover {
       
    }

    a {
      text-decoration: none;
      font-size: 20px;
      color: #333;
    }
  }
  li:hover {
  color: #00ffbd;
  
  }
  li.user {
    display:contents;
    margin-left 10px;
    }
`;

export default Header;
