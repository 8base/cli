import React from 'react';
import styled from 'react-emotion';
import { Grid, Navigation } from '@8base/boost';

const NavTag = styled(Navigation)(props => ({
  position: 'fixed',
  left: 0,
  zIndex: props.theme.Z_INDEX.FIXED_NAV,
}));

const NavPlate = ({ children, ...rest }) => (
  <Grid.Box area="nav">
    <NavTag {...rest}>{children}</NavTag>
  </Grid.Box>
);

export { NavPlate };
