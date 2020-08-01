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
import ModalZonas from '../../../modal/zonas';

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
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');

    let zonas = await API.zonas.get(this.props.helpers.getMunicipio());
    this.setState({ zonas : zonas });

    this.setState({
      pais  : this.props.helpers.getPais() || '',
      departa  : this.props.helpers.getDepartamento() || '',
      cod_muni  : this.props.helpers.getMunicipio() || '',
      cod_zona  : this.props.helpers.getZona() || '',
    })

  }
  
  handleClick = async () => {
    let zona = await this.modalZonas.showModal();

    if(zona){
        this.setState({
          openForm : true,
          zona : zona
        });
    }

  }

  saveBarrios = async ()=>{
    let data = {
      cod_barrio : this.state.codigo,
      nombre : this.state.nombre,
      flete: this.state.flete,
      cod_muni : this.state.cod_muni,
      departa : this.state.departa,
      cod_zona : this.state.cod_zona,
      pais : this.state.pais
    }
    
    console.log("obj", data);
    let barrio = await API.barrios.post(data);
    this.props.addRow(barrio);
    
    this.showSnackbar();
    this.clearFormFields();
    this.closeCreateForm();
  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  clearFormFields = ()=>{
    this.setState({ 
      cod_barrio : '',
      nombre : '',
      flete: '',
      cod_muni : this.state.cod_muni,
      departa : this.state.departa,
      cod_zona : this.state.cod_zona,
      pais : this.state.pais
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


  _renderZonasItems  = ()=>{
    if(this.state.zonas){
      return this.state.zonas.map((zona)=>{
        return (<MenuItem value={zona.codigo}>{zona.nombre}</MenuItem>);
      });
    }
  }

  _renderNewModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Agregar barrio
          <Typography variant="overline" display="block" gutterBottom>
             {'ZONA : ' + this.state.zona }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="zona-id'">Zona</InputLabel>
              <Select
                disabled={true}
                value={this.state.zona}
                onChange={(event)=>this.setState({ zona : event.target.value })}
                inputProps={{name: 'age', id: 'zona-id'}}
              >
              {this._renderZonasItems()}
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
              label="Barrio"
              type="text"
              fullWidth
              value={this.state.nombre}
              onChange={(event)=>this.setState({ nombre : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtFlete"
              label="Flete"
              type="text"
              fullWidth
              value={this.state.flete}
              onChange={(event)=>this.setState({ flete : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveBarrios} color="primary">
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
        <ModalZonas helpers={this.props.helpers} ref={ref => (this.modalZonas = ref)}/>
        <Tooltip title={"Agregar Barrio"}>
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
