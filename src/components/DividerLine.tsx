import {Divider} from "@mui/material";
import * as React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
  divider: {
    paddingTop: "20px",
  },
});

export function DividerLine() {
  const classes = useStyles();
  return(
    <Divider className={classes.divider} variant='middle' />
  );
}
