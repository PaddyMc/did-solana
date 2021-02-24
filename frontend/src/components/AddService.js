import React, { useState } from "react";
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

const AddService = () => {
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
        "3zgomZzhRMyep8nBuCJA67ayMr7LScQtrGPTruS7wRHu",
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
            <div className="title">Add a service to your DID</div>
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
                  maxWidth="1000px"
                  label="Enter an id of the service here"
                  color="default"
                />
                <FormControl className="buttonServicePage">
                  <InputLabel id="label">Service Type</InputLabel>
                  <Select
                    labelId="label"
                    id="select"
                    value={type}
                    onChange={handleChange}
                  >
                    <MenuItem value={"amm licence"}>AMM Licence</MenuItem>
                    <MenuItem value={"bridge licence"}>Bridge Licence</MenuItem>
                    <MenuItem value={"did document"}>DID Document</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  value={value}
                  className="buttonServicePage"
                  id="standard-key"
                  maxWidth="1000px"
                  label="Enter the data key of the service here (will be used to get data)"
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
                className="buttonServicePage"
                variant="contained"
                onClick={() => getIdentifier()}
                startIcon={<AddIcon />}
              >
                Add Service
              </Button>
            </Grid>
            {isLoading && (
              <Grid
                container
                className="spacing"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <ReactLoading type={"bars"} color={"grey"} />
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
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.dataAccount}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Your account address
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.ownerAccount}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Service Data Key
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.serviceAccount}
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
    font-weight: bold;
  }
`;

export default AddService;
