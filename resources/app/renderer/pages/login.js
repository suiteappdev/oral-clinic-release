import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, MuiThemeProvider, makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { electron } from 'electron';
import pawPrint from '../../static/paw_print.png';
import Logo from '../../static/logos/brand_logo.png';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiService } from '../services/api.service';
import Username from '../pages/views/components/fields/username'
import Password from '../pages/views/components/fields/password'
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  root: {
    background: 'linear-gradient(45deg, #14538F 30%, #49849B 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(20,83,143, .3)',
    color: 'white',
    height: 28,
    padding: '0 30px',
  },
});

let API = null;
let remote = null;
class LoginPage extends React.Component {

  constructor(props){
      super(props);


      this.state = {

      }


      
  }

  componentDidMount(){
    this.socket = new WebSocket('ws://127.0.0.1:2015');
    var _self  = this;

    _self.socket.onopen  = (e)=>{
      this.socket.send(JSON.stringify({ type : 'validate'}));
      _self.socket = this.socket;
      console.log("connected");
    }

    _self.socket.onmessage = async function (evt) {
      var data;
      eval(evt.data);
      console.log(data)
    
      switch (data.type) {
          case 'validate':
              var r = data.payload[0];
              if(r.state == "complete"){

                API = new apiService(false);

                _self.showLoading(true);
            
                let loginData = await API.Login({
                  username : r.username,
                  password : r.password
                }).catch(()=>  _self.showLoading(false))
            
                _self.showLoading(false);
            
                if(loginData){
                    localStorage.setItem('session', JSON.stringify(loginData));
                    const {ipcRenderer: ipc} = require('electron');
                    ipc.send('open-inicio-view', loginData );
                }
              }else{
                _self.showSnakBar(true);
                _self.socket.send(JSON.stringify({ type : 'validate'}));
              }

          } 
     }
  }

  showLoading = (isLoading)=>{
    this.setState({isLoading});
  }

  login = async ()=>{
     API = new apiService(false);

     this.showLoading(true);

    let loginData = await API.Login({
      username : this.state.username,
      password : this.state.password
    }).catch(()=>  this.showLoading(false));

    this.showLoading(false);

    if(loginData){
        localStorage.setItem('session', JSON.stringify(loginData));
       
        const {ipcRenderer: ipc} = require('electron');
        ipc.send('open-inicio-view', loginData );
    }
  }

  showSnakBar(show){
    this.setState({ showSnackbar : show});
  }

  _renderMetas = ()=>{
    return (
        <Typography style={{position:'absolute', bottom:10}} variant="caption" display="block" gutterBottom>
          Oral Clinic v1.0.0
        </Typography>
        );
  } 

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} noValidate autoComplete="off">
        <div style={{flexDirection:'column',  paddingTop:40, width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
           <img src={Logo} />
        </div>
        <div className={classes.container} style={{borderRadius: 5,backgroundColor:'white', padding:10, width:'100%', height:'auto', display:'flex', justifyContent:'center', textAlign:'center', alignItems:'center', "flexDirection" :'column'}}>
          <Username 
          onChange={(e)=>this.setState({ username : e.target.value})} 
          onBlur={(e)=>this.setState({ username : e.target.value})}
          />
          <br />
          <Password
            onChange={(e)=>this.setState({ password : e.target.value})} 
            onBlur={(e)=>this.setState({ password : e.target.value})}
          />
        <Grid style={{ marginBottom: 20 }} alignItems='left' container className={classes.container} spacing={0}>
          <Grid item xs={12} >
            <Link style={{ fontSize: 12 , color:'#14538F'}} component="button" variant="body2" onClick={(e) => {e.preventDefault()}}>
              Olvide mi contraseña
            </Link>
          </Grid>
        </Grid>
        <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Button className={classes.root} onClick={this.login}>
              ENTRAR
            </Button>
        </div>
        <div style={{position:'relative'}}>
        </div>
        <div style={{flexDirection:'column',  paddingTop:40, width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Typography style={{marginTop:5}} variant="caption" display="block" gutterBottom>
            Ingrese usando su huella
          </Typography>
           <img src={pawPrint} />
        </div>
        {this._renderMetas()}
        </div>
        <Backdrop className={classes.backdrop} open={this.state.isLoading}>
         <CircularProgress/>
        </Backdrop>
        <Snackbar
          open={this.state.showSnackbar}
          onClose={()=>[]}
          autoHideDuration={4000}
          message="Usted no esta registrado!"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={()=>this.showSnakBar(false)}>
                Reintentar
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={()=>this.showSnakBar(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
      />
      </form>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPage);