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

const Info = () => (
  <Wrapper>
    <Container maxWidth="ml">
      <Paper elevation="10" className="card">
        <Grid item xs={12} justify="center" className="headerGrid">
          <Grid item xs={12}>
            <div className="title">Information</div>
          </Grid>
        </Grid>
      </Paper>
      <Grid direction="column" spacing={12} justify="space-between">
        <Paper elevation="10" className="spacing card">
          <div className="subtitle">
            Decentralised identifiers (DIDs) are useful because...
          </div>
          <Container maxWidth="">
            <Typography variant="h6" component="h1">
              What are DIDs
            </Typography>
            <Typography component="p">
              Decentralized identifiers (DIDs) are a new type of identifier that
              enables verifiable, decentralized digital identity. A DID
              identifies any subject (e.g., a person, organization, thing, data
              model, abstract entity, etc.) that the controller of the DID
              decides what it identifies.{" "}
              <a target="_blank" href="https://w3c.github.io/did-core/">
                [more info]
              </a>
            </Typography>
            <br />
            <Typography variant="h6" component="h1">
              Why DIDs are being used in this project
            </Typography>
            <Typography component="p">
              DIDs allow users to attach multiple keys and abartary data
              seructures to an on chain entity they control. This unlocks the
              ability to identify and license AMMs and Bridges, this allows
              users of AMMs to have some certainty that the pool is created by a
              respectable authority and their funds will be safe. Bridge
              licenses can allow bridge programs that are stored on-chain to
              identify themselves.
            </Typography>
            <br />
            <Typography variant="h6" component="h2">
              Project information
            </Typography>
            <Grid item className="datalinks" justify="center">
              <Grid item justify="space-evenly">
                <Typography component="p">
                  Identifier Program ➡️{" "}
                  <a
                    target="_blank"
                    href="https://explorer.solana.com/address/FKNARQsQ3wTTadNRcUuQBx9moynv7ctWPP8ni5H4C4HR?cluster=devnet"
                  >
                    FKNARQsQ3wTTadNRcUuQBx9moynv7ctWPP8ni5H4C4HR
                  </a>
                </Typography>
              </Grid>
              <Typography component="p">
                License Program ➡️{" "}
                <a
                  target="_blank"
                  href="https://explorer.solana.com/address/DTXJtDoZ6X5eb9Ek63B5zK857FmhSYNzHnsiygxhEJJY?cluster=devnet"
                >
                  DTXJtDoZ6X5eb9Ek63B5zK857FmhSYNzHnsiygxhEJJY
                </a>
              </Typography>
              <Typography component="p">
                Source Code ➡️{" "}
                <a href="http://github.com/PaddyMc/did-solana">did-solana</a>
              </Typography>
            </Grid>
            <br />
            <Typography variant="h6" component="h2">
              How to use this application
            </Typography>
            <Typography component="p">
              This is a test application and all key data is persisted on the
              Solana development network and keys (public and private) are
              stored in local storage.
            </Typography>
            <br />
            <Typography variant="h6" component="h2">
              Creating a DID and issuing your own licence
            </Typography>
            <Typography component="p">
              1. Go to the `Create Identifiers` tab and create an identifier
              (this will store your key in local storage)
            </Typography>
            <Typography component="p">
              2. Add an public key to your account on the `Add Authentication`
              tab
            </Typography>
            <Typography component="p">
              3. Create a service to attach to your identifier on the `Create
              Services` tab, select `Generic Service`, remember to save the data
              key
            </Typography>
            <Typography component="p">
              4. Add a service to your DID on the `Add Services` tab
            </Typography>
            <Typography component="p">
              6. Query your DID on the `Home` tab (Hint: if you hover your mouse
              over the person Icon, your address will show up)
            </Typography>
            <Typography component="p">
              7. Congrats your now the proud owner of a DID 🎉
            </Typography>
            <br />
            <Typography variant="h6" component="h2">
              Creating a DID and issuing a licence to the Sereum DEX
            </Typography>
            <Typography component="p">
              1. Go to the `Create Identifiers` tab and create an identifier
              called `Sereum Dex` (this will store your key in local storage)
            </Typography>
            <Typography component="p">
              2. Add an public key to your account on the `Add Authentication`
              tab
            </Typography>
            <Typography component="p">
              3. Create a service to attach to your identifier on the `Create
              Services` tab,
              <Typography component="p">
                3a. Select the `AMM licence` in the service type input field,
              </Typography>
              <Typography component="p">
                3b. The subject of the licence should be the `Sereum DEX`
                program address{" "}
                <a
                  target="_blank"
                  href="https://explorer.solana.com/address/9MVDeYQnJmN2Dt7H44Z8cob4bET2ysdNu2uFJcatDJno?cluster=devnet"
                >
                  9MVDeYQnJmN2Dt7H44Z8cob4bET2ysdNu2uFJcatDJno
                </a>
              </Typography>
              <Typography component="p">
                3c. Remember to save the data key for use in the `Add Services`
                tab
              </Typography>
            </Typography>
            <Typography component="p">
              4. Add a service to the `Sereum Dex` DID on the `Add Services` tab
            </Typography>
            <Typography component="p">
              6. Query the `Sereum Dex` DID on the `Home` tab (Hint: if you
              hover your mouse over the person Icon, your address will show up)
            </Typography>
            <Typography component="p">
              7. Congrats you made a DEX on Solana more secure 🎉
            </Typography>
            <br />
            <Typography variant="h6" component="h2">
              How to thank the users
            </Typography>
            <Typography component="p">
              Thanks for taking the time to use this prototype, you're the real
              MVP. 🙇🏿
            </Typography>
          </Container>
        </Paper>
      </Grid>
    </Container>
  </Wrapper>
);

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
  a {
    text-decoration: none;
    cursor: pointer;
    color: #d117e7;
  }
`;

export default Info;
