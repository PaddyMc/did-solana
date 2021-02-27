import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { createService } from "../utils/create-service";
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
import config from "../config.js";
import LaunchIcon from "@material-ui/icons/Launch";
import { Tooltip } from "@material-ui/core";

const CreateService = () => {
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
      let identifier = await createService(
        config().licenceProgramId,
        account,
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
              <div className="title">Create Service</div>
            </Grid>
          </Grid>
        </Paper>
        <Grid direction="column" spacing={12} justify="space-between">
          <Paper elevation="10" className="spacing card">
            <Grid item justify="space-between" className="headergrid">
              <div className="subtitle">Create a new service</div>
              {dataAccount && (
                <Grid item xs={2} justify="center" className="menuGrid">
                  <UserMenu refersh={identifier} />
                </Grid>
              )}
            </Grid>
            {!!account ? (
              <Fragment>
                <Grid container justify="center" spacing={6}>
                  <Grid
                    alignItems="center"
                    align="center"
                    className="textgrid"
                    item
                    xs={8}
                  >
                    <TextField
                      value={value}
                      id="standard-id"
                      className="inputstop"
                      maxWidth="1000px"
                      label="Please enter an id here..."
                      color="default"
                    />
                    <FormControl className="inputs">
                      <InputLabel id="label">
                        Please select a service type...
                      </InputLabel>
                      <Select
                        labelId="label"
                        id="select"
                        value={type}
                        onChange={handleChange}
                      >
                        <MenuItem value={"AMM License"}>AMM Licence</MenuItem>
                        <MenuItem value={"Bridge License"}>
                          Bridge Licence
                        </MenuItem>
                        <MenuItem value={"Generic License"}>
                          Generic License
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      value={value}
                      className="inputs"
                      id="standard-key"
                      maxWidth="1000px"
                      label="Please enter the public key or program id of the subject..."
                      color="default"
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  alignItems="center"
                  justify="flex-end"
                  align="center"
                  className="button"
                  xs={10}
                >
                  <Button
                    variant="contained"
                    className="buttonServicePage"
                    color="secondary"
                    onClick={() => getIdentifier()}
                    startIcon={<AddIcon />}
                  >
                    Create Service
                  </Button>
                </Grid>
              </Fragment>
            ) : (
              <Grid justify="center" className="flex">
                <Typography className="title flex" color="textSecondary">
                  Please create an identifier in the "Create Identifier" tab
                </Typography>
              </Grid>
            )}
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
                      Data account (Use this to add a service to a DID in the
                      `Add Service` tab)
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
                      Service Id
                    </Typography>
                    <Typography component="p" gutterBottom>
                      {identifier && identifier.id}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Service Type
                    </Typography>
                    <Typography component="p" gutterBottom>
                      {identifier && identifier.serviceType}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Subject of the license
                    </Typography>
                    <Grid item className="linkgrid" justify="space-between">
                      <Typography component="p" gutterBottom>
                        {identifier && identifier.subject}
                      </Typography>
                      <a
                        target="_blank"
                        className="link"
                        href={`http://explorer.solana.com/address/${identifier.subject}?cluster=devnet`}
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
                      Issuer of the license
                    </Typography>
                    <Grid item className="linkgrid" justify="space-between">
                      <Typography component="p" gutterBottom>
                        {identifier && identifier.issuer}
                      </Typography>
                      <a
                        target="_blank"
                        className="link"
                        href={`http://explorer.solana.com/address/${identifier.issuer}?cluster=devnet`}
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
                      Date the license was issued
                    </Typography>
                    <Typography component="p" gutterBottom>
                      {identifier && identifier.issuanceDate}
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

export default CreateService;
