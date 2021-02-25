import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Button from "@material-ui/core/Button";
import { getAccountInfo } from "../utils";
import { decodePubkeys } from "../utils/add-authentication";
import { decodeServices } from "../utils/add-service";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { values } from "ramda";
import { PublicKey } from "@solana/web3.js";
import "./Home.css";
import ReactLoading from "react-loading";
import UserMenu from "./UserMenu";
import HomeIcon from "@material-ui/icons/Home";

const Home = () => {
  const [value] = useState();
  const [identifier, setIdentifier] = useState();
  const [pubkeys, setPubkeys] = useState();
  const [services, setServices] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataAccount] = useState(
    JSON.parse(localStorage.getItem("dataAccount"))
  );

  // Similar to componentDidMount and componentDidUpdate:
  const getIdentifier = async () => {
    // Update the document title using the browser API
    const hacky = document.getElementById("standard-basic").value;
    if (hacky) {
      setIsLoading(true);
      setIdentifier();
      let identifier = await getAccountInfo(hacky);
      if (identifier) {
        setIdentifier(identifier);
        let pubkeys = decodePubkeys(identifier.authentication);
        setPubkeys(pubkeys);
        let services = decodeServices(identifier.services);
        setServices(services);
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
              <div className="title">
                Home
              </div>
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
              <div className="subtitle">
                Query decentralized identifiers (DIDs)
              </div>
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
                  label="Please enter a data key here to get DID data..."
                  color="default"
                />
              </Grid>
              <Grid
                item
                className="button"
                alignItems="center"
                align="center"
                justify="center"
                xs={4}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => getIdentifier()}
                  startIcon={<AssignmentIndIcon />}
                >
                  Get Identifier
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
                      Identifier
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.id}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Aka (also known as)
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.aka}
                    </Typography>
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Public Keys (base58 encoded)
                    </Typography>
                    {pubkeys &&
                      values(pubkeys).map((pubkey) => (
                        <Typography variant="h5" component="h2" gutterBottom>
                          {pubkey.toString("base64") !==
                            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" &&
                            new PublicKey(pubkey).toBase58()}
                        </Typography>
                      ))}
                    <Typography
                      className="title"
                      color="textSecondary"
                      gutterBottom
                    >
                      Services (can be used to resolve data about the did
                      subject)
                    </Typography>
                    {services &&
                      services.map((service) => (
                        <div>
                          {service.id && (
                            <div>
                              <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                              >
                                ID: {service.id}
                              </Typography>
                              <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                              >
                                Type: {service.serviceType}
                              </Typography>
                              <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                              >
                                Key: {service.serviceKey}
                              </Typography>
                            </div>
                          )}
                        </div>
                      ))}
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

export default Home;
