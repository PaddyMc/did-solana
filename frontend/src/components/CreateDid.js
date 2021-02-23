import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { createDid } from "../utils";
import { decodePubkeys } from "../utils/add-authentication";
import { decodeServices } from "../utils/add-service";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const CreateDid = () => {
  const [value, setValue] = useState();
  const [identifier, setIdentifier] = useState();

  // Similar to componentDidMount and componentDidUpdate:
  const getIdentifier = async () => {
    // Update the document title using the browser API
    const hacky = document.getElementById("standard-basic").value;
    if (hacky) {
      let identifier = await createDid(
        "AmmabwF1cQka6rMosVgBCjbwpEk2pdxuozLYmFAtgBCi",
        hacky
      );
      if (identifier) {
        setIdentifier(identifier);
      }
    }
  };
  return (
    <Wrapper>
      <Container maxWidth="md">
        <div className="title">Create decentralized identifier</div>
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
                  label="Enter an aka (also known as) here  to create a did"
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
                  onClick={() => getIdentifier()}
                  startIcon={<AddIcon />}
                >
                  Create Identifier
                </Button>
              </Grid>
            </Grid>
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
export default CreateDid;
