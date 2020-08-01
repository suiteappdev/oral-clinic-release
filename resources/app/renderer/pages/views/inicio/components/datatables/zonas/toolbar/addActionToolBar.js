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
import ModalMunicipios from '../../../modal/municipios'
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
}));


class AddActionToolBar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false,
      paises : [],
      form : {}
    }

  }

  async componentDidMount(){
    let remote = require('electron').remote;
    API = new apiService(true);

    let municipios = await API.municipios.ByDepartamento.get(this.props.helpers.getDepartamento());
    this.setState({ municipios : municipios });

    this.setState({
      pais  : this.props.helpers.getPais() || '',
      departamento  : this.props.helpers.getDepartamento() || '',
      municipio  : this.props.helpers.getMunicipio() || '',
    })
  }
  
  handleClick = async () => {
    let municipio = await this.modalMunicipios.showModal();

    if(municipio){
      this.setState({
        openForm : true,
        municipio : municipio
      });
    }

  }

  saveZona = async ()=>{

    let data = {
      codigo : this.state.codigo,
      nombre : this.state.nombre,
      pais : this.state.pais || '',
      depto : this.state.departamento || '',
      ciudad : this.state.municipio || ''
    }
    
    console.log("obj", data);
    let zona = await API.zonas.post(data);
    this.props.addRow(zona);
    
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
        nombre :'',
        pais : '',
        departamento : '',
        municipio : ''
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

  _renderMunicipiosItems  = ()=>{
    if(this.state.municipios){
      return this.state.municipios.map((municipio)=>{
        return (<MenuItem value={municipio.codigo}>{municipio.nombre}</MenuItem>);
      });
    }
  }

  _renderNewModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar zona
          <Typography variant="overline" display="block" gutterBottom>
             {'MUNICIPIO : ' + this.state.municipio }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="municipio-id'">Municipio</InputLabel>
              <Select
                disabled={true}
                value={this.state.municipio}
                onChange={(event)=>this.setState({ municipio : event.target.value })}
                inputProps={{name: 'age', id: 'municipio-id'}}
              >
              {this._renderMunicipiosItems()}
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
              id="txtNombre"
              label="Zona"
              type="text"
              fullWidth
              value={this.state.nombre}
              onChange={(event)=>this.setState({ nombre : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveZona} color="primary">
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
      <ModalMunicipios helpers={this.props.helpers} ref={ref => (this.modalMunicipios = ref)}/>
        <Tooltip title={"Agregar Zona"}>
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
