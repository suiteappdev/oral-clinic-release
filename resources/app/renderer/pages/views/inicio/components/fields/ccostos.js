
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

class CentroCostosField extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            ccosto : this.props.value || null
        }
    }

    async componentDidMount(){
        remote = require('electron').remote;
        API = new apiService(false);
  
        let ccostos = await API.centro_costos.get();
        this.setState({ ccostos : ccostos });
        this.setState({ ccosto : this.props.value || null });
    }

    onChange  = (event)=>{
        this.setState({ccosto : event.target.value});
        this.props.setCcosto(event);
    }

    _renderItem = ()=>{
        if(this.state.ccostos){
                return (this.state.ccostos.map((ccosto)=>{
                    console.log("centro", ccosto.centro);
                        return (<MenuItem value={ccosto.centro}>{ccosto.descri}</MenuItem>);
                        })
                ); 
        }
    }

    render(){
        
        const {classes} = this.props;

        return (
            <form autoComplete="off">
                <FormControl style={{width : '100%'}}>
                <InputLabel htmlFor="ccostos">Centro de costos</InputLabel>
                <Select
                placeholder = {'Centro de costos'}
                style={{width : '100%'}}
                value={this.state.ccosto}
                onChange={this.onChange}
                inputProps={{
                    name: 'ccostos',
                    id: 'ccostos'
                }}
                >
                {this._renderItem()}
                </Select>
            </FormControl>
        </form>
        );
    }
}

export default withStyles({ name: "CentroCostosField" })(CentroCostosField);