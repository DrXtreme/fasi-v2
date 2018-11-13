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
import {PostData} from './PostData';
import { Well,Nav,Navbar,NavItem,NavDropdown,MenuItem,Button,Table,Overlay,Tooltip,Alert,Modal } from 'react-bootstrap';
import { Link, Route,Switch,Redirect,withRouter} from 'react-router-dom';
import {done} from './done';
import Runner from './Runner';
import Welcome from './welcome';
import Login from './Login';
import Logout from './Logout';
import { LinkContainer } from 'react-router-bootstrap';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import checkboxHOC from "react-table/lib/hoc/selectTable";
import ReactToPrint from "react-to-print";
// import 'bootstrap/dist/css/bootstrap.min.css';

const url = 'http://admin.fasicurrency.com/sbuild/';



let rand = ()=> (Math.floor(Math.random() * 20) - 10);

            const modalStyle = {
              position: 'fixed',
              zIndex: 1040,
              top: 0, bottom: 0, left: 0, right: 0
            };
            
            const backdropStyle = {
              ...modalStyle,
              zIndex: 'auto',
              backgroundColor: '#000',
              opacity: 0.6
            };
            
            const dialogStyle = function() {
              // we use some psuedo random coords so nested modals
              // don't sit right on top of each other.
              let top = -50;
              let left = 50;
            
              return {
                position: 'absolute',
                width: 400,
                top: top + '%', left: left + '%',
                transform: `translate(-${top}%, -${left}%)`,
                border: '1px solid #e5e5e5',
                backgroundColor: 'white',
                boxShadow: '0 5px 15px rgba(0,0,0,.5)',
                padding: 20
              };
            };
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
    this._runnerUser = React.createRef();
    this._formToPrint = React.createRef();
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
      log:{
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
      selectedRunner: '',
      showModal: false,
      showModalto: false,
      submitIsDisabled: false,
      runnerUser : "",
      housefee : '',
      date: ''
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
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.opento = this.opento.bind(this);
    this.closeto = this.closeto.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.handleRunnerUserChange = this.handleRunnerUserChange.bind(this);
    this.handleAddRunnerUser = this.handleAddRunnerUser.bind(this);
    this.loginAction = this.loginAction.bind(this);
    this.getfee = this.getfee.bind(this);
    this.handleChangeFee = this.handleChangeFee.bind(this);
    this.fetchLogData = this.fetchLogData.bind(this);
    this.handleCustomerWithdraw = this.handleCustomerWithdraw.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  getDate(){
    fetch(url+'?getDate').then(res => res.text()).then(reso => {this.setState({date:reso})});
  }

  handleCustomerWithdraw(e){
    e.preventDefault();
    ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
    NotificationManager.warning("يتم تسجيل سحب للزبون","أرجوا الإنتظار");
    let id = e.target.customer_id.value;
    let amount = e.target.amount.value;
    var form = new FormData(e.target);
    form.set('customerWithdraw','1');
    fetch(url,{
      method: 'POST',
      body:form
    })
    .then(res => res.text())
    .then(reso => {
      if(reso == "Success"){
        this.closeto();
        NotificationManager.success("تم تسجيل سحب للزبون","نجاح");
        window.location.replace(`/build/admin/customertransaction/${id}/${amount}`);
      }
      else{
        this.closeto();
        NotificationManager.error("لم يتم تسجيل السحب للزبون","خطأ");
      }
    })
  }

  fetchLogData(){
    this.setState.loading=true;
    var form = new FormData();
    form.set('getLogs','1');
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(data => {
      this.setState({log:{data,loading:false}});
    })
  }

  handleChangeFee(e){
    e.preventDefault();
    var form = new FormData(e.target);
    form.set('changeHouseFee', '1');
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.text())
    .then(resText => {
      if(resText == "Success"){
        NotificationManager.success("تم تغيير العمولة","نجاح");
        this.getfee();
        this.close();
      }
      else{
        NotificationManager.error("فشل تغيير العمولة","خطأ");
        this.close();
      }
    });
  }

  getfee(){
    var form = new FormData();
    form.set('getHouseFee','1');
    fetch(url,{
      method: 'POST',
      body:form
    })
    .then(res => res.json())
    .then(resJson => {
      this.setState({housefee:resJson.amount});
    })
  }

  async loginAction(runner_id) {
    var form = new FormData();
    form.set('hasLogin',1);
    form.set('runner_id',runner_id);
    const res = await fetch(url, {
      method: 'POST',
      body: form
    });
    if (res === 1) {
      return (<Button className="btn btn-danger" onClick={this.open}>إضافة معرف دخول</Button>);
    }
    else if (res === 0) {
      return(<Button className="btn btn-info" onClick={this.open}>تغيير كلمة المرور</Button>);
    }
  };

  handleAddRunnerUser(e){
    e.preventDefault();
    NotificationManager.warning("تتم إضافة معرف دخول للساحب","الرجاء الإنتظار");
    const form = new FormData(e.target);
    form.set('addRunnerUser',1);
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.text())
    .then(resText => {
      if(resText === "Success"){
        NotificationManager.success("تمت إضافة معرف الدخول للساحب","نجاح");
        this.close();
      }else{
        NotificationManager.error("فشل إضافة معرف الدخول للساحب","خطأ");
        this.close();
      }
    });
  }

  handleRunnerUserChange(e){
    this.setState({runnerUser:e.target.value+"@fasicurrency.com"});
  }  

  handleAddCard(e){
    e.preventDefault();
    ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
    // this.setState({submitIsDisabled:true});
    // e.currentTarget.classList.add("disabled");
    NotificationManager.warning("تتم إضافة البطاقة","الرجاء الإنتظار");
    const form = new FormData(e.target);
    form.set('addCard',1);
    fetch(url,{
      method:'POST',
      body:form
    })
    .then(res => res.text())
    .then(textRes => {
      if(textRes === "Success"){
        this.close();
        NotificationManager.success("تمت إضافة البطاقة بنجاح","نجاح");
        // this.setState({submitIsDisabled:false});
      }else{
        this.close();
        NotificationManager.error("ﻻ يمكن إضافة بطاقة","خطأ");
        // this.setState({submitIsDisabled:false});
      }
    })
  }

  close(){
    this.setState({showModal: false});
  }

  open(){
    this.setState({showModal: true});
  }
  closeto(){
    this.setState({showModalto: false});
  }

  opento(){
    this.setState({showModalto: true});
  }
  
  fetchQueueData(){
    () => this.setState({queue:{loading:true}})
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
    let selectedRunner = ReactDOM.findDOMNode(this._select).value;
    console.log(selectedRunner);
    // if( typeof(this.state.selectedRunner)!== 'undefined'){
      if (selectedRunner !== null){
      try {
        NotificationManager.warning("إرسال البطاقة الى  "+id+" الساحب","أرجوا الإنتظار...");
        this.sendCard2Runner(id,selectedRunner);
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
        NotificationManager.success('تمت إضافة ساحب جديد','نجاح');
        window.location.replace('/build/admin/runners');
        }
        else{
          NotificationManager.error('فشل في إضافة ساحب جديد','خطأ');
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
          window.location.replace('/build/admin/customers');
          // return(<Redirect to='/customers'/>);
          // this.setState({toCustomers:true});
          // this.props.history.push('/customers');
        }
        else{
          NotificationManager.error("لا يمكن إضافة الزبون","خطأ");
        }
    });
  }

  generateKey(pre) {
    return `${ pre }_${ new Date().getTime() }`;
  }
  
  addCardRow(e){
    e.preventDefault();
    let row = <tr key={this.generateKey("card_row")}><td><input type="text" name="owname" placeholder="إسم مالك البطاقة" required/></td><td><input type="text" name="card_number" placeholder="رقم البطاقة" required/></td><td><input name="card_code" type="text" placeholder="كود البطاقة" required/></td><td><input type="text" name="type" placeholder="النوع" required/></td><td><input type="text" name="bank" placeholder="المصرف" required/></td><td><input type="text" name="exp" placeholder="الصلاحية" required/></td><td><input type="text" name="state" placeholder="الحاله" required/></td><td><input type="text" name="credit" placeholder="الرصيد" required/></td><td><input type="text" name="drawn" placeholder="المسحوب منه" required/></td></tr>;
    
    this.setState({cardRow:[this.state.cardRow,row]}) ;
    ReactDOM.findDOMNode(this.target).setAttribute("disabled", "disabled");
    // this.refs.target.setAttribute("disabled", "disabled");
    // this.target.disabled=true;
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

  componentDidMount(){
    {this.fetchCustomerData()};//fetchCardData
    {this.fetchRunnerData()};//fetchRunnerDatafetchCardData
    {this.fetchCardData()};//fetchRunnerDatafetchCardData
    {this.getfee()};//fetch house fee
  }

  render() {
    
    
    const pg_customer = () => { 
      const { data , loading} = this.state.customer;
      return( <div><ReactTable
      columns={[
        {
          Header: 'الإشاري',
          accessor: 'id',
          Cell: props => <span className='number'><Link to={`/build/admin/customer/${props.value}`}>{props.value}</Link></span>
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
          Cell: props => <span className='number'><Link to={`/build/admin/card/${props.value}`}>{props.value != null ? props.value : "0"}</Link></span> // Custom cell components!
        }
        ]}
      className="-striped -highlight"
      data={data}
      //pages={pages} // Display the total number of pages
      loading={loading} // Display the loading overlay when we need it
      onFetchData={this.fetchCustomerData} // Request new data when things change
      noDataText="ﻻ توجد بيانات مطابقة !"
      loadingText="جاري التحميل"
      nextText="التالي"
      previousText="السابق"
      rowsText="صفوف"
      pageText="صفحة"
      filterable
      minRows={3}
      defaultPageSize={10}
      />
      <Link to="/build/admin/addCustomer" className="btn btn-info">إضافة</Link>
      </div>
      )};

      const pg_card = () => {
        const { data , loading} = this.state.card;
        return( <ReactTable
        columns={[
          {
            Header: 'الإشاري',
            accessor: 'id',
            Cell: props => <span className='number'><Link to={`/build/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
          },
          {
            Header: 'الإسم',
            accessor: 'owname' // String-based value accessors!
          },
          {
            Header: 'الرقم',
            accessor: 'card_number'
          },
          {
            Header: 'الكود',
            accessor: 'card_code'
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
        noDataText="ﻻ توجد بيانات مطابقة !"
        loadingText="جاري التحميل"
        nextText="التالي"
        previousText="السابق"
        rowsText="صفوف"
        pageText="صفحة"
        filterable
        minRows={3}
        defaultPageSize={10}
        className="-striped -highlight"
        />)};

        const pg_queue = () => {
          const { data , loading} = this.state.queue;
          return( <div>
            <Well bsSize="small">
              <h3>بطاقات فالإنتظار</h3>
            </Well>
            <ReactTable
              columns={[
                {
                  Header: 'الإشاري',
                  accessor: 'id'
                },
                {
                  Header: 'إشاري البطاقة',
                  accessor: 'card_id' 
                }, 
                {
                  Header: 'إشاري الساحب',
                  accessor: 'runner_id'
                },
                {
                  Header: 'فاعل؟',
                  accessor: 'valid',
                  Cell: props => <span>{props.value=1?"نعم":"ﻻ"}</span>
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
              loadingText="جاري التحميل"
              nextText="التالي"
              previousText="السابق"
              rowsText="صفوف"
              pageText="صفحة"
              filterable
              minRows={3}
              defaultPageSize={10}
              className="-striped -highlight"
              /></div>)};

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
                <tr><td>الإسم:</td><td><input type="text" name="name" title="إسم صاحب الحساب" required/></td></tr>
                <tr><td>رقم الهاتف</td><td><input type="number" name="phone" title="رقم هاتف صاحب الحساب" required/></td></tr>
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
          this.getCustomerData(id)
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
                    <tr><td>تاريخ التسجيل :</td><td>{customer.created}</td></tr>
                  </tbody>
                </Table>
              )});

              var cards4withdraw = data2.map((card,index) => {
                return(
                    <option value={card.id}>{card.bank}({card.act_bal})</option>
                )
              })
            
          }
          catch(error){
            console.error(error);
          }
          
          finally{
          return(
          <div>
            <h3>ID: {match.params.id}</h3>
            {customer}
            <ReactTable 
              className="-striped -highlight"
              onFetchData={() => this.getCustomerData(id)} // getcardata needs id for its for 1 but fetchcardata iz 4 all
              noDataText="ﻻ توجد بيانات مطابقة !"
              loadingText="جاري التحميل"
              nextText="التالي"
              previousText="السابق"
              rowsText="صفوف"
              pageText="صفحة"
              loading = {loading}
              defaultPageSize = {10}
              minRows = {1}
              columns = {
                [
                  {
                    id : 'id',
                    Header : 'الإشاري',
                    accessor : 'id',
                    Cell: props => <span className='number'><Link to={`/build/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                  },
                  {
                    id : 'owname',
                    Header : 'إسم صاحب البطاقة',
                    accessor : 'owname'
                  }
                ]
              }
              data = {data2}/>
              <Button className="btn btn-link" onClick={this.open}>إضافة بطاقة</Button>
              <Modal
                aria-labelledby='modal-label'
                style={modalStyle}
                backdropStyle={backdropStyle}
                show={this.state.showModal}
                onHide={this.close}
                dir="rtl"
              >
                <div style={dialogStyle()} >
                  <h4 id='modal-label'>إضافة بطاقة</h4>
                  <form onSubmit={this.handleAddCard}>
                    <input name="customer_id" type="text" defaultValue={match.params.id} readOnly required/>
                    <input name="owname" type="text" placeholder="إسم مالك البطاقة" required/>
                    <input name="card_number" type="text" pattern="\d*" maxlength="8" placeholder="رقم البطاقة" required/>
                    <input name="card_code" type="text" pattern="\d*" maxlength="4" placeholder="كود البطاقة" required/>
                    <input name="type" type="text" placeholder="النوع" required/>
                    <input name="bank" type="text" placeholder="المصرف" required/>
                    <input name="exp" type="text" placeholder="الصلاحية" required/>
                    <input name="state" type="text" placeholder="الحاله" required/>
                    <input type="text" name="credit" placeholder="الرصيد" required/>
                    <input type="text" name="drawn" placeholder="المسحوب منه" required/>
                    <br/>
                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                  </form>
                  {/* <ModalExample/> */}
                </div>
              </Modal>

              <Button className="btn btn-danger" onClick={this.opento}>إجراء سحب</Button>
              <Modal
                aria-labelledby='modal-label'
                style={modalStyle}
                backdropStyle={backdropStyle}
                show={this.state.showModalto}
                onHide={this.closeto}
                dir="rtl"
              >
                <div style={dialogStyle()} >
                  <h4 id='modal-label'>إجراء سحب</h4>
                  <form onSubmit={this.handleCustomerWithdraw}>
                    <input name="customer_id" type="text" defaultValue={match.params.id} readOnly required/>
                    <select name="card_id" required>
                      {cards4withdraw}
                    </select>
                    <input name="amount" type="number" placeholder="المبلغ" required/>
                    <br/>
                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                  </form>
                  {/* <ModalExample/> */}
                </div>
              </Modal>
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
                <tr><td>الرقم:</td><td>{card.card_number}</td></tr>
                <tr><td>الكود:</td><td>{card.card_code}</td></tr>
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
          <h1 className="App-title">مرحبا بك في شركة الفاسي لخدمات الصرافة</h1>
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
              Cell: props => <span className='number'><Link to={`/build/admin/runner/${props.value}`}>{props.value}</Link></span> // Custom cell components!
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
          loadingText="جاري التحميل"
          nextText="التالي"
          previousText="السابق"
          rowsText="صفوف"
          pageText="صفحة"
          filterable
          minRows={3}
          defaultPageSize={10}
          />
          <Link to="/build/admin/addRunner" className="btn btn-info">إضافة</Link>
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
                      <tr key={"row_card_"+index}><td>{card.id}</td><td>{card.owname}</td><td>{card.card_number}</td><td>|</td><td>
                        <select 
                        onChange={this.handleSelectRunnerChange} 
                        required
                        placeholder="الساحب"
                        ref={ref => {
                          this._select = ref
                        }}
                        
                        value={this.state.selectedRunner}
                        // defaultValue={this.state.selectedRunner}
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
          const gotoSendCard = () => {window.location = '/build/admin/sendCard'};
          //const email = ReactDOM.findDOMNode(this._runnerUser).value+"@fasicurrency.com";
          // isLoggedIn() ? (<Button className="btn btn-danger" onClick={this.open}>إضافة معرف دخول</Button>
          
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
                        <tr><td><LinkContainer to="/build/admin/sendCard"><Button className="btn btn-info">إرسال بطاقات</Button></LinkContainer></td><td></td></tr>
                        <tr><td></td><td><Button className="btn btn-danger" onClick={this.open}>إضافة معرف دخول</Button></td></tr>
                        <Modal
                          aria-labelledby='modal-label'
                          style={modalStyle}
                          backdropStyle={backdropStyle}
                          show={this.state.showModal}
                          onHide={this.close}
                          dir="rtl"
                        >
                          <div style={dialogStyle()} >
                            <h4 id='modal-label'>إضافة معرف دخول</h4>
                            <form onSubmit={this.handleAddRunnerUser}>
                              <input name="runner_id" type="text" defaultValue={match.params.id} readOnly required/>
                              <input ref={ref => this._runnerUser=ref} name="username" type="text" placeholder="إسم المستخدم" onChange={this.handleRunnerUserChange} required/>
                              <input name="email" type="email" placeholder="البريد الإلكتروني" value={this.state.runnerUser} required/>
                              <input type="password" name="password" placeholder="كلمة المرور" required/>
                              <br/>
                              <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                            </form>
                            {/* <ModalExample/> */}
                          </div>
                        </Modal>
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
                  <tr><td>الإسم:</td><td><input type="text" name="name" title="إسم الساحب" required/></td></tr>
                  <tr><td>رقم الهاتف</td><td><input type="text" name="phone" title="رقم هاتف الساحب" required/></td></tr>
                  <tr><td>العموله</td><td><input type="text" name="fee" title="عمولة الساحب للبطاقة الواحدة" required/></td></tr>
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

        const Settings = () => {
          () => this.getfee;
          return(
            <div>
              <Table>
                <thead>
                  <tr><td><Button className="btn btn-info" onClick={this.open}>تغيير العمولة</Button></td><td>{this.state.housefee}</td><td dir="rtl">عمولة الشركة:</td></tr>
                  <tr><td><Button className="btn btn-info" disabled>تغيير اللغة</Button></td><td>العربية</td><td>اللغة</td></tr>
                  <Modal
                          aria-labelledby='modal-label'
                          style={modalStyle}
                          backdropStyle={backdropStyle}
                          show={this.state.showModal}
                          onHide={this.close}
                          dir="rtl"
                        >
                          <div style={dialogStyle()} >
                            <h4 id='modal-label'>تغيير العمولة</h4>
                            <form onSubmit={this.handleChangeFee}>
                              <p dir="rtl">العمولة الجديدة:</p>
                              <input name="amount" type="number" required/>
                              <br/>
                              <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                            </form>
                          </div>
                        </Modal>
                </thead>
              </Table>
            </div>
          );
        }

        const Logs = () => {
          const { data , loading} = this.state.log;
        return( <ReactTable
        columns={[
          {
            Header: 'الإشاري',
            accessor: 'id'
          },
          {
            Header: 'الإسم',
            accessor: 'description' // String-based value accessors!
          },
          {
            Header: 'الرقم',
            accessor: 'created'
          }
          ]}
        data={data}
        //pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchLogData} // Request new data when things change
        noDataText="ﻻ توجد بيانات مطابقة !"
        loadingText="جاري التحميل"
        nextText="التالي"
        previousText="السابق"
        rowsText="صفوف"
        pageText="صفحة"
        filterable
        minRows={3}
        defaultPageSize={10}
        className="-striped -highlight"
        />)
        }

        const CustomerTransaction = ({ match }) => {
          const { data } = this.state.customer;
          let id = match.params.id;
          let amount = match.params.amount;
          this.getCustomerData(id);
          this.getDate();

          return (
            <div>
              {
                data.map((customer,index) => {
                  return(
                    <div>
                    <Table key={"receipt"+index} ref={table => {this._formToPrint=table;}}>
                      <tbody>
                        <tr><td colSpan="2" dir="rtl"><b>شركة الفاسي لخدمات الصرافة</b></td></tr>
                        <tr><td colSpan="2" dir="rtl"><b>واصل إستلام</b></td></tr>
                        <tr><td>{customer.name}</td><td dir="rtl">إسم المستلم</td></tr>
                        <tr><td>{customer.phone}</td><td dir="rtl">رقم هاتفه</td></tr>
                        <tr><td style={{border:'solid'}}>$ {amount}</td><td dir="rtl">المبلغ</td></tr>
                        <tr><td>{this.state.date}</td><td dir="rtl">التاريخ و الوقت</td></tr>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <tr><td>توقيع الموظف</td><td dir="rtl">توقيع الزبون</td></tr>
                      </tbody>
                    </Table>
                    <ReactToPrint
                      trigger={() => <a href="#">طباعة</a>}
                      content={() => this._formToPrint}
                    />
                    </div>
                  )
                })
              }
            </div>
          )
        }


        function isLoggedIn() {
          var sessId = sessionStorage.getItem('userData');
          //console.log(sessId);
          if(sessId !== null){
            console.log("you may enter");
            return true;
          }
          else{
            return false;
          }
        }

          // function requireAuth(nextState, replace) {
          //   if (!loggedIn()) {
          //     replace({
          //       pathname: '/login'
          //     })
          //   }
          // }

    return (
      <div className="App">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/build/fasi">الفاسي لخدمات الصرافة</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/build/admin/customers">
                <NavItem eventKey={1}>
                  الزبائن
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/build/admin/runners">
                <NavItem eventKey={2}>
                  الساحبون
                </NavItem>
              </LinkContainer>
              <NavDropdown eventKey={3} title="المزيد" id="basic-nav-dropdown">
                <LinkContainer to="/build/admin/cards">
                  <MenuItem eventKey={3.1}title="يعرض بيانات البطاقات">البطاقات</MenuItem>
                </LinkContainer>
                <LinkContainer to="/build/admin/sendCard">
                  <MenuItem eventKey={3.1}title="يعرض قائمة إرسال البطاقات">إرسال البطاقات</MenuItem>
                </LinkContainer>
                <LinkContainer to="/build/admin/queue">
                  <MenuItem eventKey={3.1}title="يعرض البطاقات التي فالإنتظار">بطاقات فالإنتظار</MenuItem>
                </LinkContainer>
                <LinkContainer to="/build/admin/transactions">
                  <MenuItem eventKey={3.1}title="يعرض جميع المعاملات">المعاملات</MenuItem>
                </LinkContainer>
                <LinkContainer to="/build/admin/logs">
                  <MenuItem eventKey={3.1}title="يعرض جميع السجلات">السجلات</MenuItem>
                </LinkContainer>
                <MenuItem eventKey={3.2}>التقارير</MenuItem>
                <LinkContainer to="/build/admin/settings">
                <MenuItem eventKey={3.3}>الإعدادات</MenuItem>
                </LinkContainer>
                <MenuItem divider />
                <LinkContainer to="/build/admin/users">
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
        <Route path="/build/admin" render={() => (
          isLoggedIn() ? (
            <Switch>
            <Route path="/build/admin/customers" render={pg_customer} />
            <Route path="/build/admin/cards" render={pg_card} />
            <Route path="/build/admin/addCustomer" render={pg_addCustomer} />
            <Route path="/build/admin/runners" render={pg_runner} />
            <Route path="/build/admin/runner/:id" render={cmp_runner} />
            <Route path="/build/admin/addRunner" render={pg_addRunner} />
            <Route path="/build/admin/sendCard" render={sendCard}/>
            <Route path="/build/admin/done" render={done}/>
            <Route path="/build/admin/queue" render={pg_queue}/>
            <Route path="/build/admin/transactions" render={home_header}/>
            <Route path="/build/admin/logs" render={Logs}/>
            <Route path="/build/admin/users" render={Users}/>
            <Route path="/build/admin/customer/:id" render={Customer} />
            <Route path="/build/admin/customertransaction/:id/:amount" render={CustomerTransaction} />
            <Route path="/build/admin/card/:id" render={Card} />
            <Route path="/build/admin/settings" render={Settings} />
            <Route path="/build/admin/addCard" />
            </Switch>
            
          ) : (
            // {pg_customer}
            <Redirect to="/build/login"/>
          )
        )}/>
        
        
        <Route path="/build/fasi" render={home_header} />
        <Route path="/build/login" component={Login} />
        {/* <Route path="/logout" component={Logout}/> */}
        <Route path="/build" component={Welcome}/>
        <Route path="*" render={alert404} />
        </Switch>

        <NotificationContainer/>
        
      </div>
    );
  }
}

export default App;
