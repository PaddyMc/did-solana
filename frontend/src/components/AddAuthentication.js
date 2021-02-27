import React, { useState } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { addAuthentication } from "../utils/add-authentication";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ReactLoading from "react-loading";
import UserMenu from "./UserMenu";
import "./Home.css";
import config from "../config";
import LaunchIcon from "@material-ui/icons/Launch";
import { Tooltip } from "@material-ui/core";

const AddAuthentication = () => {
  const [account] = useState(JSON.parse(localStorage.getItem("account")));
  const [dataAccount] = useState(
    JSON.parse(localStorage.getItem("dataAccount"))
  );
  const [identifier, setIdentifier] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  const getIdentifier = async () => {
    setIsLoading(true);
    setIdentifier();
    // Update the document title using the browser API
    let identifier = await addAuthentication(
      config().identifierProgramId,
      account,
      dataAccount
    );
    setIsLoading(false);
    if (identifier) {
      setIdentifier(identifier);
    }
  };
  return (
    <Wrapper>
      <Container maxWidth="ml">
        <Paper elevation="10" className="card">
          <Grid item xs={12} justify="center" className="headerGrid">
            <Grid item xs={12}>
              <div className="title">Add Authentication</div>
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
            <div className="subtitle">Add a public key to your DID</div>
            <Grid justify="center" container spacing={3}>
              <Grid
                item
                className="button"
                alignItems="center"
                justify="center"
                align="center"
                xs={8}
              >
                {!!account ? (
                  <Button
                    className="buttonAuthPage"
                    variant="contained"
                    color="secondary"
                    onClick={() => getIdentifier()}
                    startIcon={<AddIcon />}
                  >
                    Add Authentication Method
                  </Button>
                ) : (
                  <Typography className="title" color="textSecondary">
                    Please create an identifier in the "Create Identifier" tab
                  </Typography>
                )}
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
                      Newly added account address
                    </Typography>
                    <Grid item className="linkgrid" justify="space-between">
                      <Typography component="p" gutterBottom>
                        {identifier && identifier.newAccount}
                      </Typography>
                      <a
                        target="_blank"
                        className="link"
                        href={`http://explorer.solana.com/address/${identifier.newAccount}?cluster=devnet`}
                      >
                        <Tooltip className="link" title={"View on explorer"}>
                          <LaunchIcon />
                        </Tooltip>
                      </a>
                    </Grid>
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

export default AddAuthentication;
