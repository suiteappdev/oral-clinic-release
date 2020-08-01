import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles , makeStyles} from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import {remote} from 'electron';

const defaultToolbarStyles = {
  iconButton: {

  },
};

let API = null;

class AddActionToolBar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false,
      paises : [],
      form : {}
    }

    console.log("CustomToolbar pais", this.props);
  }

  componentDidMount(){
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
  }

  
  handleClick = () => {
    console.log("open modal here");

    this.setState({
      openForm : true
    });

  }

  savePais = async ()=>{
    let data = {
      codigo : this.state.codigo,
      nombre : this.state.nombre,
      codigo2: this.state.codigo2,
      cod_factelectronica : this.state.cod_factelectronica
    }

    let pais = await API.paises.post(data);
    this.props.addRow(pais);
    
    this.showSnackbar();
    this.clearFormFields();
    this.closeCreateForm();

  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  clearFormFields = ()=>{
    this.setState({ 
      codigo : '',
      nombre : '',
      codigo2: '',
      cod_factelectronica : ''
    });
  }

  closeCreateForm = ()=>{
    this.setState({ openForm : false });
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
    
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar pais</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="txtCodigo"
              label="Código"
              type="text"
              fullWidth
              value={this.state.codigo}
              onChange={(event)=>this.setState({ codigo : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtNombre"
              label="Nombre"
              type="text"
              fullWidth
              value={this.state.nombre}
              onChange={(event)=>this.setState({ nombre : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtCodFact"
              label="Código de factura electronica"
              type="text"
              fullWidth
              value={this.state.facturaElectronica}
              onChange={(event)=>this.setState({ cod_factelectronica : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtCodFact"
              label="Código alternativo"
              type="text"
              fullWidth
              value={this.state.codigo2}
              onChange={(event)=>this.setState({ codigo2 : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.savePais} color="primary">
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
