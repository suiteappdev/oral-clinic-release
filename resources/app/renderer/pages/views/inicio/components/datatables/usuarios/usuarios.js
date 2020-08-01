import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import AddActionToolBar from './toolbar/addActionToolBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CustomToolbarSelect from './toolbar/CustomToolbarSelect'
import Snackbar from '@material-ui/core/Snackbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { apiService } from '../../../../../../services/api.service';
import SedesField from "../../fields/sedes";
import Backdrop from '@material-ui/core/Backdrop';
import pawPrint from '../../../../../../../static/paw_print.png';
import CheckIcon from '@material-ui/icons/Check';
import moment from "moment";

let API = null;
let remote = null;

const styles = (theme)=>({
  root: {
    minWidth: 275,
    marginBottom : 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class Usuarios extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          showEditToolbar : false,
          loading : true,
          selectedRow : null,
          showBackdrop : true,
          showFingerprint : false,
          h1 : false,
          h2 : false,
          h3 : false,
          h4 : false,
          h5 : false
        };
    }

    handleChangeState () {

    }
    
    async componentDidMount(){
      remote = require('electron').remote;
      API = new apiService(false);
      let sedes = await API.sedes.get();
      this.setState({ sedes : sedes });
      let usuarios = await API.usuarios.get();

      this.setState({ usuarios : usuarios });
      this.loader(false);

      this.socket = new WebSocket('ws://127.0.0.1:2015');
      var _self  = this;
  
      _self.socket.onopen  = (e)=>{
        _self.socket = this.socket;
      }
  
      _self.socket.onmessage = async function (evt) {
        var data;
        eval(evt.data);
        console.log(data)
      
        switch (data.type) {
            case 'update':
                var r = data.payload[0];

                switch (r.time) {
                  case "1":
                    _self.setState({ finger1 :  true});
                    break;
                  case "2":
                    _self.setState({ finger2 :  true});
                    break;
                  case "3":
                    _self.setState({ finger3 :  true});
                    break;
                  case "4":
                    _self.setState({ finger4 :  true});
                    break;
                  default:
                    if(r.state == "complete"){
                      _self.setState({ finger5 :  true});
                    }
                    break;
                }

            } 
       }


    }

  loader = (isVisible, text)=>{
    this.setState({ loading : isVisible, textLoading : text || 'Cargando...'});
  }


  hideSnackBar = ()=>{
    this.setState({ snackbar : false});
  }

  showSnackbar = (snackbarText)=>{
    this.setState({ snackbar : true, snackbarText: snackbarText});
  }

  snackbarOnClose = ()=>{
    return true;
  }

    addRow = (row)=>{
      this.setState({
        usuarios : [...this.state.usuarios, row]
      });
    }

    async updateUser(){
      this.loader(true);
      
      let user = await API.usuarios.put(this.state.selectedRow.id, this.state.selectedRow);
      let usuarios = await API.usuarios.get();

      this.setState({ usuarios : usuarios });
      this.loader(false);
    }

    removeRow = async (selectedRow) =>{
      return new Promise((resolve, reject)=>{
          let data = this.state.formas_pagos;
          this.loader(true, 'Borrando registros por favor espera...');

          for(let r in selectedRow.data){
              
              let sourceIndex = data[selectedRow.data[r].dataIndex];


              if(sourceIndex.id){
                try{
                  (async ()=>{
                      await API.formasPagos.delete(sourceIndex.id);
                  })(sourceIndex);
                }catch(e){
                  reject(e.message);
                }
              }

              let tableIndex = selectedRow.data[r].index;
              data.splice(tableIndex, 1);
          }

          this.setState({ formas_pagos : data });
          this.loader(false);
          this.showSnackbar("Registros Borrados");
      });
    }

    updateRow= (index, data)=>{
      let formas_pagos = [...this.state.formas_pagos];     
      formas_pagos[index] = data;                  
      this.setState({ formas_pagos : formas_pagos }); 
    }

    _renderItem = ()=>{
      if(this.state.sedes){
              return (this.state.sedes.map((sede)=>{
                      return (<MenuItem value={sede.cod}>{sede.nombre}</MenuItem>);
                      })
              ); 
      }
  }

    _renderContent (){
      console.log("loading", this.state.loading);
      if(this.state.loading){
          return (<Grid container justify ="center" direction="column" alignContent="center"> <CircularProgress style={{margin:'0 auto'}} /><Typography>{this.state.textLoading || 'Cargando...'}</Typography></Grid>);
      }
      
      return this._renderDatatable();

    }

    toggleFingerprint(){
      if(!this.state.selectedRow){
        return alert("Debe seleccionar un usuario de la lista");
      }

      if(!this.state.showFingerprint){
        this.socket.send(JSON.stringify({ type : 'update',  payload : { id : this.state.selectedRow.id.toString()} }));
      }

      this.setState({showFingerprint : !this.state.showFingerprint});
    }

    _renderDatatable () {


        const columns = [
            {
                name: "id",
                label: "Codigo",
                options: {
                 filter: true,
                 sort: false,
                }
               },
          {
            name: "usuario",
            label: "Nombre de usuario",
            options: {
             filter: true,
             sort: false,
            }
           },
          {
           name: "responsable",
           label: "Empleado responsable",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
            name: "cedula",
            label: "Cedula",
            options: {
             filter: true,
             sort: true,
            }
           },
           {
            name: "sede",
            label: "Sede",
            options: {
             filter: true,
             sort: true,
            }
           },
           {
            name: "estado",
            label: "Activo",
            options: {
             filter: true,
             sort: true,
             customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <Checkbox
                    disabled  = {true}
                    checked={(value == 1)  ? true : false}
                    value={value}
                    color="Primary"
                  />
              );
            }
            }
           },
           {
            name: "fechaupdate",
            label: "Ultima actualizacion",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                console.log("value", value);
                  return value ? moment(value).format("YYYY-MM-DD") : 'Desactualizado'
                },
             filter: true,
             sort: true,
            }
           },
           {
            name: "fecha",
            label: "Fecha",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                  return value ? moment(value).format("YYYY-MM-DD") : 'Desactualizado'
                },
             filter: true,
             sort: true,
            }
           }
         ];
         const options = {
          filterType: "dropdown",
          responsive: "scroll",
          selectableRows:'single',
          selectableRowsOnClick: true,
          onRowsSelect : async (currentRowsSelected)=>{
            let data =  this.state.usuarios[currentRowsSelected[0].dataIndex];
            
            await this.setState({ selectedRow : data});
            console.log("state", this.state.selectedRow);
          },
          onRowsDelete : (currentRowsSelected)=>{
            console.log("deleted", currentRowsSelected);
          },
          customToolbar: () => {
            return (
              <span>
                  <AddActionToolBar addRow={this.addRow}/>
              </span>
            );
          },
          customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect 
              updateRow={this.updateRow} 
              source={this.state.formas_pagos} 
              removeRow={this.removeRow} 
              selectedRows={selectedRows} 
              displayData={displayData} 
              setSelectedRows={setSelectedRows} 
              showSnackbar = {this.showSnackbar}  
              hideSnackbar = {this.hideSnackBar}  
              />
          ),

          textLabels: {
            body: {
              noMatch: "Sin resultados",
              toolTip: "Ordenar",
            },
            pagination: {
              next: "Proxima Pagina",
              previous: "Pagina Anterior",
              rowsPerPage: "Filas por pagina:",
              displayRows: "de",
            },
            toolbar: {
              search: "Buscar",
              downloadCsv: "Descargar CSV",
              print: "Print",
              viewColumns: "Ver Columnas",
              filterTable: "Filtrar tabla",
            },
            filter: {
              all: "TODO",
              title: "FILTROS",
              reset: "RESETEAR",
            },
            viewColumns: {
              title: "Mostrar Columnas",
              titleAria: "Mostrar/Ocultar columnas",
            },
            selectedRows: {
              text: "Fila(s) seleccionada",
              delete: "Borrar",
              deleteAria: "Borrar fila seleccionaba"
            },
          }
        };

        const { classes } = this.props;

        return(
          <>
            <Card style={{marginBottom : 20, padding : 10}} variant="outlined">
              <CardContent>

              <form  noValidate autoComplete="on">
                <Grid container xs={6} spacing={3}>
                    <Grid item xs={4} >
                        <Grid container justify="right" spacing={2}>
                            <TextField  required id="standard-required" onChange={(e)=>{
                              
                              let data = {...this.state.selectedRow};
                              data.cedula  =  e.target.value;
                              this.setState({selectedRow : data});

                            }} value={this.state.selectedRow  ? this.state.selectedRow.cedula : ""} InputLabelProps={{shrink: true}} label="Cedula" placeholder="Cedula"  />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                            <TextField required onChange={(e)=>{
                              
                              let data = {...this.state.selectedRow};
                              data.responsable  =  e.target.value;
                              this.setState({selectedRow : data});

                            }} id="standard-required" value={this.state.selectedRow  ? this.state.selectedRow.responsable : ""} InputLabelProps={{shrink: true}} label="Responsable" placeholder="Responsable"/>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                            <TextField required id="standard-required" onChange={(e)=>{
                              
                              let data = {...this.state.selectedRow};
                              data.usuario  =  e.target.value;
                              this.setState({selectedRow : data});

                            }} value={this.state.selectedRow  ? this.state.selectedRow.usuario : ""}   InputLabelProps={{shrink: true}} label="Usuario" placeholder="Usuario" />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                        <TextField  type="password" required id="standard-required"  onChange={(e)=>{
                              
                              let data = {...this.state.selectedRow};
                              data.clave  =  e.target.value;
                              this.setState({selectedRow : data});

                            }} value={this.state.selectedRow  ? this.state.selectedRow.clave : ""} InputLabelProps={{shrink: true}} label="Clave" placeholder="Clave" />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                        <TextField  type="password" required id="standard-required"  onChange={(e)=>{
                              
                              let data = {...this.state.selectedRow};
                              data.clave  =  e.target.value;
                              this.setState({selectedRow : data});

                            }} value={this.state.selectedRow  ? this.state.selectedRow.clave : ""} label="Confirmar clave" InputLabelProps={{shrink: true}} placeholder="Confirmar clave" />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                        <FormControl style={{width :"100%"}}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Sede
                            </InputLabel>
                            <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={this.state.selectedRow ? this.state.selectedRow.sede  : null }
                            onChange={(e)=>{
                              let data = {...this.state.selectedRow};
                              data.sede  =  e.target.value;
                              this.setState({selectedRow : data});
                            }}
                            >
                              {this._renderItem()}
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="right" spacing={2}>
                        <FormControl style={{width :"100%"}}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Estado
                            </InputLabel>
                            <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={this.state.selectedRow ? this.state.selectedRow.estado  : null }
                            onChange={(e)=>{
                              let data = {...this.state.selectedRow};
                              data.estado  =  e.target.value;
                              this.setState({selectedRow : data});
                            }}
                            displayEmpty
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>Activo</MenuItem>
                            <MenuItem value={0}>Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <div>
                </div>
              </form>
              {this.state.showFingerprint ? (
              <Grid container spacing={3} style={{marginTop : 20}} >
              <Grid item xs>
                <Paper style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <img src={pawPrint} />
                  <Typography variant="h5" gutterBottom>
                       INDICE 1
                  </Typography>
                  {this.state.finger1 ? (<CheckIcon color="primary" />) : null}
                  <Typography variant="subtitle1" gutterBottom>
                    {this.state.finger1 ? "Completado!" :null}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <img src={pawPrint} />
                  <Typography variant="h5" gutterBottom>
                       INDICE 2
                  </Typography>
                  {this.state.finger2 ? (<CheckIcon color="primary" />) : null}
                  <Typography variant="subtitle1" gutterBottom>
                  {this.state.finger2 ? "Completado!" : null}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <img src={pawPrint} />
                  <Typography variant="h5" gutterBottom>
                    INDICE 3
                  </Typography>
                  {this.state.finger3 ? (<CheckIcon color="primary" />) : null}
                  <Typography variant="subtitle1" gutterBottom>
                    {this.state.finger3 ? "Completado!" : null}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <img src={pawPrint} />
                  <Typography variant="h5" gutterBottom>
                       INDICE 4
                  </Typography>
                  {this.state.finger4 ? (<CheckIcon color="primary" />) : null}
                  <Typography variant="subtitle1" gutterBottom>
                  {this.state.finger4 ? "Completado!" : null}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <img src={pawPrint} />
                  <Typography variant="h5" gutterBottom>
                       INDICE 5
                  </Typography>
                  {this.state.finger5 ? (<CheckIcon color="primary" />) : null}
                  <Typography variant="subtitle1" gutterBottom>
                  {this.state.finger5 ? "Completado!" : null}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
              ) : null}

              </CardContent>
              <CardActions>
              <Button onClick={(e)=>this.toggleFingerprint()} variant="contained" color="primary">
                Asignar Huella
              </Button>

              <Button onClick={(e)=>{
               
              }} variant="contained" color="primary" onClick={async (e)=>{
                this.updateUser();
              }}>
                 Actualizar Registro
             </Button>

              </CardActions>
            </Card>
          <Paper>
            <MUIDataTable 
              title={"Usuarios"} 
              data={this.state.usuarios} 
              addRow={this.addRow}
              columns={columns} 
              options={options} 
            />
            <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    open={this.state.snackbar}
                    autoHideDuration={6000}
                    onClose={this.snackbarOnClose}
                    ContentProps={{
                      'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackbarText}</span>}
                    action={[
                      <Button key="undo" color="primary" size="small" onClick={this.hideSnackBar}>
                        Deshacer
                      </Button>,
                      <IconButton
                        key="close"
                        aria-label="Cerrar"
                        color="inherit"
                        onClick={this.hideSnackBar}
                      >
                        <CloseIcon />
                      </IconButton>,
                    ]}
                  />

          </Paper>
          </>
        )
    }

    render(){

        return (
          <div>
            {this._renderContent()}
          </div>
            )
    }
}

Usuarios.propTypes = {

};


export default Usuarios;
