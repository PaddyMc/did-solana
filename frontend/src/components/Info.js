import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { addService } from "../utils/add-service";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import UserMenu from "./UserMenu";
import "./AddService.css";
import ReactLoading from "react-loading";
import config from "../config";

const Info = () => {
  const [value] = useState();
  const [identifier, setIdentifier] = useState();
  const [type, setType] = React.useState("");
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const [account] = useState(JSON.parse(localStorage.getItem("account")));
  const [dataAccount] = useState(
    JSON.parse(localStorage.getItem("dataAccount"))
  );
  const [isLoading, setIsLoading] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  const getIdentifier = async () => {
    // Update the document title using the browser API
    const id = document.getElementById("standard-id").value;
    const key = document.getElementById("standard-key").value;
    if (id && key) {
      setIsLoading(true);
      setIdentifier();
      let identifier = await addService(
        config().identifierProgramId,
        account,
        dataAccount,
        id,
        type,
        key
      );
      setIsLoading(false);
      if (identifier) {
        setIdentifier(identifier);
      }
    }
  };
  return (
    <Wrapper>
      <Container maxWidth="ml">
        <Paper elevation="10" className="card">
          <Grid item xs={12} justify="center" className="headerGrid">
            <Grid item xs={12}>
              <div className="title">Information</div>
            </Grid>
            {dataAccount && (
              <Grid item xs={2} justify="center" className="menuGrid">
                <UserMenu refersh={identifier} />
              </Grid>
            )}
          </Grid>
        </Paper>
        <Grid direction="column" spacing={12} justify="space-between">
          <Paper elevation="10" className="spacing card">
            <div className="subtitle">Decentralised identifiers are useful because...</div>
          </Paper>
        </Grid>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;

  div.title {
    font-size: 35px;
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    font-family: roboto;
  }
  div.subtitle {
    font-size: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-family: roboto;
  }
`;

export default Info;
