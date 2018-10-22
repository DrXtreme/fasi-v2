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

const url = 'http://localhost/';
// const CheckboxTable = checkboxHOC(ReactTable);

// function cards4sendData(){
//   var form = new FormData();
//   form.set('getCards4runners',1);
//   var reso={};
//   fetch(url,{
//     method: 'POST',
//     body: form
//   })
//     .then(res => res.json())
//     .then(data => {reso = data})
//     .then(() => {return reso});
// }

// function getData() {
//   if(typeof(cards4sendData()) !== 'undefined'){
//     const data = cards4sendData().map(item => {
//     // using chancejs to generate guid
//     // shortid is probably better but seems to have performance issues
//     // on codesandbox.io
//     const _id = item.id;
//     return {
//       _id,
//       ...item
//     };
//   });
//   return data;
//   }else{
//     return {};
//   }
  
// }

// function getColumns(data) {
//   const columns = [];
//   var sample ;
//   if(typeof(data[0]) !== 'undefined'){
//     sample = data[0];
//     Object.keys(sample).forEach(key => {
//       if (key !== "_id") {
//         columns.push({
//           accessor: key,
//           Header: key
//         });
//       }
//     });
//   }
  
//   return columns;
// }


class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    // const data = getData();
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
      queue:{
        data: [],
        pages: null,
        loading: true
      },
      sendCard: {
        cards4send: [],
        runners: [],
        pages: null,
        loading: true,
        selection: [],
        selectAll: false,
        selectedRunner: null,
        selectedRunnerName: null
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
    this.selectCard4send = this.selectCard4send.bind(this);
    this.removeCard4send = this.removeCard4send.bind(this);
    this.executeSendCard = this.executeSendCard.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.fetchQueueData = this.fetchQueueData.bind(this);
  }

  fetchQueueData(){
    this.setState({queue:{loading:true}})
    var form = new FormData();
    form.set('queues',1);
    fetch(url,{
      method: 'POST',
      body: form
    }).then(res => res.json())
    .then(data => {
      this.setState({queue:{data,loading:false}})
    })
  }
  
  handleCheckbox(e){
    var id = e.target.value;
    if(e.target.checked){
    console.log("ahhh");
    var oldstate = this.state.sendCard.selection || [];
    oldstate.push(id);
    this.setState({sendCard:{selection:{oldstate}}});
    }
    if(e.target.checked === false){
      console.log("woooh");
      var oldstate = this.state.sendCard.selection;
      var index = oldstate.findIndex(id);
      if(index > -1){
        oldstate.splice(index,1);
      }
    }
}

  selectCard4send(id){
    var oldstate = this.state.sendCard.selection || [];
    oldstate.push(id);
    this.setState({sendCard:{selection:{oldstate}}});
  }

  removeCard4send(id){
    var oldstate = this.state.sendCard.selection;
    var index = oldstate.findIndex(id);
    if(index > -1){
      oldstate.splice(index,1);
    }
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
    this.setState({selectedRunner:e.target.value,selectedRunnerName:e.target.text});
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
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(data => {
      var runners = data[1];
      var cards4send = data[0];
      if(typeof(data[0]) !== 'undefined'){
        this.setState({sendCard:{cards4send:cards4send,runners:runners,loading:false}});
      }else{
        this.setState({sendCard:{cards4send:[],runners:[],loading:false}});
      }
    })
  }

  executeSendCard(id){
    if( typeof(this.state.selectedRunner)!== 'undefined'){
      try {
        NotificationManager.warning("إرسال البطاقة الى  "+id+" الساحب","أرجوا الإنتظار...");
        this.sendCard2Runner(id,this.state.selectedRunner);
      }
      catch(error){
        NotificationManager.error("ﻻ يمكن إرسال البطاقة","حدث خطأ ما");
      }
    }
  }

  executeSendCards(event){
    event.preventDefault();
    if( typeof(this.state.sendCard.selection)!== 'undefined'){
      console.log("hahahhaha");
      this.state.sendCard.selection.map((id,index) => {
      try {
        NotificationManager.warning("إرسال البطاقة الى  "+index+" الساحب","أرجوا الإنتظار...");
        this.sendCard2Runner(id,this.state.selectedRunner);
        NotificationManager.success("تم إرسال البطاقة","نجاح");
      }
      catch(error){
        NotificationManager.error("ﻻ يمكن إرسال البطاقة","حدث خطأ ما");
      }
      });
    }
  }

  sendCard2Runner(card_id,runner_id){
    var form = new FormData();
    form.set('sendCard',1);
    form.set('card_id', card_id);
    form.set('runner_id', runner_id);
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.text())
    .then(reso => {console.log(reso);
      // switch(resa){
      //   case "": break;
      //   case "SuccessMore Success": window.location = '/done'; break;
      //   case "Success": break;
      //   default: break;
      // }
      if(reso.toString().localeCompare("Success")===0){
        NotificationManager.success('تم إرسال البطاقة الى الساحب','نجاح');
      }
      else{
        NotificationManager.error('فشل في إرسال البطاقة','خطأ');
      }
    });
  }

  

  handleAddRunner(event){
    event.preventDefault();
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`   
    data.set('addRunner', 1);
    fetch(url, {
      method: 'POST',
      body: data,
    }).then(reso => {
      return reso.text();
    }).then(resa => {
      if(resa.toString().localeCompare("Success")===0){
        NotificationManager.success('تمت إضافة ساحب جديد','نجاح')
        }
        else{
          NotificationManager.success('فشل في إضافة ساحب جديد','خطأ');
        }
    });
  }

  fetchRunnerById(id){
    () => this.setState({runner:{loading:true}});
    var form = new FormData();
    form.set('getRunner',1);
    form.set('id',id);
    fetch(url,{
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

    fetch(url,{
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

    fetch(url,{
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
    NotificationManager.warning("الرجاء الإنتظار...","إضافة حساب لزبون جديد");
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`   
    data.set('addCustomer', 1);
    fetch(url, {
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
          NotificationManager.success("تمت إضافة حساب لزبون جديد","نجاح");
          // window.location='/customers';
          // return(<Redirect to='/customers'/>);
          // this.setState({toCustomers:true});
          this.props.history.push('/customers');
        }
        else{
          NotificationManager.error("لا يمكن إضافة الزبون","خطأ");
        }
    });
  }

  generateKey(pre) {
    return `${ pre }_${ new Date().getTime() }`;
  }
  
  addCardRow(){
    let row = <tr key={this.generateKey("card_row")}><td><input type="text" name="owname" placeholder="Owner Name"/></td><td><input type="text" name="number" placeholder="Card Number"/></td><td><input type="text" name="type" placeholder="Type"/></td><td><input type="text" name="bank" placeholder="Bank"/></td><td><input type="text" name="exp" placeholder="EXP"/></td><td><input type="text" name="state" placeholder="State"/></td><td><input type="text" name="credit" placeholder="Credit"/></td><td><input type="text" name="drawn" placeholder="Drawn"/></td></tr>;
    
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
          Header: 'الإشاري',
          accessor: 'id',
          Cell: props => <span className='number'><Link to={`/customer/${props.value}`}>{props.value}</Link></span>
        },
        {
          Header: 'الإسم',
          accessor: 'name' // String-based value accessors!
        }, {
          Header: 'البطاقات',
          accessor: 'cards',
          id: 'cards',
          Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
        }, {
          id: 'phone', // Required because our accessor is not a string
          Header: 'الهاتف',
          accessor: 'phone',
          Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
          Header: 'اشاري البطاقة',
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
      noDataText="ﻻ توجد بيانات مطابقة !"
      filterable
      minRows={3}
      defaultPageSize={10}
      />
      <Link to="/addCustomer" className="btn btn-info">إضافة</Link>
      </div>
      )};

      const pg_card = () => {
        const { data , loading} = this.state.card;
        return( <ReactTable
        columns={[
          {
            Header: 'الإشاري',
            accessor: 'id',
            Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
          },
          {
            Header: 'الإسم',
            accessor: 'owname' // String-based value accessors!
          },
          {
            Header: 'الرقم',
            accessor: 'number',
            Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
          },
          {
            Header: 'النوع',
            accessor: 'type',
            id: 'type'
          },
          {
            id: 'exp', // Required because our accessor is not a string
            Header: 'الصلاحية',
            accessor: 'exp',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          },
          {
            Header: 'الحالة',
            accessor: 'state',
            id: 'state'
          },
          {
            Header: 'المصرف',
            accessor: 'bank',
            id: 'bank'
          },
          {
            Header: 'الرصيد',
            accessor: 'credit',
            id: 'credit'
          },
          {
            Header: 'المسحوب',
            accessor: 'drawn',
            id: 'drawn'
          },
          {
            Header: 'المتبقي',
            accessor: 'avail',
            id: 'avail'
          }
          ]}
        data={data}
        //pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchCardData} // Request new data when things change
        noDataText="لا توجد بيانات مطابقة !"
        filterable
        minRows={3}
        defaultPageSize={10}
        className="-striped -highlight"
        />)};

        const pg_queue = () => {
          const { data , loading} = this.state.queue;
          return( <ReactTable
          columns={[
            {
              Header: 'الإشاري',
              accessor: 'id'
            },
            {
              Header: 'إشاري البطاقة',
              accessor: 'card_id' // String-based value accessors!
            }, 
            {
              Header: 'إشاري الساحب',
              accessor: 'runner_id'
            },
            {
              Header: 'فاعل؟',
              accessor: 'valid'
            },
            {
              Header: 'تاريخ الإضافة',
              accessor: 'created'
            }
            ]}
          data={data}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchQueueData} // Request new data when things change
          noDataText="ﻻ توجد بيانات مطابقة !"
          filterable
          minRows={3}
          defaultPageSize={10}
          className="-striped -highlight"
          />)};

        const alert404 = ( () => {
          return(
            <Alert bsStyle="danger"><h4>رابط خاطئ؟</h4><br/>هذا ليس خطأك.</Alert>
          );
        });

        const pg_addCustomer = () => {
          return(
          <form onSubmit={this.handleAddCustomer}>
            <label>
              حساب جديد:
            </label>
            <br/>
            <Table ref={table => {this.addTable=table;}} responsive>
              <tbody>
                <tr><td>Name:</td><td><input type="text" name="name" title="إسم صاحب الحساب" required/></td></tr>
                <tr><td>Phone</td><td><input type="number" name="phone" title="رقم هاتف صاحب الحساب" required/></td></tr>
                {this.state.cardRow}
                <tr><td><Button bsStyle="success" ref={button => {this.target = button;}} onClick={this.addCardRow} >+ أضف بطاقة...</Button></td></tr>
                <tr><td></td><td>
                <Button ref={button => {this.submitTarget=button;}} type="submit">قدّم</Button>
                </td></tr>
              </tbody>
            </Table>
            <Overlay {...sharedProps} placement="bottom">
              <Tooltip id="overload-bottom" onClick={this.handleToggle}>ﻻ توجد حدود لإضافة البطاقات!</Tooltip>
            </Overlay>
            <Overlay {...submitProps} placement="left">
              <Tooltip id="overload-left" onClick={this.handleToggle}>عندما تكون مستعدا!</Tooltip>
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
                    <tr><td>الإشاري:</td><td>{customer.id}</td></tr>
                    <tr><td>الإسم:</td><td>{customer.name}</td></tr>
                    <tr><td>البطاقات:</td><td>{customer.cards}</td></tr>
                    <tr><td>الهاتف:</td><td>{customer.phone}</td></tr>
                    <tr><td>إشاري البطاقة:</td><td>{customer.cards_id}</td></tr>
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
              noDataText="ﻻ توجد بيانات مطابقة !"
              loading = {loading}
              defaultPageSize = {1}
              minRows = {1}
              columns = {
                [
                  {
                    id : 'id',
                    Header : 'الإشاري',
                    accessor : 'id',
                    Cell: props => <span className='number'><Link to={`/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                  },
                  {
                    id : 'owname',
                    Header : 'إسم صاحب البطاقة',
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
                <tr><td>الإشاري:</td><td>{card.id}</td></tr>
                <tr><td>الإسم:</td><td>{card.owname}</td></tr>
                <tr><td>النوع:</td><td>{card.type}</td></tr>
                <tr><td>المصرف:</td><td>{card.bank}</td></tr>
                <tr><td>الصلاحية:</td><td>{card.exp}</td></tr>
                <tr><td>الحالة:</td><td>{card.state}</td></tr>
                <tr><td>أين؟:</td><td>{card.whereis}</td></tr>
                <tr><td>الرصيد:</td><td>{card.credit}</td></tr>
                <tr><td>المسحوب:</td><td>{card.drawn}</td></tr>
                <tr><td>الرقم:</td><td>{card.number}</td></tr>
                <tr><td>الكود:</td><td>{1234}</td></tr>
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
          <h1 className="App-title">مرحبا بك في فاسي لخدمات العمله</h1>
          </header>
        );

        const home_message = () => (
          <p className="App-intro">
            قريبا على منصات الهةاتف الذكية.
          </p>
        );

        const pg_runner = () => { 
          const { data , loading} = this.state.runner;
          return( <div><ReactTable
          columns={[
            {
              Header : 'الإشاري',
              accessor : 'id',
              Cell: props => <span className='number'><Link to={`/runner/${props.value}`}>{props.value}</Link></span> // Custom cell components!
            },
            {
              id : 'name',
              Header : 'الإسم',
              accessor : 'name'
            },
            {
              id : 'phone',
              Header : 'الهاتف',
              accessor : 'phone'
            },
            {
              id : 'fee',
              Header : 'العمولة',
              accessor : 'fee'
            },
            {
              id : 'credit',
              Header : 'الرصيد',
              accessor : 'credit'
            }
            ]}
          className="-striped -highlight"
          data={data}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchRunnerData} // Request new data when things change
          noDataText="ﻻ توجد بيانات مطابقة !"
          filterable
          minRows={3}
          defaultPageSize={10}
          />
          <Link to="/addRunner" className="btn btn-info">ADD</Link>
          </div>
          )};
        
        
        const sendCard = () => {
          const { runners, cards4send , loading} = this.state.sendCard;
          // const sendIt = (e) => {
          //   e.preventDefault();
          //   this.sendCard2Runner(160,this.state.selectedRunner)
          // };

          const execSend = (e) => {
            e.preventDefault;
          }

          const handleCheckbox = (checkbox,id) => {
              console.log("ahhh");
              if(checkbox.checked){
              this.selectCard4send(id);
            }
            if(checkbox.checked === false){
              console.log("woooh");
              this.removeCard4send(id);
            }
          }
          // const data = cards4send;
          // const { toggleSelection, toggleAll, isSelected, logSelection } = this;
          const { selectAll } = this.state.sendCard;
          // const { columns } = this.state;
          // const checkboxProps = {
          //   selectAll,
          //   isSelected,
          //   toggleSelection,
          //   toggleAll,
          //   selectType: "checkbox",
          //   getTrProps: (s, r) => {
          //     // someone asked for an example of a background color change
          //     // here it is...
          //     if(typeof(r) !== 'undefined'){
          //       const selected = this.isSelected(r.original._id);
          //         return {
          //           style: {
          //             backgroundColor: selected ? "lightblue" : "inherit"
          //             // color: selected ? 'white' : 'inherit',
          //           }
          //         };
          //     }else{
          //       return {};
          //     }
          //   }
          // };
          this.fetchCards4Send();
          
          const tbl_cards4send = (
            <Table>
              <thead>
                  <tr><td>الإشاري</td><td>إسم صاحبها</td><td>رقم البطاقة</td><td>|</td><td>الساحب</td><td>أرسل</td></tr>
              </thead>
              <tbody>
                {
                  
                  cards4send.map((card,index) => {
                    return(
                      <tr key={"row_card_"+index}><td>{card.id}</td><td>{card.owname}</td><td>{card.number}</td><td>|</td><td>
                        <select 
                        onChange={this.handleSelectRunnerChange} 
                        required
                        placeholder="الساحب"
                        ref={ref => {
                          this._select = ref
                        }}
                        value={this.state.selectedRunner}
                        defaultValue={this.state.selectedRunner}
                        >
                          {
                            runners.map((runner,index) => (
                              <option value={runner.id} key={"opt_runner_"+index}>{runner.name}</option>
                            ))
                          }
                        </select></td><td><Button className="btn btn-link" onClick={() => this.executeSendCard(card.id)}>أرسل</Button></td></tr>
                    )
                  })
                }
              </tbody>
              
            </Table>
          );
          // this.state.selectedRunner = runners.id;
          const opt_runners = (
            <select onChange={this.handleSelectRunnerChange} autoFocus required>
              {
                runners.map((runner,index) => (
                  <option value={runner.id} key={"opt_runner_"+index}>{runner.name}</option>
                ))
              }
            </select>
          )
            
          return (
            <div>
              <Well bsSize="small">
                <h3>إرسال بطاقات</h3>
              </Well>
              {tbl_cards4send}
              {/* <CheckboxTable
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
              /> */}
        
              <div>
              <Well bsSize="large">
                {/* <form onSubmit={this.executeSendCard}>
                    {
                      opt_runners
                    }
                  <Button className="btn btn-info" type="submit">Submit</Button>
                </form> */}
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
                        <tr><td>الإشاري</td><td>{runner.id}</td></tr>
                        <tr><td>الإسم</td><td>{runner.name}</td></tr>
                        <tr><td>الرقم</td><td>{runner.phone}</td></tr>
                        <tr><td>العمولة</td><td>{runner.fee}</td></tr>
                        <tr><td>الرصيد</td><td>{runner.credit}</td></tr>
                        <tr><td>المسحوب</td><td>{runner.drawn}</td></tr>
                        <tr><td>المودع</td><td>{runner.diposited}</td></tr>
                        <tr><td>بطاقات مع</td><td></td></tr>
                        <tr><td>بطاقات فالطريق منه</td><td></td></tr>
                        <tr><td>بطاقات فالطريق اليه</td><td></td></tr>
                        <tr><td>تاريخ الإضافة</td><td>{runner.created}</td></tr>
                        <tr><td><Button onClick={gotoSendCard} className="btn btn-info">إرسال بطاقات</Button></td><td></td></tr>
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
                  <tr><td>المستخدم</td><td>الإمر</td></tr>
                </thead>
                <tbody>
                  <tr><td>Admin</td><td><a>تغيير كلمة المرور</a></td></tr>
                </tbody>
              </Table>
            </div>
          );
        }

        const pg_addRunner = () => {
          return(
            <form onSubmit={this.handleAddRunner}>
              <label>
                ساحب جديد:
              </label>
              <br/>
              <Table ref={table => {this.addTable=table;}} responsive>
                <tbody>
                  <tr><td>الإسم:</td><td><input type="text" name="name" title="إسم الساحب"/></td></tr>
                  <tr><td>رقم الهاتف</td><td><input type="text" name="phone" title="رقم هاتف الساحب"/></td></tr>
                  <tr><td>العموله</td><td><input type="text" name="fee" title="عمولة الساحب للبطاقة الواحدة"/></td></tr>
                  <tr><td></td><td>
                  <Button ref={button => {this.submitTarget=button;}} type="submit" className="btn btn-info">قدّم</Button>
                  </td></tr>
                </tbody>
              </Table>
              <Overlay {...submitProps} placement="left">
                <Tooltip id="overload-left" onClick={this.handleToggle}>عندما تكون مستعدا!</Tooltip>
              </Overlay>
            </form>
            );
        }


    return (
      <div className="App">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/fasi">فاسي لخدمات العمله</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/customers">
                <NavItem eventKey={1}>
                  الزبائن
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/runners">
                <NavItem eventKey={2}>
                  الساحبون
                </NavItem>
              </LinkContainer>
              <NavDropdown eventKey={3} title="المزيد" id="basic-nav-dropdown">
                <LinkContainer to="/cards">
                  <MenuItem eventKey={3.1}title="يعرض بيانات البطاقات">البطاقات</MenuItem>
                </LinkContainer>
                <LinkContainer to="/sendCard">
                  <MenuItem eventKey={3.1}title="يعرض قائمة إرسال البطاقات">إرسال البطاقات</MenuItem>
                </LinkContainer>
                <LinkContainer to="/queue">
                  <MenuItem eventKey={3.1}title="يعرض البطاقات التي فالإنتظار">بطاقات فالإنتظار</MenuItem>
                </LinkContainer>
                <LinkContainer to="/transactions">
                  <MenuItem eventKey={3.1}title="يعرف جميع المعاملات">المعاملات</MenuItem>
                </LinkContainer>
                <MenuItem eventKey={3.2}>التقارير</MenuItem>
                <MenuItem eventKey={3.3}>الإعدادات</MenuItem>
                <MenuItem divider />
                <LinkContainer to="/users">
                <MenuItem eventKey={3.3} title="يعرض بيانات المستخدمين">المستخدمون</MenuItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1}>
                المساعدة
              </NavItem>
              <NavItem eventKey={2}>
                حول
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
        <Route path="/queue" render={pg_queue}/>
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
