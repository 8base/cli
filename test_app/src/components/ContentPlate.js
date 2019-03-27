import React from 'react';
import styled from 'react-emotion';
import { Grid } from '@8base/boost';

const ContentPlateTag = styled(Grid.Box)({
  padding: '0 2rem 2rem 2rem',
  minHeight: 0,
});

const ContentPlate = ({ children }) => <ContentPlateTag area="content">{children}</ContentPlateTag>;

export { ContentPlate };
