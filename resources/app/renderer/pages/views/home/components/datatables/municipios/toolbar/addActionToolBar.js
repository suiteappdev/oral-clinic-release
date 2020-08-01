import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles , makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
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
import MenuItem from '@material-ui/core/MenuItem';
import ModalDepartamentos from '../../../modal/departamentos'

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
}));


class AddActionToolBar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false,
      municipios : [],
      form : {}
    }

  }

  async componentDidMount(){
    let remote = require('electron').remote;
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
    let departamentos = await API.departamentos.ByPais.get(this.props.helpers.getPais());
    this.setState({departamentos : departamentos});
  }
  
  handleClick = async () => {
      let depto = await this.modalDeptos.showModal();
      if(depto){
        this.setState({
          openForm : true,
          departamento : depto
        });
      }
  }

  saveMunicipios = async ()=>{
   
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
    
    console.log("obj", data);
    let municipio = await API.municipios.post(data);
    this.props.addRow(municipio);
    
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
      departa : null,
      nombre: '',
      marca: '',
      agencia: '',
      provincia: '',
      ica: ''
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

  onSelectPais(event) {

  }

  _renderDepartamentosItems  = ()=>{
    if(this.state.departamentos){
      return this.state.departamentos.map((departamento)=>{
        return (<MenuItem value={departamento.cod}>{departamento.depto}</MenuItem>);
      });
    }
  }

  _renderNewModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar municipios
          <Typography variant="overline" display="block" gutterBottom>
             {'Departamento : ' + this.state.departamento }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="pais-id">Departamento</InputLabel>
              <Select
                disabled={this.state.departamento}
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
              id="txtDepartamento"
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
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveMunicipios} color="primary">
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
        <ModalDepartamentos helpers={this.props.helpers} ref={ref => (this.modalDeptos = ref)}/>
        <Tooltip title={"Agregar municipios"}>
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
