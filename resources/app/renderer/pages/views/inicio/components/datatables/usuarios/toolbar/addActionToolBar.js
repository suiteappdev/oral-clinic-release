import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles , makeStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { apiService } from '../../../../../../../services/api.service';

const defaultToolbarStyles = {
  iconButton: {

  },
};

let API = null;
let remote = null;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  inline: {
    display: 'inline',
  }
}));


class AddActionToolBar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false,
      form : {},
      suggestions : [],
      comi : '0.00'
    }

  }

  async componentDidMount(){
      API = new apiService(false);
      let sedes = await API.sedes.get();
      this.setState({ sedes : sedes });
  }
  
  handleClick = () => {
    console.log("open modal here");

    this.setState({
      openForm : true
    });

  }

  saveUsuario = async ()=>{
    let data = {
      cedula : this.state.cedula,
      responsable : this.state.responsable,
      sede : this.state.sede,
      clave : this.state.clave,
      estado : this.state.estado
    }
    
    let usuario = await API.usuarios.post(data);
    this.props.addRow(usuario);
    
    this.showSnackbar();
    this.clearFormFields();
    this.closeCreateForm();
  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  clearFormFields = ()=>{
    this.setState({ 
      cedula : null,
      responsable : null,
      sede : null,
      clave : null,
      etado : null
    });
  }

  closeCreateForm = ()=>{
    this.setState({ openForm : false });
  }

  _renderItem = ()=>{
    if(this.state.sedes){
            return (this.state.sedes.map((sede)=>{
                    return (<MenuItem value={sede.cod}>{sede.nombre}</MenuItem>);
                    })
            ); 
    }
  }

  hideSnackBar = ()=>{
    this.setState({ snackbar : false });
  }

  showSnackbar = ()=>{
    this.setState({ snackbar : true});
  }

  snackbarOnClose = ()=>{
    return true;
  }

  _renderNewModal(){
    const { classes } = this.props;

    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Crear usuario</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="txtResponsable"
              label="Responsable"
              type="text"
              fullWidth
              value={this.state.responsable}
              onChange={(event)=>this.setState({ responsable : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtUser"
              label="Cedula"
              type="text"
              fullWidth
              value={this.state.cedula}
              onChange={(event)=>this.setState({ cedula : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtClave"
              label="Clave"
              type="text"
              fullWidth
              value={this.state.clave}
              onChange={(event)=>this.setState({ clave : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtClave"
              label="Confirmar clave"
              type="text"
              fullWidth
              value={this.state.confirmClave}
              onChange={(event)=>this.setState({ confirmClave : event.target.value })}
            />
            <FormControl style={{width :"100%"}}>
              <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Sede
              </InputLabel>
              <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={this.state.sede}
              onChange={(e)=>{
                this.setState({sede :  e.target.value});
              }}
              >
                {this._renderItem()}
              </Select>
            </FormControl>
            <FormControl style={{width :"100%"}}>
              <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Estado
              </InputLabel>
              <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={this.state.estado}
              onChange={(e)=>{
                this.setState({estado : e.target.value});
              }}
              displayEmpty
              >
              <MenuItem value="">
                  <em>Estado</em>
              </MenuItem>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
              </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveUsuario} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbar}
        autoHideDuration={6000}
        onClose={this.snackbarOnClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Registro creado.</span>}
        action={[
          <Button key="undo" color="primary" size="small" onClick={this.hideSnackBar}>
            Deshacer
          </Button>,
          <IconButton
            key="close"
            aria-label="Cerrar"
            color="inherit"
            onClick={this.hideSnackBar}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={"Agregar Pais"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
        {this._renderNewModal()}
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(AddActionToolBar);
