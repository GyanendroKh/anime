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
  const [infoRunning, setInfoRunning] = useState(false);
  const [episodesRunning, setEpisodesRunning] = useState(false);
  const [infoRemaining, setInfoRemaining] = useState(0);
  const [episodesRemaining, setEpisodesRemaining] = useState(0);

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/gogoanime/state/isRunning').then(d => {
      setRunning(d.data.isRunning);
    });

    const socket = io('http://127.0.0.1:3000');
    socket.on('events', ({ action, data, extra, type }: IEvent<any>) => {
      if (type === 'list') {
        if (action === 'start') {
          console.log(data);
          setList(l => [...l, data]);
          return;
        }

        if (action === 'finish') {
          setList(l => l.filter(i => i !== data));
          return;
        }
      }

      if (type === 'info') {
        if (action === 'start') {
          setInfo(l => [...l, data]);
          setInfoRemaining(extra);
          return;
        }

        if (action === 'finish') {
          setInfo(l => l.filter(i => i !== data));
          setInfoRemaining(extra);
          return;
        }

        if (action === 'running') {
          setInfoRunning(data);
          return;
        }
      }

      if (type === 'episodes') {
        if (action === 'start') {
          setEpisodes(l => [...l, data]);
          setEpisodesRemaining(extra);
          return;
        }

        if (action === 'finish') {
          setEpisodes(l => l.filter(i => i !== data));
          setEpisodesRemaining(extra);
          return;
        }

        if (action === 'running') {
          setEpisodesRunning(data);
          return;
        }
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
            <Typography variant="h6">Info {infoRunning && '*'}</Typography>
            <Typography variant="caption">
              Remaining: {infoRemaining}
            </Typography>
          </Box>
          <List>
            {info.map(d => {
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
            <Typography variant="h6">
              Episodes {episodesRunning && '*'}
            </Typography>
            <Typography variant="caption">
              Remaining: {episodesRemaining}
            </Typography>
          </Box>
          <List>
            {episodes.map(d => {
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
