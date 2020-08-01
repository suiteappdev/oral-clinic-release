import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const defaultToolbarStyles = {
  iconButton: {
  },
};

class CustomToolbar extends React.Component {
  constructor(props){
    super(props);
    
     this.state = {
      openForm : false
    }
  }
  
  handleClick = () => {
    console.log("open modal here");

    this.setState({
      openForm : true
    });

  }

  handleClose = ()=>{
    this.setState({ openForm : false });
  }

  _renderNewModal(){
    return (
      <div>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar Ciudad</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="pais"
              label="Pais"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="ciudad"
              label="Ciudad"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={this.handleClose} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={"custom icon"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
        {this._renderNewModal()}
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);
