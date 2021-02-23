import React, { useState } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Button from "@material-ui/core/Button";
import { getAccountInfo } from "../utils";
import { decodePubkeys } from "../utils/add-authentication";
import { decodeServices } from "../utils/add-service";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { values } from "ramda";
import { PublicKey } from "@solana/web3.js";
import "./Home.css";
import ReactLoading from "react-loading";

const Home = () => {
  const [value] = useState();
  const [identifier, setIdentifier] = useState();
  const [pubkeys, setPubkeys] = useState();
  const [services, setServices] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        console.log(pubkeys);
        setPubkeys(pubkeys);
        let services = decodeServices(identifier.services);
        setServices(services);
      }
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container maxWidth="md">
        <div className="title">Query decentralized identifiers</div>
        <Grid direction="column" spacing={12} justify="space-between">
          <Paper className="spacing">
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
                  label="Enter a data key here to get a did"
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
  background-color: #333;
  flex-direction: column;
  color: #fff;

  div.title {
    font-size: 40px;
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 40px;
    text-align: center;
  }
  div.subtitle {
    font-size: 30px;
    font-weight: bold;
  }
`;

export default Home;
