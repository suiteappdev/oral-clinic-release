import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Typography from '@material-ui/core/Typography';
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles , makeStyles} from "@material-ui/core/styles";
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

let API = null;
let remote = null;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
}));

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
      cod : '',
      depto : '',
      pais : null
    }
  }

  async componentDidMount(){
    remote = require('electron').remote;
    
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
    let paises = await API.paises.get();
    let departamentos = await API.departamentos.get();
    
    this.setState({ paises : paises , departamentos : departamentos});
  }

  openFormEdit = () => {
    let obj = this.props.getSource(this.props.selectedRows);
    this.setState({ undo : obj });

    if(obj){

      let data = {
        id : obj.id,
        codigo : obj.codigo,
        nombre : obj.nombre,
        departamento : obj.departa.trim(),
        marca: obj.marca,
        agencia: obj.agencia,
        provincia: obj.provincia,
        ica : obj.ica,
        categoria : obj.categoria
      }

      this.setState(data);

    }
    
    this.setState({formEdit : true});
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

   updateMunicipios = async ()=>{
    let data = {
      codigo : this.state.codigo,
      nombre : this.state.nombre,
      departa : this.state.departamento,
      marca: this.state.marca,
      agencia: this.state.agencia,
      provincia: this.state.provincia,
      ica : this.state.ica,
      categoria : this.state.categoria
    }

    console.log("data", data);
    
    await this.setState({loading : true});
    await API.municipios.put(this.state.id, data);
    let index = this.props.selectedRows.data[0].dataIndex;
    await this.setState({loading : false});

    this.props.updateRow(index, data);

    this.props.showSnackbar("Registro actualizado.", {
      type : 'UPDATE',
      data : this.state.undo,
      tableIndex: index
    });
  }
  
  confirmDelete = async ()=>{
    await this.props.removeRow(this.props.selectedRows);
  }

  _renderDepartamentosItems  = ()=>{
    if(this.state.departamentos){
      return this.state.departamentos.map((departamento)=>{
        return (<MenuItem value={departamento.cod}>{departamento.depto}</MenuItem>);
      });
    }
  }

  _renderEditModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.formEdit} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Actualizar municipio
          <Typography variant="overline" display="block" gutterBottom>
             {'DEPARTAMENTO : ' + this.state.departamento }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="pais-id">Departamento</InputLabel>
              <Select
                disabled = {true}
                value={this.state.departamento}
                onChange={(event)=>this.setState({ departamento : event.target.value })}
                inputProps={{name: 'age', id: 'pais-id'}}
              >
              {this._renderDepartamentosItems()}
              </Select>
            </FormControl>
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
              id="txtMunicipio"
              label="Municipio"
              type="text"
              fullWidth
              value={this.state.nombre}
              onChange={(event)=>this.setState({ nombre : event.target.value })}
            />

            <TextField
              margin="dense"
              id="txtMarca"
              label="Marca"
              type="text"
              fullWidth
              value={this.state.marca}
              onChange={(event)=>this.setState({ marca : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtAgencia"
              label="Agencia"
              type="text"
              fullWidth
              value={this.state.agencia}
              onChange={(event)=>this.setState({ agencia : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtProvincia"
              label="Provincia"
              type="text"
              fullWidth
              value={this.state.provincia}
              onChange={(event)=>this.setState({ provincia : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtIca"
              label="Ica"
              type="text"
              fullWidth
              value={this.state.ica}
              onChange={(event)=>this.setState({ ica : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtCategoria"
              label="Categoria"
              type="text"
              fullWidth
              value={this.state.categoria}
              onChange={(event)=>this.setState({ categoria : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModalEdit} color="primary">
              Cancelar
            </Button>
            <Button disabled={this.state.loading} variant="contained" color="primary" onClick={this.updateMunicipios} color="primary">
              {this.state.loading ? 'Actualizando...' : 'Actualizar'}
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
