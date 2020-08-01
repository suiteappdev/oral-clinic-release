import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

let API = null;
let remote = null;

class ModalPais extends React.Component{
    constructor(props){
        super(props);

        this.state  = {
            modalPromise : null,
            departamento : null
        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
        
        let paises = await API.paises.get();
        this.setState({ paises : paises });
    }

    showModal = ()=>{
        return new Promise((resolve, reject)=>{
            this.setState({resolve :resolve, reject : reject, show : true});
        });
    }

    hideModal = ()=>{
        this.setState({ show : false});
        this.state.reject();
    }

    confirm = ()=>{
        this.setState({ show : false });
        return this.state.resolve(this.state.pais);
    }

    cancel = ()=>{
        return this.state.reject();
    }

    _renderPaisesItems  = ()=>{
        if(this.state.paises){
          return this.state.paises.map((pais)=>{
            return (<MenuItem value={pais.codigo}>{pais.nombre}</MenuItem>);
          });
        }
      }
  
  
      _renderModalSelectPaises = ()=>{
        return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.show}>
                <DialogTitle>Pais
                  <Typography variant="caption" display="block" gutterBottom>
                        Seleccione el pais de trabajo
                  </Typography>
                </DialogTitle>
                <DialogContent>
          
                  <form>
                    <FormControl style={{minWidth: '100%'}}>
                      <InputLabel htmlFor="select-pais">Pais</InputLabel>
                        <Select
                          value={this.state.pais}
                          onChange={(event)=>this.setState({ pais : event.target.value })}
                          inputProps={{name: 'pais', id: 'select-pais'}}
                        >
                        {this._renderPaisesItems()}
                        </Select>
                    </FormControl>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.confirm} color="primary">
                    Seleccionar
                  </Button>
                </DialogActions>
                </Dialog>  )
    }

    render(){
        return (
            <React.Fragment>
                {this._renderModalSelectPaises()}
            </React.Fragment>
        );
    }
}

export default withStyles({ name: "ModalPais" })(ModalPais);