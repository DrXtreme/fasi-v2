import React from 'react';
import ReactDOM from 'react-dom';


export default class App extends React.Component {
    constructor(props, context) {
      super(props, context);
      this._runnerUser = React.createRef();
      this._formToPrint = React.createRef();
      // const data = getData();
      this.state = {}
    }
    render(){
        return(
            <div>fuck breaking changes</div>
        );
    }
}