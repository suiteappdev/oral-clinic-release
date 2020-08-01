import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
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
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

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

  }

  async componentUnMount(){
    remote = require('electron').remote;
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
  }

  openFormEdit = () => {
    let data = this.props.source;
    let selectedRows =  this.props.selectedRows;

    let obj = data[selectedRows.data[0].dataIndex];
    if(obj){
      let data = {
        cod : obj.cod,
        for_p : obj.for_p,
        comi : obj.comi,
        devolu : obj.devolu,
        canje : obj.canje,
        otro_nit :obj.otro_nit,
        selectedNit : obj.nit,
        selectedCta :  obj.cta,
        inhabilitado : obj.inhabilitado,
        doc : obj.doc,
        anticipo : obj.anticipo
      }

      this.setState(data);
    }
    
    this.setState({formEdit : true})
  }

  getSuggestions = async (event)=>{
    if(event.target.value){
      this.setState({ selectedCta : event.target.value});
      let suggestion = await API.cuentas.search.get(event.target.value, 3);
      this.setState({ suggestions : suggestion});
    }else{
      this.setState({ selectedCta : ''});
      this.closeSuggestion();
    }
  }

  getSuggestionsNit = async (event)=>{
    if(event.target.value){
      this.setState({ selectedNit : event.target.value});
      let suggestion = await API.nits.search.get(event.target.value, 3);
      this.setState({ suggestionsNit : suggestion});
    }else{
      this.setState({ selectedNit : ''});
      this.closeSuggestion();
    }
  }

  closeSuggestion = ()=>{
    this.setState({ suggestions : null});
  }

  closeSuggestionNit = ()=>{
    this.setState({ suggestionsNit : null});
  }

  _renderSuggestions = ()=>{
    if(this.state.suggestions && this.state.suggestions.length > 0){
      return this.state.suggestions.map((c)=>{
          return (
            <ListItem alignItems="flex-start" button onClick={()=>{ this.setCuenta(c)}}>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={require('../../../../../../../../static/images/avatar/1.jpg')}/>
            </ListItemAvatar>
            <ListItemText
              primary={c.nom_cta}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={this.props.classes.inline}
                    color="textPrimary"
                  >
                  {c.cod_cta}
                  </Typography>
                  {' - '}{c.nom_cta.toLowerCase()}
                </React.Fragment>
              }
            />
        </ListItem>
          )        
      });
    }
  }

  _renderSuggestionsNit = ()=>{
    if(this.state.suggestionsNit && this.state.suggestionsNit.length > 0){
      return this.state.suggestionsNit.map((c)=>{
          return (
            <ListItem alignItems="flex-start" button onClick={()=>{ this.setNit(c)}}>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={require('../../../../../../../../static/images/avatar/1.jpg')}/>
            </ListItemAvatar>
            <ListItemText
              primary={c.nit}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={this.props.classes.inline}
                    color="textPrimary"
                  >
                  {c.cod_cta}
                  </Typography>
                  {`${c.direcc || 'Sin dirección'} - `}{`${c.nom1} ${c.nom2} ${c.ape1} ${c.ape2}`}
                </React.Fragment>
              }
            />
        </ListItem>
          )        
      });
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

  setCuenta = (c)=>{
    if(c){
      this.setState({ selectedCta : c.cod_cta});
      this.closeSuggestion();
    }
  }

  setNit = (c)=>{
    if(c){
      this.setState({ selectedNit: c.nit});
      this.closeSuggestionNit();
    }
  }


   updateDepartamentos = async ()=>{
    let source = this.props.source;
    let sourceIndex = source[this.props.selectedRows.data[0].dataIndex];

    let data = {
      cod : this.state.cod,
      for_p : this.state.for_p,
      comi : this.state.comi,
      devolu : this.state.devolu,
      canje : this.state.canje,
      otro_nit :this.state.otro_nit,
      nit : this.state.selectedNit,
      cta :  this.state.selectedCta,
      doc :  this.state.doc,
      inhabilitado : this.state.inhabilitado,
      anticipo : this.state.anticipo
    }

    await API.formasPagos.put(sourceIndex.id, data);
    let index = this.props.selectedRows.data[0].dataIndex;

    this.props.updateRow(index, data);
    this.props.showSnackbar("Registro actualizado.");
  }
  
  confirmDelete = async ()=>{
    let removed = await this.props.removeRow(this.props.selectedRows);
  }

    _renderNitSelector = ()=>{

    if(this.state.otro_nit == 1){
      return ( <React.Fragment>
                <TextField
                  autoFocus={true}
                  margin="dense"
                  id="txtNit"
                  label="Nit"
                  type="text"
                  fullWidth
                  placeholder={'Escribe para buscar un nit...'}
                  value={this.state.selectedNit}
                  onChange={this.getSuggestionsNit}
                  ref={el => this.nitRef = el}
                  onBlur={this.OnBlurNit}
                />
                <List style={{position: 'fixed', zIndex: 99999, }}>
                  <Paper>
                    {this._renderSuggestionsNit()}
                  </Paper>
                </List>  
            </React.Fragment>)
    }

    return null;
  }

  OnBlurCuenta = (event)=>{
    if(this.state.suggestions && this.state.suggestions.length > 0){
      setTimeout(()=>{
        this.closeSuggestion();
      }, 100)
    }
  }

  OnBlurNit = (event)=>{
    if(this.state.suggestionsNit && this.state.suggestionsNit.length > 0){
      setTimeout(()=>{
        this.closeSuggestionNit();
      }, 100)
    }
  }


  _renderEditModal(){

    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.formEdit} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Actualizar forma de pago</DialogTitle>
          <DialogContent>
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
              id="txtfor_p"
              label="Forma de pago"
              type="text"
              fullWidth
              value={this.state.for_p}
              onChange={(event)=>this.setState({ for_p : event.target.value })}
            />
            <TextField
              margin="dense"
              id="txtCuenta"
              label="Cuenta"
              type="text"
              fullWidth
              value={this.state.selectedCta}
              placeholder={'Escribe para buscar una cuenta...'}
              onBlur={this.OnBlurCuenta}
              onChange={this.getSuggestions}
            />
            <List style={{position: 'fixed', zIndex: 99999, }}>
              <Paper>
                {this._renderSuggestions()}
              </Paper>
            </List>  
            <TextField
              margin="dense"
              id="txtComision"
              label="Comisión"
              type="text"
              fullWidth
              value={this.state.comi}
              onChange={(event)=>this.setState({ comi : event.target.value })}
            />
            {this._renderNitSelector()}
          
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.doc == 1 ? true : false}
                    onChange={(event)=>this.setState({doc : event.target.checked ? 1 : 0})}
                    value={1}
                    color="primary"
                  />
                }
                label="Doct"
              />
             <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.devolu == 1 ? true : false}
                    onChange={(event)=>this.setState({devolu : event.target.checked ? 1 : 0})}
                    value={1}
                    color="primary"
                  />
                }
                label="Devolucion"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.canje == 1 ? true :false}
                    onChange={(event)=>this.setState({canje : event.target.checked ? 1 : 0})}
                    value={1}
                    color="Primary"
                  />
                }
                label="Canje"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.anticipo == 1 ? true : false}
                    onChange={(e)=>this.setState({anticipo : event.target.checked ? 1 : 0})}
                    value="1"
                    color="primary"
                  />
                }
                label="Anticipo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.otro_nit == 1 ? true : false}
                    onChange={(e)=>{
                      this.setState({otro_nit : event.target.checked ? 1 : 0});
                      console.log("this", this.nitRef);
                    }}
                    value={1}
                    color="primary"
                  />
                }
                label="Nit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.inhabilitado == 1 ? true : false}
                    onChange={(e)=>this.setState({inhabilitado : event.target.checked ? 1 : 0})}
                    value={1}
                    color="primary"
                  />
                }
                label="Inhabilitado"
              />
            </FormGroup>
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
