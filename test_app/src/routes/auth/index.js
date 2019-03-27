import React from 'react';
import { Route } from 'react-router';

import { AuthContainer } from './routes/root';
import { CallbackContainer } from './routes/callback';

export const Auth = () => (
  <React.Fragment>
    <Route exact path="/auth/" component={AuthContainer} />
    <Route path="/auth/callback" component={CallbackContainer} />
  </React.Fragment>
);
