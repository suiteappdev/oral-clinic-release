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

let API = null;
let remote = null;

class Departamentos extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          departamentos : [],
          showEditToolbar : false,
          loading : true,
        };
    }
    
    async componentDidMount(){
       remote = require('electron').remote;
       API = remote.require(remote.app.getAppPath() + '/main/services/api.service');

      let paises = await API.paises.get();
      this.setState({ paises : paises });
      this.loader(false);
      this.setState({ modalSelectPais : true});
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

  loadDepartamentos = async ()=>{
      this.loader(true, 'Cargando departamentos...');
      this.setState({ modalSelectPais : false});
      this.props.helpers.setPais(this.state.pais);
      let departamentos = await API.departamentos.ByPais.get(this.state.pais);
      this.setState({ departamentos : departamentos});
      this.loader(false);
  }

    addRow = (row)=>{
      this.setState({
        departamentos : [...this.state.departamentos, row]
      });
    }

    removeRow = async (selectedRow) =>{
      return new Promise((resolve, reject)=>{
          let data = this.state.departamentos;
          this.loader(true, 'Borrando registros por favor espera...');

          for(let r in selectedRow.data){
              
              let sourceIndex = data[selectedRow.data[r].dataIndex];


              if(sourceIndex.id){
                try{
                  (async ()=>{
                      await API.departamentos.delete(sourceIndex.id);
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
      let departamentos = [...this.state.departamentos];     
      departamentos[index] = data;                  
      this.setState({ departamentos : departamentos }); 
    }

    _renderPaisItems  = ()=>{
      if(this.state.paises){
        return this.state.paises.map((pais)=>{
          return (<MenuItem value={pais.codigo}>{pais.nombre}</MenuItem>);
        });
      }
    }

    _renderModalSelectPais = ()=>{
        return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.modalSelectPais}>
                <DialogTitle>Pais
                  <Typography variant="caption" display="block" gutterBottom>
                        Seleccione el pais de trabajo
                  </Typography>
                </DialogTitle>
                <DialogContent>
          
                  <form>
                    <FormControl style={{minWidth: '100%'}}>
                      <InputLabel htmlFor="select-pais">Pais</InputLabel>
                        <Select
                          value={this.state.pais}
                          onChange={(event)=>this.setState({ pais : event.target.value })}
                          inputProps={{name: 'age', id: 'pais-id'}}
                        >
                        {this._renderPaisItems()}
                        </Select>
                    </FormControl>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.loadDepartamentos} color="primary">
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
           name: "depto",
           label: "Departamento",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "cod",
           label: "Código",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "pais",
           label: "Pais",
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
                  <AddActionToolBar addRow={this.addRow}/>
              </span>
            );
          },
          customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect 
              updateRow={this.updateRow} 
              source={this.state.departamentos} 
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
            <MUIDataTable 
              title={"Departamentos"} 
              data={this.state.departamentos} 
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
            {this._renderModalSelectPais()}
          </div>
            )
    }
}

Departamentos.propTypes = {

};


export default Departamentos;
