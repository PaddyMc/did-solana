import React, { useState, useEffect, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Grid";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { getAccountInfo } from "../utils/index";
import { Account } from "@solana/web3.js";
import { values } from "ramda";
import "./Home.css";

const UserMenu = (refresh) => {
  const [aka, setAka] = useState();

  useEffect(async () => {
    let dataAccount = JSON.parse(localStorage.getItem("dataAccount"));
    if (dataAccount) {
      const aka = await getAccountInfo(
        new Account(values(dataAccount._keypair.secretKey)).publicKey.toString()
      );

      setAka(aka.aka);
    }
  });

  return (
    <Fragment>
      {aka && (
        <Fragment>
          <AccountCircleIcon color="#00ffbd" className="icon" />
          <Fragment>
            <Typography> {aka}</Typography>
          </Fragment>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserMenu;
