import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

export default class Username extends Component {
    constructor(props){
        super()

        this.state = {
            password : '',
            error : false
        }
    }

    onChange = (e)=>{
        if(!e.target.value){
            return this.setState({ error : true});
        }

        this.setState({ value : e.target.value, error : false});
        this.props.onChange(e);
    }

    onBlur = (e)=>{
        if(!e.target.value){
            return this.setState({ error : true });
        }

        this.setState({ value : e.target.value, error : false});
        this.props.onBlur(e);
    }

    render() {
        return (
            <TextField
            type="email"
            id="standard-full-width"
            label="Cedula de ciudadania"
            placeholder="Cedula de ciudadania"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={this.state.error}
            onBlur={(e)=>this.onBlur(e)}
            onChange={(e)=>this.onChange(e)}
            helperText={`${this.state.error ? 'Introduzca un nùmero de cedula válida' : ''}`}
          />
        )
    }
}
