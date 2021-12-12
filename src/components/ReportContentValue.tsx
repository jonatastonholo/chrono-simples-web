// @flow
import * as React from "react";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box} from "@mui/material";

const useStyles = makeStyles({
  root: {
    background: theme.background,
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
    marginTop: "1.5rem",
    textAlign: "center",
  },

  label: {
    fontWeight: 700,
    textAlign: "start",
  },

  value: {
    fontWeight: 300,
    paddingLeft: "0.3rem",
    textAlign: "start",
  },
});

type props = {
  label: string;
  value: any;
}

export function ReportContentValue({ label, value }: props) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.label}>{label}</Box>
      <Box className={classes.value}>{value ? value : '-'}</Box>
    </Box>

  );
}
