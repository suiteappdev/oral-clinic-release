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
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import SedesField from '../../../fields/sedes';
import CentroCostosField from '../../../fields/ccostos';

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
      console.log("obj", obj);
      let data = {
        prefijo : obj.prefijo,
        ano : obj.ano,
        ccostos : obj.ccostos,
        clavetecnica : obj.clavetecnica,
        consecu : obj.consecu,
        contado : obj.contado || 0 ,
        credito : obj.credito,
        documen : obj.documen,
        f_ini_vence : obj.f_ini_vence,
        f_vence : obj.f_vence,
        factura : obj.factura || 0,
        nro : obj.nro,
        nro_resolucion : obj.nro_resolucion,
        ocupa : obj.ocupa,
        primer_nro : obj.primer_nro,
        resolu : obj.resolu,
        sede : obj.sede,
        sigla : obj.prefijo
      }
        
        console.log(data);

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
      let removed = await this.props.removeRow(this.props.selectedRows).then().catch((e)=>this.props.showSnackbar("Este consecutivo se encuentra en uso."));
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
          <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <TextField
                autoFocus
                margin="dense"
                id="txtCodigo"
                label="Código"
                type="text"
                fullWidth
                value={this.state.sigla}
                onChange={(event)=>this.setState({ sigla : event.target.value })}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="txtDocumento"
                label="Documento"
                type="text"
                fullWidth
                value={this.state.documen}
                onChange={(event)=>this.setState({ documen : event.target.value })}
              />
              </Grid>
              <Grid item xs={2}>
              <TextField
                autoFocus
                margin="dense"
                id="txtAno"
                label="Año"
                type="text"
                fullWidth
                value={this.state.ano}
                onChange={(event)=>this.setState({ ano : event.target.value })}
              />
              </Grid>
              <Grid item xs={2}>
              <TextField
                autoFocus
                margin="dense"
                id="txtPrefijo"
                label="Prefijo"
                type="text"
                fullWidth
                value={this.state.prefijo}
                onChange={(event)=>this.setState({ prefijo : event.target.value })}
              />
              </Grid>
              <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                id="txtConsecutivo"
                label="Número consecutivo"
                type="text"
                fullWidth
                value={this.state.consecu}
                onChange={(event)=>this.setState({ consecu : event.target.value })}
              />
              </Grid>
              <Grid item xs={4}>
                <CentroCostosField value={this.state.ccostos } setCcosto={this.setCcosto} />
              </Grid>
              <Grid item xs={4}>
                <SedesField value={this.state.sede } setSede={this.setSede} />
              </Grid>
              <Grid item xs={6}>
              <TextField
                id="standard-multiline-flexible"
                margin="dense"
                label="Resolución"
                placeholder="Escriba la resolución"
                multiline
                rowsMax="4"
                onChange={(event)=>this.setState({ resolu : event.target.value })}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="txtNroResoluc"
                label="Número resolución"
                type="text"
                fullWidth
                value={this.state.nro}
                onChange={(event)=>this.setState({ nro : event.target.value })}
              />
              </Grid>

              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Fecha de resolución desde"
                    value={this.state.f_ini_vence}
                    onChange={(date)=>this.setState({ f_ini_vence : date})}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Fecha de resolución hasta"
                    value={this.state.f_vence}
                    onChange={(date)=>this.setState({ f_vence : date})}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="txtNroResolucDesde"
                label="Resolución desde"
                type="text"
                fullWidth
                value={this.state.primer_nro}
                onChange={(event)=>this.setState({ primer_nro : event.target.value })}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="txtNroResoluc"
                label="Resolución hasta"
                type="text"
                fullWidth
                value={this.state.ultimo_nro}
                onChange={(event)=>this.setState({ ultimo_nro : event.target.value })}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="txtClave"
                label="Clave tecnica facturación electronica"
                type="text"
                fullWidth
                value={this.state.clavetecnica}
                onChange={(event)=>this.setState({ clavetecnica : event.target.value })}
              />
              </Grid>
              <Grid item xs={4}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.ocupa == 1 ? true : false}
                          onChange={(event)=>this.setState({ocupa : event.target.checked ? 1 : 0})}
                          value={1}
                          color="primary"
                        />
                      }
                      label="Habilitar doc"
                    />
                </FormGroup>
              </Grid>
              <Grid item xs={4}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.factura == 1 ? true : false}
                          onChange={(event)=>this.setState({factura : event.target.checked ? 1 : 0})}
                          value={1}
                          color="primary"
                        />
                      }
                      label="Facturas"
                    />
                </FormGroup>
              </Grid>
              <Grid item xs={4}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.contado == 1 ? true : false}
                          onChange={(event)=>this.setState({contado : event.target.checked ? 1 : 0})}
                          value={1}
                          color="primary"
                        />
                      }
                      label="Contado"
                    />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
              <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.credito == 1 ? true : false}
                          onChange={(event)=>this.setState({credito : event.target.checked ? 1 : 0})}
                          value={1}
                          color="primary"
                        />
                      }
                      label="Crédito"
                    />

              </Grid>
              <Grid item xs={6}>
              <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.showfact == 1 ? true : false}
                          onChange={(event)=>this.setState({showfact : event.target.checked ? 1 : 0})}
                          value={1}
                          color="primary"
                        />
                      }
                      label="Mostrar en facturación"
                    />
              </Grid>
          </Grid>
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
