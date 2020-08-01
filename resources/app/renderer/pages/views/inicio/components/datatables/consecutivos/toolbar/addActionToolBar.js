import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles , makeStyles} from "@material-ui/core/styles";
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
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import SedesField from '../../../fields/sedes';
import CentroCostosField from '../../../fields/ccostos';

const defaultToolbarStyles = {
  iconButton: {

  },
};

import Grid from '@material-ui/core/Grid';

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
  inline: {
    display: 'inline',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));


class AddActionToolBar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false,
      form : {},
      suggestions : [],
      comi : '0.00'
    }

  }

  async componentDidMount(){
    let remote = require('electron').remote;
    API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
  }
  
  handleClick = () => {
    console.log("open modal here");

    this.setState({
      openForm : true
    });

  }

  saveConsecutivos = async ()=>{
    let data = {
      prefijo : this.state.prefijo,
      ano : this.state.ano,
      ccostos : this.state.ccosto,
      clavetecnica : this.state.clavetecnica,
      consecu : this.state.consecu,
      contado : this.state.contado || 0 ,
      credito : this.state.credito,
      documen : this.state.documen,
      f_ini_vence : this.state.f_ini_vence,
      f_vence : this.state.f_vence,
      factura : this.state.factura || 0,
      nro : this.state.nro,
      nro_resolucion : this.state.nro_resolucion,
      ocupa : this.state.ocupa,
      primer_nro : this.state.primer_nro,
      resolu : this.state.resolu,
      sede : this.state.sede,
      sigla : this.state.prefijo,
      ultimo_nro : this.state.ultimo_nro,
    }

    console.log("data", data);
    
    let consecutivo = await API.consecutivos.post(data);
    this.props.addRow(consecutivo);
    
    this.showSnackbar();
    this.clearFormFields();
    this.closeCreateForm();
  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  clearFormFields = ()=>{
    this.setState({
      prefijo : '',
      ano : '',
      ccostos : '',
      clavetecnica : '',
      consecu : '',
      contado : null ,
      credito : '',
      documen : '',
      f_ini_vence : null,
      f_vence : null,
      factura : null,
      nro : '',
      nro_resolucion : '',
      ocupa : null,
      primer_nro : '',
      resolu : '',
      sede : '',
      sigla : null,
      ultimo_nro : '',
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


  clearSelection = ()=>{

  }

  _renderSuggestions = ()=>{
    if(this.state.suggestions && this.state.suggestions.length > 0){
      return this.state.suggestions.map((c)=>{
          return (
            <ListItem alignItems="flex-start" button onClick={()=>{ this.setCuenta(c)}} >
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

  setFocusOnNit = (Input)=>{
    input.focus();
  }

  setSede = (event)=>{
    this.setState({ sede : event.target.value});
  }

  setCcosto = (event)=>{
    this.setState({ ccosto : event.target.value});
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
                  onBlur={this.OnBlurNit}
                  ref={el => this.nitRef = el}
                  onKeyUp={(event)=>{
                    console.log("Evt", event);
                    if(event.keyCode === 13){
                        if(this.state.suggestionsNit.length > 0){
                          this.setState({
                            selectedNit  : this.state.suggestionsNit[0].nit
                          })

                          this.closeSuggestionNit();
                        }
                    }
                  }}
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

  _renderNewModal(){
    const { classes } = this.props;
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar consecutivo</DialogTitle>
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
                <CentroCostosField setCcosto={this.setCcosto} />
              </Grid>
              <Grid item xs={4}>
                <SedesField setSede={this.setSede} />
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
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveConsecutivos} color="primary">
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
