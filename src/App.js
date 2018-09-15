import React from 'react';
import ReactTable from "react-table";
import logo from './logo.svg';
import './App.css';
import 'react-table/react-table.css';
import 'whatwg-fetch';
import { makeData } from './Account';
import { Nav,Navbar,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import { BrowserRouter as Router, Link} from 'react-router-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, instance) {
      this.setState.loading = true;
      makeData()
      .then(res => {
        let data = res;
        this.setState({data});
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { data , loading} = this.state;
    return (
      <div className="App">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/brand" class="nav-link active">FASI Currency</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">
                Customers
              </NavItem>
              <NavItem eventKey={2} href="#">
                Runners
              </NavItem>
              <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Cards</MenuItem>
                <MenuItem eventKey={3.2}>Statistics</MenuItem>
                <MenuItem eventKey={3.3}>Settings</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}>Users</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">
                Help
              </NavItem>
              <NavItem eventKey={2} href="#">
                About
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
              Header: 'ID',
              accessor: 'id',
              Cell: props => <span className='number'><a href="#customer">{props.value}</a></span>
            },
            {
              Header: 'Name',
              accessor: 'name' // String-based value accessors!
            }, {
              Header: 'Cards',
              accessor: 'cards',
              id: 'cards',
              Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
            }, {
              id: 'phone', // Required because our accessor is not a string
              Header: 'Phone',
              accessor: 'phone',
              Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
              Header: 'CardsID',
              accessor: 'cards_id',
              id: 'cards_id',
              Cell: props => <span className='number'><a href="#card">{props.value != null ? props.value : "0"}</a></span> // Custom cell components!
            },
            ]}
          data={data}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          noDataText="No matching data !"
          filterable
          minRows={3}
          defaultPageSize={5}
        />
        <div style={{position: "absolute", bottom: 0, right: 0}}> FUCK THE WORLD</div>
      </div>
    );
  }
}

export default App;
