import React from 'react';
import { Router, Route, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import NotFoundPage from 'NotFoundPage';
import App from 'App';

const history = createBrowserHistory();

const routes = (
  <Router
    history={history} >
    <Route path="/" component={ App }>
      <Route path="chapter4" getComponent={(location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./Chapter4'));
        });
      }} />
      <Route path="*" component={ NotFoundPage }/>
    </Route>
  </Router>
);

export default routes;
