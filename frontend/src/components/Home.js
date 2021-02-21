import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";
import {getAccountInfo} from "../utils";

const Home = () => {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    const hacky = document.getElementById("standard-basic").value;
    if (hacky) {
      const acc = getAccountInfo(hacky)
    }
  });

  return (
    <Wrapper>
      <Container maxWidth="md">
        <div className="title">Query decentralized identifiers</div>
        <section>
          <p>Hello</p>
          <form noValidate autoComplete="off">
            <TextField value={value} id="standard-basic" label="Enter public key here" color="default" />
            <Button
              variant="contained"
              color="default"
              onClick={() => setCount(count + 1)}
              startIcon={<LockIcon />}
            >
              Upload
            </Button>
          </form>
        </section>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;

  div.title {
    font-size: 40px;
    font-weight: bold;
    padding-top: 10px;
    text-align: center;
  }
  div.subtitle {
    font-size: 30px;
    font-weight: bold;
  }

  section {
    p {
      font-size: 20px;
    }
  }
`;

export default Home;
