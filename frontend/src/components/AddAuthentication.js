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
      "3zgomZzhRMyep8nBuCJA67ayMr7LScQtrGPTruS7wRHu",
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
            <div className="title">Add a public key to your DID</div>
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
                    variant="contained"
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
                      Newly added account address
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {identifier && identifier.newAccount}
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

export default AddAuthentication;
