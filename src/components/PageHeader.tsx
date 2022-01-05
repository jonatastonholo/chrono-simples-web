// @flow
import * as React from "react";
import {Card, makeStyles, Typography} from "@material-ui/core";
import {theme} from "../Styles";
import Box from "@material-ui/core/Box";
import {UserMenu} from "./UserMenu";
import {StopwatchMenu} from "./StopwatchMenu";
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";

type Props = {
  title: string;
};

const useStyles = makeStyles({
  header: {
    background: "linear-gradient(45deg, #3C3F41 30%, #3C3F41 70%)",
    border: 0,
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    fontWeight: 200,
    padding: "0.25rem",
    marginTop: "25px",
    textAlign: "center",
    color: theme.fonts.color,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    padding: "0.50rem",
    textAlign: "center",
  },
});

export function PageHeader({ title }: Props) {
  const classes = useStyles();
  return (
    <Card className={classes.header}>
      <Typography variant="h5" component="h2">
        <Box className={classes.content}>
          <Box>
            <SwipeableTemporaryDrawer/>
          </Box>
          <Box flex="1" padding="1rem" marginLeft="5.35rem">
            {title}
          </Box>
          <Box>
            <StopwatchMenu />
          </Box>
          <Box>
            <UserMenu />
          </Box>
        </Box>
      </Typography>
    </Card>
  );
}
