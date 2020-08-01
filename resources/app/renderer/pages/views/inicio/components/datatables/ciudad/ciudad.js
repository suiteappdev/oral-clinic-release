import React from 'react';
import MUIDataTable from 'mui-datatables';
import CustomToolbar from './toolbar/toolbar';

class Ciudad extends React.Component{
    constructor(props){
        super(props)
    }
    
    componentDidMount(){

    }

    render(){
        const columns = ["Código", "País", "Import dpt/esta"];

        const data = [
          ["00010", "Colombia", "Yonkers"],
          ["00020", "Venezuela", "Test Corp"],
          ["00030", "Brazil", "Test Corp"],
          ["00040", "USA", "Test Corp"]
         ];
      
         const options = {
          filterType: 'checkbox',
          customToolbar: () => {
            return (
              <CustomToolbar />
            );
          }
        };

        return (
            <MUIDataTable 
            title={"Ciudades"} 
            data={data} 
            columns={columns} 
            options={options} 
            />
        );
    }
}

export default Ciudad;
