import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Typography from '@material-ui/core/Typography';
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
    
    let zonas = await API.zonas.get(this.props.helpers.getMunicipio());
    this.setState({ zonas : zonas });

    this.setState({
      pais  : this.props.helpers.getPais() || '',
      departa  : this.props.helpers.getDepartamento() || '',
      cod_muni  : this.props.helpers.getMunicipio() || '',
      cod_zona  : this.props.helpers.getZona() || '',
    })
  }

  openFormEdit = () => {
    let data = this.props.source;
    let selectedRows =  this.props.selectedRows;

    let obj = data[selectedRows.data[0].dataIndex];
    if(obj){
      let data = {
        cod_barrio : obj.cod_barrio,
        nombre : obj.nombre,
        flete: obj.flete,
        pais  : this.props.helpers.getPais() || '',
        departa  : this.props.helpers.getDepartamento() || '',
        cod_muni  : this.props.helpers.getMunicipio() || '',
        cod_zona  : this.props.helpers.getZona() || ''
      }

      this.setState(data);
    }
    
    this.setState({formEdit : true})
  }

  updateBarrios = async ()=>{
    let data = this.props.source;
    let selectedRows =  this.props.selectedRows;

    let sourceIndex = data[selectedRows.data[0].dataIndex];

    if(sourceIndex){

      let obj = {
        cod_barrio : this.state.cod_barrio,
        nombre : this.state.nombre,
        flete: this.state.flete,
        pais  : this.props.helpers.getPais() || '',
        departa  : this.props.helpers.getDepartamento() || '',
        cod_muni  : this.props.helpers.getMunicipio() || '',
        cod_zona  : this.props.helpers.getZona() || ''
      }

      await API.barrios.put(sourceIndex.id, obj);
      let index = this.props.selectedRows.data[0].dataIndex;

      this.props.updateRow(index, obj);
      this.props.showSnackbar("Registro actualizado.");
    }
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

  confirmDelete = async ()=>{
    let removed = await this.props.removeRow(this.props.selectedRows);
  }

  _renderZonasItems  = ()=>{
    if(this.state.zonas){
      return this.state.zonas.map((zona)=>{
        return (<MenuItem value={zona.codigo}>{zona.nombre}</MenuItem>);
      });
    }
  }

  _renderEditModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.formEdit} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Actualizar barrio
          <Typography variant="overline" display="block" gutterBottom>
             {'ZONA : ' + this.state.cod_zona }
          </Typography>
          </DialogTitle>
          <DialogContent>
          <FormControl style={{minWidth: '100%'}} className={classes.formControl}  margin="dense">
              <InputLabel htmlFor="zona-id'">Zona</InputLabel>
              <Select
                disabled={true}
                value={this.state.cod_zona}
                onChange={(event)=>this.setState({ cod_zona : event.target.value })}
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
              value={this.state.cod_barrio}
              onChange={(event)=>this.setState({ cod_barrio : event.target.value })}
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
            <Button onClick={this.closeModalEdit} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.updateBarrios} color="primary">
              Actualizar
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
