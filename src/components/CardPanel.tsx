// @flow
import * as React from "react";
import { Box, Card, makeStyles } from "@material-ui/core";
import { theme } from "../Styles";

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "0.50rem",
    textAlign: "center",
    background: theme.background,
    color: theme.fonts.color,
    border: 0,
    borderRadius: 5,
    marginTop: "1rem",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    marginTop: "2px",
    color: theme.fonts.color,
  },
});

export function CardPanel({ children }: Props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Box className={classes.content}>{children}</Box>
    </Card>
  );
}
