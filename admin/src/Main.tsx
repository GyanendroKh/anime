import React, { FC } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Routes from './Routes';

const drawerWidth = 260;

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flex: 1
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      overflow: 'auto'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      flexGrow: 1
    }
  };
});

const Main: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Button disableRipple component={RouterLink} color="inherit" to="/">
            <Typography variant="h6" style={{ textTransform: 'none' }}>
              Anime
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List
            component="nav"
            subheader={<ListSubheader component="div">Spider</ListSubheader>}
          >
            <ListItem button component={RouterLink} to="/spider/gogoanime">
              <ListItemText>GoGoAnime</ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Routes />
      </main>
    </div>
  );
};

export default Main;
