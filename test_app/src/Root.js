import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ProtectedRoute } from './shared/components';
import { MainPlate, ContentPlate, Nav } from './components';
import { Auth } from './routes/auth';
/** __APP_PAGES_IMPORTS__ */

export const Root = () => (
  <Switch>
    <Route path="/auth" component={Auth} />
    <Route>
      <MainPlate>
        <Nav.Plate color="BLUE">
          {/** __APP_ROUTE_LINKS__ */}
        </Nav.Plate>
        <ContentPlate>
          <Switch>
            {/** __APP_ROUTES__ */}
        </Switch>
        </ContentPlate>
      </MainPlate>
    </Route>
  </Switch>
);
