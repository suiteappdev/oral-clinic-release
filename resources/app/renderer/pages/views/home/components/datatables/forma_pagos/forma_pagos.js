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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

let API = null;
let remote = null;

class FormasPagos extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          showEditToolbar : false,
          loading : true,
        };
    }
    
    async componentDidMount(){
      remote = require('electron').remote;
      API = remote.require(remote.app.getAppPath() + '/main/services/api.service');

      let formas_pagos = await API.formasPagos.get();

      this.setState({ formas_pagos : formas_pagos });
      this.loader(false);
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
        formas_pagos : [...this.state.formas_pagos, row]
      });
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
            name: "cod",
            label: "Código",
            options: {
             filter: true,
             sort: false,
            }
           },
          {
           name: "for_p",
           label: "Forma de pago",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
            name: "cta",
            label: "Cuenta",
            options: {
             filter: true,
             sort: true,
            }
           },
           {
            name: "comi",
            label: "Comisión",
            options: {
             filter: true,
             sort: true,
            }
            
           },
           {
            name: "nit",
            label: "Nit",
            options: {
             filter: true,
             sort: true
            }
           },
           {
            name: "inhabilitado",
            label: "Inhabilitado",
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

        return(
          <Paper>
            <MUIDataTable 
              title={"Formas de pagos"} 
              data={this.state.formas_pagos} 
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
          </div>
            )
    }
}

FormasPagos.propTypes = {

};


export default FormasPagos;
