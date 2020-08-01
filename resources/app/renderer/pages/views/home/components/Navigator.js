import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import FlagIcon from '@material-ui/icons/Flag';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';

const categories = [
  {
    id: 'CatConfiguraciones',
    label : 'Configuraciones',
    children: [
        { id: 'menuLocalizacion', label:'Localizacion', icon: <FlagIcon />, active : true, tabs:[
        { id: 'tabPais', label:'Pais', active : true},
        { id: 'tabDepartamentos', label:'Departamentos' },
        { id: 'tabMunicipios', label:'Municipios' },
        { id: 'tabZonas', label:'Zonas' },
        { id: 'tabBarrios', label:'Barrios' }
      ]},
      { id: 'menuFormasPagos', label:'Formas de pago', icon: <LocalAtmIcon />, tabs:[
        { id: 'tabFormasPago', label:'Formas de pago', active : true},
      ]},
      { id: 'menuConsecutivos', label:'Consecutivos', icon: <LooksTwoIcon />, tabs:[
        { id: 'tabConsecutivos', label:'Consecutivos', active : true},
      ]}
    ]
  }
];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

class Navigator extends React.Component {

  constructor(props){
      super(props);

      this.state = {
        selectedIndex : 'menuLocalizacion'
      }
  }

  componentDidMount(){
    this.props.setmenu(categories[0].children[0]);
  }

  handleListItemClick = (event, id, cat, index) =>{
    let menu = categories[cat].children[index];
    this.setState({ selectedIndex  : id});
    this.props.setmenu(menu);
  }

  render(){
    const { classes, ...other } = this.props;
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          Oral Clinic v1.0.0
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Principal
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children, label }, cat) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader} >
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {label}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, label, icon, active }, index) => (
              <ListItem
                selected={(this.state.selectedIndex)}
                onClick={event => this.handleListItemClick(event, childId, cat, index)}
                key={childId}
                button
                className={clsx(classes.item, (this.state.selectedIndex == childId) ? classes.itemActiveItem : null)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {label}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );    
  }


}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  setmenu: PropTypes.func.isRequired,
  loadViewFromNavigator: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);