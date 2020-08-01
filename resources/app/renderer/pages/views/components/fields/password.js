import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

export default class Password extends Component {
    constructor(props){
        super()

        this.state = {
            value : '',
            error : false
        }
    }

    onChange = (e)=>{
        if(!e.target.value){
            return this.setState({ error : true });
        }

        this.setState({ value : e.target.value, error : false});
        this.props.onChange(e);
    }

    onBlur = (e)=>{
        if(!e.target.value){
            return this.setState({ error : true});
        }

        this.setState({ value : e.target.value, error : false});
        this.props.onBlur(e);
    }

    render() {
        return (
            <TextField
            type="password"
            id="standard-full-width"
            label="Contraseña"
            placeholder="Contraseña"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={this.state.error ? true : false}
            helperText={`${this.state.error ? 'Introduzca una contraseña válida' : ''}`}
            onChange={(e)=>this.onChange(e)}
            onBlur={(e)=>this.onBlur(e)}
          />
        )
    }
}
