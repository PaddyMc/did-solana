import React from "react";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import LockIcon from "@material-ui/icons/Lock";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import QueueIcon from "@material-ui/icons/Queue";
import InfoIcon from "@material-ui/icons/Info";
import { Link } from "react-router-dom";

const Header = () => (
  <Wrapper>
    <ul>
      <li>
        <HomeIcon className="icon" />
        <Link to="/">Home</Link>
      </li>
      <li>
        <FingerprintIcon className="icon" />
        <Link to="/create-identifier">Create Identifier</Link>
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
    </ul>
  </Wrapper>
);

const Wrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
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

    a {
      text-decoration: none;
      font-size: 20px;
      color: #333;
    }
  }
`;

export default Header;
