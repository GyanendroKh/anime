import React, { FC } from 'react';
import { Route, Switch } from 'react-router';
import { Dashboard, GoGoAnime } from './pages';

const Routes: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/spider/gogoanime" component={GoGoAnime} />
    </Switch>
  );
};

export default Routes;
