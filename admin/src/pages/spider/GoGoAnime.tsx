import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import { IEvent } from '../../types';
import {
  Button,
  ButtonGroup,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column'
    },
    sectionWrapper: {
      display: 'flex',
      flexGrow: 1
    },
    section: {
      flex: 1,
      borderWidth: '1px 0',
      borderColor: 'black',
      borderStyle: 'solid',
      overflow: 'scroll',
      '&:first-child': {
        border: '1px solid black',
        borderRadius: [
          `${theme.shape.borderRadius}px`,
          0,
          0,
          `${theme.shape.borderRadius}px`
        ].join(' ')
      },
      '&:last-child': {
        border: '1px solid black',
        borderRadius: [
          0,
          `${theme.shape.borderRadius}px`,
          `${theme.shape.borderRadius}px`,
          0
        ].join(' ')
      },
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  };
});

export const GoGoAnime: FC = () => {
  const classes = useStyles();

  const [isRunning, setRunning] = useState<boolean>(false);
  const [list, setList] = useState<number[]>([]);
  const [info, setInfo] = useState<string[]>([]);
  const [episodes, setEpisodes] = useState<string[]>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/gogoanime/state/isRunning').then(d => {
      setRunning(d.data.isRunning);
    });

    const socket = io('http://127.0.0.1:3000');
    socket.on('events', ({ action, data, type }: IEvent<any>) => {
      if (type === 'list') {
        if (action === 'add') {
          setList(l => [...l, data]);
        } else if (action === 'add-multiple') {
          setList(l => [...l, ...data]);
        }
        if (action === 'finish') {
          setList(l => l.filter(i => i !== data));
        }
        return;
      }

      if (type === 'info') {
        if (action === 'add') {
          setInfo(l => [...l, data.name]);
        } else if (action === 'add-multiple') {
          setInfo(l => [...l, ...data.map(d => d.name)]);
        }
        if (action === 'finish') {
          setInfo(l => l.filter(i => i !== data));
        }
        return;
      }

      if (type === 'episodes') {
        if (action === 'add') {
          console.log('Single:', data);
          setEpisodes(l => [...l, data.movieId]);
        } else if (action === 'add-multiple') {
          setEpisodes(l => [...l, ...data.map(d => d.movieId)]);
        }
        if (action === 'finish') {
          setEpisodes(l => l.filter(i => i !== data));
        }
        return;
      }

      if (type === 'runner') {
        if (action === 'running') {
          setRunning(data);
        }
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <ButtonGroup fullWidth={true} variant="contained" color="primary">
        <Button
          color="primary"
          onClick={async () => {
            await axios.get('http://127.0.0.1:3000/gogoanime/start');
          }}
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          color="secondary"
          onClick={async () => {
            await axios.get('http://127.0.0.1:3000/gogoanime/stop');
            setList([]);
            setInfo([]);
            setEpisodes([]);
          }}
          disabled={!isRunning}
        >
          Stop
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setList([]);
            setInfo([]);
            setEpisodes([]);
          }}
          disabled={isRunning}
        >
          Clear
        </Button>
      </ButtonGroup>
      <Box height="10px" />
      <div className={classes.sectionWrapper}>
        <div className={classes.section}>
          <Box textAlign="center" padding={1} borderBottom="1px solid black">
            <Typography variant="h6">List</Typography>
            <Typography variant="caption">Size: {list.length}</Typography>
          </Box>
          <List>
            {list.map(d => {
              return (
                <ListItem key={d}>
                  <ListItemText primary={d} />
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className={classes.section}>
          <Box textAlign="center" padding={1} borderBottom="1px solid black">
            <Typography variant="h6">Info</Typography>
            <Typography variant="caption">Size: {info.length}</Typography>
          </Box>
          <List>
            {info.slice(0, 50).map(d => {
              return (
                <ListItem key={d} button>
                  <ListItemText
                    primary={d}
                    primaryTypographyProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className={classes.section}>
          <Box textAlign="center" padding={1} borderBottom="1px solid black">
            <Typography variant="h6">Episodes</Typography>
            <Typography variant="caption">Size: {episodes.length}</Typography>
          </Box>
          <List>
            {episodes.slice(0, 50).map(d => {
              return (
                <ListItem key={d} button>
                  <ListItemText
                    primary={d}
                    primaryTypographyProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
};
