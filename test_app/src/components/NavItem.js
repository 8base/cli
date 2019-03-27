import React from 'react';
import { Navigation } from '@8base/boost';
import { NavLink } from 'react-router-dom';

const NavItem = props => <Navigation.Item tagName={NavLink} {...props} />;

export { NavItem };
