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

let API = null;
let remote = null;

class Pais extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          paises : [],
          showEditToolbar : false,
          loading : true,
        };

    }
    
    async componentDidMount(){
       remote = require('electron').remote;
       API = remote.require(remote.app.getAppPath() + '/main/services/api.service');

       console.log("API", API);
      
      let paises = await API.paises.get();
      
      this.setState({ paises : paises });

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

  getSource = (selectedRow)=>{
    return this.state.paises[selectedRow.data[0].dataIndex];
  }

    addRow = (row)=>{
      this.setState({
        paises : [...this.state.paises, row]
      });
    }

    removeRow = async (selectedRow) =>{
      return new Promise((resolve, reject)=>{
          let data = this.state.paises;
          this.loader(true, 'Borrando registros por favor espera...');

          for(let r in selectedRow.data){
              
              let sourceIndex = data[selectedRow.data[r].dataIndex];

              
              if(sourceIndex.id){
                try{
                  (async ()=>{
                      await API.paises.delete(sourceIndex.id);
                  })(sourceIndex);
                }catch(e){
                  reject(e.message);
                }
              }

              let tableIndex = selectedRow.data[r].index;
              data.splice(tableIndex, 1);
          }

          this.setState({ paises : data });
          this.loader(false);
          this.showSnackbar("Registros Borrados");
      });
    }



    updateRow= (index, data)=>{
      console.log("index", index);
      console.log("data", data);
      let paises = [...this.state.paises];     
      paises[index] = data;                  
      this.setState({ paises : paises }); 
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
           label: "País",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "codigo",
           label: "Código",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "codigo2",
           label: "Código alternativo",
           options: {
            filter: true,
            sort: true,
           }
          },
          {
           name: "cod_factelectronica",
           label: "Factura Electrónica",
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
              removeRow={this.removeRow} 
              getSource = {this.getSource}
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
              title={"Pais"} 
              data={this.state.paises} 
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
        return this._renderContent()
    }
}

Pais.propTypes = {

};


export default Pais;
