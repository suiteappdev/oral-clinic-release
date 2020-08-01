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
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ModalZonas from '../../modal/zonas';
import { apiService } from '../../../../../../services/api.service';

let API = null;
let remote = null;

class Barrios extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          barrios : [],
          showEditToolbar : false,
          loading : true,
        };
    }
    
    async componentDidMount(){
       remote = require('electron').remote;
       API = new apiService(true);
      let zonas = await API.zonas.get(this.props.helpers.getMunicipio());
      this.setState({ zonas : zonas });
      this.loader(false);
      this.setState({ modalSelectZona : true});

    }

  loader = async (isVisible, text)=>{
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

  loadBarrios = async ()=>{
      this.loader(true, 'Cargando barrios...');
      this.setState({ modalSelectZona : false});
      this.props.helpers.setZona(this.state.zona);
      let barrios = await API.barrios.ByZona.get(this.state.zona);
      this.setState({ barrios : barrios});
      this.loader(false);
  }

    addRow = (row)=>{
      this.setState({
        barrios : [...this.state.barrios, row]
      });
    }

    removeRow = async (selectedRow) =>{
      return new Promise((resolve, reject)=>{
          let data = this.state.barrios;
          this.loader(true, 'Borrando registros por favor espera...');

          for(let r in selectedRow.data){
              
              let sourceIndex = data[selectedRow.data[r].dataIndex];


              if(sourceIndex.id){
                try{
                  (async ()=>{
                      await API.barrios.delete(sourceIndex.id);
                  })(sourceIndex);
                }catch(e){
                  reject(e.message);
                }
              }

              let tableIndex = selectedRow.data[r].index;
              data.splice(tableIndex, 1);
          }

          this.setState({ departamentos : data });
          this.loader(false);
          this.showSnackbar("Registros Borrados");
      });
    }

    updateRow= (index, data)=>{
      console.log("index", index);
      console.log("data", data);
      let barrios = [...this.state.barrios];     
      barrios[index] = data;                  
      this.setState({ barrios : barrios }); 
    }

    _renderZonasItems  = ()=>{
      if(this.state.zonas){
        return this.state.zonas.map((zona)=>{
          return (<MenuItem value={zona.codigo}>{zona.nombre}</MenuItem>);
        });
      }
    }

    showSelectZona = ()=>{
      this.setState({ modalSelectZona : true });
    }

    _renderModalSelectZona = ()=>{
        return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.modalSelectZona}>
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
                  <Button onClick={this.loadBarrios} color="primary">
                    Seleccionar
                  </Button>
                </DialogActions>
                </Dialog>  )
    }

    _renderContent (){
      console.log("loading", this.state.loading);
      if(this.state.loading){
          return (<Grid container justify ="center" direction="column" alignContent="center"> <CircularProgress style={{margin:'0 auto'}} /><Typography>{this.state.textLoading || 'Cargando...'}</Typography></Grid>);
      }
      
      return this._renderDatatable();

    }

    _renderDatatable () {
        const columns = [
          {
           name: "nombre",
           label: "Barrio",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "cod_barrio",
           label: "Código",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "zona",
           label: "Zona",
           options: {
            filter: true,
            sort: false,
           }
          },
          {
            name: "departa",
            label: "Departamento",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "comuna",
            label: "Comuna",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "flete",
            label: "Flete",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "pais",
            label: "Pais",
            options: {
             filter: true,
             sort: false,
            }
          },
          {
            name: "cod_zona",
            label: "Código Zona",
            options: {
             filter: true,
             sort: false,
            }
          }
         ];
         const options = {
          filterType: "dropdown",
          responsive: "scroll",
          onRowsSelect : (currentRowsSelected)=>{

          },
          onRowsDelete : (currentRowsSelected)=>{
            console.log("deleted", currentRowsSelected);
          },
          customToolbar: () => {
            return (
              <span>
                  <AddActionToolBar showSelectZona = {this.showSelectZona} addRow={this.addRow} helpers={this.props.helpers}/>
              </span>
            );
          },
          customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect 
              helpers={this.props.helpers}
              updateRow={this.updateRow} 
              source={this.state.barrios} 
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

        return(
          <Paper>
            <ModalZonas helpers={this.props.helpers} ref={ref => (this.modalZonas = ref)}/>
            <MUIDataTable 
              title={"Barrios"} 
              data={this.state.barrios} 
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
        )
    }

    render(){
        return (
          <div>
            {this._renderContent()}
            {this._renderModalSelectZona()}
          </div>
            )
    }
}

Barrios.propTypes = {

};


export default Barrios;
