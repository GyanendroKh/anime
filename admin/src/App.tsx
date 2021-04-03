import React, { FC } from 'react';
import { CssBaseline } from '@material-ui/core';
import { HashRouter as Router } from 'react-router-dom';
import Main from './Main';

const App: FC = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <Main />
      </Router>
    </>
  );
};

export default App;
