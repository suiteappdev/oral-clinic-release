import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper';

const lightColor = 'rgba(255, 255, 255, 0.7)';

import InicioModule from './views/home/';
let theme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48,
    },
  },
};

const styles = theme => ({
  secondaryBar: {
    zIndex: 0,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

class Home extends React.Component {
  constructor(props){
    super(props);
  }
  
  render() {
    const { classes, onDrawerToggle } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <AppBar position="sticky" elevation={0}>
        <Toolbar>
            <React.Fragment>
              <img src={require('../../static/logos/brand_logo.png')} />
            </React.Fragment>
            <Grid container spacing={1} alignItems="center">
              <Hidden smUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid item xs />
              <Grid item>
                <Typography className={classes.link} component="a" href="#">
                  listerine@gmail.com
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Alerts • No alters">
                  <IconButton color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton color="inherit" className={classes.iconButtonAvatar}>
                  <Avatar
                    className={classes.avatar}
                    src={require('../../static/images/avatar/1.jpg')}
                    alt="My Avatar"
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
       </AppBar>
       <div style={{width:'100%', height:'100%', backgroundColor:'red'}}>

       </div>
       <Container maxWidth="sm">
       <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={6}>
            {[0, 1, 2].map(value => (
              <Grid key={value} item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h5" component="h3">
                    This is a sheet of paper.
                  </Typography>
                  <Typography component="p">
                    Paper can be used to build surface or other elements for your application.
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      </Container>
      </React.Fragment>
        <style jsx global>{`
            body { 
              margin: 0;
              padding:0;
            }
      `}</style>
      </MuiThemeProvider>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  loadView: PropTypes.func.isRequired
};

export default withStyles(styles)(Home);