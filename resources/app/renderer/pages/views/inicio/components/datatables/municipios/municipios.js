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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ModalDepartamentos from '../../modal/departamentos';
import { apiService } from '../../../../../../services/api.service';
let API = null;
let remote = null;

class Municipios extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          municipios : [],
          showEditToolbar : false,
          loading : true,
        };
    }
    
    async componentDidMount(){
       remote = require('electron').remote;
       API = new apiService(false);
      
      let departamentos = await API.departamentos.ByPais.get(this.props.helpers.getPais());
      
      this.setState({ departamentos : departamentos});
      this.setState({ modalSelectDepartamentos : true});
      this.loader(false);
    }

  loader = (isVisible, text)=>{
    this.setState({ loading : isVisible, textLoading : text || 'Cargando...'});
  }


  hideSnackBar = ()=>{
    this.setState({ snackbar : false});
  }

  showSnackbar = (snackbarText, undoData)=>{
    this.setState({ snackbar : true, snackbarText: snackbarText, undoData : undoData});
  }

  snackbarOnClose = ()=>{
    return true;
  }

    addRow = (row)=>{
      this.setState({
        municipios : [...this.state.municipios, row]
      });
    }

  loadMunicipios = async ()=>{
      this.loader(true, 'Cargando municipios...');
      this.setState({ modalSelectDepartamentos : false});
      
      if(this.state.departamento){
        this.props.helpers.setDepartamento(this.state.departamento);
      }

      let municipios = await API.municipios.ByDepartamento.get(this.state.departamento);
      this.setState({ municipios : municipios});
      this.loader(false);
  }


    removeRow = async (selectedRow) =>{
      console.log("SelectedRow", selectedRow);

      return new Promise((resolve, reject)=>{
          let data = this.state.municipios;
          let undoData = [];

          for(let r in selectedRow.data){
              
              let sourceIndex = data[selectedRow.data[r].dataIndex];
              undoData.push(sourceIndex);

              if(sourceIndex.id){
                try{
                  (async ()=>{
                      await API.municipios.delete(sourceIndex.id);
                  })(sourceIndex);
                }catch(e){
                  reject(e.message);
                }
              }

              let tableIndex = selectedRow.data[r].dataIndex;
              data.splice(tableIndex, 1);
          }

          this.setState({ municipios : data});
          this.showSnackbar("Registros borrados.", {
            type : 'DELETE',
            data : undoData
          });
      });
    }

    updateRow= (index, data)=>{
      let municipios = [...this.state.municipios];     
      municipios[index] = data;                  
      this.setState({ municipios : municipios }); 
    }

    getSource = (selectedRow)=>{
      return this.state.municipios[selectedRow.data[0].dataIndex];
    }

    undo = async ()=>{
      if(this.state.undoData){
        switch (this.state.undoData.type) {
          case 'UPDATE':
            await this.setState({ snackbarText : 'Restaurando...', hideUndoBtn : true });
            
            let data = this.state.undoData.data;
            let id = this.state.undoData.data.id;
            let tableIndex = this.state.undoData.tableIndex;

            await API.municipios.put(id, data);

            this.updateRow(tableIndex, data);
            await this.setState({ snackbarText : 'Restauración completada.', undoData : null, hideUndoBtn : true});

            break;
          case 'DELETE':
              this.setState({ snackbarText : 'Restaurando...', hideUndoBtn : true });
              let deleted = this.state.undoData;
              console.log("undo data", this.state.undoData);

              for(let d in deleted){
                let data = deleted[d];
                delete data.id;                
                await API.municipios.post(data);
              }

              this.setState({ snackbarText : 'Restauración completada.', undoData : null, hideUndoBtn : true});
              break;
          default:
            break;
        }
      }
    }

    _renderContent (){
      console.log("loading", this.state.loading);
      if(this.state.loading){
          return (<Grid container justify ="center" direction="column" alignContent="center"> <CircularProgress style={{margin:'0 auto'}} /><Typography>{this.state.textLoading || 'Cargando...'}</Typography></Grid>);
      }
      
      return this._renderDatatable();

    }

    _renderDepartamentosItems  = ()=>{
      if(this.state.departamentos){
        return this.state.departamentos.map((departamento)=>{
          return (<MenuItem value={departamento.cod}>{departamento.depto}</MenuItem>);
        });
      }
    }


    _renderModalSelectDepartamentos = ()=>{
      return (<Dialog disableBackdropClick disableEscapeKeyDown open={this.state.modalSelectDepartamentos}>
              <DialogTitle>Departamentos
                <Typography variant="caption" display="block" gutterBottom>
                      Seleccione el departamento de trabajo
                </Typography>
              </DialogTitle>
              <DialogContent>
        
                <form>
                  <FormControl style={{minWidth: '100%'}}>
                    <InputLabel htmlFor="select-departamento">Departamentos</InputLabel>
                      <Select
                        value={this.state.departamento}
                        onChange={(event)=>this.setState({ departamento : event.target.value })}
                        inputProps={{name: 'departamento', id: 'select-departamento'}}
                      >
                      {this._renderDepartamentosItems()}
                      </Select>
                  </FormControl>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.loadMunicipios} color="primary">
                  Seleccionar
                </Button>
              </DialogActions>
              </Dialog>  )
  }


    _renderDatatable () {
        const columns = [
          {
            name: "codigo",
            label: "Código",
            options: {
             filter: true,
             sort: true,
            }
           },
          {
           name: "nombre",
           label: "Nombre",
           options: {
            filter: true,
            sort: true,
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
            name: "marca",
            label: "Marca",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "agencia",
            label: "Agencia",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "provincia",
            label: "Provincia",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "ica",
            label: "Ica",
            options: {
             filter: true,
             sort: false,
            }
           },
           {
            name: "categoria",
            label: "categoria",
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
                  <AddActionToolBar addRow={this.addRow} helpers = {this.props.helpers}/>
              </span>
            );
          },
          customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect 
              undo = {this.undo}
              updateRow={this.updateRow} 
              removeRow={this.removeRow} 
              getSource={this.getSource}
              selectedRows={selectedRows} 
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
              title={"Municipios"} 
              data={this.state.municipios} 
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
                      <Button disabled={this.state.hideUndoBtn} key="undo" color="primary" size="small" onClick={this.undo}>
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
            {this._renderModalSelectDepartamentos()}
        </div>
      );
    }
}

Municipios.propTypes = {

};


export default Municipios;
