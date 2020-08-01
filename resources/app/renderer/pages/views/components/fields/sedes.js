
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      width:'100%'
    },
    formControl: {
      margin: theme.spacing(1),
      width:'100%'
    }
  }));

let API = null;
let remote = null;

class SedesField extends React.Component{
    constructor(props){
        super(props)

        this.state = {

        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = remote.require(remote.app.getAppPath() + '/main/services/api.service');
  
        let sedes = await API.sedes.get();
  
        this.setState({ sedes : sedes });
        this.setState({ sede : this.props.value || null });
    }

    onChange  = (event)=>{
        this.setState({sede : event.target.value});
        this.props.setSede(event);
    }

    _renderItem = ()=>{
        if(this.state.sedes){
                return (this.state.sedes.map((sede)=>{
                        return (<MenuItem value={sede.cod}>{sede.nombre}</MenuItem>);
                        })
                ); 
        }
    }

    render(){
        
        const {classes} = this.props;

        return (
            <form autoComplete="off">
                <FormControl style={{width : '100%'}}>
                <InputLabel htmlFor="sedes">Sedes</InputLabel>
                <Select
                placeholder = {'Sede'}
                style={{width : '100%'}}
                value={this.state.sede}
                onChange={this.onChange}
                inputProps={{
                    name: 'sedes',
                    id: 'sedes'
                }}
                >
                {this._renderItem()}
                </Select>
            </FormControl>
        </form>
        );
    }
}

export default withStyles({ name: "SedesField" })(SedesField);