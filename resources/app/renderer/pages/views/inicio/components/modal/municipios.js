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

class ModalMunicipios extends React.Component{
    constructor(props){
        super(props);

        this.state  = {
            modalPromise : null
        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = new apiService(true);
        let municipios = await API.municipios.ByDepartamento.get(this.props.helpers.getDepartamento());
        this.setState({ municipios : municipios });
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
        return this.state.resolve(this.state.municipio);
    }

    cancel = ()=>{
        return this.state.reject();
    }

    _renderMunicipiosItems  = ()=>{
        if(this.state.municipios){
          return this.state.municipios.map((municipio)=>{
            return (<MenuItem value={municipio.codigo}>{municipio.nombre}</MenuItem>);
          });
        }
      }

    _renderModalMunicipios  = ()=>{
            return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.show}>
                <DialogTitle>Municipios
                <Typography variant="caption" display="block" gutterBottom>
                        Seleccione el municipio de trabajo
                </Typography>
                </DialogTitle>
                <DialogContent>
                <form>
                    <FormControl style={{minWidth: '100%'}}>
                    <InputLabel htmlFor="municipio-id">Municipio</InputLabel>
                        <Select
                        value={this.state.municipio}
                        onChange={(event)=>this.setState({ municipio : event.target.value })}
                        inputProps={{name: 'age', id: 'municipio-id'}}
                        >
                        {this._renderMunicipiosItems()}
                        </Select>
                    </FormControl>
                </form>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.confirm} color="primary">
                    Seleccionar
                </Button>
                </DialogActions>
                </Dialog>);
    }

    render(){
        return (
            <React.Fragment>
                {this._renderModalMunicipios()}
            </React.Fragment>
        );
    }
}

export default withStyles({ name: "ModalMunicipios" })(ModalMunicipios);