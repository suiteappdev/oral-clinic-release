import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

let API = null;
let remote = null;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
};

class CustomToolbarSelect extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      confirmDelete : false,
      snackbar : false,
      formEdit : false,
    }
  }

  componentDidMount(){
    remote = require('electron').remote;
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
  }

  openFormEdit = () => {
    let obj = this.props.getSource(this.props.selectedRows);
    
    if(obj){
      let data = {
        id     : obj.id,  
        codigo : obj.codigo,
        nombre : obj.nombre,
        codigo2: obj.codigo2,
        cod_factelectronica : obj.cod_factelectronica
      }
      this.setState(data);
    }
    
    this.setState({formEdit : true})
  }

  showModalDelete = ()=> {
    this.setState({confirmDelete : true})
  }

  handleClose = ()=> {
    this.setState({confirmDelete : false})
  }

  closeModalEdit =()=>{
    this.setState({formEdit : false});
  }

   updatePais = async ()=>{
    let data = {
      codigo : this.state.codigo,
      nombre : this.state.nombre,
      codigo2: this.state.codigo2,
      cod_factelectronica :this.state.cod_factelectronica
    }

    await API.paises.put(this.state.id, data);
    let index = this.props.selectedRows.data[0].dataIndex;

    this.props.updateRow(index, data);
    this.props.showSnackbar("Registro actualizado.");
  }
  
  confirmDelete = async ()=>{
    let removed = await this.props.removeRow(this.props.selectedRows);
  }

  _renderEditModal(){
    
    return (
      <div>
        <Dialog open={this.state.formEdit} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Actualizar pais</DialogTitle>
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
              value={this.state.cod_factelectronica}
              onChange={(event)=>this.setState({ cod_factelectronica : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtCod2"
              label="Código alternativo"
              type="text"
              fullWidth
              value={this.state.codigo2}
              onChange={(event)=>this.setState({ codigo2 : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModalEdit} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.updatePais} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.iconContainer}>
        <Tooltip title={"Editar"}>
          <IconButton className={classes.iconButton} onClick={this.openFormEdit}>
            <EditIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Eliminar"}>
          <IconButton className={classes.iconButton} onClick={this.showModalDelete}>
            <DeleteIcon className={[classes.icon].join(" ")} />
          </IconButton>
        </Tooltip>
        <Dialog
        open={this.state.confirmDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
       <DialogTitle id="alert-dialog-slide-title">{"Confirma que desea eliminar este registro?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              Al eliminar este registro se borrara completamente de la base de datos. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="secondary" onClick={this.confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      {this._renderEditModal()}
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles)(CustomToolbarSelect);
