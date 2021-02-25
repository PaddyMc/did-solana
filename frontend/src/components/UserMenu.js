import React, { useState, useEffect, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Grid";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { getAccountInfo } from "../utils/index";
import { Account } from "@solana/web3.js";
import { values } from "ramda";
import Tooltip from '@material-ui/core/Tooltip';
import "./Home.css";

const UserMenu = (refresh) => {
  const [aka, setAka] = useState();
  const [pk, setPk] = useState();

  useEffect(async () => {
    let dataAccount = JSON.parse(localStorage.getItem("dataAccount"));
    if (dataAccount) {
        let publicKey = new Account(values(dataAccount._keypair.secretKey)).publicKey.toString()
      const aka = await getAccountInfo(
        publicKey
      );
setPk(publicKey)
      setAka(aka.aka);
    }
  });

  return (
    <Fragment>
      {aka && (
        <Fragment>
	      <Tooltip title={pk} interactive>
          <AccountCircleIcon className="menuicon" />
</Tooltip>
          <Fragment>
            <Typography className="menuText">{aka}</Typography>
          </Fragment>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserMenu;
