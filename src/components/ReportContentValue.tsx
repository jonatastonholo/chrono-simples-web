// @flow
import * as React from "react";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, Theme} from "@mui/material";
import {SxProps} from "@mui/system";

const useStyles = makeStyles({
  root: {
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
    marginTop: "1.5rem",
    textAlign: "center",
  },

  label: {
    fontWeight: 750,
    textAlign: "start",
  },

  value: {
    fontWeight: 400,
    paddingLeft: "0.3rem",
    textAlign: "start",
  },
});

type props = {
  label: string;
  value: any;
  sx?: SxProps<Theme>;
  sxLabel?: SxProps<Theme>;
  sxValue?: SxProps<Theme>;
}

export function ReportContentValue({ label, value, sx, sxLabel, sxValue}: props) {
  const classes = useStyles();

  return (
    <Box className={classes.root} sx={sx ?? {}}>
      <Box className={classes.label} sx={sxLabel ?? {}}>{label}</Box>
      <Box className={classes.value} sx={sxValue ?? {}}>{value ? value : '-'}</Box>
    </Box>

  );
}
