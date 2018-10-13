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
import {done} from './done';
import Runner from './Runner';
import Welcome from './welcome';
import Login from './Login';

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
      runner:{
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
    this.handleAddCustomer = this.handleAddCustomer.bind(this);
    this.getCardData = this.getCardData.bind(this);
    this.getCustomerData = this.getCustomerData.bind(this);
    this.fetchRunnerData = this.fetchRunnerData.bind(this);
    this.fetchRunnerById = this.fetchRunnerById.bind(this);
    this.handleAddRunner = this.handleAddRunner.bind(this);
  }

  handleAddRunner(event){
    event.preventDefault();
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`   
    data.set('addRunner', 1);
    fetch('http://localhost/', {
      method: 'POST',
      body: data,
    }).then(reso => {
      return reso.text();
    }).then(resa => {
      // switch(resa){
      //   case "": break;
      //   case "SuccessMore Success": window.location = '/done'; break;
      //   case "Success": break;
      //   default: break;
      // }
      if(resa.toString().localeCompare("Success")===0){
          window.location = '/done';
        }
        else{
          return(<Alert bsStyle="danger"><h4>Sorry something went wrong</h4><br/>its not your fault.</Alert>);
        }
    });
  }

  fetchRunnerById(id){
    () => this.setState({runner:{loading:true}});
    var form = new FormData();
    form.set('getRunner',1);
    form.set('id',id);
    fetch('http://localhost/',{
      method: 'POST',
      body: form
      })
      .then(res => res.json())
      .then(data => {
        this.setState({runner:{data,loading:false}});
      })
  }

  fetchRunnerData(state, instance){
    this.setState({runner:{loading:true}});
    var form = new FormData();
    form.set('runners',1);
    fetch('http://localhost/',{
      method: 'POST',
      body: form
      })
      .then(res => res.json())
      .then(data => {
        this.setState({runner:{data,loading:false}});
      })
  }

  getCustomerData(id) {
    () => this.setState({customer:{loading:true}});
    var formData = new FormData();
    formData.append('account', '1');
    formData.append('id', id);

    fetch('http://localhost/',{
      method: 'POST',
      body: formData
      })
      .then(res => res.json())
      .then(data => {
        this.setState({customer:{data,loading:false}});
      })
  }

  getCardData(id) {
    var formData = new FormData();
    formData.append('card', '1');
    formData.append('id', id);

    fetch('http://localhost/',{
      method: 'POST',
      body: formData
      })
      .then(res => res.json())
      .then(data => {
        this.setState({card:{data}});
      })
  }

  handleAddCustomer(event){
    event.preventDefault();
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`   
    data.set('addCustomer', 1);
    fetch('http://localhost/', {
      method: 'POST',
      body: data,
    }).then(reso => {
      return reso.text();
    }).then(resa => {
      // switch(resa){
      //   case "": break;
      //   case "SuccessMore Success": window.location = '/done'; break;
      //   case "Success": break;
      //   default: break;
      // }
      if(resa.toString().localeCompare("SuccessMore Success")===0){
          window.location = '/done';
        }
    });
  }

  generateKey(pre) {
    return `${ pre }_${ new Date().getTime() }`;
  }
  
  addCardRow(){
    let row = <tr key={this.generateKey("card_row")}><td><input type="text" name="owname" placeholder="Owner Name"/></td><td><input type="text" name="type" placeholder="Type"/></td><td><input type="text" name="bank" placeholder="Bank"/></td><td><input type="text" name="exp" placeholder="EXP"/></td><td><input type="text" name="state" placeholder="State"/></td><td><input type="text" name="credit" placeholder="Credit"/></td><td><input type="text" name="drawn" placeholder="Drawn"/></td></tr>;
    
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

  }


  render() {
    
    const pg_customer = () => { 
      const { data , loading} = this.state.customer;
      return( <div><ReactTable
      columns={[
        {
          Header: 'ID',
          accessor: 'id',
          Cell: props => <span className='number'><Link to={`/customer/${props.value}`}>{props.value}</Link></span>
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
          Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value != null ? props.value : "0"}</Link></span> // Custom cell components!
        }
        ]}
      data={data}
      //pages={pages} // Display the total number of pages
      loading={loading} // Display the loading overlay when we need it
      onFetchData={this.fetchCustomerData} // Request new data when things change
      noDataText="No matching data !"
      filterable
      minRows={3}
      defaultPageSize={10}
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
            accessor: 'id',
            Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
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
        defaultPageSize={10}
        className="-striped -highlight"
        />)};

        const alert404 = ( () => {
          return(
            <Alert bsStyle="danger"><h4>Wrong Link?</h4><br/>its not your fault.</Alert>
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
                <tr><td>Name:</td><td><input type="text" name="name" title="Name of account holder"/></td></tr>
                <tr><td>Phone</td><td><input type="text" name="phone" title="Phone number of account holder"/></td></tr>
                {this.state.cardRow}
                <tr><td><Button bsStyle="success" ref={button => {this.target = button;}} onClick={this.addCardRow} >+ Add Card...</Button></td></tr>
                <tr><td></td><td>
                <Button ref={button => {this.submitTarget=button;}} type="submit">Premium Submit</Button>
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
    
        const Customer = ({ match }) => {
          const { data , loading} = this.state.customer;
          let id = match.params.id;
          if(typeof(data) === 'undefined'){
            return (<p></p>);
          }
          let custCardsData;
          if(typeof(data[1]) !== 'undefined'){
            custCardsData = data[1] || [];
          }
          var cusData = [];
          if(typeof(data[0]) !== 'undefined'){
            cusData = data[0];
          }
          try{
          var customer;
          if(typeof(data[0]) !== 'undefined'){
            customer = cusData.map((customer,index) => {
              return(
                <Table ref={table => {this.addTable=table;}} key={index} responsive>
                  <tbody>
                    <tr><td>ID:</td><td>{customer.id}</td></tr>
                    <tr><td>Name:</td><td>{customer.name}</td></tr>
                    <tr><td>Cards:</td><td>{customer.cards}</td></tr>
                    <tr><td>Phone:</td><td>{customer.phone}</td></tr>
                    <tr><td>Card ID:</td><td>{customer.cards_id}</td></tr>
                  </tbody>
                </Table>
              )})
          }}
          catch(error){
            console.error(error);
          }
          finally{
          return(
          <div>
            {customer}
            <h3>ID: {match.params.id}</h3>

            <ReactTable 
              onFetchData={() => this.getCustomerData(id)} // getcardata needs id for its for 1 but fetchcardata iz 4 all
              noDataText="No matching data !"
              loading = {loading}
              defaultPageSize = {1}
              minRows = {1}
              columns = {
                [
                  {
                    id : 'id',
                    Header : 'ID',
                    accessor : 'id',
                    Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                  },
                  {
                    id : 'owname',
                    Header : 'Owner Name',
                    accessor : 'owname'
                  }
                ]
              }
              data = {custCardsData}/>
          </div>
          );}}

        const Card = ({ match }) => {
          const {data} = this.state.card;
          let id = match.params.id;
          this.getCardData(id);
          const cards = data.map((card,index) => 
            (
            <Table>
              <tbody>
                <tr><td>ID:</td><td>{card.id}</td></tr>
                <tr><td>Name:</td><td>{card.owname}</td></tr>
                <tr><td>Type:</td><td>{card.type}</td></tr>
                <tr><td>Bank:</td><td>{card.bank}</td></tr>
                <tr><td>EXP:</td><td>{card.exp}</td></tr>
                <tr><td>State:</td><td>{card.state}</td></tr>
                <tr><td>Credit:</td><td>{card.credit}</td></tr>
                <tr><td>Drawn:</td><td>{card.drawn}</td></tr>
                <tr><td>Number:</td><td>{12345678}</td></tr>
                <tr><td>CODE:</td><td>{1234}</td></tr>
              </tbody>
            </Table>
          ));

          return(
          <div>
            {cards}
          </div>
        )};

        const home_header = () => (
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fasi currency services</h1>
          </header>
        );

        const home_message = () => (
          <p className="App-intro">
            Soon coming to mobile platforms.
          </p>
        );

        const pg_runner = () => {
          const { data , loading} = this.state.runner;
         return (
           <div>
             <ReactTable 
              onFetchData={this.fetchRunnerData} 
              noDataText="No matching data !"
              loading = {loading}
              defaultPageSize = {10}
              minRows = {3}
              columns = {
                [
                  {
                    id : 'id',
                    Header : 'ID',
                    accessor : 'id',
                    Cell: props => <span className='number'><Link to={`/runner/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                  },
                  {
                    id : 'name',
                    Header : 'Name',
                    accessor : 'name'
                  },
                  {
                    id : 'fee',
                    Header : 'Fee',
                    accessor : 'fee'
                  },
                  {
                    id : 'credit',
                    Header : 'Credit',
                    accessor : 'credit'
                  }
                ]
              }
              data = {data}/>
           </div>
         )
        };

        const cmp_runner = ({ match }) => {
          const { data , loading} = this.state.runner;
          let id = match.params.id;
          return (
            <div>
              {
                data.map((runner,index) => {
                  return(
                    <Table key={"runner"+index}>
                      <tbody>
                        <tr><td>Name</td><td>{runner.name}</td></tr>
                        {/* <tr><td>Phone</td><td>{runner.phone}</td></tr> */}
                        <tr><td>Fee</td><td>{runner.fee}</td></tr>
                        <tr><td>Credit</td><td>{runner.credit}</td></tr>
                        <tr><td>Drawn</td><td>{runner.drawn}</td></tr>
                        <tr><td>Diposited</td><td>{runner.diposited}</td></tr>
                        <tr><td></td><td></td></tr>
                        <tr><td></td><td></td></tr>
                      </tbody>
                    </Table>
                  )
                })
              }
              
              <ReactTable 
               onFetchData={this.fetchRunnerById(id)} 
               noDataText="No matching data !"
               loading = {loading}
               defaultPageSize = {1}
               minRows = {1}
               columns = {
                 [
                   {
                     id : 'id',
                     Header : 'ID',
                     accessor : 'id',
                     Cell: props => <span className='number'><Link to={`/runner/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                   },
                   {
                     id : 'name',
                     Header : 'Name',
                     accessor : 'name'
                   },
                   {
                     id : 'fee',
                     Header : 'Fee',
                     accessor : 'fee'
                   },
                   {
                     id : 'credit',
                     Header : 'Credit',
                     accessor : 'credit'
                   }
                 ]
               }
               data = {data}/>
            </div>
          )
        }

        const Users = () => {
          return(
            <div>
              <Table>
                <thead>
                  <tr><td>User</td><td>Action</td></tr>
                </thead>
                <tbody>
                  <tr><td>Admin</td><td><a>Change Password</a></td></tr>
                </tbody>
              </Table>
            </div>
          );
        }
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
                <MenuItem eventKey={3.1} href="/cards" title="Shows Cards Table">Cards</MenuItem>
                <MenuItem eventKey={3.1} href="/transactions" title="Shows Transaction Table">Transactions</MenuItem>
                <MenuItem eventKey={3.2}>Statistics</MenuItem>
                <MenuItem eventKey={3.3}>Settings</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3} href="/users" title="Shows Users Info">Users</MenuItem>
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
        
        <Switch>
        <Route path="/customers" render={pg_customer} />
        <Route path="/cards" render={pg_card} />
        <Route path="/addCustomer" render={pg_addCustomer} />
        <Route path="/addCard" />
        <Route path="/runners" render={pg_runner} />
        <Route path="/runner/:id" component={cmp_runner} />
        <Route path="/done" render={done}/>
        <Route path="/transactions" render={home_header}/>
        <Route path="/users" render={Users}/>
        <Route path="/customer/:id" component={Customer} />
        <Route path="/card/:id" component={Card} />
        <Route path="/fasi" render={home_header} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome}/>
        <Route render={alert404} />
        </Switch>
      </div>
    );
  }
}

export default App;
