import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import logo from './logo.svg';
import './App.css';
import 'react-table/react-table.css';
import 'whatwg-fetch';
import { makeData } from './Account';
import { makeCardData } from './CardAccount';
import { makeRunnerData } from './RunnerAccount';
import { Well,Nav,Navbar,NavItem,NavDropdown,MenuItem,Button,Table,Overlay,Tooltip,Alert } from 'react-bootstrap';
import { Link, Route,Switch,Redirect,withRouter} from 'react-router-dom';
import {done} from './done';
import Runner from './Runner';
import Welcome from './welcome';
import Login from './Login';
import { LinkContainer } from 'react-router-bootstrap';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import checkboxHOC from "react-table/lib/hoc/selectTable";
// import 'bootstrap/dist/css/bootstrap.min.css';


const CheckboxTable = checkboxHOC(ReactTable);

function cards4sendData(){
  var form = new FormData();
  form.set('getCards4runners',1);
  var reso={};
  fetch('http://localhost/',{
    method: 'POST',
    body: form
  })
    .then(res => res.json())
    .then(data => {reso = data})
    .then(() => {return reso});
}

function getData() {
  if(typeof(cards4sendData()) !== 'undefined'){
    const data = cards4sendData().map(item => {
    // using chancejs to generate guid
    // shortid is probably better but seems to have performance issues
    // on codesandbox.io
    const _id = item.id;
    return {
      _id,
      ...item
    };
  });
  return data;
  }else{
    return {};
  }
  
}

function getColumns(data) {
  const columns = [];
  var sample ;
  if(typeof(data[0]) !== 'undefined'){
    sample = data[0];
    Object.keys(sample).forEach(key => {
      if (key !== "_id") {
        columns.push({
          accessor: key,
          Header: key
        });
      }
    });
  }
  
  return columns;
}


