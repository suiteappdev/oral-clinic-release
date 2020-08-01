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

class ModalZonas extends React.Component{
    constructor(props){
        super(props);

        this.state  = {
            modalPromise : null
        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = new apiService(true);
        let zonas = await API.zonas.get(this.props.helpers.getMunicipio());
        this.setState({ zonas : zonas });
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
        return this.state.resolve(this.state.zona);
    }

    cancel = ()=>{
        return this.state.reject();
    }

    _renderZonasItems  = ()=>{
        if(this.state.zonas){
          return this.state.zonas.map((zona)=>{
            return (<MenuItem value={zona.codigo}>{zona.nombre}</MenuItem>);
          });
        }
      }

    _renderModalZonas  = ()=>{
            return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.show}>
                <DialogTitle>Zona
                <Typography variant="caption" display="block" gutterBottom>
                        Seleccione la zona de trabajo
                </Typography>
                </DialogTitle>
                <DialogContent>
                <form>
                    <FormControl style={{minWidth: '100%'}}>
                    <InputLabel htmlFor="zonas-id">Zona</InputLabel>
                        <Select
                        value={this.state.zona}
                        onChange={(event)=>this.setState({ zona : event.target.value })}
                        inputProps={{name: 'age', id: 'zonas-id'}}
                        >
                        {this._renderZonasItems()}
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
                {this._renderModalZonas()}
            </React.Fragment>
        );
    }
}

export default withStyles({ name: "ModalZonas" })(ModalZonas);