export const buildTemplateIconsRouter = (modules: string[]) => {
    return `
  
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import * as React from 'react';
  import clsx from 'clsx';
  import { Theme, Drawer } from '@mui/material';
  import IconButton from '@mui/material/IconButton';
  import { Box } from '@mui/system';
  import HomeIcon from '@mui/icons-material/Home';
  import { createStyles, makeStyles } from '@mui/styles';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { PRIMARY } from '../../css/theme';
  import SettingsIcon from '@mui/icons-material/Settings';
  
  interface StylesProps {
    drawerWidth: number;
  }
  
  const routes = [
    {
      name: 'Home',
      icon: <HomeIcon />,
      path: '/home',
    },
    ${modules.map(
      (module) => `
      {
        name: '${module}',
        icon: <HomeIcon />,
        path: '/${module}',
      }
      `,
    )}
  ];
  
  const useStyles = makeStyles<Theme, StylesProps>((theme) =>
    createStyles({
      drawer: {
        [theme.breakpoints?.up('sm')]: {
          /**
           *
           * @param {object} props - Styles Props.
           * @param {boolean} props.drawerWidth - Drawer Width.
           * @returns {number} - Drawer Width.
           */
          width: (props) => props.drawerWidth,
          flexShrink: 0,
        },
      },
      drawerPaper: {
        /**
         *
         * @param {object} props - Styles Props.
         * @param {boolean} props.drawerWidth - Drawer Width.
         * @returns {number} - Drawer Width.
         */
        width: (props) => props.drawerWidth,
        backgroundColor: PRIMARY,
        padding: '28px 2px',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      divider: {
        width: '100%',
        backgroundColor: '#fff',
        height: 1,
      },
      buttonWhite: {
        color: '#fff',
        opacity: 0.5,
        '&:hover': {
          opacity: 1,
        },
      },
      iconButton: {
        width: 70,
        height: 56,
        color: '#fff',
        opacity: 0.5,
        borderRadius: 8,
        marginBottom: '4px',
        '&:hover': {
          opacity: 1,
        },
      },
      buttonActive: {
        opacity: 1,
        backgroundColor: '#8C8C8C',
        '&:hover': {
          backgroundColor: '#8C8C8C',
        },
      },
      noMargin: {
        margin: 0,
      },
    }),
  );
  
  interface SidebarProps {
    open: boolean;
    drawerWidth: number;
  }
  
  /**
   * @param {object} props - Sidebar Props.
   * @param {boolean} props.open - Open Boolean.
   * @param {number} props.drawerWidth - Drawer Width.
   * @returns Component.
   */
  export const Sidebar: React.FC<SidebarProps> = ({ open, drawerWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyles({ drawerWidth });
  
    return (
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box width="100%">
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              style={{ width: '70px', margin: '5px', borderRadius: '6px' }}
              src="https://main.durcr9xm9ia67.amplifyapp.com/Asset.png"
              alt="shawcor-logo"
            />
            <Box className={classes.divider} marginTop={2} marginBottom={2} />
  
            {routes.map((route) => {
              return (
                <IconButton
                  onClick={() => navigate(route.path)}
                  key={route.name}
                  className={clsx(classes.iconButton, {
                    [classes.buttonActive]: location.pathname.startsWith(
                      route.path,
                    ),
                  })}
                >
                  {route.icon}
                </IconButton>
              );
            })}
          </Box>
        </Box>
  
        <Box width="100%">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.divider} marginBottom={2} />
            <IconButton className={clsx([classes.iconButton, classes.noMargin])}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    );
  };
  `;
  };