class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    const data = getData();
    this.state = {
      customer: {
        data: [],
        data2: [],
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
      sendCard: {
        cards4send: data,
        runners: [],
        pages: null,
        loading: true,
        selection: [],
        selectAll: false,
        selectedRunner: null,

    },
      show: true,
      cardRow: <tr></tr>,
      selection: [],
      selectAll: false,
      selectedRunner: null
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
    this.sendCard2Runner = this.sendCard2Runner.bind(this);
    this.fetchCards4Send = this.fetchCards4Send.bind(this);
    // this.addIdToSelected = this.addIdToSelected.bind(this);
    // this.removeIdFromSelected = this.removeIdFromSelected.bind(this);
    this.handleSelectRunnerChange = this.handleSelectRunnerChange.bind(this);
  }

  // getData() {
  //   const data = this.state.card.data.map(item => {
  //     // using chancejs to generate guid
  //     // shortid is probably better but seems to have performance issues
  //     // on codesandbox.io
  //     const _id = chance.guid();
  //     return {
  //       _id,
  //       ...item
  //     };
  //   });
  //   return data;
  // }

  handleSelectRunnerChange(e){
    this.setState({selectedRunner:e.target.value});
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?
      
      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).
      
      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).
      
      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'. 
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = key => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key);
  };

  // addIdToSelected(id){
  //   var selected = [];
  //   selected.push(this.state.selected);
  //   selected.push(id);
  //   this.setState({selected:selected})
  // }

  // removeIdFromSelected(id){
  //   var selected = [];
  //   selected.push(this.state.selected);
  //   selected.pop(id);
  //   this.setState({selected:selected})
  // }

  fetchCards4Send(){
    var form = new FormData();
    form.set('getCards4runners',1);
    fetch('http://localhost/',{
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(data => {
      var runners = data[1];
      var cards4send = data[0];
      this.setState({sendCard:{cards4send:cards4send,runners:runners,loading:false}});
    })
  }

  executeSendCard(){
    this.state.selection.map((id,index) => {
      try {
        this.sendCard2Runner(id,this.state.selectedRunner);
        NotificationManager.success("Card Sent To Runner","Success");
      }
      catch(error){
        NotificationManager.error("Can't Send Card","Something Went Wrong");
      }
    });
  }

  sendCard2Runner(card_id,runner_id){
    var form = new FormData();
    form.set('sendCard',1);
    form.set('card_id', card_id);
    form.set('runner_id', runner_id);
    fetch('http://localhost/',{
      method: 'POST',
      body: form
    })
    .then(res => res.text())
    .then(reso => {
      // switch(resa){
      //   case "": break;
      //   case "SuccessMore Success": window.location = '/done'; break;
      //   case "Success": break;
      //   default: break;
      // }
      if(reso.toString().localeCompare("Success")===0){
        this.createNotification('success','Card successfully sent to runner','Success');
      }
      else{
        this.createNotification('error','Failed to send card to runner','Success');
      }
    });
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
      if(resa.toString().localeCompare("Success")===0){
        NotificationManager.success('Added New Runner','Success')
        }
        else{
          this.createNotification('error','Failed to add runner','ERROR');
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

  fetchRunnerData(state, instance) {
    this.setState.loading=true;
    makeRunnerData()
    .then(res => {
      let data = res;
      this.setState({runner:{data,loading:false}});
    });
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
        var data2=data[1];
        data = data[0];
        this.setState({customer:{data,data2,loading:false}});
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
    NotificationManager.warning("Please wait...","Adding New Customer");
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
          NotificationManager.success("Added New Customer","Success");
          // window.location='/customers';
          // return(<Redirect to='/customers'/>);
          // this.setState({toCustomers:true});
          this.props.history.push('/customers');
        }
        else{
          NotificationManager.error("Can't Add Customer!","Something went wrong");
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

 


  render() {
    // if (this.state.toCustomers === true) {
    //   return <Redirect to='/' />
    // }
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
      className="-striped -highlight"
      data={data}
      //pages={pages} // Display the total number of pages
      loading={loading} // Display the loading overlay when we need it
      onFetchData={this.fetchCustomerData} // Request new data when things change
      noDataText="No matching data !"
      filterable
      minRows={3}
      defaultPageSize={10}
      />
      <Link to="/addCustomer" className="btn btn-info">ADD</Link>
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
          const { data , data2 , loading} = this.state.customer;
          let id = match.params.id;
          // if(typeof(data) === 'undefined'){
            // return (<p></p>);
          // }
          // let custCardsData;
          // if(typeof(data2) !== 'undefined'){
            // custCardsData = data2 || [];
          // }
          // var cusData = [];
          // if(typeof(data[0]) !== 'undefined'){
            // cusData = data;
          // }
          try{
          var customer;
          // if(typeof(data[0]) !== 'undefined'){
            customer = data.map((customer,index) => {
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
          }
          catch(error){
            console.error(error);
          }
          finally{
          return(
          <div>
            {customer}
            <h3>ID: {match.params.id}</h3>

            <ReactTable 
              className="-striped -highlight"
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
              data = {data2}/>
          </div>
          );}}

        const Card = ({ match }) => {
          const {data} = this.state.card;
          let id = match.params.id;
          setInterval(this.getCardData(id),300);
          // setTimeout(() => (this.getCardData(id),300));
          const cards = data.map((card,index) => (
            <Table key={index}>
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
          return( <div><ReactTable
          columns={[
            {
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
              id : 'phone',
              Header : 'phone',
              accessor : 'phone'
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
            ]}
          className="-striped -highlight"
          data={data}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchRunnerData} // Request new data when things change
          noDataText="No matching data !"
          filterable
          minRows={3}
          defaultPageSize={10}
          />
          <Link to="/addRunner" className="btn btn-info">ADD</Link>
          </div>
          )};
        
        
        const sendCard = () => {
          const { runners, cards4send , loading} = this.state.sendCard;
          const data = cards4send;
          const { toggleSelection, toggleAll, isSelected, logSelection } = this;
          const { selectAll } = this.state.sendCard;
          // const { columns } = this.state;
          const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
            getTrProps: (s, r) => {
              // someone asked for an example of a background color change
              // here it is...
              if(typeof(r) !== 'undefined'){
                const selected = this.isSelected(r.original._id);
                  return {
                    style: {
                      backgroundColor: selected ? "lightblue" : "inherit"
                      // color: selected ? 'white' : 'inherit',
                    }
                  };
              }else{
                return {};
              }
            }
          };
          // () => this.fetchCards4Send;
          const tbl_cards4send = (
            <Table>
              <tbody>
                <thead>
                  <tr><td>ID</td><td>Owner Name</td></tr>
                </thead>
                {console.log(cards4send)
                  // cards4send.map((card,index) => {
                  //   return(
                  //     <tr><td>{card.id}</td><td>{card.owname}</td></tr>
                  //   )
                  // })
                }
              </tbody>
              
            </Table>
          );
          // this.state.selectedRunner = runners.id;
          const opt_runners = (
            <select onChange={this.handleSelectRunnerChange} onLoad={this.handleSelectRunnerChange} autoFocus required>
              {
                runners.map((runner,index) => (
                  <option value={runner.id} key={"opt_runner_"+index}>{runner.name}</option>
                ))
              }
            </select>
          )
            
          return (
            <div>
              <h3>Send Cards</h3>
              <h6>Sending Cards to : {this.state.selectedRunner}</h6>
              {tbl_cards4send}
              <CheckboxTable
                ref={r => (this.checkboxTable = r)}
                onFetchData = {this.fetchCards4Send}
                data={data}
                columns={getColumns(data)}
                // columns={[
                //   {
                //     Header: 'ID',
                //     accessor: 'id',
                //     Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                //   },
                //   {
                //     Header: 'Owner Name',
                //     accessor: 'owname'
                //   }
                // ]}
                defaultPageSize={10}
                className="-striped -highlight"
                {...checkboxProps}
              />
        
              <div>
              <Well bsSize="large">
                <form onSubmit={this.sendCard2Runner}>
                    {
                      opt_runners
                    }
                  <Button className="btn btn-info">Submit</Button>
                </form>
              </Well>
            </div>
            </div>
          )
        }

        const cmp_runner = ({ match }) => {
          const { data } = this.state.runner;
          let id = match.params.id;
          this.fetchRunnerById(id);
          const gotoSendCard = () => {window.location = '/sendCard'};
          return (
            <div>
              {
                data.map((runner,index) => {
                  return(
                    <Table key={"runner"+index}>
                      <tbody>
                        <tr><td>ID</td><td>{runner.id}</td></tr>
                        <tr><td>Name</td><td>{runner.name}</td></tr>
                        <tr><td>Phone</td><td>{runner.phone}</td></tr>
                        <tr><td>Fee</td><td>{runner.fee}</td></tr>
                        <tr><td>Credit</td><td>{runner.credit}</td></tr>
                        <tr><td>Drawn</td><td>{runner.drawn}</td></tr>
                        <tr><td>Diposited</td><td>{runner.diposited}</td></tr>
                        <tr><td>Cards With</td><td></td></tr>
                        <tr><td>Cards Pending from</td><td></td></tr>
                        <tr><td>Cards Pending to</td><td></td></tr>
                        <tr><td>Date Created</td><td>{runner.created}</td></tr>
                        <tr><td><Button onClick={gotoSendCard} className="btn btn-info">Send Card</Button></td><td></td></tr>
                      </tbody>
                    </Table>
                  )
                })
              }
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

        const pg_addRunner = () => {
          return(
            <form onSubmit={this.handleAddRunner}>
              <label>
                New Runner:
              </label>
              <br/>
              <Table ref={table => {this.addTable=table;}} responsive>
                <tbody>
                  <tr><td>Name:</td><td><input type="text" name="name" title="Name of runner"/></td></tr>
                  <tr><td>Phone</td><td><input type="text" name="phone" title="Phone number of runner"/></td></tr>
                  <tr><td>Fee</td><td><input type="text" name="fee" title="Fee per card in USD"/></td></tr>
                  <tr><td></td><td>
                  <Button ref={button => {this.submitTarget=button;}} type="submit" className="btn btn-info">Submit</Button>
                  </td></tr>
                </tbody>
              </Table>
              <Overlay {...submitProps} placement="left">
                <Tooltip id="overload-left" onClick={this.handleToggle}>Whenever you're ready!</Tooltip>
              </Overlay>
            </form>
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
              <LinkContainer to="/customers">
                <NavItem eventKey={1}>
                  Customers
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/runners">
                <NavItem eventKey={2}>
                  Runners
                </NavItem>
              </LinkContainer>
              <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                <LinkContainer to="/cards">
                  <MenuItem eventKey={3.1}title="Shows Cards Table">Cards</MenuItem>
                </LinkContainer>
                <LinkContainer to="/transactions">
                  <MenuItem eventKey={3.1}title="Shows Transaction Table">Transactions</MenuItem>
                </LinkContainer>
                <MenuItem eventKey={3.2}>Statistics</MenuItem>
                <MenuItem eventKey={3.3}>Settings</MenuItem>
                <MenuItem divider />
                <LinkContainer to="/users">
                <MenuItem eventKey={3.3} title="Shows Users Info">Users</MenuItem>
                </LinkContainer>
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
        <Route path="/runners" render={pg_runner} />
        <Route path="/runner/:id" render={cmp_runner} />
        <Route path="/addRunner" render={pg_addRunner} />
        <Route path="/sendCard" render={sendCard}/>
        <Route path="/done" render={done}/>
        <Route path="/transactions" render={home_header}/>
        <Route path="/users" render={Users}/>
        <Route path="/customer/:id" render={Customer} />
        <Route path="/card/:id" render={Card} />
        <Route path="/fasi" render={home_header} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome}/>
        <Route path="/addCard" />
        <Route render={alert404} />
        </Switch>

        <NotificationContainer/>
        
      </div>
    );
  }
}

export default App;
