import React from 'react';
import ReactTable from "react-table";
import logo from './logo.svg';
import './App.css';
import 'react-table/react-table.css';
import 'whatwg-fetch';
import { makeData } from './Account';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: false
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, instance) {
      this.setState.loading = true;
      makeData()
      .then(res => {
        console.log("this be res");
        console.log(res);
        let data = res;
        this.setState({data});
        this.setState({
          loading: false
        });
      });
  }

  // componentDidMount() {
  //   this.setState.loading = true;
  //     makeData()
  //     .then(res => {
  //       console.log("this be res");
  //       console.log(res);
  //       let data = res;
  //       this.setState({data});
  //       this.setState({
  //         loading: false
  //       });
  //     });
  // }

  render() {
    const { data , loading} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fasi currency services</h1>
        </header>
        <p className="App-intro">
          Soon coming to mobile platforms.
        </p>
        <ReactTable
          columns={[
            {
              Header: 'Name',
              accessor: 'name' // String-based value accessors!
            }, {
              Header: 'Cards',
              accessor: 'cards',
              id: 'cards',
              Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
              id: 'phone', // Required because our accessor is not a string
              Header: 'Phone',
              accessor: 'phone',
              Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
              Header: 'CardsID',
              accessor: 'cards_id',
              id: 'cards_id',
              Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
            },
            ]}
          data={data}
          //resolveData={data => data.map(row => row)}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          noDataText="No matching data !"
          filterable
          minRows={3}
          defaultPageSize={5}
        />
      </div>
    );
  }
}

export default App;
