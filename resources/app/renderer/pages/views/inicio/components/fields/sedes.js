
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
import { apiService } from '../../../../../services/api.service';
import equal from 'fast-deep-equal'

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
            value : this.props.value
        }
        
    }

    async componentDidMount(){
        API = new apiService(false);
        let sedes = await API.sedes.get();
        console.log("sedes", sedes),
        this.setState({ sedes : sedes });
        this.setState({ value : this.props.value });
    }

    onChange  = (event)=>{
        this.setState({value : event.target.value});
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
        console.log("props value", this.props.value);
        return (
            <form autoComplete="off">
                <FormControl style={{width :"100%"}}>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Sedes
                    </InputLabel>
                    <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={this.props.value}
                    onChange={this.onChange}
                    >
                    {this._renderItem()}
                    </Select>
                </FormControl>
        </form>
        );
    }
}

export default withStyles({ name: "SedesField" })(SedesField);