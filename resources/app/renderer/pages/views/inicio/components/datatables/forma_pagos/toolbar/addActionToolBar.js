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
  inline: {
    display: 'inline',
  }
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

  saveFormaPagos = async ()=>{
    let data = {
      cod : this.state.cod,
      for_p : this.state.for_p,
      comi : this.state.comi,
      devolu : this.state.devolu,
      canje : this.state.canje,
      otro_nit : this.state.otro_nit,
      nit : this.state.selectedNit,
      cta : this.state.selectedNit,
      inhabilitado : this.state.inhabilitado,
      anticipo : this.state.anticipo,
      doc : this.state.doc
    }
    
    let formaPgo = await API.formasPagos.post(data);
    this.props.addRow(formaPgo);
    
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
      for_p : '',
      comi : '',
      devolu : '',
      canje : '',
      otro_nit :'',
      nit : '',
      cta : '',
      inhabilitado : '',
      anticipo : '',
      doc : ''
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
          <DialogTitle id="form-dialog-title">Agregar forma de pago</DialogTitle>
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
              onKeyUp={(event)=>{
                    console.log("Evt", event);
                    if(event.keyCode === 13){
                        if(this.state.suggestions.length > 0){
                          this.setState({
                            selectedCta  : this.state.suggestions[0].cod_cta
                          })

                          this.closeSuggestion();
                        }
                    }
                  }}
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
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveFormaPagos} color="primary">
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
