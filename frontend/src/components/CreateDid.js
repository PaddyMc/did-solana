import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { createDid } from "../utils";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ReactLoading from "react-loading";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { getAccountInfo } from "../utils/index";
import { Account } from "@solana/web3.js";
import { values } from "ramda";
import Divider from "@material-ui/core/Divider";
import UserMenu from "./UserMenu";
import "./Home.css";
import config from "../config";
import LaunchIcon from "@material-ui/icons/Launch";
import { Tooltip } from "@material-ui/core";

const CreateDid = () => {
  const [value] = useState();
  const [identifier, setIdentifier] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataAccount, setDataAccount] = useState(
    JSON.parse(localStorage.getItem("dataAccount"))
  );

  // Similar to componentDidMount and componentDidUpdate:
  const getIdentifier = async () => {
    // Update the document title using the browser API
    const hacky = document.getElementById("standard-basic").value;
    if (hacky) {
      setIsLoading(true);
      setIdentifier();
      let identifier = await createDid(config().identifierProgramId, hacky);
      if (identifier) {
        setIdentifier(identifier);
        setDataAccount(true);
      }
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Container maxWidth="ml">
        <Paper elevation="10" className="card">
          <Grid item xs={12} justify="center" className="headerGrid">
            <Grid item xs={12}>
              <div className="title">Create Identifier</div>
            </Grid>
          </Grid>
        </Paper>
        <Grid direction="column" spacing={12} justify="space-between">
          <Paper elevation="10" className="spacing card">
            <Grid item justify="space-between" className="headergrid">
              <div className="subtitle">
                Create a decentralized identifier (DID)
              </div>
              {dataAccount && (
                <Grid item xs={2} justify="center" className="menuGrid">
                  <UserMenu refersh={identifier} />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={3}>
              <Grid
                alignItems="center"
                align="center"
                className="textgrid"
                item
                xs={8}
              >
                <TextField
                  value={value}
                  id="standard-basic"
                  maxWidth="1000px"
                  label="Please enter an aka (also known as) here to create a DID..."
                  color="default"
                />
              </Grid>
              <Grid
                item
                className="button"
                alignItems="center"
                justify="center"
                align="center"
                xs={4}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => getIdentifier()}
                  startIcon={<AddIcon />}
                >
                  Create Identifier
                </Button>
              </Grid>
            </Grid>
            {isLoading && (
              <Grid
                container
                className="spacing"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <ReactLoading type={"bars"} color={"#d117e7"} />
              </Grid>
            )}
            {identifier && (
              <Grid
                container
                className="spacing"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <Card className="root" variant="outlined">
                  <CardContent>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Data account (Use this to query data in the Home tab)
                    </Typography>
                    <Grid item className="linkgrid" justify="space-between">
                      <Typography component="p" gutterBottom>
                        {identifier && identifier.dataAccount}
                      </Typography>
                      <a
                        target="_blank"
                        className="link"
                        href={`http://explorer.solana.com/address/${identifier.dataAccount}?cluster=devnet`}
                      >
                        <Tooltip className="link" title={"View on explorer"}>
                          <LaunchIcon />
                        </Tooltip>
                      </a>
                    </Grid>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Your account address
                    </Typography>
                    <Grid item className="linkgrid" justify="space-between">
                      <Typography component="p" gutterBottom>
                        {identifier && identifier.ownerAccount}
                      </Typography>
                      <a
                        target="_blank"
                        className="link"
                        href={`http://explorer.solana.com/address/${identifier.ownerAccount}?cluster=devnet`}
                      >
                        <Tooltip className="link" title={"View on explorer"}>
                          <LaunchIcon />
                        </Tooltip>
                      </a>
                    </Grid>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Information
                    </Typography>
                    <Typography component="p" gutterBottom>
                      Your account has be added to local storage for use adding
                      authentication and services
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
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
export default CreateDid;
