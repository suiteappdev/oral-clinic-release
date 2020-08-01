import React from 'react';
import PropTypes from 'prop-types';

import AgendaModule from './views/agenda/';

class Agenda extends React.Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <AgendaModule/>
    );
  }
}


export default Agenda;