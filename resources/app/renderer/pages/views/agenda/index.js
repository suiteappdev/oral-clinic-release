import React from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, withStyles, MuiThemeProvider} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigator from '../inicio/components/Navigator';
import Content from '../inicio/components/Content';
import Header from '../inicio/components/Header';
import dynamic from 'next/dynamic'
import Calendar from '../components/calendar'
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import SedesField from '../components/fields/sedes';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

const drawerWidth = 256;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#eaeff1',
  },
};

class AgendaModule extends React.Component {
  constructor(props){
    super(props);

    this.state = {
     names : [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
      ]
    }
  }

  componentDidMount(){

  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  setMenu = (menu)=>{
    this.setState({ menu : menu });
    this.loadView(menu.tabs[0].id);
  }

  setSede = (event)=>{
    this.setState({ sede : event.target.value});
  }
  
  loadView = (view)=>{
    this.setState({ view : view });
  }

  render() {
    const { classes } = this.props;

    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }
    
    const rows = [
      createData('07AM-08AM', 1, 1, 1, 1),
      createData('09AM-10AM', 2, 2, 2, 2),
      createData('11AM-12AM', 3, 3, 3, 3),
      createData('01AM-02PM', 4, 4, 4, 4),
      createData('03PM-04PM', 5, 5, 5, 5),
      createData('05PM-06PM', 6, 6, 6, 6),
    ];

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
        <Grid container spacing={3}>
        <Grid item xs={3} >
         <Calendar/>
        </Grid>
        <Grid item xs={3} >
            <SedesField setSede={this.setSede} />
            <List style={{width: '100%',maxWidth: 360,backgroundColor: theme.palette.background.paper, position: 'relative', overflow: 'auto',maxHeight: 200}} subheader={<li />}>
              {[0, 1, 2, 3, 4].map(sectionId => (
                <li key={`section-${sectionId}`} style={{backgroundColor: theme.palette.background.paper}}>
                  <ul style={{backgroundColor: 'inherit',padding: 0}}>
                    <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                    {[0, 1, 2].map(item => (
                      <ListItem key={`item-${sectionId}-${item}`}>
                        <ListItemText primary={`Item ${item}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))}
          </List>
        </Grid>
        <Grid item xs={6}>
        <Table className={classes.table} size="small">
          <TableHead>

            <TableRow>
              { 
                Array.from(Array(31).keys()).map((index)=>(<TableCell padding={'none'}><span style={{padding:'6px'}} >{(index == 0) ? 'HORARIOS' : index }</span></TableCell>))
              }
            </TableRow>
          </TableHead>
          <TableBody>
          {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row" style={{fontSize : '10px', display:'flex', padding:'4px', flexDirection:'column'}}>
                  {row.name}
                </TableCell>
                <TableCell style={{fontSize : '11px', textAlign:'center', padding:'0px'}}><span>{row.calories}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Grid>
      </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

AgendaModule.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme : true })(AgendaModule);