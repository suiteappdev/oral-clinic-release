import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';

import Ciudad from './datatables/ciudad/ciudad';
import Departamentos from './datatables/departamentos/departamentos';
import Pais from './datatables/pais/pais';
import Zonas from './datatables/zonas/zonas';
import Barrios from './datatables/barrios/barrios';
import Municipios from './datatables/municipios/municipios';
import FormasPagos from './datatables/forma_pagos/forma_pagos';
import Consecutivos from './datatables/consecutivos/consecutivos';

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden'
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '0px 0px',
  },
});

class Content extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      loading : true
    };
  }

  componentDidMount(){

  }

  setPais = (pais)=>{
    this.setState({pais : pais});
  }

  setDepartamento = (departamento)=>{
    this.setState({departamento : departamento});
  }

  setMunicipio = (municipio)=>{
    this.setState({municipio : municipio});
  }

  getPais = ()=>{
    return this.state.pais;
  }

  getDepartamento = ()=>{
    return this.state.departamento;
  }

  setZona = (zona)=>{
    this.setState({zona : zona});
  }

  getZona = ()=>{
    return this.state.zona;
  }

  getMunicipio = ()=>{
    return this.state.municipio;
  }

  loader = (isVisible)=>{
    if(isVisible){
      this.setState({loading : true});
    }else{
      this.setState({loading : false});
    }
  }


  _renderView = ()=>{
    switch (this.props.view) {
      case 'tabPais':
          return (<Pais/>)
          break;
      case 'tabDepartamentos':
          
          return (<Departamentos helpers={{
            getPais : this.getPais,
            getDepartamento : this.getDepartamento,
            getMunicipio : this.getMunicipio,
            setPais : this.setPais,
            setDepartamento : this.setDepartamento,
            setMunicipio : this.setMunicipio,
            setZona : this.setZona,
            getZona : this.getZona
          }} />)

          break;
          case 'tabMunicipios':
            return (<Municipios helpers={{
              getPais : this.getPais,
              getDepartamento : this.getDepartamento,
              getMunicipio : this.getMunicipio,
              setPais : this.setPais,
              setDepartamento : this.setDepartamento,
              setMunicipio : this.setMunicipio,
              setZona : this.setZona,
              getZona : this.getZona
            }}  
            />)
            break;
      case 'tabBarrios':
          return (<Barrios helpers={{
              getPais : this.getPais,
              getDepartamento : this.getDepartamento,
              getMunicipio : this.getMunicipio,
              setPais : this.setPais,
              setDepartamento : this.setDepartamento,
              setMunicipio : this.setMunicipio,
              setZona : this.setZona,
              getZona : this.getZona
            }}
           />)
          break;   
      case 'tabZonas':
          return (<Zonas helpers={{
              getPais : this.getPais,
              getDepartamento : this.getDepartamento,
              getMunicipio : this.getMunicipio,
              setPais : this.setPais,
              setDepartamento : this.setDepartamento,
              setMunicipio : this.setMunicipio,
              setZona : this.setZona,
              getZona : this.getZona
            }}
          />)
          break;  
      case 'tabBarrios':
          return (<Barrios helpers={{
              getPais : this.getPais,
              getDepartamento : this.getDepartamento,
              getMunicipio : this.getMunicipio,
              setPais : this.setPais,
              setDepartamento : this.setDepartamento,
              setMunicipio : this.setMunicipio,
              setZona : this.setZona,
              getZona : this.getZona
            }}
          />)
          break;  
          case 'tabFormasPago':
            return (<FormasPagos/>)
            break; 
            case 'tabConsecutivos':
              return (<Consecutivos/>)
              break; 
      default:
          return (<Pais/>)
          break;
    }     
  }

  render (){
    const { classes} = this.props;

    return (<div>{this._renderView()}</div>);
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
};

export default withStyles(styles)(Content);
