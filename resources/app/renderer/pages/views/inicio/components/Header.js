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

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  secondaryBar: {
    zIndex: 0,
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

class Header extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      tabSelected : 0
    };
  }

  componentDidMount(){

  }

  _renderTabs = ()=>{
    try{
      if(this.props.menu){
        let tabIndex = this.state.tabSelected;
        
        console.log("tabIndex", tabIndex);
        console.log("tabs.length", this.props.menu.tabs.length);

       if(tabIndex >= this.props.menu.tabs.length){
          this.setState({ tabSelected : 0});
       }

        return (<Tabs value={this.state.tabSelected} textColor="inherit" onChange={this.handleTab}>
                    {this.props.menu.tabs.map(({ id, label }, index)=>{
                          return (<Tab key={index} textColor="inherit" label={label} value={index} />);
                     })}
               </Tabs>);
      }
    }catch(e){
      console.log("e", e.message);
    }
  }

  handleTab = (event, value)=>{
    this.setState({ tabSelected :  value });
    this.props.loadView(this.props.menu.tabs[value].id);
  }

  render(){
    const { classes, onDrawerToggle } = this.props;

    return (
      <React.Fragment>
        <AppBar color="primary" position="sticky" elevation={0}>
          <Toolbar>
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
                    src={require('../../../../../static/images/avatar/1.jpg')}
                    alt="My Avatar"
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                {this.props.menu.label}
                </Typography>
              </Grid>
              <Grid item>
                <Button className={classes.button} variant="outlined" color="inherit" size="small">
                  Web setup
                </Button>
              </Grid>
              <Grid item>
                <Tooltip title="Help">
                  <IconButton color="inherit">
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
        {this._renderTabs()}
        </AppBar>
      </React.Fragment>
    )
  }

}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  loadView: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);