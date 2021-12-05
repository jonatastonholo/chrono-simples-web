// @flow
import * as React from "react";
import {Card, makeStyles, Typography} from "@material-ui/core";
import {theme} from "../Styles";
import Box from "@material-ui/core/Box";
import {Fab} from "@mui/material";
import {GridAddIcon} from "@material-ui/data-grid";

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

type props = {
  title: string;
  onAddNewClick: () => void;
}
export function ContentHeader({ title, onAddNewClick }: props) {
  const classes = useStyles();

  const handleAddButtonOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAddNewClick();
  };

  return (
    <Card className={classes.header}>
      <Typography variant="h5" component="h2">
        <Box className={classes.content}>
          <Box flex="1" padding="1rem" marginLeft="12px">
            {title}
          </Box>
          <Box className={classes.content}>
            <Fab color="primary" aria-label="add" size="small" onClick={handleAddButtonOnClick}>
              <GridAddIcon />
            </Fab>
          </Box>
        </Box>
      </Typography>
    </Card>
  );
}
