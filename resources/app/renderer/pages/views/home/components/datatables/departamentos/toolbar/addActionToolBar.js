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
import ModalPais from '../../../modal/pais';

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

    let paises = await API.paises.get();
    this.setState({paises : paises});
  }
  
  handleClick = async () => {
    let pais = await this.modalPais.showModal();
    
    if(pais){
      this.setState({
        openForm : true,
        pais : pais
      });
    }
  }

  saveDepartamento = async ()=>{
    let data = {
      cod : this.state.codigo,
      depto : this.state.depto,
      pais: this.state.pais
    }
    
    console.log("obj", data);
    let departamento = await API.departamentos.post(data);
    this.props.addRow(departamento);
    
    this.showSnackbar();
    this.clearFormFields();
    this.closeCreateForm();
  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  clearFormFields = ()=>{
    this.setState({ 
      cod : '',
      depto : '',
      pais: null,
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

  _renderPaisesItems  = ()=>{
    if(this.state.paises){
      return this.state.paises.map((pais)=>{
        return (<MenuItem value={pais.codigo}>{pais.nombre}</MenuItem>);
      });
    }
  }

  _renderNewModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar departamento
          <Typography variant="overline" display="block" gutterBottom>
             {'PAIS : ' + this.state.pais }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="pais-id">Pais</InputLabel>
              <Select
                disabled={true}
                value={this.state.pais}
                onChange={(event)=>this.setState({ pais : event.target.value })}
                inputProps={{name: 'age', id: 'pais-id'}}
              >
              {this._renderPaisesItems()}
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
              label="Departamento"
              type="text"
              fullWidth
              value={this.state.depto}
              onChange={(event)=>this.setState({ depto : event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveDepartamento} color="primary">
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
      <ModalPais helpers={this.props.helpers} ref={ref => (this.modalPais = ref)}/>
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
