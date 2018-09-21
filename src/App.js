import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import logo from './logo.svg';
import './App.css';
import 'react-table/react-table.css';
import 'whatwg-fetch';
import { makeData } from './Account';
import { makeCardData } from './CardAccount';
import { Nav,Navbar,NavItem,NavDropdown,MenuItem,Button,Table,Overlay,Tooltip,Alert } from 'react-bootstrap';
import { Link, Route,Switch} from 'react-router-dom';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      customer: {
        data: [],
        pages: null,
        loading: true
      },
      card:{
        data: [],
        pages: null,
        loading: true
      },
      show: true,
      cardRow: <tr></tr>
    };
    this.fetchCustomerData = this.fetchCustomerData.bind(this);
    this.fetchCardData = this.fetchCardData.bind(this);
    this.getTarget = this.getTarget.bind(this);
    this.getSubmitTarget = this.getSubmitTarget.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.addCardRow = this.addCardRow.bind(this);
  }
  generateKey(pre) {
    return `${ pre }_${ new Date().getTime() }`;
  }
  addCardRow(){
    let row = <tr key={this.generateKey("card_row")}><td><input type="text" placeholder="Owner Name"/></td><td><input type="text" placeholder="Type"/></td><td><input type="text" placeholder="Bank"/></td><td><input type="text" placeholder="EXP"/></td><td><input type="text" placeholder="State"/></td><td><input type="text" placeholder="Credit"/></td><td><input type="text" placeholder="Drawn"/></td></tr>;
    
    this.setState({cardRow:[this.state.cardRow,row]}) ;
  }

  handleToggle() {
    this.setState({ show: !this.state.show });
  }
  //add card button and it depends on overlay code!
  getTarget() {
    return ReactDOM.findDOMNode(this.target);
  }

  getSubmitTarget(){
    return ReactDOM.findDOMNode(this.submitTarget);
  }

  fetchCustomerData(state, instance) {
      this.setState.loading=true;
      makeData()
      .then(res => {
        let data = res;
        this.setState({customer:{data,loading:false}});
      });
  }

  fetchCardData(state, instance) {
    this.setState.loading=true;
    makeCardData()
      .then(res => {
        let data = res;
        this.setState({card:{data,loading:false}});
      });
  }

  componentDidMount() {
    //this.getTarget().onClick = () => {
      // console.log("b4b4b4");      
      // let buttonRow = this.getTarget().parentNode;
      // let table = buttonRow.parentNode;
      // let row = <tr><td>ID</td><td>NUMBER</td><td>BANK</td><td>FAVOURITE COLOR</td><td>BLA</td><td>BLABLA</td></tr>;
      // console.log("b4b4");
      // //insertBefore(row,buttonRow);
      // table.insertBefore(row,buttonRow);
      // console.log("done");
    //}
  }


  render() {
    
    const pg_customer = () => { 
      const { data , loading} = this.state.customer;
      return( <div><ReactTable
      columns={[
        {
          Header: 'ID',
          accessor: 'id',
          Cell: props => <span className='number'><Link to="/customer">{props.value}</Link></span>
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
          Cell: props => <span className='number'><Link to="/card">{props.value != null ? props.value : "0"}</Link></span> // Custom cell components!
        }
        ]}
      data={data}
      //pages={pages} // Display the total number of pages
      loading={loading} // Display the loading overlay when we need it
      onFetchData={this.fetchCustomerData} // Request new data when things change
      noDataText="No matching data !"
      filterable
      minRows={3}
      defaultPageSize={5}
      />
      <Link to="/addCustomer" className="button">ADD</Link>
      </div>
      )};

      const pg_card = () => { 
        const { data , loading} = this.state.card;
        return( <ReactTable
        columns={[
          {
            Header: 'ID',
            accessor: 'id'
          },
          {
            Header: 'Name',
            accessor: 'owname' // String-based value accessors!
          }, {
            Header: 'Type',
            accessor: 'type',
            id: 'type'
           }, {
            id: 'exp', // Required because our accessor is not a string
            Header: 'exp',
            accessor: 'exp',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            Header: 'State',
            accessor: 'state',
            id: 'state'
          },{
            Header: 'Bank',
            accessor: 'bank',
            id: 'bank'
          },{
            Header: 'Credit',
            accessor: 'credit',
            id: 'credit'
          },{
            Header: 'Drawn',
            accessor: 'drawn',
            id: 'drawn'
          },{
            Header: 'Avail',
            accessor: 'avail',
            id: 'avail'
          }
          ]}
        data={data}
        //pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchCardData} // Request new data when things change
        noDataText="No matching data !"
        filterable
        minRows={3}
        defaultPageSize={5}
        className="-striped -highlight"
        />)};

        const alert404 = ( () => {
          return(
            <Alert bsStyle="danger"><h4>fuck u looking for nigga?</h4><br/>we closed go home</Alert>
          );
        });

        const pg_addCustomer = () => {
          return(
          <form onSubmit={this.handleAddCustomer}>
            <label>
              New Account:
            </label>
            <br/>
            <Table ref={table => {this.addTable=table;}} responsive>
              <tbody>
                <tr><td>Name:</td><td><input type="text" /></td></tr>
                <tr><td>Phone</td><td><input type="text" /></td></tr>
                {this.state.cardRow}
                <tr><td><Button bsStyle="success" ref={button => {this.target = button;}} onClick={this.addCardRow} >+ Add Card...</Button></td></tr>
                <tr><td></td><td>
                <Button ref={button => {this.submitTarget=button;}} >Premium Submit</Button>
                </td></tr>
              </tbody>
            </Table>
            <Overlay {...sharedProps} placement="bottom">
              <Tooltip id="overload-bottom" onClick={this.handleToggle}>Unlimited cards!</Tooltip>
            </Overlay>
            <Overlay {...submitProps} placement="left">
              <Tooltip id="overload-left" onClick={this.handleToggle}>Whenever you're ready!</Tooltip>
            </Overlay>
          </form>
          );
        };
        
        const sharedProps = {
          container: this,
          target: this.getTarget,
          show: this.state.show
        };

        const submitProps = {
          container: this,
          target: this.getSubmitTarget,
          show: this.state.show
        };
    
    return (
      <div className="App">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/fasi">FASI Currency</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/customers">
                Customers
              </NavItem>
              <NavItem eventKey={2} href="/runners">
                Runners
              </NavItem>
              <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1} href="/cards">Cards</MenuItem>
                <MenuItem eventKey={3.2}>Statistics</MenuItem>
                <MenuItem eventKey={3.3}>Settings</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}>Users</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1}>
                Help
              </NavItem>
              <NavItem eventKey={2}>
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
        <Switch>
        <Route path="/customers" render={pg_customer} />
        <Route path="/cards" render={pg_card} />
        <Route path="/addCustomer" render={pg_addCustomer} />
        <Route path="/addCard" />
        <Route path="/runners" />
        <Route render={alert404}/>
        </Switch>
      </div>
    );
  }
}

export default App;
