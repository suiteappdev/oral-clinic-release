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
import { apiService } from '../../../../../services/api.service';

let API = null;
let remote = null;

class ModalDepartamentos extends React.Component{
    constructor(props){
        super(props);

        this.state  = {
            modalPromise : null,
            departamento : null
        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = new apiService(true);
        let departamentos = await API.departamentos.ByPais.get(this.props.helpers.getPais());
        this.setState({ departamentos : departamentos });
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
        return this.state.resolve(this.state.departamento);
    }

    cancel = ()=>{
        return this.state.reject();
    }

    _renderDepartamentosItems  = ()=>{
        if(this.state.departamentos){
          return this.state.departamentos.map((departamento)=>{
            return (<MenuItem value={departamento.cod}>{departamento.depto}</MenuItem>);
          });
        }
      }
  
  
      _renderModalSelectDepartamentos = ()=>{
        return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.show}>
                <DialogTitle>Departamentos
                  <Typography variant="caption" display="block" gutterBottom>
                        Seleccione el departamento de trabajo
                  </Typography>
                </DialogTitle>
                <DialogContent>
          
                  <form>
                    <FormControl style={{minWidth: '100%'}}>
                      <InputLabel htmlFor="select-departamento">Departamentos</InputLabel>
                        <Select
                          value={this.state.departamento}
                          onChange={(event)=>this.setState({ departamento : event.target.value })}
                          inputProps={{name: 'departamento', id: 'select-departamento'}}
                        >
                        {this._renderDepartamentosItems()}
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
                {this._renderModalSelectDepartamentos()}
            </React.Fragment>
        );
    }
}

export default withStyles({ name: "ModalDepartamentos" })(ModalDepartamentos);