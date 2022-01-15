import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {AccountTreeOutlined, Assessment, AttachMoney, PersonAddAlt, Timer} from '@mui/icons-material/';
import MenuIcon from "@mui/icons-material/Menu";
import {IconButton} from "@mui/material";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";

type Anchor = 'left';


const useStyles = makeStyles({
  rootContent: {
    textAlign: "center",
    color: theme.fonts.color,
    background: theme.background,
  },
  menuButton: {
    paddingTop: '1.0rem',
    marginLeft: '1.0rem',
    marginRight: '-3.5rem',
  }
});

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();

  const [state, setState] = React.useState({left: false, });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      className={classes.rootContent}
      sx={{ width: 250, height: '100%'}}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button component={Link} to="/periods">
          <ListItemIcon> <Timer /> </ListItemIcon>
          <ListItemText primary="Períodos"/>
        </ListItem>
        <ListItem button component={Link} to="/projects">
          <ListItemIcon> <AccountTreeOutlined /> </ListItemIcon>
          <ListItemText primary="Projetos"/>
        </ListItem>
        <ListItem button component={Link} to="/expenses">
          <ListItemIcon> <AttachMoney /> </ListItemIcon>
          <ListItemText primary="Despesas"/>
        </ListItem>
        <ListItem button component={Link} to="/dependents">
          <ListItemIcon> <PersonAddAlt /> </ListItemIcon>
          <ListItemText primary="Dependentes"/>
        </ListItem>
        <ListItem button component={Link} to="/reports">
          <ListItemIcon> <Assessment /> </ListItemIcon>
          <ListItemText primary="Relatórios"/>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment >
        <Box className={classes.menuButton}>
          <IconButton aria-label="menu" onClick={toggleDrawer("left", true)}><MenuIcon /></IconButton>
        </Box>
        <SwipeableDrawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
        >
          {list("left")}
        </SwipeableDrawer>
      </React.Fragment>

    </div>
  );
}
