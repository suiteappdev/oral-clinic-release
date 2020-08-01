import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import BlockIcon from "@material-ui/icons/Block";
import Typography from '@material-ui/core/Typography';
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
    this.setState({ paises : paises });
  }

  openFormEdit = () => {
    let data = this.props.source;
    let selectedRows =  this.props.selectedRows;

    let obj = data[selectedRows.data[0].dataIndex];
    if(obj){
      let data = {
        cod : obj.cod,
        depto : obj.depto,
        pais: obj.pais
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

   updateDepartamentos = async ()=>{
    let source = this.props.source;
    let sourceIndex = source[this.props.selectedRows.data[0].dataIndex];

    let data = {
      depto : this.state.depto,
      cod : this.state.cod,
      pais: this.state.pais
    }

    console.log("departamento", data);


    await API.departamentos.put(sourceIndex.id, data);
    let index = this.props.selectedRows.data[0].dataIndex;

    this.props.updateRow(index, data);
    this.props.showSnackbar("Registro actualizado.");
  }
  
  confirmDelete = async ()=>{
    let removed = await this.props.removeRow(this.props.selectedRows);
  }

  _renderPaisesItems  = ()=>{
    if(this.state.paises){
      return this.state.paises.map((pais)=>{
        return (<MenuItem value={pais.codigo}>{pais.nombre}</MenuItem>);
      });
    }
  }

  _renderEditModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.formEdit} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Actualizar departamento
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
              value={this.state.cod}
              onChange={(event)=>this.setState({ cod : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtdepto"
              label="Departamento"
              type="text"
              fullWidth
              value={this.state.depto}
              onChange={(event)=>this.setState({ depto : event.target.value })}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModalEdit} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.updateDepartamentos} color="primary">
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
