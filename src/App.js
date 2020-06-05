import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from "react-table-v6";
import logo from './logo.svg';
import { makeData } from './Account';
import { makeCardData, makeDebtCardData, makeCreditCardData } from './CardAccount';
import { makeRunnerData } from './RunnerAccount';
import { Badge,Nav,Navbar,NavDropdown,Button,Table,Alert,Modal,Tab,Tabs,Spinner,Container,Col,Row,Card as Card2 } from 'react-bootstrap';
import { Link, Route,Switch,Redirect} from 'react-router-dom';
import Welcome from './welcome';
import Login from './Login';
import { LinkContainer } from 'react-router-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Toggle from "react-toggle-component";
import {Chart, Axis, Tooltip, Geom, Legend} from "bizcharts";
import { PieChart } from 'react-minimal-pie-chart';
import PrintProvider, { Print } from 'react-easy-print';
import matchSorter from 'match-sorter';
import print from 'print-js'
import {enable as enableDarkMode,disable as disableDarkMode,} from 'darkreader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync,faLightbulb } from '@fortawesome/free-solid-svg-icons';
import CountUp from 'react-countup';
import { progressBarFetch, setOriginalFetch, ProgressBar } from 'react-fetch-progressbar';
import packageJson from '../package.json';
import './App.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table-v6/react-table.css'
import "react-toggle-component/styles.css";

const url = ''+process.env.REACT_APP_SERVER_URL+'/';

setOriginalFetch(window.fetch);
window.fetch = progressBarFetch;

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

var tablerows = 10;

const onPageSizeChange = function(newSize){
  tablerows = newSize;
  localStorage.setItem('tablerows',tablerows);
}

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._runnerUser = React.createRef();
    this._formToPrint = React.createRef();
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
      debtcard:{
        data: [],
        pages: null,
        loading: true
      },
      creditcard:{
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
      deposit:{
        data: [],
        pages: null,
        loading: true
      },
      vdeposit:{
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
    bank: {
      data: []
    },
    bankEdit:{
      id: '0',
      name: '',
      fee: '0'
    },
      show: true,
      cardRow: <tr></tr>,
      selection: [],
      selectAll: false,
      selectedRunner: '',
      selectedBank: '',
      selectedBankName: null,
      showModal: false,
      showModalto: false,
      submitIsDisabled: false,
      runnerUser : "",
      housefee : '',
      date: '',
      redirect: false,
      redirectTo: "",
      bankChecked: false,
      darkreader: false,
      tablerows : 10,
      users: [],
      showChangePasswordModal: false,
      isLoggedIn: false
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
    this.fetchDepositsData = this.fetchDepositsData.bind(this);
    this.verifyDeposit = this.verifyDeposit.bind(this);
    this.fetchVDepositsData = this.fetchVDepositsData.bind(this);
    this.fetchBankData = this.fetchBankData.bind(this);
    this.handleAddBank = this.handleAddBank.bind(this);
    this.handleBankFeeChange = this.handleBankFeeChange.bind(this);
    this.fetchBankById = this.fetchBankById.bind(this);
    this.handleBankEditSubmit = this.handleBankEditSubmit.bind(this);
    this.handleSelectBankChange = this.handleSelectBankChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.darkreaderToggle = this.darkreaderToggle.bind(this);
    this.getDarkModeStatus = this.getDarkModeStatus.bind(this);
    this.fetchDebtCardData = this.fetchDebtCardData.bind(this);
    this.getTableRowsStatus = this.getTableRowsStatus.bind(this);
    this.logout = this.logout.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.openChangePasswordModal = this.openChangePasswordModal.bind(this);
    this.closeChangePasswordModal = this.closeChangePasswordModal.bind(this);
    this.fetchCreditCardData = this.fetchCreditCardData.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  isLoggedIn(){
    setTimeout(() => {
      fetch(url+'test',{
        method:'POST'
      })
      .then(res =>{
        this.setState({isLoggedIn:res.status===200?true:false});
      })
    }, 500);
  }

  stopLoading(){
    setTimeout(() => {
      let state = this.state;
      state.loading = false;
      this.setState(state);
    }, 200);
  }

  startLoading(){
    let state = this.state;
    state.loading = true;
    this.setState(state);
  }

  fetchCreditCardData(){
    makeCreditCardData()
      .then(res => {
        let data = res;
        this.setState({creditcard:{data}});
      });
  }

  closeChangePasswordModal(){
    this.setState({showChangePasswordModal: false});
  }

  openChangePasswordModal(){
    let state = this.state;
    state.showChangePasswordModal = true;
    this.setState(state);
  }

  handleChangePassword(e){
    e.preventDefault();
    var form = new FormData();
    form.append('username',e.target.username.value);
    form.append('id',e.target.id.value);
    form.append('password',e.target.password.value);
    form.append('password_confirmation',e.target.password_confirmation.value);
    fetch(url+'password',{
      method:'POST',
      body: form
    })
    .then(res=>{
      if(res.status===200){
        NotificationManager.success('تم تغيير كلمة المرور','نجاح');
        this.closeChangePasswordModal();
      }else{
        NotificationManager.error('لم يتم تغيير كلمة المرور','فشل');
      }
    })
  }

  getUsers(){
    fetch(url+'users',{
      method: 'POST'
    })
    .then(res =>{
      if (res.status!==200){
        return null;
      }
      return res.json();
    })
    .then(res =>{
      var state = this.state;
      state.users = res;
      this.setState(state);
    })
  }

  logout(){
    var form = new FormData();
    form.append('logout',1);
    fetch(url+'logout',{
      method: 'POST',
      body: form
    })
    .then(res => {
      var cool = 0;
      res.status===200?cool=1:cool=0;
      localStorage.clear();
      sessionStorage.clear();
      if(cool===1){
        NotificationManager.success("تم تسجيل الخروج ", "نجاح");
        window.location.replace('/login');
      }else{
        NotificationManager.error("لم نتمكن من تسجيل الخروج عند الخادم, يرجى إغلاق المتصفح لإكمال تسجيل الخروج بدون العودة الى الخادم ", "فشل");
      }
    })
  }

  getTableRowsStatus(){
    if(localStorage.getItem('tablerows')!==null){
      tablerows = localStorage.getItem('tablerows')!==10?localStorage.getItem('tablerows'):10;
    }
  }

  getDarkModeStatus(){
    let state = this.state;
    if(localStorage.getItem('darkmode')!==null){
      state.darkreader = localStorage.getItem('darkmode')==="true"?true:localStorage.getItem('darkmode')==="false"?false:false;
      this.setState(state);
      if(this.state.darkreader){
        enableDarkMode({
          brightness: 100,
          contrast: 90,
          sepia: 10,
          })
        let state = this.state;
        state.darkreader = true;
        this.setState(state);
        localStorage.setItem('darkmode',state.darkreader);
      }else{
        disableDarkMode();
        let state = this.state;
        state.darkreader = false;
        this.setState(state);
        localStorage.setItem('darkmode',state.darkreader);
      }
    }
  }

  darkreaderToggle(){
    if(!this.state.darkreader){
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
        })
      let state = this.state;
      state.darkreader = true;
      this.setState(state);
      localStorage.setItem('darkmode',state.darkreader);
    }else{
      disableDarkMode();
      let state = this.state;
      state.darkreader = false;
      this.setState(state);
      localStorage.setItem('darkmode',state.darkreader);
    }
  }

   // fake authentication Promise
  authenticate(){
    return new Promise(resolve => setTimeout(resolve, 200))
  }

  handleSelectBankChange(e){
    this.setState({selectedBank:e.target.value,selectedBankName:e.target.text});
  }

  handleBankEditSubmit(e){
    e.preventDefault();
    NotificationManager.warning("يتم تعديل عمولة مصرف "+e.target.name.value,"الرجاء الإنتظار");
    ReactDOM.findDOMNode(this.submitTarget).setAttribute("disabled", "disabled");
    let form = new FormData(e.target);
    form.set('editBankFee','1');
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.text())
    .then(reso => {
      if(reso === "Success"){
        NotificationManager.success("تم تعديل عمولة المصرف ", "نجاح");
        this.render(<Redirect to="/admin/banks"/>);
        this.setState({redirect:true,redirectTo:"/admin/banks"})
        this.fetchBankData();
      }else{
        NotificationManager.error("فشل تعديل عمولة المصرف ","فشل");
        this.fetchBankData();
      }
    })
    //send new/old values to server
    //notify user
    //redirect
  }

  fetchBankById(id){
    let form = new FormData();
    form.set('getBank','1');
    form.set('id',id);
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(reso => {
      this.setState({bankEdit: {id:reso.id,name:reso.name,fee:reso.fee}});
      this.fetchBankData();
    });
  }

  handleBankFeeChange(e){
    let fee = e.target.value;
    this.setState({bankEdit:{fee:fee}});
  }

  handleAddBank(event){
    event.preventDefault();
    ReactDOM.findDOMNode(this.submitTarget).setAttribute("disabled", "disabled");
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`
    data.set('addBank', 1);
    fetch(url, {
      method: 'POST',
      body: data,
    }).then(reso => {
      return reso.text();
    }).then(resa => {
      if(resa.toString().localeCompare("Success")===0){
        NotificationManager.success('تمت إضافة مصرف جديد','نجاح');
        window.location.replace('/admin/banks');
        this.fetchBankData();
      }
      else{
        NotificationManager.error('فشل في إضافة مصرف جديد','خطأ');
        this.fetchBankData();
      }
    });
  }

  fetchBankData(){
    var form = new FormData();
    form.set('banks',1);
    fetch(url,{
      method: 'POST',
      body: form
    }).then(res => res.json())
    .then(data => {
      this.setState({bank:{data}})
    })
  }

  fetchVDepositsData(){
    var form = new FormData();
    form.set('getVDeposits',1);

    fetch(url,{
      method: 'POST',
      body:form
    })
    .then(res => res.json())
    .then(reso => {
      this.setState({vdeposit:{data:reso}});
    })
  }

  verifyDeposit(row){
    if(window.confirm("متأكد من تأكيد هذا الإيداع؟")){
      NotificationManager.warning("يتم تأكيد الأيداع","الرجاء الإنتظار");
      var form = new FormData();
      form.set('verifyDeposit',1);
      form.set('deposit_id', row.row.id);

      fetch(url,{
        method: 'POST',
        body:form
      })
      .then(res => res.text())
      .then(reso => {
        if(reso === "Success"){
          NotificationManager.success("تم تأكيد الإيداع","نجاح");
          this.fetchDepositsData();
        }else{
          NotificationManager.error("لم يتم تأكيد الإيداع","خطأ");
        }
      })
    }

  }

  fetchDepositsData(){
    var form = new FormData();
    form.set('getDeposits4v',1);

    fetch(url,{
      method: 'POST',
      body:form
    })
    .then(res => res.json())
    .then(reso => {
      this.setState({deposit:{data:reso}});
    })
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
      if(reso === "Success"){
        this.closeto();
        NotificationManager.success("تم تسجيل سحب للزبون","نجاح");
        window.location.replace(`/admin/customertransaction/${id}/${amount}`);
      }
      else{
        this.closeto();
        NotificationManager.error("لم يتم تسجيل السحب للزبون","خطأ");
      }
    })
  }

  fetchLogData(){
    var form = new FormData();
    form.set('getLogs','1');
    fetch(url,{
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(data => {
      this.setState({log:{data}});
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
      if(resText === "Success"){
        NotificationManager.success("تم تغيير العمولة","نجاح");
        this.getfee();
        this.close();
      }
      else{
        NotificationManager.error("فشل تغيير العمولة","خطأ");
        this.close();
        this.getfee();
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
    .catch(err=>{
      // console.error("can't set house fee");
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
    form.set('bankFee',this.state.bankChecked);
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
    var form = new FormData();
    form.set('queues',1);
    fetch(url,{
      method: 'POST',
      body: form
    }).then(res => res.json())
    .then(data => {
      this.setState({queue:{data}})
    })
  }

  handleCheckbox(e){
    var id = e.target.value;
    if(e.target.checked){
    // console.log("ahhh");
    var oldstate = this.state.sendCard.selection || [];
    oldstate.push(id);
    this.setState({sendCard:{selection:{oldstate}}});
    }
    if(e.target.checked === false){
      // console.log("woooh");
      oldstate = this.state.sendCard.selection;
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

  handleSelectRunnerChange(e){
    this.setState({selectedRunner:e.target.value,selectedRunnerName:e.target.text});
  }

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
    // console.log(selectedRunner);
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
    .then(reso => {
      if(reso.toString().localeCompare("Success")===0){
        NotificationManager.success('تم إرسال البطاقة الى الساحب','نجاح');
        this.fetchCards4Send();
      }
      else{
        NotificationManager.error('فشل في إرسال البطاقة','خطأ');
        this.fetchCards4Send();
      }
    });
  }

  handleAddRunner(event){
    event.preventDefault();
    ReactDOM.findDOMNode(this.submitTarget).setAttribute("disabled", "disabled");
    const data = new FormData(event.target);
    // NOTE: you access FormData fields with `data.get(fieldName)`
    data.set('addRunner', 1);
    fetch(url, {
      method: 'POST',
      body: data,
    }).then(reso => {
      return reso.text();
    }).then(resa => {
      if(resa){
        switch(resa){
          case "Name Exists":
            NotificationManager.error("الإسم موجود من قبل","خطأ");
            ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
            break;

          case "Phone Exists":
            NotificationManager.error("رقم الهاتف موجود من قبل","خطأ");
            ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
            break;

          case "Failure":
          NotificationManager.error("فشل في إضافة ساحب جديد","خطأ");
          ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
          break;

          default:
            break;
        }
      }
      if(resa.toString().localeCompare("Failure")!==0){
        if(!isNaN(resa)){
          NotificationManager.success('تمت إضافة ساحب جديد','نجاح');
          // window.location.replace('/admin/runners');
          window.location.replace(`/admin/runner/${resa}`);
        }

        }
        else{
          NotificationManager.error('فشل في إضافة ساحب جديد','خطأ');
        }
    });
  }

  fetchRunnerById(id){
    this.setState({runner:{loading:true}});
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
    this.setState({runner:{loading:true}});
    makeRunnerData()
    .then(res => {
      let data = res;
      this.setState({runner:{data,loading:false}});
    });
  }

  getCustomerData(id) {
    this.setState({customer:{loading:true}});
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
    ReactDOM.findDOMNode(this.submitTarget).setAttribute("disabled", "disabled");
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
      if(resa){
        switch(resa){
          case "Name Exists":
            NotificationManager.error("الإسم موجود من قبل","خطأ");
            ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
            break;

          case "Phone Exists":
            NotificationManager.error("رقم الهاتف موجود من قبل","خطأ");
            ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
            break;

          default:
            if(!isNaN(resa)){
              NotificationManager.success("تمت إضافة حساب لزبون جديد","نجاح");
              window.location.replace(`/admin/customer/${resa}`);
            }

        }
        // console.log("validating response");
        if(!isNaN(resa)){
          // console.log("valid!");
          NotificationManager.success("تمت إضافة حساب لزبون جديد","نجاح");
          window.location.replace(`/admin/customer/${resa}`);
        }
          // NotificationManager.success("تمت إضافة حساب لزبون جديد","نجاح");
          // window.location.replace(`/admin/customer/${resa}`);
          // return(<Redirect to='/customers'/>);
          // this.setState({toCustomers:true});
          // this.props.history.push('/customers');
        }
        else{
          NotificationManager.error("لا يمكن إضافة الزبون","خطأ");
            ReactDOM.findDOMNode(this.submitTarget).removeAttribute("disabled");
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
      makeData()
      .then(res => {
        let data = res;
        this.setState({customer:{data}});
      });
  }

  fetchCardData(state, instance) {
    makeCardData()
      .then(res => {
        let data = res;
        this.setState({card:{data}});
      });
  }

  fetchDebtCardData(state, instance) {
    makeDebtCardData()
      .then(res => {
        let data = res;
        this.setState({debtcard:{data}});
      });
  }

  componentDidMount(){
    // setInterval(() => {
    //   this.isLoggedIn();
    // }, 4000);
    this.isLoggedIn();
    this.startLoading();
    this.getTableRowsStatus();
    this.getDarkModeStatus();
    this.fetchVDepositsData();
    this.fetchDepositsData();
    this.fetchLogData();
    this.fetchQueueData();
    this.fetchCustomerData();//fetchCardData
    this.fetchRunnerData();//fetchRunnerDatafetchCardData
    this.fetchCardData();//fetchRunnerDatafetchCardData
    this.fetchDebtCardData();
    this.fetchCreditCardData();
    this.getfee();//fetch house fee
    this.getUsers();
    this.fetchBankData();
    this.fetchCards4Send();
    this.authenticate().then(() => {
      const ele = document.getElementById('ipl-progress-indicator')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 200)
      }
    });
    this.stopLoading();
  }

  render() {

    const pg_customer = () => {
      const { data } = this.state.customer;
      const {loading} = this.state;
      return( <div>
        <Badge variant="secondary">
          <h5>الزبائن</h5>
        </Badge>
        <ReactTable
      columns={[
        {
          Header: 'الإشاري',
          accessor: 'id',
          id: 'id',
          sortMethod: (a, b) => {
            if (a === b) {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
            return parseInt(a) > parseInt(b) ? 1 : -1;
          },
          Cell: props => <span className='number'><Link to={`/admin/customer/${props.value}`}>{props.value}</Link></span>
        },
        {
          Header: 'الإسم',
          accessor: 'name', // String-based value accessors!
          filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name"] }),
          filterAll: true,
        }, {
          Header: 'عدد البطاقات',
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
          filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cards_id"] }),
          filterAll: true,
          Cell: props => <span className='number'>{props.value.map((cardid,index)=>(<span key={index}><Link to={`/admin/card/${cardid}`}>{cardid != null ? cardid : "0"}</Link> , </span>))}</span> // Custom cell components!
        }
        ]}
      defaultSorted={[
        {
          id: "id",
          desc: true
        }
      ]}
      className="-striped -highlight"
      data={data}
      //pages={pages} // Display the total number of pages
      loading={loading} // Display the loading overlay when we need it
      onFetchData={this.fetchCustomerData} // Request new data when things change
      noDataText="ﻻ توجد بيانات مطابقة !"
      loadingText={
                    <>
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="light" />
                    <Spinner animation="grow" variant="dark" />
                    </>
                    }
      showPaginationTop={true}
      nextText="التالي"
      previousText="السابق"
      rowsText="صفوف"
      pageText="صفحة"
      filterable
      minRows={3}
      pageSize={tablerows}
      onPageSizeChange={onPageSizeChange}
      />
      <Link to="/admin/addCustomer" className="btn btn-info">إضافة</Link>
      </div>
      )};

      const pg_card = () => {
        const { data } = this.state.card;
        const {loading} = this.state;
        return( <div>
          <Badge variant="secondary">
              <h5>البطاقات</h5>
            </Badge>
          <ReactTable
        columns={[
          {
            Header: 'الإشاري',
            accessor: 'id',
            sortMethod: (a, b) => {
              if (a === b) {
                return parseInt(a) > parseInt(b) ? 1 : -1;
              }
              return parseInt(a) > parseInt(b) ? 1 : -1;
            },
            Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
          },
          {
            Header: 'الإسم',
            accessor: 'owname', // String-based value accessors!
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
            filterAll: true,
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
          },
          {
            Header: 'العمولة',
            accessor: 'fee_type',
            id: 'fee_type',
            Cell: props => <span>{props.value != null ? (props.value.localeCompare("true")===0?"مصرف":"شركة") : "شركة"}</span>,
            filterMethod: (filter, row) => {
              if (filter.value === "all") {
                return true;
              }
              if (filter.value === "true") {
                return row[filter.id] === "true";
              }
              return row[filter.id] !== "true";
            },
            Filter: ({ filter, onChange }) =>
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}
              >
                <option value="all">الكل</option>
                <option value="true">مصرف(10الاف)</option>
                <option value="NULL">شركة(ارباب الاسر)</option>
              </select>
          }
          ]}
        data={data}
        //pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchCardData} // Request new data when things change
        noDataText="ﻻ توجد بيانات مطابقة !"
        loadingText={
                    <>
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="light" />
                    <Spinner animation="grow" variant="dark" />
                    </>
                    }
        showPaginationTop={true}
        nextText="التالي"
        previousText="السابق"
        rowsText="صفوف"
        pageText="صفحة"
        filterable
        minRows={3}
        pageSize={tablerows}
        onPageSizeChange={onPageSizeChange}
        className="-striped -highlight"
        ref={(r)=>this.cardTable=r}
        />
        <Button
        onClick={()=>print({printable: this.cardTable.getResolvedState().sortedData,
        properties: [
        { field: 'id', displayName: 'الأشاري'},
        { field: 'owname', displayName: 'الإسم'},
        { field: 'card_number', displayName: 'الرقم'},
        { field: 'card_code', displayName: 'الكود'},
        { field: 'type', displayName: 'النوع'},
        { field: 'exp', displayName: 'الصلاحية'},
        { field: 'state', displayName: 'الحالة'},
        { field: 'bank', displayName: 'المصرف'},
        { field: 'credit', displayName: 'الرصيد'},
        { field: 'drawn', displayName: 'المسحوب'},
        { field: 'avail', displayName: 'المتبقي'},
        { field: 'fee_type', displayName: 'العمولة'},
          ],
          header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3" dir="rtl">جميع البطاقات</h3>',
          style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
          Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
          type: 'json'})}>
          طباعة
          </Button>
        </div>)};

const pg_creditcard = () => {
  const { data } = this.state.creditcard;
  const {loading} = this.state;
  return( <div>
    <Badge variant="secondary">
        <h5>البطاقات التي لها ديون</h5>
      </Badge>
    <ReactTable
  columns={[
    {
      Header: 'الإشاري',
      accessor: 'id',
      sortMethod: (a, b) => {
        if (a === b) {
          return parseInt(a) > parseInt(b) ? 1 : -1;
        }
        return parseInt(a) > parseInt(b) ? 1 : -1;
      },
      Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
    },
    {
      Header: 'الإسم',
      accessor: 'owname', // String-based value accessors!
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
      filterAll: true,
    },
    {
      Header: 'الرقم',
      accessor: 'card_number'
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
      Header: 'الرصيد الفعلي',
      accessor: 'act_bal',
      id: 'act_bal'
    },
    {
      Header: 'المسحوب',
      accessor: 'drawn',
      id: 'drawn'
    },
    {
      Header: 'العمولة',
      accessor: 'fee_type',
      id: 'fee_type',
      Cell: props => <span>{props.value !== null ? (props.value.localeCompare("true")===0?"مصرف":"شركة") : "شركة"}</span>,
      filterMethod: (filter, row) => {
        if (filter.value === "all") {
          return true;
        }
        if (filter.value === "true") {
          return row[filter.id] === "true";
        }
        return row[filter.id] !== "true";
      },
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "all"}
        >
          <option value="all">الكل</option>
          <option value="true">مصرف(10الاف)</option>
          <option value="NULL">شركة(ارباب الاسر)</option>
        </select>
    }
    ]}
  data={data}
  //pages={pages} // Display the total number of pages
  loading={loading} // Display the loading overlay when we need it
  onFetchData={this.fetchCreditCardData} // Request new data when things change
  noDataText="ﻻ توجد بيانات مطابقة !"
  loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
  showPaginationTop={true}
  nextText="التالي"
  previousText="السابق"
  rowsText="صفوف"
  pageText="صفحة"
  filterable
  minRows={3}
  pageSize={tablerows}
  onPageSizeChange={onPageSizeChange}
  style={{
    height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
  }}
  className="-striped -highlight"
  ref={(r)=>this.debtCardTable=r}
  />
  <Button
  onClick={()=>print({printable: this.debtCardTable.getResolvedState().sortedData,
  properties: [
  { field: 'id', displayName: 'الأشاري'},
  { field: 'owname', displayName: 'الإسم'},
  { field: 'card_number', displayName: 'الرقم'},
  { field: 'card_code', displayName: 'الكود'},
  { field: 'type', displayName: 'النوع'},
  { field: 'exp', displayName: 'الصلاحية'},
  { field: 'state', displayName: 'الحالة'},
  { field: 'bank', displayName: 'المصرف'},
  { field: 'credit', displayName: 'الرصيد'},
  { field: 'drawn', displayName: 'المسحوب'},
  { field: 'avail', displayName: 'المتبقي'},
  { field: 'fee_type', displayName: 'العمولة'},
    ],
    header: '<h1 class="custom-h1">منظومة البطاقات</h1><h3 class="custom-h3" dir="rtl">البطاقات التي لها ديون</h3>',
    style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
    Footer: '<h1 class="custom-h1">منظومة البطاقات</h1>',
    type: 'json'})}>
    طباعة
    </Button>
  </div>)};

const pg_debtcard = () => {
  const { data } = this.state.debtcard;
  const {loading} = this.state;
  return( <div>
    <Badge variant="secondary">
        <h5>البطاقات التي عليها ديون</h5>
      </Badge>
    <ReactTable
  columns={[
    {
      Header: 'الإشاري',
      accessor: 'id',
      sortMethod: (a, b) => {
        if (a === b) {
          return parseInt(a) > parseInt(b) ? 1 : -1;
        }
        return parseInt(a) > parseInt(b) ? 1 : -1;
      },
      Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
    },
    {
      Header: 'الإسم',
      accessor: 'owname', // String-based value accessors!
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
      filterAll: true,
    },
    {
      Header: 'الرقم',
      accessor: 'card_number'
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
      Header: 'الرصيد الفعلي',
      accessor: 'act_bal',
      id: 'act_bal'
    },
    {
      Header: 'المسحوب',
      accessor: 'drawn',
      id: 'drawn'
    },
    {
      Header: 'العمولة',
      accessor: 'fee_type',
      id: 'fee_type',
      Cell: props => <span>{props.value !== null ? (props.value.localeCompare("true")===0?"مصرف":"شركة") : "شركة"}</span>,
      filterMethod: (filter, row) => {
        if (filter.value === "all") {
          return true;
        }
        if (filter.value === "true") {
          return row[filter.id] === "true";
        }
        return row[filter.id] !== "true";
      },
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "all"}
        >
          <option value="all">الكل</option>
          <option value="true">مصرف(10الاف)</option>
          <option value="NULL">شركة(ارباب الاسر)</option>
        </select>
    }
    ]}
  data={data}
  //pages={pages} // Display the total number of pages
  loading={loading} // Display the loading overlay when we need it
  onFetchData={this.fetchDebtCardData} // Request new data when things change
  noDataText="ﻻ توجد بيانات مطابقة !"
  loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
  showPaginationTop={true}
  nextText="التالي"
  previousText="السابق"
  rowsText="صفوف"
  pageText="صفحة"
  filterable
  minRows={3}
  pageSize={tablerows}
  onPageSizeChange={onPageSizeChange}
  style={{
    height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
  }}
  className="-striped -highlight"
  ref={(r)=>this.debtCardTable=r}
  />
  <Button
  onClick={()=>print({printable: this.debtCardTable.getResolvedState().sortedData,
  properties: [
  { field: 'id', displayName: 'الأشاري'},
  { field: 'owname', displayName: 'الإسم'},
  { field: 'card_number', displayName: 'الرقم'},
  { field: 'card_code', displayName: 'الكود'},
  { field: 'type', displayName: 'النوع'},
  { field: 'exp', displayName: 'الصلاحية'},
  { field: 'state', displayName: 'الحالة'},
  { field: 'bank', displayName: 'المصرف'},
  { field: 'credit', displayName: 'الرصيد'},
  { field: 'drawn', displayName: 'المسحوب'},
  { field: 'avail', displayName: 'المتبقي'},
  { field: 'fee_type', displayName: 'العمولة'},
    ],
    header: '<h1 class="custom-h1">منظومة البطاقات</h1><h3 class="custom-h3" dir="rtl">البطاقات التي عليها ديون</h3>',
    style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
    Footer: '<h1 class="custom-h1">منظومة البطاقات</h1>',
    type: 'json'})}>
    طباعة
    </Button>
  </div>)};

        const pg_queue = () => {
          const { data } = this.state.queue;
          const {loading} = this.state;
          return( <div>
            <Badge variant="secondary">
              <h5>بطاقات فالإنتظار</h5>
            </Badge>
            <ReactTable
              columns={[
                {
                  Header: 'الإشاري',
                  accessor: 'id',
                  sortMethod: (a, b) => {
                    if (a === b) {
                      return parseInt(a) > parseInt(b) ? 1 : -1;
                    }
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                  },
                },
                {
                  Header: 'إشاري البطاقة',
                  accessor: 'card_id',
                  Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                },
                {
                  Header: 'إشاري الساحب',
                  accessor: 'runner_id', // String-based value accessors!
                  Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                },
                {
                  Header: 'فاعل؟',
                  accessor: 'valid',
                  Cell: props => <span>{props.value=1?"نعم":"ﻻ"}</span>
                },
                {
                  Header: 'تاريخ الإضافة',
                  accessor: 'created',
                  filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["created"] }),
                  filterAll: true,
                }
                ]}
              data={data}
              //pages={pages} // Display the total number of pages
              loading={loading} // Display the loading overlay when we need it
              onFetchData={this.fetchQueueData} // Request new data when things change
              noDataText="ﻻ توجد بيانات مطابقة !"
              loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
              showPaginationTop={true}
              nextText="التالي"
              previousText="السابق"
              rowsText="صفوف"
              pageText="صفحة"
              filterable
              minRows={3}
              pageSize={tablerows}
              onPageSizeChange={onPageSizeChange}
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
                <tr><td>رقم الهاتف</td><td><input type="number" name="phone" pattern="\d*" maxLength="18" title="رقم هاتف صاحب الحساب" required/></td></tr>
                <tr><td></td><td>
                <Button ref={button => {this.submitTarget=button;}} type="submit">قدّم</Button>
                </td></tr>
              </tbody>
            </Table>
          </form>
          );
        };

        class Custo extends React.Component {
          constructor(props, context) {
            super(props, context);
            this.state = {
              customer: {
                data: [],
                data2: [],
                pages: null,
                loading: true,
                tot_bal: 0,
              },
              card:{
                data: [],
                pages: null,
                loading: true
              },
            bank: {
              data: []
            },
            bankEdit:{
              id: '0',
              name: '',
              fee: '0'
            },
              show: true,
              cardRow: <tr></tr>,
              selection: [],
              selectAll: false,
              selectedRunner: '',
              selectedBank: '',
              selectedBankName: null,
              showModal: false,
              showModalto: false,
              showModaltree: false,
              showModalfoor: false,
              showModalfive: false,
              submitIsDisabled: false,
              runnerUser : "",
              housefee : '',
              date: '',
              redirect: false,
              redirectTo: "",
              bankChecked: false,
              card4RecCust: [],
              customerUserExist: null,
              customerUser: null
            };
            this.getTarget = this.getTarget.bind(this);
            this.getSubmitTarget = this.getSubmitTarget.bind(this);
            this.handleToggle = this.handleToggle.bind(this);
            this.getCardData = this.getCardData.bind(this);
            this.getCustomerData = this.getCustomerData.bind(this);
            this.open = this.open.bind(this);
            this.close = this.close.bind(this);
            this.opento = this.opento.bind(this);
            this.closeto = this.closeto.bind(this);
            this.opentree = this.opentree.bind(this);
            this.closetree = this.closetree.bind(this);
            this.openfoor = this.openfoor.bind(this);
            this.closefoor = this.closefoor.bind(this);
            this.openfive = this.openfive.bind(this);
            this.closefive = this.closefive.bind(this);
            this.handleAddCard = this.handleAddCard.bind(this);
            this.handleCustomerWithdraw = this.handleCustomerWithdraw.bind(this);
            this.getDate = this.getDate.bind(this);
            this.fetchBankData = this.fetchBankData.bind(this);
            this.handleSelectBankChange = this.handleSelectBankChange.bind(this);
            this.handleCustomerReceiveCard = this.handleCustomerReceiveCard.bind(this);
            this.fetchcard4RecCust = this.fetchcard4RecCust.bind(this);
            this.handleAddCustomerUser = this.handleAddCustomerUser.bind(this);
            this.checkCustomerUser = this.checkCustomerUser.bind(this);
            this.getCustomerUser = this.getCustomerUser.bind(this);
            this.handleChangeCustomerPass = this.handleChangeCustomerPass.bind(this);
            this.handleEditCustomer = this.handleEditCustomer.bind(this);
          }

          handleEditCustomer(e){
            e.preventDefault();
            const { id } = this.props.match.params;
            ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
            // this.setState({submitIsDisabled:true});
            // e.currentTarget.classList.add("disabled");
            NotificationManager.warning("يتم تعديل الزبون","الرجاء الإنتظار");
            const form = new FormData(e.target);
            form.append('editCustomer',1);
            fetch(url,{
              method:'POST',
              body:form
            })
            .then(res => res.text())
            .then(textRes => {
              if(textRes === "Success"){
                this.closefive();
                NotificationManager.success("تم تعديل الزبون بنجاح","نجاح");
                this.getCustomerData(id);
              }else{
                this.closefive();
                NotificationManager.error("ﻻ يمكن تعديل الزبون","خطأ");
                // this.setState({submitIsDisabled:false});
              }
            })
          }

          handleChangeCustomerPass(e){
            e.preventDefault();
            NotificationManager.warning("يتم تغيير كلمة سر للزبون","الرجاء الإنتظار");
            const form = new FormData(e.target);
            form.set('changeCustomerPass',1);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Success"){
                NotificationManager.success("تم تغيير كلمة سر للزبون","نجاح");
                this.closefoor();
              }
              else{
                NotificationManager.error("فشل تغيير كلمة سر للزبون","خطأ");
                this.closefoor();
              }
            });
          }

          getCustomerUser(){
            const { id } = this.props.match.params;
            var form = new FormData();
            form.append("getCustomerUser",1);
            form.append("customer_id",id);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Doesn't Exists"){
                this.setState({customerUser:null});
              }
              else{
                this.setState({customerUser:resText});
              }
            });
          }

          checkCustomerUser(){
            const { id } = this.props.match.params;
            var form = new FormData();
            form.append("checkCustomerUser",1);
            form.append("customer_id",id);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Doesn't Exists"){
                this.setState({customerUserExist:false});
              }
              else if(resText === "Exists"){
                this.setState({customerUserExist:true});
              }
              else{

              }
            });
          }

          handleAddCustomerUser(e){
            e.preventDefault();
            NotificationManager.warning("تتم إضافة معرف دخول للزبون","الرجاء الإنتظار");
            const form = new FormData(e.target);
            form.set('addCustomerUser',1);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Success"){
                NotificationManager.success("تمت إضافة معرف الدخول للزبون","نجاح");
                this.closefoor();
              }
              else if(resText === "Exists"){
                NotificationManager.error("معرف الدخول للزبون موجود من قبل, أعد المحاولة","خطأ");
              }
              else{
                NotificationManager.error("فشل إضافة معرف الدخول للزبون","خطأ");
                this.closefoor();
              }
              this.componentDidMount();
            });
          }

          fetchcard4RecCust(cuid){
            var formData = new FormData();
            formData.append('card4RecCust', '1');
            formData.append('customer_id',cuid);

            fetch(url,{
              method: 'POST',
              body: formData
              })
              .then(res => res.json())
              .then(data => {
                this.setState({card4RecCust:data});
              })
          }

          handleSelectBankChange(e){
            this.setState({selectedBank:e.target.value,selectedBankName:e.target.text});
          }

          fetchBankData(){
            var form = new FormData();
            form.set('banks',1);
            fetch(url,{
              method: 'POST',
              body: form
            }).then(res => res.json())
            .then(data => {
              this.setState({bank:{data}})
            })
          }

          getDate(){
            fetch(url+'?getDate').then(res => res.text()).then(reso => {this.setState({date:reso})});
          }

          handleCustomerReceiveCard(e){
            e.preventDefault();
            ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
            NotificationManager.warning("يتم تسجيل تسليم بطاقة للزبون","أرجوا الإنتظار");
            // let id = e.target.customer_id.value;
            var form = new FormData(e.target);
            form.set('customerReceive','1');
            fetch(url,{
              method: 'POST',
              body:form
            })
            .then(res => res.text())
            .then(reso => {
              if(reso === "Success"){
                this.closetree();
                NotificationManager.success("تم تسجيل تسليم بطاقة للزبون","نجاح");
              }
              else{
                this.closetree();
                NotificationManager.error("لم يتم تسجيل السحب للزبون","خطأ");
              }
            })
          }

          handleCustomerWithdraw(e){
            e.preventDefault();
            ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
            NotificationManager.warning("يتم تسجيل سحب للزبون","أرجوا الإنتظار");
            let id = e.target.customer_id.value;
            let amount = e.target.amount.value;
            let caid = e.target.card_id.value;
            var form = new FormData(e.target);
            form.set('customerWithdraw','1');
            fetch(url,{
              method: 'POST',
              body:form
            })
            .then(res => res.text())
            .then(reso => {
              if(reso === "Success"){
                this.closeto();
                NotificationManager.success("تم تسجيل سحب للزبون","نجاح");
                window.location.replace(`/admin/customertransaction/${id}/${amount}/${caid}`);
              }
              else{
                this.closeto();
                NotificationManager.error("لم يتم تسجيل السحب للزبون","خطأ");
              }
            })
          }

          handleAddCard(e){
            e.preventDefault();
            const { id } = this.props.match.params;
            ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
            // this.setState({submitIsDisabled:true});
            // e.currentTarget.classList.add("disabled");
            NotificationManager.warning("تتم إضافة البطاقة","الرجاء الإنتظار");
            let banke = e.target.bank_id.options[e.target.bank_id.selectedIndex].text;
            const form = new FormData(e.target);
            form.set('addCard',1);
            form.set('bankFee',this.state.bankChecked);
            form.set('bank',banke);
            fetch(url,{
              method:'POST',
              body:form
            })
            .then(res => res.text())
            .then(textRes => {
              if(textRes === "Success"){
                this.close();
                NotificationManager.success("تمت إضافة البطاقة بنجاح","نجاح");
                this.getCustomerData(id);
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

          closetree(){
            this.setState({showModaltree: false});
          }

          opentree(){
            this.setState({showModaltree: true});
          }

          closefoor(){
            this.setState({showModalfoor: false});
          }

          openfoor(){
            this.setState({showModalfoor: true});
          }

          closefive(){
            this.setState({showModalfive: false});
          }

          openfive(){
            this.setState({showModalfive: true});
          }

          getCustomerData(id) {
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
                var tot_bal = 0.0 ;
                data2.map((row,index)=>{
                  if(!isNaN(row.act_bal) && row.act_bal!==null)
                  {
                    tot_bal = parseFloat(tot_bal)+parseFloat(row.act_bal);
                  }
                  return 0;
                });
                this.setState({customer:{data,data2,loading:false,tot_bal}});
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

          componentDidMount(){
            const { id } = this.props.match.params;
            this.fetchcard4RecCust(id);
            this.getCustomerData(id);
            this.fetchBankData();
            this.checkCustomerUser();
            this.getCustomerUser();
          }
          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }
          render(){
            const { data , data2 , loading , tot_bal } = this.state.customer;
            const  banks  = this.state.bank.data;
            const { id } = this.props.match.params;
            var last_customer=[];

            function humanizeWhereis(raw){
              switch(raw){
                case "Runner":
                  raw="لدى الساحب";
                  break;
                case "Company":
                  raw="لدى الشركة";
                  break;
                case "Customer":
                  raw="لدى الزبون";
                  break;
                case "Queue":
                  raw="فالطريق";
                  break;
                default:
                  break;
              }
              return raw;
            }

            try{
              var customer;
              // if(typeof(data[0]) !== 'undefined'){
              customer = data.map((customer,index) => {
                last_customer=customer;
                return(
                  <Table ref={table => {this.addTable=table;}} key={index} responsive dir="rtl">
                    <tbody>
                      <tr><td>الإشاري:</td><td>{customer.id}</td></tr>
                      <tr><td>الإسم:</td><td>{customer.name}</td></tr>
                      <tr><td>الهاتف:</td><td>{customer.phone}</td></tr>
                      <tr><td>عددالبطاقات:</td><td>{customer.cards}</td></tr>
                      <tr><td>إجمالي التسليمات:</td><td>{customer.tots_withdrawn}</td></tr>
                      <tr><td>إجمالي الأرصدة:</td><td>{tot_bal}</td></tr>
                      <tr><td>تاريخ التسجيل :</td><td>{customer.created}</td></tr>
                    </tbody>
                  </Table>
                )});

                var card4RecCust = this.state.card4RecCust.map((card,index) => {
                  return(
                      <option key={"card4w"+index} value={card.id}>{card.id}-{card.owname}-{card.bank}({card.act_bal})</option>
                  )
                })

                var cards4withdraw = data2.map((card,index) => {
                  return(
                      <option key={"card4w"+index} value={card.id}>{card.id}-{card.owname}-{card.bank}({card.act_bal})</option>
                  )
                })

                var banks4cards = banks.map((bank,index) => {
                  return(
                      <option key={"bank4crds"+index} value={bank.id}>{bank.name}</option>
                  )
                })

            }
            catch(error){
              // console.error(error);
            }

            finally{
            return(
            <div>
              <Badge variant="secondary"><h3>ملف الزبون {id}</h3></Badge>
              {customer}
              <ReactTable
                className="-striped -highlight"
                onFetchData={() => this.getCustomerData(id)} // getcardata needs id for its for 1 but fetchcardata iz 4 all
                noDataText="ﻻ توجد بيانات مطابقة !"
                loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                showPaginationTop={true}
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
                      sortMethod: (a, b) => {
                        if (a === b) {
                          return parseInt(a) > parseInt(b) ? 1 : -1;
                        }
                        return parseInt(a) > parseInt(b) ? 1 : -1;
                      },
                      Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                    },
                    {
                      id : 'owname',
                      Header : 'إسم صاحب البطاقة',
                      accessor : 'owname',
                      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
                      filterAll: true,
                    },{
                      id : 'act_bal',
                      Header : 'الرصيد الفعلي',
                      accessor : 'act_bal'
                    },{
                      id : 'tot_withdrawn',
                      Header : 'إجمالي المستلم',
                      accessor : 'tot_withdrawn'
                    },{
                      id : 'whereis',
                      Header : 'مكان البطاقة',
                      accessor : 'whereis',
                      Cell: props => <span>{humanizeWhereis(props.value)}</span>
                    },{
                      id : 'state',
                      Header : 'حالة البطاقة',
                      accessor : 'state'
                    }
                  ]
                }
                data = {data2}/>
                <Button variant="link" onClick={this.open}>إضافة بطاقة</Button>
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
                      <Table>
                        <tbody>
                          <tr><td><input name="customer_id" type="text" defaultValue={id} readOnly required/></td></tr>
                          <tr><td><input name="owname" type="text" placeholder="إسم مالك البطاقة" required/></td></tr>
                          <tr><td><input name="card_number" type="text" pattern="\d*" maxLength="8" placeholder="رقم البطاقة" required/></td></tr>
                          <tr><td><input name="card_code" type="text" pattern="\d*" maxLength="4" placeholder="كود البطاقة" required/></td></tr>
                          <tr><td><input name="type" type="text" placeholder="النوع" required/></td></tr>
                          <tr><td>
                            <select name="bank_id" required>
                              {banks4cards}
                            </select>
                          </td></tr>
                          <tr><td><input name="exp" type="text" placeholder="الصلاحية" required/></td></tr>
                          <tr><td><input name="state" type="text" placeholder="الحاله" required/></td></tr>
                          <tr><td><input type="text" name="credit" pattern="\d*" maxLength="18" placeholder="الرصيد" required/></td></tr>
                          <tr><td><input type="text" name="drawn" pattern="\d*" maxLength="18" placeholder="المسحوب منه" required/></td></tr>
                          <tr><td><Toggle label="عمولة المصرف" checked={this.state.bankChecked} onToggle={value => this.setState({bankChecked:value})} /></td></tr>
                        </tbody>
                      </Table>
                      <br/>
                      <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                    </form>
                    {/* <ModalExample/> */}
                  </div>
                </Modal>
                {' '}
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
                      <input name="customer_id" type="text" defaultValue={id} readOnly required/>
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
                {' '}
                <Button className="btn btn-success" onClick={this.opentree}>تسليم البطاقة</Button>
                <Modal
                  aria-labelledby='modal-label'
                  style={modalStyle}
                  backdropStyle={backdropStyle}
                  show={this.state.showModaltree}
                  onHide={this.closetree}
                  dir="rtl"
                >
                  <div style={dialogStyle()} >
                    <h4 id='modal-label'>تسليم البطاقة</h4>
                    <form onSubmit={this.handleCustomerReceiveCard}>
                      <input name="customer_id" type="text" defaultValue={id} readOnly required/>
                      <select name="card_id" required>
                        {card4RecCust}
                      </select>
                      <Badge variant="secondary">يمكن فقط تسليم بطاقة توجد لدى الشركة</Badge>
                      <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                    </form>
                    {/* <ModalExample/> */}
                  </div>
                </Modal>
                {' '}
                <Button className="btn btn-warning" onClick={this.openfive}>تعديل</Button>
                <Modal
                  aria-labelledby='modal-label'
                  style={modalStyle}
                  backdropStyle={backdropStyle}
                  show={this.state.showModalfive}
                  onHide={this.closefive}
                  dir="rtl"
                >
                  <div style={dialogStyle()} >
                    <h4 id='modal-label'>تعديل ملف زبون</h4>
                    <form onSubmit={this.handleEditCustomer}>
                    <Table>
                      <tbody>
                        <tr><td><input name="customer_id" type="text" defaultValue={this.props.match.params.id} readOnly required/></td></tr>
                        <tr><td><input name="name" type="text" defaultValue={last_customer.name} placeholder="الإسم" required/></td></tr>
                        <tr><td><input name="phone" type="text" defaultValue={last_customer.phone} pattern="\d*" maxLength="18" placeholder="رقم الهاتف" required/></td></tr>
                        </tbody>
                    </Table>
                    <br/>
                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                  </form>
                    {/* <ModalExample/> */}
                  </div>
                </Modal>
                {' '}
                {this.state.customerUserExist===true?
                  (<div><Button className="btn btn-info" onClick={this.openfoor}>تغيير كلمة المرور</Button>
                  <Modal
                    aria-labelledby='modal-label'
                    style={modalStyle}
                    backdropStyle={backdropStyle}
                    show={this.state.showModalfoor}
                    onHide={this.closefoor}
                    dir="rtl"
                  >
                    <div style={dialogStyle()} >
                      <h4 id='modal-label'>تغيير كلمة المرور</h4>
                      <form onSubmit={this.handleChangeCustomerPass}>
                        <input name="customer_id" type="text" defaultValue={this.props.match.params.id} readOnly required/>
                        <input name="username" type="text" defaultValue={this.state.customerUser} placeholder="إسم المستخدم" readOnly required/>
                        <input type="text" name="password" placeholder="كلمة المرور الجديدة" required/>
                        <Badge variant="secondary">للإستعمال على تطبيق الهواتف الذكية</Badge>
                        <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                      </form>
                      {/* <ModalExample/> */}
                    </div>
                  </Modal></div>)

                  :
                  this.state.customerUserExist===false?(<div>
                    <Button className="btn btn-info" onClick={this.openfoor}>إضافة معرف دخول</Button>
                    <Modal
                      aria-labelledby='modal-label'
                      style={modalStyle}
                      backdropStyle={backdropStyle}
                      show={this.state.showModalfoor}
                      onHide={this.closefoor}
                      dir="rtl"
                    >
                      <div style={dialogStyle()} >
                        <h4 id='modal-label'>إضافة معرف دخول</h4>
                        <form onSubmit={this.handleAddCustomerUser}>
                          <input name="customer_id" type="text" defaultValue={this.props.match.params.id} readOnly required/>
                          <input ref={ref => this._customerUser=ref} name="username" type="text" placeholder="إسم المستخدم" required/>
                          <input type="text" name="password" placeholder="كلمة المرور" required/>
                          <Badge variant="secondary">للإستعمال على تطبيق الهواتف الذكية</Badge>
                          <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                        </form>
                        {/* <ModalExample/> */}
                      </div>
                    </Modal>
                  </div>):(<div></div>)}

                <Button onClick={() => window.print()}>طباعة</Button>
            </div>
            );}
          }
        }

          class Card extends React.Component {
            constructor(props, context) {
              super(props, context);
              // this._runnerUser = React.createRef();
              this.state = {
                card:{
                  data:[],
                  pages:null,
                  loading:true
                },
                bank: {
                  data: []
                },
                showModal: false,
                bankChecked: false,
                updatedBankCheck:false
              }
              //this.open = this.open.bind(this);
              //this.close = this.close.bind(this);
              //this.handleRunnerUserChange = this.handleRunnerUserChange.bind(this);
              //this.handleAddRunnerUser = this.handleAddRunnerUser.bind(this);
              //this.fetchRunnerById = this.fetchRunnerById.bind(this);
              this.getCardData = this.getCardData.bind(this);
              this.open = this.open.bind(this);
              this.close = this.close.bind(this);
              this.fetchBankData = this.fetchBankData.bind(this);
              this.handleEditCard = this.handleEditCard.bind(this);
              this.updateStateForEdit = this.updateStateForEdit.bind(this);
            }

            updateStateForEdit(checked){
              checked = checked==="true"?true:false;
              if(this.state.bankChecked!==checked && this.state.updatedBankCheck===false){
                this.setState({bankChecked:checked});
                this.setState({updatedBankCheck:true})
              }
            }

            handleEditCard(e){
              e.preventDefault();
              const { id } = this.props.match.params;
              ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
              // this.setState({submitIsDisabled:true});
              // e.currentTarget.classList.add("disabled");
              NotificationManager.warning("يتم تعديل البطاقة","الرجاء الإنتظار");
              let banke = e.target.bank_id.options[e.target.bank_id.selectedIndex].text;
              const form = new FormData(e.target);
              form.append('editCard',1);
              form.append('bankFee',this.state.bankChecked);
              form.append('bank',banke);
              fetch(url,{
                method:'POST',
                body:form
              })
              .then(res => res.text())
              .then(textRes => {
                if(textRes === "Success"){
                  this.close();
                  NotificationManager.success("تم تعديل البطاقة بنجاح","نجاح");
                  this.getCardData(id);
                }else{
                  this.close();
                  NotificationManager.error("ﻻ يمكن تعديل البطاقة","خطأ");
                  // this.setState({submitIsDisabled:false});
                }
              })
            }

            fetchBankData(){
              var form = new FormData();
              form.set('banks',1);
              fetch(url,{
                method: 'POST',
                body: form
              }).then(res => res.json())
              .then(data => {
                this.setState({bank:{data}})
              })
            }

            close(){
              this.setState({showModal: false});
            }

            open(){
              this.setState({showModal: true});
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
            componentDidMount(){
              const { id } = this.props.match.params;
              this.getCardData(id);
              this.fetchBankData();
            }

            componentWillUnmount() {
              // fix Warning: Can't perform a React state update on an unmounted component
              this.setState = (state,callback)=>{
                  return;
              };
            }

            render(){
              const {data} = this.state.card;
              const banks = this.state.bank.data;

              function humanizeWhereis(raw){
                switch(raw){
                  case "Runner":
                    raw="لدى الساحب";
                    break;
                  case "Company":
                    raw="لدى الشركة";
                    break;
                  case "Customer":
                    raw="لدى الزبون";
                    break;
                  case "Queue":
                    raw="فالطريق";
                    break;
                  default:
                    break;
                }
                return raw;
              }
                //setInterval(this.getCardData(id),300);
                // setTimeout(() => (this.getCardData(id),300));
                var card=data;
                const cards =  (
                  <div>
                  <Table striped bordered hover responsive dir="rtl">
                    <tbody>
                      <tr><td>الإشاري:</td><td>{card.id}</td></tr>
                      <tr><td>إسم و رقم حساب الزبون:</td><td>{card.account_name},<Link to={`/admin/customer/${card.account_id}`}>{card.account_id}</Link></td></tr>
                      <tr><td>إسم و رقم الساحب (إذا كانت لدى ساحب):</td><td>{card.runner_name},<Link to={`/admin/runner/${card.runner_id}`}>{card.runner_id}</Link></td></tr>
                      <tr><td>الإسم:</td><td>{card.owname}</td></tr>
                      <tr><td>النوع:</td><td>{card.type}</td></tr>
                      <tr><td>المصرف:</td><td>{card.bank}</td></tr>
                      <tr><td>الصلاحية:</td><td>{card.exp}</td></tr>
                      <tr><td>الحالة:</td><td>{card.state}</td></tr>
                      <tr><td>أين؟:</td><td>{humanizeWhereis(card.whereis)}</td></tr>
                      <tr><td>الرصيد:</td><td>{card.credit}</td></tr>
                      <tr><td>المسحوب:</td><td>{card.drawn}</td></tr>
                      <tr><td>الرقم:</td><td>{card.card_number}</td></tr>
                      <tr><td>الكود:</td><td>{card.card_code}</td></tr>
                      <tr><td>عمولة حسب المصرف:</td><td>{card.fee_type==="true"?"نعم":"ﻻ"}</td></tr>
                      <tr><td>تم دفع العمولة؟:</td><td>{card.fee_paid===1?"نعم":"ﻻ"}</td></tr>
                      <tr><td>تاريخ الإضافه:</td><td>{card.created}</td></tr>
                      <tr><td><Button className="btn btn-warning" onClick={this.open}>تعديل</Button></td><td></td></tr>
                    </tbody>
                  </Table>
                  {this.updateStateForEdit(card.fee_type)}
                  <Modal
                  aria-labelledby='modal-label'
                  style={modalStyle}
                  backdropStyle={backdropStyle}
                  show={this.state.showModal}
                  onHide={this.close}
                  dir="rtl"
                >
                  <div style={dialogStyle()} >
                    <h4 id='modal-label'>تعديل بطاقة</h4>
                    <form onSubmit={this.handleEditCard}>
                    <Table>
                      <tbody>
                        <tr><td><input name="card_id" type="text" defaultValue={this.props.match.params.id} readOnly required/></td></tr>
                        <tr><td><input name="owname" type="text" defaultValue={card.owname} placeholder="إسم مالك البطاقة" required/></td></tr>
                        <tr><td><input name="card_number" type="text" defaultValue={card.card_number} pattern="\d*" maxLength="8" placeholder="رقم البطاقة" required/></td></tr>
                        <tr><td><input name="card_code" type="text" defaultValue={card.card_code} pattern="\d*" maxLength="4" placeholder="كود البطاقة" required/></td></tr>
                        <tr><td><input name="type" type="text" defaultValue={card.type} placeholder="النوع" required/></td></tr>
                        <tr><td>
                          <select name="bank_id" required>
                            {
                              banks.map((bank,index) => {
                                if(bank.name===card.bank){
                                  return(
                                    <option key={"bank4crds"+index} value={bank.id} selected="selected">{bank.name}</option>
                                  )
                                }
                                else{
                                  return(
                                    <option key={"bank4crds"+index} value={bank.id}>{bank.name}</option>
                                  )
                                }
                              })
                            }
                          </select>
                        </td></tr>
                        <tr><td><input name="exp" type="text" defaultValue={card.exp} placeholder="الصلاحية" required/></td></tr>
                        <tr><td><input name="state" type="text" defaultValue={card.state} placeholder="الحاله" required/></td></tr>
                        <tr><td><input type="text" name="credit" pattern="\d*" maxLength="18" defaultValue={card.credit} placeholder="الرصيد" required/></td></tr>
                        <tr><td><input type="text" name="drawn" pattern="\d*" maxLength="18" defaultValue={card.drawn} placeholder="المسحوب منه" required/></td></tr>
                        <tr><td><Toggle label="عمولة المصرف" defaultChecked={card.fee_type==="true"?true:false} checked={this.state.bankChecked} onToggle={value => this.setState({bankChecked:value})} /></td></tr>
                      </tbody>
                    </Table>
                    <br/>
                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                  </form>
                    {/* <ModalExample/> */}
                  </div>
                </Modal>
                </div>
                );

                return(
                <div>
                  <Badge variant="secondary">
                    <h4>ملف البطاقة</h4>
                  </Badge>
                  {cards}


                  <Button onClick={() => window.print()}>طباعة</Button>
                </div>
              )
            }
          }

        const home_header = () => (
          <header>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">مرحبا بك في منظومة البطاقات</h1>
          </header>
        );

        const pg_runner = () => {
          const { data } = this.state.runner;
          const {loading} = this.state;
          return( <div>
            <Badge variant="secondary">
              <h5>الساحبون</h5>
            </Badge>
            <ReactTable
          columns={[
            {
              Header : 'الإشاري',
              accessor : 'id',
              sortMethod: (a, b) => {
                if (a === b) {
                  return parseInt(a) > parseInt(b) ? 1 : -1;
                }
                return parseInt(a) > parseInt(b) ? 1 : -1;
              },
              Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span> // Custom cell components!
            },
            {
              id : 'name',
              Header : 'الإسم',
              accessor : 'name',
              filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name"] }),
              filterAll: true,
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
            }
            ]}
          className="-striped -highlight"
          data={data}
          //pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchRunnerData} // Request new data when things change
          noDataText="ﻻ توجد بيانات مطابقة !"
          loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
          showPaginationTop={true}
          nextText="التالي"
          previousText="السابق"
          rowsText="صفوف"
          pageText="صفحة"
          filterable
          minRows={3}
          pageSize={tablerows}
          onPageSizeChange={onPageSizeChange}
          />
          <Link to="/admin/addRunner" className="btn btn-info">إضافة</Link>
          </div>
          )};


        const sendCard = () => {
          const { runners, cards4send } = this.state.sendCard;
          const {loading} = this.state;
          return (
            <div>
              <Badge variant="secondary">
                <h5>إرسال بطاقات</h5>
              </Badge>
              <ReactTable
                columns={[
                  {
                    Header: 'الإشاري',
                    accessor: 'id',
                    id: 'id',
                    sortMethod: (a, b) => {
                      if (a === b) {
                        return parseInt(a) > parseInt(b) ? 1 : -1;
                      }
                      return parseInt(a) > parseInt(b) ? 1 : -1;
                    },
                    Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                  },
                  {
                    Header: 'إسم صاحب البطاقة',
                    accessor: 'owname', // String-based value accessors!
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
                    filterAll: true,
                  },
                  {
                    Header: 'الحالة',
                    accessor: 'state', // String-based value accessors!
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["state"] }),
                    filterAll: true,
                  }, {
                    Header: 'الساحب',
                    Cell: <select
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
                          </select>
                  }, {
                    accessor: 'id',
                    Header: 'إرسال',
                    Cell: props=><Button variant="link" onClick={() => this.executeSendCard(props.value)}>أرسل</Button>
                  }
                  ]}
                defaultSorted={[
                  {
                    id: "id",
                    desc: false
                  }
                ]}
                className="-striped -highlight"
                data={cards4send}
                //pages={pages} // Display the total number of pages
                loading={loading} // Display the loading overlay when we need it
                onFetchData={this.fetchCards4Send} // Request new data when things change
                noDataText="ﻻ توجد بيانات مطابقة !"
                loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                showPaginationTop={true}
                nextText="التالي"
                previousText="السابق"
                rowsText="صفوف"
                pageText="صفحة"
                filterable
                minRows={3}
                pageSize={tablerows}
                onPageSizeChange={onPageSizeChange}
                  style={{
                    height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                  }}
                />
            </div>
          )
        }

        class Cmp_runner extends React.Component {
          constructor(props, context) {
            super(props, context);
            this._runnerUser = React.createRef();
            this.state = {
              runner:{
                data:[],
                pages:null,
                loading:true
              },
              showModal: false,
              showModalto: false,
              showModalfoor: false,
              runnerUser : null,
              runnerUserExist: null,
            }
            this.open = this.open.bind(this);
            this.close = this.close.bind(this);
            this.opento = this.opento.bind(this);
            this.closeto = this.closeto.bind(this);
            this.openfoor = this.openfoor.bind(this);
            this.closefoor = this.closefoor.bind(this);
            this.handleRunnerUserChange = this.handleRunnerUserChange.bind(this);
            this.handleAddRunnerUser = this.handleAddRunnerUser.bind(this);
            this.fetchRunnerById = this.fetchRunnerById.bind(this);
            this.handleEditRunner = this.handleEditRunner.bind(this);
            this.checkRunnerUser = this.checkRunnerUser.bind(this);
            this.getRunnerUser = this.getRunnerUser.bind(this);
            this.handleChangeRunnerPass = this.handleChangeRunnerPass.bind(this);
          }
          handleChangeRunnerPass(e){
            e.preventDefault();
            NotificationManager.warning("يتم تغيير كلمة سر للساحب","الرجاء الإنتظار");
            const form = new FormData(e.target);
            form.set('changeRunnerPass',1);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Success"){
                NotificationManager.success("تم تغيير كلمة سر للساحب","نجاح");
                this.closefoor();
              }
              else{
                NotificationManager.error("فشل تغيير كلمة سر للساحب","خطأ");
                this.closefoor();
              }
            });
          }

          getRunnerUser(){
            const { id } = this.props.match.params;
            var form = new FormData();
            form.append("getRunnerUser",1);
            form.append("runner_id",id);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Doesn't Exists"){
                this.setState({runnerUser:null});
              }
              else{
                this.setState({runnerUser:resText});
              }
            });
          }

          checkRunnerUser(){
            const { id } = this.props.match.params;
            var form = new FormData();
            form.append("checkRunnerUser",1);
            form.append("runner_id",id);
            fetch(url,{
              method: 'POST',
              body: form
            })
            .then(res => res.text())
            .then(resText => {
              if(resText === "Doesn't Exists"){
                this.setState({runnerUserExist:false});
              }
              else if(resText === "Exists"){
                this.setState({runnerUserExist:true});
              }
              else{

              }
            });
          }

          handleEditRunner(e){
            e.preventDefault();
            const { id } = this.props.match.params;
            ReactDOM.findDOMNode(this._button).setAttribute("disabled", "disabled");
            // this.setState({submitIsDisabled:true});
            // e.currentTarget.classList.add("disabled");
            NotificationManager.warning("يتم تعديل الساحب","الرجاء الإنتظار");
            const form = new FormData(e.target);
            form.append('editRunner',1);
            fetch(url,{
              method:'POST',
              body:form
            })
            .then(res => res.text())
            .then(textRes => {
              if(textRes === "Success"){
                this.closeto();
                NotificationManager.success("تم تعديل الساحب بنجاح","نجاح");
                this.fetchRunnerById(id);
              }else{
                this.closeto();
                NotificationManager.error("ﻻ يمكن تعديل الساحب","خطأ");
                // this.setState({submitIsDisabled:false});
              }
            })
          }

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
                this.closefoor();
              }else{
                NotificationManager.error("فشل إضافة معرف الدخول للساحب","خطأ");
                this.closefoor();
              }
              this.componentDidMount();
            });
          }

          handleRunnerUserChange(e){
            this.setState({runnerUser:e.target.value+"@fasicurrency.com"});
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

          closefoor(){
            this.setState({showModalfoor: false});
          }

          openfoor(){
            this.setState({showModalfoor: true});
          }

          fetchRunnerById(id){
            let state = this.state;
            state.runner.loading = true;
            this.setState(state);
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

          componentDidMount(){
            const { id } = this.props.match.params;
            // this.fetchRunnerById(id);
            setTimeout(() => {
              this.fetchRunnerById(id);
            }, 300);
            this.checkRunnerUser();
            this.getRunnerUser();
          }

          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }

          render(){
            const { data } = this.state.runner;
            try{
              return (
                <div>
                  {data.length>0&&!this.state.runner.loading?
                        data.map((runner,index) => {
                          return(
                            <div key={index}>
                              <Badge variant="secondary">
                                <h5>ملف الساحب</h5>
                              </Badge>
                          <Table key={"runner"+index} style={{maxWidth:"none"}} striped bordered hover responsive dir="rtl">
                          <tbody>
                            <tr><td>الإشاري</td><td>{runner.id}</td></tr>
                            <tr><td>الإسم</td><td>{runner.name}</td></tr>
                            <tr><td>الرقم</td><td>{runner.phone}</td></tr>
                            <tr><td>العمولة</td><td>{runner.fee}</td></tr>
                            <tr style={{backgroundColor:'#E9573F',color:'#FFFFFF',fontWeight:'bold'}}><td>الدين</td><td>{runner.credit}</td></tr>
                            <tr style={{backgroundColor:'#479e7b',color:'#FFFFFF',fontWeight:'bold'}}><td>المكسب طوال الوقت</td><td>{runner.profit}</td></tr>
                            <tr style={{backgroundColor:'#327057',color:'#FFFFFF',fontWeight:'bold'}}><td>المكسب هذا الشهر</td><td>{runner.profit_month}</td></tr>
                            <tr style={{backgroundColor:'#38579e',color:'#FFFFFF',fontWeight:'bold'}}><td>المودع طوال الوقت</td><td>{runner.depoe}</td></tr>
                            <tr style={{backgroundColor:'#2b4070',color:'#FFFFFF',fontWeight:'bold'}}><td>المودع هذا الشهر</td><td>{runner.depoe_month}</td></tr>
                            <tr><td>عدد البطاقات لديه</td><td>{runner.cards_with}</td></tr>
                            <tr><td>إجمالي البطاقات التي إستلمها</td><td>{runner.old_cards}</td></tr>
                            <tr><td>إجمالي المسحوب لدى البطاقات التي إستلمها(خانة المسحوب لدى البطاقة)ـ</td><td>{runner.all_cards_withdrawn}</td></tr>
                            <tr style={{backgroundColor:'#bfc657',color:'#FFFFFF',fontWeight:'bold'}}><td>إجمالي البطاقات التي اخذ منها عمولة</td><td>{runner.fee_cards_count}</td></tr>
                            <tr><td>إجمالي المسحوب لدى البطاقات التي اخذ منها عمولة(خانة المسحوب لدى البطاقة)ـ</td><td>{runner.fee_cards_withdrawn}</td></tr>
                            <tr style={{backgroundColor:'#bfc657',color:'#FFFFFF',fontWeight:'bold'}}><td>إجمالي المسحوب لدى البطاقات التي اخذ منها عمولة(المسحوب في معاملات البطاقة)ـ</td><td>{runner.fee_cards_withdrawn_real}</td></tr>
                            <tr><td>إجمالي البطاقات التي أرسلها</td><td>{runner.all_sents}</td></tr>
                            {/* <tr><td>المسحوب</td><td>{runner.drawn}</td></tr>
                            <tr><td>المودع</td><td>{runner.diposited}</td></tr> */}
                            {/* <tr><td>بطاقات مع</td><td></td></tr>
                            <tr><td>بطاقات فالطريق منه</td><td></td></tr>
                            <tr><td>بطاقات فالطريق اليه</td><td></td></tr> */}
                            <tr><td>تاريخ الإضافة</td><td>{runner.created}</td></tr>
                            </tbody>
                            </Table>
                            {/* <tr><td colSpan={2}> */}
                              <hr/><br/><h6><b>جميع البطاقات التي إستلمها فالسابق</b></h6>
                              <Button
                              onClick={()=>print({printable: this.allCardTable.getResolvedState().sortedData,
                              properties: [
                              { field: 'id', displayName: 'الأشاري'},
                              { field: 'owname', displayName: 'الإسم'},
                              { field: 'card_number', displayName: 'الرقم'},
                              { field: 'card_code', displayName: 'الكود'},
                              { field: 'type', displayName: 'النوع'},
                              { field: 'exp', displayName: 'الصلاحية'},
                              { field: 'state', displayName: 'الحالة'},
                              { field: 'bank', displayName: 'المصرف'},
                              { field: 'credit', displayName: 'الرصيد'},
                              { field: 'drawn', displayName: 'المسحوب'},
                              { field: 'avail', displayName: 'المتبقي'},
                              { field: 'fee_type', displayName: 'العمولة'},
                                ],
                                header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3" dir="rtl">جميع البطاقات التي إستلمها '+runner.name+' فالسابق</h3>',
                                style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                                Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                                type: 'json'})}>
                                طباعة
                                </Button>
                              <ReactTable
                                columns={[
                                  {
                                    Header: 'الإشاري',
                                    accessor: 'id',
                                    sortMethod: (a, b) => {
                                      if (a === b) {
                                        return parseInt(a) > parseInt(b) ? 1 : -1;
                                      }
                                      return parseInt(a) > parseInt(b) ? 1 : -1;
                                    },
                                    Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                                  },
                                  {
                                    Header: 'الإسم',
                                    accessor: 'owname', // String-based value accessors!
                                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
                                    filterAll: true,
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
                                  },
                                  {
                                    Header: 'العمولة',
                                    accessor: 'fee_type',
                                    id: 'fee_type',
                                    Cell: props => <span>{props.value != null ? (props.value.localeCompare("true")===0?"مصرف":"شركة") : "شركة"}</span>,
                                    filterMethod: (filter, row) => {
                                      if (filter.value === "all") {
                                        return true;
                                      }
                                      if (filter.value === "true") {
                                        return row[filter.id] === "true";
                                      }
                                      return row[filter.id] !== "true";
                                    },
                                    Filter: ({ filter, onChange }) =>
                                      <select
                                        onChange={event => onChange(event.target.value)}
                                        style={{ width: "100%" }}
                                        value={filter ? filter.value : "all"}
                                      >
                                        <option value="all">الكل</option>
                                        <option value="true">مصرف(10الاف)</option>
                                        <option value="NULL">شركة(ارباب الاسر)</option>
                                      </select>
                                  }
                                  ]}
                                defaultSorted={[
                                  {
                                    id: "id",
                                    desc: true
                                  }
                                ]}
                                className="-striped -highlight"
                                data={runner.all_cards}
                                //pages={pages} // Display the total number of pages
                                // loading={loading} // Display the loading overlay when we need it
                                // onFetchData={this.fetchCustomerData} // Request new data when things change
                                noDataText="ﻻ توجد بيانات مطابقة !"
                                loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                                showPaginationTop={true}
                                nextText="التالي"
                                previousText="السابق"
                                rowsText="صفوف"
                                pageText="صفحة"
                                filterable
                                minRows={3}
                                pageSize={tablerows}
                                onPageSizeChange={onPageSizeChange}
                                ref={(r)=>this.allCardTable=r}
                                  // style={{
                                  //   height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                                  // }}
                                />
                              {/* </td></tr> */}
                              {/* <tr><td colSpan={2}> */}
                              <hr/><br/><h6><b>جميع البطاقات التي لديه الآن</b></h6>
                              <Button
                              onClick={()=>print({printable: this.nowCardTable.getResolvedState().sortedData,
                              properties: [
                              { field: 'id', displayName: 'الأشاري'},
                              { field: 'owname', displayName: 'الإسم'},
                              { field: 'card_number', displayName: 'الرقم'},
                              { field: 'card_code', displayName: 'الكود'},
                              { field: 'type', displayName: 'النوع'},
                              { field: 'exp', displayName: 'الصلاحية'},
                              { field: 'state', displayName: 'الحالة'},
                              { field: 'bank', displayName: 'المصرف'},
                              { field: 'credit', displayName: 'الرصيد'},
                              { field: 'drawn', displayName: 'المسحوب'},
                              { field: 'avail', displayName: 'المتبقي'},
                              { field: 'fee_type', displayName: 'العمولة'},
                                ],
                                header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3" dir="rtl">جميع البطاقات التي لدى '+runner.name+' الآن</h3>',
                                style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                                Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                                type: 'json'})}>
                                طباعة
                                </Button>
                              <ReactTable
                                columns={[
                                  {
                                    Header: 'الإشاري',
                                    accessor: 'id',
                                    sortMethod: (a, b) => {
                                      if (a === b) {
                                        return parseInt(a) > parseInt(b) ? 1 : -1;
                                      }
                                      return parseInt(a) > parseInt(b) ? 1 : -1;
                                    },
                                    Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
                                  },
                                  {
                                    Header: 'الإسم',
                                    accessor: 'owname', // String-based value accessors!
                                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["owname"] }),
                                    filterAll: true,
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
                                  },
                                  {
                                    Header: 'العمولة',
                                    accessor: 'fee_type',
                                    id: 'fee_type',
                                    Cell: props => <span>{props.value != null ? (props.value.localeCompare("true")===0?"مصرف":"شركة") : "شركة"}</span>,
                                    filterMethod: (filter, row) => {
                                      if (filter.value === "all") {
                                        return true;
                                      }
                                      if (filter.value === "true") {
                                        return row[filter.id] === "true";
                                      }
                                      return row[filter.id] !== "true";
                                    },
                                    Filter: ({ filter, onChange }) =>
                                      <select
                                        onChange={event => onChange(event.target.value)}
                                        style={{ width: "100%" }}
                                        value={filter ? filter.value : "all"}
                                      >
                                        <option value="all">الكل</option>
                                        <option value="true">مصرف(10الاف)</option>
                                        <option value="NULL">شركة(ارباب الاسر)</option>
                                      </select>
                                  }
                                  ]}
                                defaultSorted={[
                                  {
                                    id: "id",
                                    desc: true
                                  }
                                ]}
                                className="-striped -highlight"
                                data={runner.cards_now}
                                //pages={pages} // Display the total number of pages
                                // loading={loading} // Display the loading overlay when we need it
                                // onFetchData={this.fetchCustomerData} // Request new data when things change
                                noDataText="ﻻ توجد بيانات مطابقة !"
                                loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                                showPaginationTop={true}
                                nextText="التالي"
                                previousText="السابق"
                                rowsText="صفوف"
                                pageText="صفحة"
                                filterable
                                minRows={3}
                                pageSize={tablerows}
                                onPageSizeChange={onPageSizeChange}
                                ref={(r)=>this.nowCardTable=r}
                                  // style={{
                                  //   height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                                  // }}
                                />
                              {/* </td></tr> */}
                              {/* <tr><td colSpan={2}> */}
                                <hr/><br/><h6><b>آخر خمسين حركه دين له</b></h6>
                                <Button
                                onClick={()=>print({printable: this.debtTable.getResolvedState().sortedData,
                                properties: [
                                { field: 'card_id', displayName: 'البطاقة'},
                                { field: 'runner_id', displayName: 'الساحب'},
                                { field: 'type', displayName: 'النوع'},
                                { field: 'cause', displayName: 'السبب'},
                                { field: 'date', displayName: 'التاريخ'},
                                { field: 'amount', displayName: 'القيمه'},
                                  ],
                                  header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3" dir="rtl">ديون و إيداعات '+runner.name+'</h3>',
                                  style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                                  Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                                  type: 'json'})}>
                                  طباعة
                                  </Button>
                                <ReactTable
                                  columns={[
                                    {
                                      Header: 'الإشاري',
                                      accessor: 'id',
                                      sortMethod: (a, b) => {
                                        if (a === b) {
                                          return parseInt(a) > parseInt(b) ? 1 : -1;
                                        }
                                        return parseInt(a) > parseInt(b) ? 1 : -1;
                                      },
                                    },
                                    {
                                      Header: 'إشاري البطاقة',
                                      accessor: 'card_id', // String-based value accessors!
                                      Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                                    },
                                    {
                                      Header: 'إشاري الساحب',
                                      accessor: 'runner_id', // String-based value accessors!
                                      Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                                    }, {
                                      Header: 'القيمة',
                                      accessor: 'amount',
                                      id: 'amount',
                                      Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                                    },{
                                      Header: 'النوع',
                                      accessor: 'type', // String-based value accessors!
                                      Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) // Custom cell components!
                                    },{
                                      Header: 'السبب',
                                      accessor: 'cause' // String-based value accessors!
                                    },{
                                      Header: 'التاريخ',
                                      accessor: 'date' // String-based value accessors!
                                    },
                                    ]}
                                  defaultSorted={[
                                    {
                                      id: "id",
                                      desc: true
                                    }
                                  ]}
                                  style={{
                                    height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                                  }}
                                  className="-striped -highlight"
                                  data={runner.last_trans}
                                  //pages={pages} // Display the total number of pages
                                  // loading={rncloading} // Display the loading overlay when we need it
                                  // onFetchData={this.getRunnerTransactionsCredits} // Request new data when things change
                                  noDataText="ﻻ توجد بيانات مطابقة !"
                                  loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                                  showPaginationTop={true}
                                  nextText="التالي"
                                  previousText="السابق"
                                  rowsText="صفوف"
                                  pageText="صفحة"
                                  filterable
                                  minRows={3}
                                  pageSize={tablerows}
                                  onPageSizeChange={onPageSizeChange}
                                  ref={(r)=>this.debtTable=r}
                                />
                              {/* </td></tr> */}
                              {/* <tr><td colSpan={2}> */}
                                <hr/><br/><h6><b>آخر خمسين عموله له</b></h6>
                                <Button
                                onClick={()=>print({printable: this.runFeeTable.getResolvedState().sortedData,
                                properties: [
                                { field: 'card_id', displayName: 'البطاقة'},
                                { field: 'runner_id', displayName: 'الساحب'},
                                { field: 'type', displayName: 'النوع'},
                                { field: 'cause', displayName: 'السبب'},
                                { field: 'date', displayName: 'التاريخ'},
                                { field: 'amount', displayName: 'القيمه'},
                                  ],
                                  header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3" dir="rtl"> عمولات '+runner.name+'</h3>',
                                  style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                                  Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                                  type: 'json'})}>
                                  طباعة
                                  </Button>
                                <ReactTable
                                  columns={[
                                    {
                                      Header: 'الإشاري',
                                      accessor: 'id',
                                      sortMethod: (a, b) => {
                                        if (a === b) {
                                          return parseInt(a) > parseInt(b) ? 1 : -1;
                                        }
                                        return parseInt(a) > parseInt(b) ? 1 : -1;
                                      },
                                    },
                                    {
                                      Header: 'إشاري البطاقة',
                                      accessor: 'card_id', // String-based value accessors!
                                      Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                                    },{
                                      Header: 'إشاري الساحب',
                                      accessor: 'runner_id', // String-based value accessors!
                                      Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                                    }, {
                                      Header: 'القيمة',
                                      accessor: 'amount',
                                      id: 'amount',
                                      Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                                    },{
                                      Header: 'النوع',
                                      accessor: 'type', // String-based value accessors!
                                      Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) // Custom cell components!
                                    },{
                                      Header: 'السبب',
                                      accessor: 'cause' // String-based value accessors!
                                    },{
                                      Header: 'التاريخ',
                                      accessor: 'date' // String-based value accessors!
                                    },
                                    ]}
                                  defaultSorted={[
                                    {
                                      id: "id",
                                      desc: true
                                    }
                                  ]}
                                  style={{
                                    height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                                  }}
                                  className="-striped -highlight"
                                  data={runner.last_fees}
                                  //pages={pages} // Display the total number of pages
                                  // loading={rnloading} // Display the loading overlay when we need it
                                  // onFetchData={this.getRunnerTransactions} // Request new data when things change
                                  noDataText="ﻻ توجد بيانات مطابقة !"
                                  loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                                  showPaginationTop={true}
                                  nextText="التالي"
                                  previousText="السابق"
                                  rowsText="صفوف"
                                  pageText="صفحة"
                                  filterable
                                  minRows={3}
                                  pageSize={tablerows}
                                  onPageSizeChange={onPageSizeChange}
                                  ref={(r)=>this.runFeeTable=r}
                                />
                              {/* </td></tr> */}
                            {/* <tr><td> */}
                              {/* </td><td> */}
                                <Table><tbody>
                                  <tr><td><LinkContainer to="/admin/sendCard"><Button className="btn btn-info">إرسال بطاقات</Button></LinkContainer></td>
                                  <td><Button className="btn btn-warning" onClick={this.opento}>تعديل</Button></td>
                            <td>
                            {this.state.runnerUserExist===true?
                              (<div><Button className="btn btn-danger" onClick={this.openfoor}>تغيير كلمة المرور</Button>
                              <Modal
                                aria-labelledby='modal-label'
                                style={modalStyle}
                                backdropStyle={backdropStyle}
                                show={this.state.showModalfoor}
                                onHide={this.closefoor}
                                dir="rtl"
                              >
                                <div style={dialogStyle()} >
                                  <h4 id='modal-label'>تغيير كلمة المرور</h4>
                                  <form onSubmit={this.handleChangeRunnerPass}>
                                    <input name="runner_id" type="text" defaultValue={this.props.match.params.id} readOnly required/>
                                    <input name="username" type="text" defaultValue={this.state.runnerUser} placeholder="إسم المستخدم" readOnly required/>
                                    <input type="text" name="password" placeholder="كلمة المرور الجديدة" required/>
                                    <Badge variant="secondary">للإستعمال على واجهة الساحبين</Badge>
                                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                                  </form>
                                  {/* <ModalExample/> */}
                                </div>
                              </Modal></div>)

                              :
                              this.state.runnerUserExist===false?(<div>
                                <Button className="btn btn-danger" onClick={this.openfoor}>إضافة معرف دخول</Button>
                                <Modal
                                  aria-labelledby='modal-label'
                                  style={modalStyle}
                                  backdropStyle={backdropStyle}
                                  show={this.state.showModalfoor}
                                  onHide={this.closefoor}
                                  dir="rtl"
                                >
                                  <div style={dialogStyle()} >
                                  <h4 id='modal-label'>إضافة معرف دخول</h4>
                                  <form onSubmit={this.handleAddRunnerUser}>
                                    <input name="runner_id" type="text" defaultValue={this.props.match.params.id} readOnly required/>
                                    <input ref={ref => this._runnerUser=ref} name="username" type="text" placeholder="إسم المستخدم" onChange={this.handleRunnerUserChange} required/>
                                    <input name="email" type="email" placeholder="البريد الإلكتروني" value={this.state.runnerUser} required disabled/>
                                    <input type="text" name="password" placeholder="كلمة المرور" required/>
                                    <br/>
                                    <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                                  </form>
                                    {/* <ModalExample/> */}
                                  </div>
                                </Modal>
                              </div>):(<div></div>)}
                              </td>
                              </tr></tbody></Table>
                              {/* </td></tr> */}

                            <Modal
                              aria-labelledby='modal-label'
                              style={modalStyle}
                              backdropStyle={backdropStyle}
                              show={this.state.showModalto}
                              onHide={this.closeto}
                              dir="rtl"
                            >
                              <div style={dialogStyle()} >
                                <h4 id='modal-label'>تعديل ملف ساحب</h4>
                                <form onSubmit={this.handleEditRunner}>
                                <Table>
                                  <tbody>
                                    <tr><td><input name="runner_id" type="text" defaultValue={this.props.match.params.id} readOnly required/></td></tr>
                                    <tr><td><input name="name" type="text" defaultValue={runner.name} placeholder="الإسم" required/></td></tr>
                                    <tr><td><input name="number" type="text" defaultValue={runner.phone} pattern="\d*" maxLength="18" placeholder="رقم الهاتف" required/></td></tr>
                                    <tr><td><input name="fee" type="text" defaultValue={runner.fee} pattern="\d*" maxLength="4" placeholder="العمولة" required/></td></tr>
                                    </tbody>
                                </Table>
                                <br/>
                                <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                              </form>
                                {/* <ModalExample/> */}
                              </div>
                            </Modal>
                          {/* </tbody> */}
                        {/* </Table> */}
                        <Button onClick={() => window.print()}>طباعة</Button></div>)
                        })
                      :
                      <>
                        <Spinner animation="border" variant="primary" />
                        <br/>
                        <Spinner animation="border" variant="secondary" />
                        <br/>
                        <Spinner animation="border" variant="success" />
                        <br/>
                        <Spinner animation="border" variant="danger" />
                        <br/>
                        <Spinner animation="border" variant="warning" />
                        <br/>
                        <Spinner animation="border" variant="info" />
                        <br/>
                        <Spinner animation="border" variant="light" />
                        <br/>
                        <Spinner animation="border" variant="dark" />
                        <br/>
                        <Spinner animation="grow" variant="primary" />
                        <br/>
                        <Spinner animation="grow" variant="secondary" />
                        <br/>
                        <Spinner animation="grow" variant="success" />
                        <br/>
                        <Spinner animation="grow" variant="danger" />
                        <br/>
                        <Spinner animation="grow" variant="warning" />
                        <br/>
                        <Spinner animation="grow" variant="info" />
                        <br/>
                        <Spinner animation="grow" variant="light" />
                        <br/>
                        <Spinner animation="grow" variant="dark" />
                      </>
                  }
                </div>
              )

            }catch(error){
              // console.error(error);
              return null;
            }
          }
        }

        const Users = () => {
          return(
            <div>
              <Badge variant="secondary">
                <h5>المستخدمون</h5>
              </Badge>
              <Table>
                <thead>
                  <tr><td>الإشاري</td><td>الإسم</td><td>المستخدم</td><td>الإمر</td></tr>
                </thead>
                <tbody>
                  {this.state.users.map((user,index)=>{
                    return (
                    <>
                    <tr key={index}><td>{user.id}</td><td>{user.name}</td><td>{user.username}</td><td><Button onClick={this.openChangePasswordModal}>تغيير كلمة المرور</Button></td></tr>
                    <Modal
                      aria-labelledby='modal-label'
                      style={modalStyle}
                      backdropStyle={backdropStyle}
                      show={this.state.showChangePasswordModal}
                      onHide={this.closeChangePasswordModal}
                      dir="rtl"
                    >
                      <div style={dialogStyle()} >
                        <h4 id='modal-label'>تغيير كلمة المرور</h4>
                        <form onSubmit={this.handleChangePassword}>
                          <p dir="rtl">المستخدم {user.name}:</p>
                          <input name="id" type="text" value={user.id} hidden disabled/>
                          <input name="username" type="text" value={user.username} disabled/>
                          <p dir="rtl">كلمة المرور الجديدة:</p>
                          <input name="password" type="password" required/>
                          <p dir="rtl">تأكيد كلمة المرور:</p>
                          <input name="password_confirmation" type="password" required/>
                          <br/>
                          <Button type="submit" className="btn btn-info" ref={ref => {this._button = ref}} >قدّم</Button>
                        </form>
                      </div>
                    </Modal>
                    </>
                    );
                  })}
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
                  <tr><td>رقم الهاتف</td><td><input type="text" name="phone" pattern="\d*" maxLength="18" title="رقم هاتف الساحب" required/></td></tr>
                  <tr><td>العموله</td><td><input type="text" name="fee" title="عمولة الساحب للبطاقة الواحدة" required/></td></tr>
                  <tr><td></td><td>
                  <Button ref={button => {this.submitTarget=button;}} type="submit" className="btn btn-info">قدّم</Button>
                  </td></tr>
                </tbody>
              </Table>
              {/* <Overlay {...submitProps} placement="left"> */}
                {/* <Tooltip id="overload-left" onClick={this.handleToggle}>عندما تكون مستعدا!</Tooltip> */}
              {/* </Overlay> */}
            </form>
            );
        }

        const Settings = () => {
          // this.getfee();
          return(
            <div>
              <Badge variant="secondary">
                <h5>الإعدادات</h5>
              </Badge>
              <Table>
                <thead>
                  <tr><td><Button className="btn btn-info" onClick={this.open}>تغيير العمولة</Button></td><td>{this.state.housefee}</td><td dir="rtl">عمولة الشركة:</td></tr>
                  <tr><td><Button className="btn btn-info" disabled>تغيير اللغة</Button></td><td>العربية</td><td>اللغة</td></tr>
                  <tr><td><Button className="btn btn-info" href={process.env.REACT_APP_SERVER_URL+"/index.php?backup=1"} target="_blank">تنزيل</Button></td><td></td><td>تنزيل نسخة من قاعدة البيانات</td></tr>
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
          const { data } = this.state.log;
          const {loading} = this.state;
        return( <div>
          <Badge variant="secondary">
            <h5>السجلات</h5>
          </Badge>
          <ReactTable
        columns={[
          {
            Header: 'الإشاري',
            accessor: 'id',
            sortMethod: (a, b) => {
              if (a === b) {
                return parseInt(a) > parseInt(b) ? 1 : -1;
              }
              return parseInt(a) > parseInt(b) ? 1 : -1;
            },
          },
          {
            Header: 'الوصف',
            accessor: 'description', // String-based value accessors!
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["description"] }),
            filterAll: true,
          },
          {
            Header: 'العنوان',
            accessor: 'ip',
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["description"] }),
            filterAll: true,
          },
          {
            Header: 'التاريخ',
            accessor: 'created',
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["created"] }),
            filterAll: true,
          }
          ]}
        data={data}
        //pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchLogData} // Request new data when things change
        noDataText="ﻻ توجد بيانات مطابقة !"
        loadingText={
                    <>
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="light" />
                    <Spinner animation="grow" variant="dark" />
                    </>
                    }
        showPaginationTop={true}
        nextText="التالي"
        previousText="السابق"
        rowsText="صفوف"
        pageText="صفحة"
        filterable
        minRows={3}
        pageSize={tablerows}
        onPageSizeChange={onPageSizeChange}
        className="-striped -highlight"
        /></div>)
        }

        class Receipt extends React.Component{
          render(){
            return(
              <div className="App">
                <Table>
                  <thead>
            <tr><td><u>{this.props.date}</u> التاريخ و الوقت</td><td colSpan="2" style={{textAlign:"center"}}><b><h1>{process.env.REACT_APP_PRINT_TITLE}</h1></b></td></tr>
                    <tr><td></td><td colSpan="2" style={{textAlign:"center"}}><b>واصل إستلام</b></td></tr>
                  </thead>
                  <tbody>
                    <tr><td dir="rtl">{this.props.customer.name}</td><td>إسم المستلم</td></tr>
                    <tr><td dir="rtl">{this.props.customer.phone}</td><td>رقم هاتفه</td></tr>
                    <tr dir="rtl"><td>المصرف:{this.props.cardo.bank}</td><td>البطاقة:{this.props.cardo.id}</td></tr>
                    <tr><td dir="rtl"><b style={{border:'solid'}}>$ {this.props.amount}</b></td><td>المبلغ</td></tr>
                    <tr><td dir="rtl">توقيع الموظف</td><td>.</td><td>توقيع الزبون</td></tr>
                  </tbody>
                </Table>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <hr></hr>
                <br></br>
                <Table>
                  <thead>
                    <tr><td><u>{this.props.date}</u> التاريخ و الوقت</td><td colSpan="2" style={{textAlign:"center"}}><b><h1> {process.env.REACT_APP_PRINT_TITLE}</h1></b></td></tr>
                    <tr><td></td><td colSpan="2" style={{textAlign:"center"}}><b>واصل إستلام</b></td></tr>
                  </thead>
                  <tbody>
                    <tr><td dir="rtl">{this.props.customer.name}</td><td>إسم المستلم</td></tr>
                    <tr><td dir="rtl">{this.props.customer.phone}</td><td>رقم هاتفه</td></tr>
                    <tr dir="rtl"><td>المصرف:{this.props.cardo.bank}</td><td>البطاقة:{this.props.cardo.id}</td></tr>
                    <tr><td dir="rtl"><b style={{border:'solid'}}>$ {this.props.amount}</b></td><td>المبلغ</td></tr>

                    <tr><td dir="rtl">توقيع الموظف</td><td>.</td><td>توقيع الزبون</td></tr>
                  </tbody>
                </Table>
              </div>
            );
          }
        }

        class CustomerTransaction extends React.Component {
          constructor(props, context) {
            super(props, context);
            //this._formToPrint = React.createRef();
            this.state = {
              customer:{
                data:[],
                pages:null,
                loading:true
              },
              card:{
                cdata:[],
                loading:true
              },
              date: ''
            }
            this.getDate = this.getDate.bind(this);
            this.getCustomerData = this.getCustomerData.bind(this);
            this.getCardData = this.getCardData.bind(this);
          }

          getDate(){
            fetch(url+'?getDate').then(res => res.text()).then(reso => {this.setState({date:reso})});
          }

          getCustomerData(id) {
            this.setState({customer:{loading:true}});
            var formData = new FormData();
            formData.append('account', '1');
            formData.append('id', id);

            fetch(url,{
              method: 'POST',
              body: formData
              })
              .then(res => res.json())
              .then(datas => {
                var data2 = datas[1];
                var data = datas[0];
                this.setState({customer:{data,data2,loading:false}});
              })
          }

          getCardData(id) {
            var formData = new FormData();
            formData.append('transcard', '1');
            formData.append('id', id);

            fetch(url,{
              method: 'POST',
              body: formData
              })
              .then(res => res.json())
              .then(cdata => {
                this.setState({card:{cdata,loading:false}});
              })
          }

          componentDidMount(){
            let id = this.props.match.params.id;
            let card = this.props.match.params.card;
            this.getCustomerData(id);
            this.getCardData(card);
          }

          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }

          render(){
            const { data } = this.state.customer;
            const { cdata } = this.state.card;
            // let id = this.props.match.params.id;
            // let card = this.props.match.params.card;
            let amount = this.props.match.params.amount;

            this.getDate();

            return (
              <div>
                {
                  typeof(data)!=='undefined'?data.map((customer,index) => {
                    return(
                      <div key={"receipt"+index}>
                        <PrintProvider>
                        <Print printOnly single name="foo">
                          <Receipt
                            ref={el => (this.componentRef = el)}
                            customer={customer}
                            cardo = {cdata[0]||[]}
                            amount={amount}
                            date={this.state.date}
                            className="fooprint"
                          />
                        </Print>
                        </PrintProvider>
                        <div>
                          <p></p>
                          <Table>
                            <thead>
                    <tr><td><u>{this.state.date}</u> التاريخ و الوقت</td><td colSpan="2" style={{textAlign:"center"}}><b><h1>{process.env.REACT_APP_COMPANY_NAME}</h1></b></td></tr>
                              <tr><td></td><td colSpan="2" style={{textAlign:"center"}}><b>واصل إستلام</b></td></tr>
                            </thead>
                            <tbody>
                              <tr><td dir="rtl">{customer.name}</td><td>إسم المستلم</td></tr>
                              <tr><td dir="rtl">{customer.phone}</td><td>رقم هاتفه</td></tr>
                              {
                                cdata.map((cardo,indexo)=>{
                                  return(
                                    <tr key={"card"+indexo} dir="rtl"><td>المصرف:{cardo.bank}</td><td>البطاقة:{cardo.id}</td></tr>
                                  )
                                })
                              }
                              <tr><td dir="rtl"><b style={{border:'solid'}}>$ {amount}</b></td><td>المبلغ</td></tr>

                              <tr><td dir="rtl">توقيع الموظف</td><td>.</td><td>توقيع الزبون</td></tr>
                            </tbody>
                          </Table>
                        </div>
                        <Button id="printRec" onClick={() => {
                          try{
                            document.getElementById("shiner").classList.remove("shiner");
                          }catch(error){
                            //we dont care, its about the stuff not being fully loaded yet
                          }
                          window.print();
                          try{
                            document.getElementById("shiner").classList.add("shiner");
                          }catch(error){
                            //we dont care, its about the stuff not being fully loaded yet
                          }
                          }
                          }>طباعة</Button>
                      </div>
                    )
                  }):''
                }
              </div>
            )
            }
        }

        class recCard extends React.Component {
          constructor(props, context) {
            super(props, context);
            this.state = {
              recCard:{
                data:[],
                pages:null,
                loading:true
              }
            }
            this.fetchRecCardData = this.fetchRecCardData.bind(this);
            this.receiveCard = this.receiveCard.bind(this);
            this.startLoading = this.startLoading.bind(this);
            this.stopLoading = this.stopLoading.bind(this);
          }

          startLoading(){
            let state = this.state;
            state.recCard.loading = true;
            this.setState(state);
          }

          stopLoading(){
            let state = this.state;
            state.recCard.loading = false;
            this.setState(state);
          }

          receiveCard(row){
            if(window.confirm("متأكد من  هذا ؟")){
              NotificationManager.warning("يتم إستقبال البطاقة","الرجاء الإنتظار");
              var form = new FormData();
              form.set('receiveCard',1);
              form.set('card_id', row.row.id);

              fetch(url,{
                method: 'POST',
                body:form
              })
              .then(res => res.text())
              .then(reso => {
                if(reso === "Success"){
                  NotificationManager.success("تم إستقبال البطاقة","نجاح");
                  this.fetchRecCardData();
                }else{
                  NotificationManager.error("لم يتم إستقبال البطاقة","خطأ");
                }
              })
            }

          }

          fetchRecCardData(){
            var form = new FormData();
            form.set('getRecCards',1);

            fetch(url,{
              method: 'POST',
              body:form
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({recCard:{data:reso}});
            })
          }

          componentDidMount(){
            this.startLoading();
            this.fetchRecCardData();
            this.stopLoading();
          }

          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }

          render(){
            const { data,loading } = this.state.recCard;
          return( <div>
            <Badge variant="secondary">
              <h5>إستقبال البطاقات</h5>
            </Badge>
            <ReactTable
            columns={[
              {
                Header: 'الإشاري',
                accessor: 'id',
                sortMethod: (a, b) => {
                  if (a === b) {
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                  }
                  return parseInt(a) > parseInt(b) ? 1 : -1;
                },
                Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span> // Custom cell components!
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
                Header: 'المصرف',
                accessor: 'bank',
                id: 'bank'
              },
              {
                Header: 'إستلام',
                Cell: row => (<Button variant="link" onClick={() => this.receiveCard(row)}>إستلام</Button>)
              }
              ]}
            data={data}
            //pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchRecCardData} // Request new data when things change
            noDataText="ﻻ توجد بيانات مطابقة !"
            loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
            showPaginationTop={true}
            nextText="التالي"
            previousText="السابق"
            rowsText="صفوف"
            pageText="صفحة"
            filterable
            minRows={3}
            pageSize={tablerows}
            onPageSizeChange={onPageSizeChange}
            className="-striped -highlight"
          /></div>)
          }
        }

        class Deposits extends React.Component{
          constructor(props, context) {
            super(props, context);
            //this._formToPrint = React.createRef();
            this.state = {
              deposit:{
                data: [],
                pages: null,
                loading: true
              }
            }
            this.fetchDepositsData = this.fetchDepositsData.bind(this);
            this.verifyDeposit = this.verifyDeposit.bind(this);
            this.startLoading = this.startLoading.bind(this);
            this.stopLoading = this.stopLoading.bind(this);
          }

          startLoading(){
            let state = this.state;
            state.deposit.loading = true;
            this.setState(state);
          }

          stopLoading(){
            let state = this.state;
            state.deposit.loading = false;
            this.setState(state);
          }

          verifyDeposit(row){
            if(window.confirm("متأكد من تأكيد هذا الإيداع؟")){
              NotificationManager.warning("يتم تأكيد الأيداع","الرجاء الإنتظار");
              var form = new FormData();
              form.set('verifyDeposit',1);
              form.set('deposit_id', row.row.id);

              fetch(url,{
                method: 'POST',
                body:form
              })
              .then(res => res.text())
              .then(reso => {
                if(reso === "Success"){
                  NotificationManager.success("تم تأكيد الإيداع","نجاح");
                  this.fetchDepositsData();
                }else{
                  NotificationManager.error("لم يتم تأكيد الإيداع","خطأ");
                  this.fetchDepositsData();
                }
              })
            }

          }

          fetchDepositsData(){
            var form = new FormData();
            form.set('getDeposits4v',1);
            fetch(url,{
              method: 'POST',
              body:form
            })
            .then(res => res.json())
            .then(reso => {
              let state = this.state;
              state.deposit.data = reso;
              this.setState(state);
            })
          }

          componentDidMount(){
            this.startLoading();
            this.fetchDepositsData();
            this.stopLoading();
          }

          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }

          render(){
            const { data,loading } = this.state.deposit;
            return( <div>
              <Badge variant="secondary">
                <h5>الأيداعات الغير مؤكدة</h5>
              </Badge>
              <ReactTable
              columns={[
                {
                  Header: 'الإشاري',
                  accessor: 'id',
                  sortMethod: (a, b) => {
                    if (a === b) {
                      return parseInt(a) > parseInt(b) ? 1 : -1;
                    }
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                  },
                },
                {
                  Header: 'إشاري الساحب',
                  accessor: 'runner_id', // String-based value accessors!
                  Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                },
                {
                  Header: 'القيمة',
                  accessor: 'amount'
                },
                {
                  Header: 'الوصف',
                  accessor: 'description' // String-based value accessors!
                },
                {
                  Header: 'التاريخ',
                  accessor: 'date'
                },
                {
                  Header: 'تأكيد',
                  Cell: row => (<Button variant="link" onClick={() => this.verifyDeposit(row)}>تأكيد</Button>)
                }
                ]}
              data={data}
              //pages={pages} // Display the total number of pages
              loading={loading} // Display the loading overlay when we need it
              onFetchData={this.fetchDepositsData} // Request new data when things change
              noDataText="ﻻ توجد بيانات مطابقة !"
              loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
              showPaginationTop={true}
              nextText="التالي"
              previousText="السابق"
              rowsText="صفوف"
              pageText="صفحة"
              filterable
              minRows={3}
              pageSize={tablerows}
              onPageSizeChange={onPageSizeChange}
              className="-striped -highlight"
            /></div>)
          }
        }

        const VDeposits = () => {
          const { data } = this.state.vdeposit;
          const {loading} = this.state;
          return( <div>
            <Badge variant="secondary">
              <h5>الأيداعات المؤكدة</h5>
            </Badge>
        <ReactTable
            columns={[
              {
                Header: 'الإشاري',
                accessor: 'id',
                sortMethod: (a, b) => {
                  if (a === b) {
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                  }
                  return parseInt(a) > parseInt(b) ? 1 : -1;
                },
              },
              {
                Header: 'إشاري الساحب',
                accessor: 'runner_id', // String-based value accessors!
                Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
              },
              {
                Header: 'القيمة',
                accessor: 'amount'
              },
              {
                Header: 'الوصف',
                accessor: 'description' // String-based value accessors!
              },
              {
                Header: 'تاريخ التأكيد',
                accessor: 'verify_date'
              },
              {
                Header: 'تاريخ الأيداع',
                accessor: 'date'
              }
              ]}
            data={data}
            //pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchVDepositsData} // Request new data when things change
            noDataText="ﻻ توجد بيانات مطابقة !"
            loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
            showPaginationTop={true}
            nextText="التالي"
            previousText="السابق"
            rowsText="صفوف"
            pageText="صفحة"
            filterable
            minRows={3}
            pageSize={tablerows}
            onPageSizeChange={onPageSizeChange}
            className="-striped -highlight"
          /></div>)
        }

        const pg_bank = () => {
          const { data } = this.state.bank;
          // this.fetchBankData();
          try{
            return (
              <div>
                <Badge variant="secondary">
                  <h5>المصارف</h5>
                </Badge>
                <Table>
                  <thead>
                    <tr><td>الإشاري</td><td>الإسم</td><td>العمولة</td></tr>
                  </thead>
                  <tbody>
                  {
                    data.map((bank,index)=>{
                      return(
                        <tr key={"tr_bank_"+index}><td>{bank.id}</td><td>{bank.name}</td><td>{bank.fee}</td><td><Link to={`/admin/editBank/${bank.id}/${bank.fee}`} variant="link" onClick={()=>this.fetchBankById(bank.id)}>تعديل العمولة</Link></td></tr>
                      )
                    })
                  }
                  </tbody>
                </Table>
                <Link to="/admin/addBank" className="btn btn-info">إضافة</Link>
              </div>
            );
          }
          catch(error){
            // console.error(error);
            return null;
          }
        }

        const pg_addBank = () => {
          return(
            <form onSubmit={this.handleAddBank}>
              <label dir="rtl">
                مصرف جديد:
              </label>
              <br/>
              <Table ref={table => {this.addTable=table;}} responsive>
                <tbody>
                  <tr><td><input type="text" name="name" title="إسم المصرف" required/></td><td dir="rtl">الإسم</td></tr>
                  <tr><td><input type="text" name="fee" title="عمولة الساحب للبطاقة الواحدة" required/></td><td dir="rtl">العموله</td></tr>
                  <tr><td></td><td>
                  <Button ref={button => {this.submitTarget=button;}} type="submit" className="btn btn-info">قدّم</Button>
                  </td></tr>
                </tbody>
              </Table>
            </form>
            );
        }

        const pg_editBank = ({match}) => {
          // let id = match.params.id;
          let oldfee = match.params.fee;
          // this.fetchBankById(id);
          return(
            <form onSubmit={this.handleBankEditSubmit}>
              <label dir="rtl">تعديل مصرف</label>
              <br />
              <Table ref={table => {this.addTable=table;}} responsive>
              <tbody>
                <tr><td><input type="number" name="id" value={this.state.bankEdit.id} readOnly/></td><td>الإشاري</td></tr>
                <tr><td><input type="text" name="name" value={this.state.bankEdit.name} readOnly/></td><td>الإسم</td></tr>
                <tr><td><input type="number" name ="fee" defaultValue={oldfee} onChange={this.handleBankFeeChange}/></td><td>العمولة</td></tr>
                <tr><td><Button ref={button => {this.submitTarget=button;}} type="submit" className="btn btn-info">قدّم</Button></td></tr>
              </tbody>
              </Table>
            </form>
          );
        }

        // const Redirecto = () => {
        //   const {redirectTo} = this.state;
        //   this.setState({redirect:false,redirectTo:""});
        //   return <Redirect to={redirectTo}/> ;
        // }

        class Reports extends React.Component{
          constructor(props, context) {
            super(props, context);
            this.state = {
              data:[],
              cards:[],
              cardsPlace:[],
              month:[],
              cardsMonth:[],
              drawn: [],
              depos: [],
              counts: {customers:0,runners:0,cards:0},
              loading: true,
            }
            this.getReport = this.getReport.bind(this);
            this.getCardReport = this.getCardReport.bind(this);
            this.getMonthReport = this.getMonthReport.bind(this);
            this.getCardReportMonth = this.getCardReportMonth.bind(this);
            this.getRandomColor = this.getRandomColor.bind(this);
            this.getCounts = this.getCounts.bind(this);
          }

          getCounts(){
            fetch(url+'counts',{
              method:'POST'
            })
            .then(reso=>reso.json())
            .then(res=>{
              let state = this.state;
              state.counts.customers = res.customers;
              state.counts.runners = res.runners;
              state.counts.cards = res.cards;
              this.setState(state);
            })
          }

          getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }
          
          getCardReportMonth(){
            let form = new FormData();
            form.append('getCardReportsAllMonth','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              reso.forEach((card,index)=>{
                card.color = this.getRandomColor();
                card.value = parseInt(card.sold);
                card.title = card.genre;
              })
              var cardsMonthPlace = reso.splice(1,4);
              let state = this.state;
              reso.splice(0,1);
              state.cardsMonth = reso;
              state.cardsMonthPlace = cardsMonthPlace;
              this.setState(state);
            })
          }
          getMonthReport(){
            let form = new FormData();
            form.append('getReportsAllMonth','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({month:reso});
            })
          }
          getCardReport(){
            let form = new FormData();
            form.append('getCardReportsAllTime','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              reso.forEach((card,index)=>{
                card.color = this.getRandomColor();
                card.value = parseInt(card.sold);
                card.title = card.genre;
              })
              var cardsPlace = reso.splice(1,4);
              let state = this.state;
              reso.splice(0,1);
              state.cards = reso;
              state.cardsPlace = cardsPlace;
              this.setState(state);
            })
          }
          getReport(){
            let form = new FormData();
            form.append('getReportsAllTime','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              reso.forEach((card,index)=>{
                card.color = this.getRandomColor();
                card.value = parseInt(card.sold);
                card.title = card.genre;
              })
              var drawn = [];
              drawn.push(reso[1],reso[2],reso[5]);
              var depos = [];
              depos.push(reso[3],reso[4],reso[7])
              let state = this.state;
              state.depos = depos;
              state.drawn = drawn;
              state.data = reso;
              this.setState(state);
            })
          }
          componentDidMount(){
            this.getCounts();
            this.getReport();
            this.getCardReport();
            this.getMonthReport();
            this.getCardReportMonth();
            setTimeout(() => {
              this.setState({loading:false});
            }, 300);
          }
          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }
          render(){
            const {data,cards,cardsPlace,month,cardsMonth,cardsMonthPlace,depos,drawn} = this.state;
            
            return(
              <div>
                <Badge variant="secondary">
                  <h5>التقارير</h5>
                </Badge>
                <br/>
                <Container>
                  {/* Stack the columns on mobile by making one full-width and the other half-width */}
                  <Row>
                    <Col xs={12} md={4}>
                    {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                    <Card2>
                      <Card2.Body>الزبائن <span style={{color:"red"}}><CountUp duration={5} end={this.state.counts.customers}/></span></Card2.Body>
                    </Card2>}
                    </Col>
                    <Col xs={6} md={4}>
                    {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                    <Card2>
                      <Card2.Body>الساحبون <span style={{color:"red"}}><CountUp duration={5} end={this.state.counts.runners}/></span></Card2.Body>
                    </Card2>}
                    </Col>
                    <Col xs={6} md={4}>
                    {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                    <Card2>
                      <Card2.Body>البطاقات <span style={{color:"red"}}><CountUp duration={5} end={this.state.counts.cards}/></span></Card2.Body>
                    </Card2>}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12} style={{overflowX:'auto',overflowY:'hidden'}}>
                      <p>تقارير كل الوقت</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <Chart width={800} height={300} data={data}>
                        <Axis name="genre" />
                        <Axis name="sold" />
                        <Legend position="top" dy={-20} />
                        <Tooltip />
                        <Geom type="interval" position="genre*sold" color="genre" />
                      </Chart>}
                    </Col>
                    <Col xs={12} md={6}>
                      <p>المسحوب</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <PieChart
                        labelStyle={(index) => ({
                          fill: drawn[index].color,
                          fontSize: '3px',
                          fontFamily: 'sans-serif',
                        })}
                        label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                        radius={20}
                        labelPosition={112}
                        segmentsShift={(index) => (index === 0 ? 2 : 1)}
                        animate={true}
                        lineWidth={45}
                        style={{maxHeight:"400px",margin:"0px"}}
                        data={drawn}
                      />}
                    </Col>
                    <Col xs={12} md={6}>
                      <p>الإيداعات</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <PieChart
                        labelStyle={(index) => ({
                          fill: depos[index].color,
                          fontSize: '3px',
                          fontFamily: 'sans-serif',
                        })}
                        label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                        radius={20}
                        labelPosition={112}
                        segmentsShift={(index) => (index === 0 ? 2 : 1)}
                        animate={true}
                        lineWidth={45}
                        style={{maxHeight:"400px"}}
                        data={depos}
                      />}
                    </Col>
                    <Col xs={12} md={6}>
                    <p>البطاقات</p>
                    {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                    <PieChart
                      labelStyle={(index) => ({
                        fill: cardsPlace[index].color,
                        fontSize: '3px',
                        fontFamily: 'sans-serif',
                      })}
                      label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                      radius={20}
                      labelPosition={112}
                      segmentsShift={(index) => (index === 0 ? 7 : 0.5)}
                      animate={true}
                      lineWidth={45}
                      style={{maxHeight:"400px"}}
                      data={cardsPlace}
                    />}
                    </Col>
                    <Col xs={12} md={6}>
                      <p>البطاقات</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <PieChart
                        labelStyle={(index) => ({
                          fill: cards[index].color,
                          fontSize: '3px',
                          fontFamily: 'sans-serif',
                        })}
                        label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                        radius={20}
                        labelPosition={112}
                        segmentsShift={(index) => (index === 0 ? 7 : 0.5)}
                        animate={true}
                        lineWidth={45}
                        style={{maxHeight:"400px"}}
                        data={cards}
                      />}
                    </Col>
                  </Row>
                  {/* Columns are always 50% wide, on mobile and desktop */}
                  <Row>
                    <Col xs={12} md={12} style={{overflowX:'auto',overflowY:'hidden'}}>
                      <p>تقارير هذا الشهر</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <Chart width={800} height={300} data={month}>
                        <Axis name="genre" />
                        <Axis name="sold" />
                        <Legend position="top" dy={-20} />
                        <Tooltip />
                        <Geom type="interval" position="genre*sold" color="genre" />
                      </Chart>}
                    </Col>
                    <Col xs={12} md={6}>
                    <p>البطاقات هذا الشهر</p>
                    {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                    <PieChart
                      labelStyle={(index) => ({
                        fill: cardsMonthPlace[index].color,
                        fontSize: '3px',
                        fontFamily: 'sans-serif',
                      })}
                      label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                      radius={20}
                      labelPosition={112}
                      segmentsShift={(index) => (index === 0 ? 7 : 0.5)}
                      animate={true}
                      lineWidth={45}
                      style={{maxHeight:"400px"}}
                      data={cardsMonthPlace}
                    />}
                    </Col>
                    <Col xs={12} md={6}>
                      <p>البطاقات هذا الشهر</p>
                      {this.state.loading?
                      <>
                      <Spinner animation="grow" variant="primary" />
                      <Spinner animation="grow" variant="secondary" />
                      <Spinner animation="grow" variant="success" />
                      <Spinner animation="grow" variant="danger" />
                      <Spinner animation="grow" variant="warning" />
                      <Spinner animation="grow" variant="info" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="dark" />
                      </>
                    :
                      <PieChart
                      labelStyle={(index) => ({
                        fill: cardsMonth[index].color,
                        fontSize: '3px',
                        fontFamily: 'sans-serif',
                      })}
                      label={({ dataEntry }) => dataEntry.title+" "+dataEntry.value}
                      radius={20}
                      labelPosition={112}
                      segmentsShift={(index) => (index === 0 ? 7 : 0.5)}
                      animate={true}
                      lineWidth={45}
                      style={{maxHeight:"400px"}}
                      data={cardsMonth}
                    />}
                    </Col>
                  </Row>
                  <Row>
                    
                  </Row>
                </Container>
                <Button onClick={() => window.print()}>طباعة</Button>
              </div>
            );
          }
        }

        class Transactions extends React.Component{
          constructor(props, context) {
            super(props, context);
            this.state = {
              cardtransaction:{
                crdata: [],
                pages: null,
                crloading: true
              },
              customertransaction:{
                data: [],
                pages:null,
                loading: true
              },
              housetransaction:{
                hsdata: [],
                pages: null,
                hsloading: true
              },
              runnertransaction:{
                rndata: [],
                pages: null,
                rnloading: true
              },
              runnertransactioncredit:{
                rncdata: [],
                pages: null,
                rncloading: true
              },
              redirect: false,
              redirectTo: "",
              loading: true
            }
            this.getCustomerTransactions = this.getCustomerTransactions.bind(this);
            this.getCardTransactions = this.getCardTransactions.bind(this);
            this.getRunnerTransactions = this.getRunnerTransactions.bind(this);
            this.getRunnerTransactionsCredits = this.getRunnerTransactionsCredits.bind(this);
            this.getHouseTransactions = this.getHouseTransactions.bind(this);
            this.editWithdraw = this.editWithdraw.bind(this);
            this.reprint = this.reprint.bind(this);
            this.handleEditRunnerCredit = this.handleEditRunnerCredit.bind(this);
            this.editTrans = this.editTrans.bind(this);
            this.editFee = this.editFee.bind(this);
            this.editHouseFee = this.editHouseFee.bind(this);
            this.editHouseRFee = this.editHouseRFee.bind(this);
            this.stopLoading = this.stopLoading.bind(this);
            this.startLoading = this.startLoading.bind(this);
          }

          startLoading(){
            let state = this.state;
            state.loading = true;
            this.setState(state);
          }

          stopLoading(){
            let state = this.state;
            state.loading = false;
            this.setState(state);
          }

          editHouseRFee(row){
            let form = new FormData();
            form.append('editHouseRFee','1');
            form.append('houseFeeId',row.row.id);
            form.append('newFee',window.prompt("سيقوم النظام بتعديل القيم المناسبه في جميع الحقول المتأثرة \nالرجاء إدخال القيمه الجديده للمعاملة "+row.row.id));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.componentDidMount();
            })
          }

          editHouseFee(row){
            let form = new FormData();
            form.append('editHouseFee','1');
            form.append('houseFeeId',row.row.id);
            form.append('newFee',window.prompt("سيقوم النظام بتعديل القيم المناسبه في جميع الحقول المتأثرة \nالرجاء إدخال القيمه الجديده للمعاملة "+row.row.id));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.componentDidMount();
            })
          }

          editFee(row){
            let form = new FormData();
            form.append('editFeeTrans','1');
            form.append('runnerFeeId',row.row.id);
            form.append('newFee',window.prompt("سيقوم النظام بتعديل القيم المناسبه في جميع الحقول المتأثرة \nالرجاء إدخال القيمه الجديده للمعاملة "+row.row.id));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.componentDidMount();
            })
          }

          editTrans(row){
            let form = new FormData();
            form.append('editCardTrans','1');
            form.append('cardTransId',row.row.id);
            form.append('newAmount',window.prompt("سيقوم النظام بتعديل القيم المناسبه في جميع الحقول المتأثرة \nالرجاء إدخال القيمه الجديده للمعاملة "+row.row.id));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.componentDidMount();
            })
          }

          handleEditRunnerCredit(row){
            let form = new FormData();
            form.append('editRunnerCredit','1');
            form.append('runnerCredId',row.row.id);
            form.append('newAmount',window.prompt("سيقوم النظام بتعديل القيم المناسبه في جميع الحقول المتأثرة \nالرجاء إدخال القيمه الجديده للمعاملة "+row.row.id));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.getRunnerTransactionsCredits();
              this.getCardTransactions();
              this.getHouseTransactions();
            })
          }
          reprint(row){
            window.location.replace(`/admin/customertransaction/${row.row.account_id}/${row.row.amount}/${row.row.card_id}`);
          }

          editWithdraw(row){
            let form = new FormData();
            form.append('editCustomerWithdraw','1');
            form.append('customertransaction_id', row.row.id);
            form.append('amount',window.prompt("الرجاء إدخال القيمة الجديدة"));
            NotificationManager.warning("يتم تعديل معاملة","الرجاء الإنتظار");
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.text())
            .then(reso => {
              if(reso==="Success"){
                NotificationManager.success("تم تعديل معاملة","نجاح");
              }else{
                NotificationManager.error("فشل تعديل معاملة","فشل");
              }
              this.getCustomerTransactions();
              this.getCardTransactions();
            })
          }
          getRunnerTransactionsCredits(state, instance){
            let form = new FormData();
            form.append('getRunnerTransactionsCredits','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({runnertransactioncredit:{rncdata:reso,rncloading:false}});
            })
          }
          getHouseTransactions(state, instance){
            let form = new FormData();
            form.append('getHouseTransactions','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({housetransaction:{hsdata:reso,hsloading:false}});
            })
          }
          getRunnerTransactions(state, instance){
            let form = new FormData();
            form.append('getRunnerTransactions','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({runnertransaction:{rndata:reso,rnloading:false}});
            })
          }
          getCardTransactions(state, instance){
            let form = new FormData();
            form.append('getCardTransactions','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({cardtransaction:{crdata:reso,crloading:false}});
            })
          }
          getCustomerTransactions(state, instance){
            let form = new FormData();
            form.append('getCustomerTransactions','1');
            fetch(url,{
              method: 'POST',
              body: form,
            })
            .then(res => res.json())
            .then(reso => {
              this.setState({customertransaction:{data:reso}});
            })
          }
          componentDidMount(){
            this.startLoading();
            this.getCustomerTransactions();
            this.getCardTransactions();
            this.getRunnerTransactions();
            this.getRunnerTransactionsCredits();
            this.getHouseTransactions();
            setTimeout(() => {
              this.stopLoading();
            }, 300);
          }
          componentWillUnmount() {
            // fix Warning: Can't perform a React state update on an unmounted component
            this.setState = (state,callback)=>{
                return;
            };
          }
          render(){
            const {loading} = this.state;
            const {data} = this.state.customertransaction;
            const {crdata} = this.state.cardtransaction;
            const {rndata} = this.state.runnertransaction;
            const {rncdata} = this.state.runnertransactioncredit;
            const {hsdata} = this.state.housetransaction;
            return(
              <div>
                <Badge variant="secondary">
                  <h5>المعاملات</h5>
                </Badge>
                <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
                  <Tab eventKey="home" title="التسليمات">
                        <ReactTable
                          columns={[
                            {
                              Header: 'الإشاري',
                              accessor: 'id',
                              sortMethod: (a, b) => {
                                if (a === b) {
                                  return parseInt(a) > parseInt(b) ? 1 : -1;
                                }
                                return parseInt(a) > parseInt(b) ? 1 : -1;
                              },
                            },
                            {
                              Header: 'إشاري البطاقة',
                              accessor: 'card_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                            },
                            {
                              Header: 'رقم الحساب',
                              accessor: 'account_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/customer/${props.value}`}>{props.value}</Link></span>
                            },{
                              Header: 'القيمة',
                              accessor: 'amount',
                              id: 'amount',
                              Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                            },{
                              Header: 'النوع',
                              accessor: 'type', // String-based value accessors!
                              Cell: props => <span className='number'>{props.value = "increase" ? "سحب" : " "}</span>,
                              filterMethod: (filter, row) => {
                                if (filter.value === "all") {
                                  return true;
                                }
                                if (filter.value === "increase") {
                                  return row[filter.id] === "increase";
                                }
                                return row[filter.id] !== "increase";
                              },
                              Filter: ({ filter, onChange }) =>
                                <select
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: "100%" }}
                                  value={filter ? filter.value : "all"}
                                >
                                  <option value="all">الكل</option>
                                  <option value="increase">سحب</option>
                                  <option value="decrease">غير ذلك</option>
                                </select>
                            },{
                              Header: 'السبب',
                              accessor: 'cause' // String-based value accessors!
                            },{
                              Header: 'التاريخ',
                              accessor: 'date' // String-based value accessors!
                            },{
                              Header: 'تعديل',
                              Cell: row => (<Button variant="link" onClick={() => this.editWithdraw(row)}>تعديل</Button>)
                            }
                            ,{
                              Header: 'طباعة',
                              Cell: row => (<Button variant="link" onClick={() => this.reprint(row)}>طباعة</Button>)
                            }
                            ]}
                          className="-striped -highlight"
                          data={data}
                          //pages={pages} // Display the total number of pages
                          loading={loading} // Display the loading overlay when we need it
                          onFetchData={this.getCustomerTransactions} // Request new data when things change
                          noDataText="ﻻ توجد بيانات مطابقة !"
                          loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                          showPaginationTop={true}
                          nextText="التالي"
                          previousText="السابق"
                          rowsText="صفوف"
                          pageText="صفحة"
                          filterable
                          minRows={3}
                          pageSize={tablerows}
                          onPageSizeChange={onPageSizeChange}
                          ref={(r)=>this.custTable=r}
                        />
                        <Button
                        onClick={()=>print({printable: this.custTable.getResolvedState().sortedData,
                        properties: [
                        { field: 'card_id', displayName: 'البطاقة'},
                        { field: 'type', displayName: 'النوع'},
                        { field: 'cause', displayName: 'السبب'},
                        { field: 'date', displayName: 'التاريخ'},
                        { field: 'amount', displayName: 'القيمه'},
                          ],
                          header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3">التسليمات</h3>',
                          style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                          Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                          type: 'json'})}>
                          طباعة
                          </Button>
                  </Tab>
                  <Tab eventKey="profile" title="البطاقات">
                  <ReactTable
                          columns={[
                            {
                              Header: 'الإشاري',
                              accessor: 'id',
                              sortMethod: (a, b) => {
                                if (a === b) {
                                  return parseInt(a) > parseInt(b) ? 1 : -1;
                                }
                                return parseInt(a) > parseInt(b) ? 1 : -1;
                              },
                            },
                            {
                              Header: 'إشاري البطاقة',
                              accessor: 'card_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                            },
                            {
                              Header: 'إشاري الساحب',
                              accessor: 'runner_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                            }, {
                              Header: 'القيمة',
                              accessor: 'amount',
                              id: 'amount',
                              Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                            },{
                              Header: 'النوع',
                              accessor: 'type', // String-based value accessors!
                              Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>),
                              filterMethod: (filter, row) => {
                                if (filter.value === "all") {
                                  return true;
                                }
                                if (filter.value === "increase") {
                                  return row[filter.id] === "increase";
                                }
                                return row[filter.id] !== "increase";
                              },
                              Filter: ({ filter, onChange }) =>
                                <select
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: "100%" }}
                                  value={filter ? filter.value : "all"}
                                >
                                  <option value="all">الكل</option>
                                  <option value="increase">زيادة</option>
                                  <option value="decrease">نقص</option>
                                </select> // Custom cell components!
                            },{
                              Header: 'السبب',
                              accessor: 'cause',
                              filterMethod: (filter, row) => {
                                if (filter.value === "all") {
                                  return true;
                                }
                                if (filter.value === "Draw") {
                                  return row[filter.id] === "Draw";
                                }
                                if (filter.value === "Company Fee Deducted") {
                                  return row[filter.id] === "Company Fee Deducted";
                                }
                                if (filter.value === "Customer Withdraws Money") {
                                  return row[filter.id] === "Customer Withdraws Money";
                                }
                                return row[filter.id] !== "Draw";
                              },
                              Filter: ({ filter, onChange }) =>
                                <select
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: "100%" }}
                                  value={filter ? filter.value : "all"}
                                >
                                  <option value="all">الكل</option>
                                  <option value="Draw">سحب</option>
                                  <option value="Company Fee Deducted">عمولة الشركة</option>
                                  <option value="Customer Withdraws Money">تسليم للزبون</option>
                                </select>
                            },{
                              Header: 'التاريخ',
                              accessor: 'date' // String-based value accessors!
                            },{
                              Header: 'تعديل',
                              Cell: row => (row.row.type==="increase"?<Button variant="link" onClick={() => this.editTrans(row)}>تعديل</Button>:"")
                            }
                            ]}
                          className="-striped -highlight"
                          data={crdata}
                          //pages={pages} // Display the total number of pages
                          loading={loading} // Display the loading overlay when we need it
                          onFetchData={this.getCardTransactions} // Request new data when things change
                          noDataText="ﻻ توجد بيانات مطابقة !"
                          loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                          showPaginationTop={true}
                          nextText="التالي"
                          previousText="السابق"
                          rowsText="صفوف"
                          pageText="صفحة"
                          filterable
                          minRows={3}
                          pageSize={tablerows}
                          onPageSizeChange={onPageSizeChange}
                          ref={(r)=>this.cardTable=r}
                        />
                        <Button
                        onClick={()=>print({printable: this.cardTable.getResolvedState().sortedData,
                        properties: [
                        { field: 'card_id', displayName: 'البطاقة'},
                        { field: 'runner_id', displayName: 'الساحب'},
                        { field: 'type', displayName: 'النوع'},
                        { field: 'cause', displayName: 'السبب'},
                        { field: 'date', displayName: 'التاريخ'},
                        { field: 'amount', displayName: 'القيمه'},
                          ],
                          header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3">معاملات البطاقات</h3>',
                          style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                          Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                          type: 'json'})}>
                          طباعة
                          </Button>
                  </Tab>
                  <Tab eventKey="contact" title="الساحبين">
                    <Tabs defaultActiveKey="fees" transition={false} id="noanim-tab-example">
                      <Tab eventKey="fees" title="العمولات">
                        <ReactTable
                            columns={[
                              {
                                Header: 'الإشاري',
                                accessor: 'id',
                                sortMethod: (a, b) => {
                                  if (a === b) {
                                    return parseInt(a) > parseInt(b) ? 1 : -1;
                                  }
                                  return parseInt(a) > parseInt(b) ? 1 : -1;
                                },
                              },
                              {
                                Header: 'إشاري البطاقة',
                                accessor: 'card_id', // String-based value accessors!
                                Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                              },{
                                Header: 'إشاري الساحب',
                                accessor: 'runner_id', // String-based value accessors!
                                Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                              }, {
                                Header: 'القيمة',
                                accessor: 'amount',
                                id: 'amount',
                                Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                              },{
                                Header: 'النوع',
                                accessor: 'type', // String-based value accessors!
                                Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>),
                                filterMethod: (filter, row) => {
                                  if (filter.value === "all") {
                                    return true;
                                  }
                                  if (filter.value === "increase") {
                                    return row[filter.id] === "increase";
                                  }
                                  return row[filter.id] !== "increase";
                                },
                                Filter: ({ filter, onChange }) =>
                                  <select
                                    onChange={event => onChange(event.target.value)}
                                    style={{ width: "100%" }}
                                    value={filter ? filter.value : "all"}
                                  >
                                    <option value="all">الكل</option>
                                    <option value="increase">زيادة</option>
                                    <option value="decrease">نقص</option>
                                  </select> // Custom cell components!
                              },{
                                Header: 'السبب',
                                accessor: 'cause' // String-based value accessors!
                              },{
                                Header: 'التاريخ',
                                accessor: 'date' // String-based value accessors!
                              },{
                                Header: 'تعديل',
                                Cell: row=><Button onClick={()=>this.editFee(row)}>تعديل</Button>
                              }
                              ]}
                            className="-striped -highlight"
                            data={rndata}
                            //pages={pages} // Display the total number of pages
                            loading={loading} // Display the loading overlay when we need it
                            onFetchData={this.getRunnerTransactions} // Request new data when things change
                            noDataText="ﻻ توجد بيانات مطابقة !"
                            loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                            showPaginationTop={true}
                            nextText="التالي"
                            previousText="السابق"
                            rowsText="صفوف"
                            pageText="صفحة"
                            filterable
                            minRows={3}
                            pageSize={tablerows}
                            onPageSizeChange={onPageSizeChange}
                            ref={(r)=>this.feeTable=r}
                          />
                          <Button
                          onClick={()=>print({printable: this.feeTable.getResolvedState().sortedData,
                          properties: [
                          { field: 'card_id', displayName: 'البطاقة'},
                          { field: 'runner_id', displayName: 'الساحب'},
                          { field: 'type', displayName: 'النوع'},
                          { field: 'cause', displayName: 'السبب'},
                          { field: 'date', displayName: 'التاريخ'},
                          { field: 'amount', displayName: 'القيمه'},
                            ],
                            header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3">العمولات</h3>',
                            style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                            Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                            type: 'json'})}>
                            طباعة
                            </Button>
                      </Tab>
                      <Tab eventKey="credits" title="السحب و الديون">
                        <ReactTable
                              columns={[
                                {
                                  Header: 'الإشاري',
                                  accessor: 'id',
                                  sortMethod: (a, b) => {
                                    if (a === b) {
                                      return parseInt(a) > parseInt(b) ? 1 : -1;
                                    }
                                    return parseInt(a) > parseInt(b) ? 1 : -1;
                                  },
                                },
                                {
                                  Header: 'إشاري الساحب',
                                  accessor: 'runner_id', // String-based value accessors!
                                  Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                                },
                                {
                                  Header: 'إشاري البطاقة',
                                  accessor: 'card_id', // String-based value accessors!
                                  Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                                }, {
                                  Header: 'القيمة',
                                  accessor: 'amount',
                                  id: 'amount',
                                  Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                                },{
                                  Header: 'النوع',
                                  accessor: 'type', // String-based value accessors!
                                  Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>),
                                  filterMethod: (filter, row) => {
                                    if (filter.value === "all") {
                                      return true;
                                    }
                                    if (filter.value === "increase") {
                                      return row[filter.id] === "increase";
                                    }
                                    return row[filter.id] !== "increase";
                                  },
                                  Filter: ({ filter, onChange }) =>
                                    <select
                                      onChange={event => onChange(event.target.value)}
                                      style={{ width: "100%" }}
                                      value={filter ? filter.value : "all"}
                                    >
                                      <option value="all">الكل</option>
                                      <option value="increase">زيادة</option>
                                      <option value="decrease">نقص</option>
                                    </select> // Custom cell components!
                                },{
                                  Header: 'السبب',
                                  accessor: 'cause' // String-based value accessors!
                                },{
                                  Header: 'التاريخ',
                                  accessor: 'date' // String-based value accessors!
                                },{
                                  Header: 'تعديل',
                                  Cell: row=>row.row.type==="increase"?<Button onClick={()=>this.handleEditRunnerCredit(row)}>تعديل</Button>:""
                                }
                                ]}
                              className="-striped -highlight"
                              data={rncdata}
                              //pages={pages} // Display the total number of pages
                              loading={loading} // Display the loading overlay when we need it
                              onFetchData={this.getRunnerTransactionsCredits} // Request new data when things change
                              noDataText="ﻻ توجد بيانات مطابقة !"
                              loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                              showPaginationTop={true}
                              nextText="التالي"
                              previousText="السابق"
                              rowsText="صفوف"
                              pageText="صفحة"
                              filterable
                              minRows={3}
                              pageSize={tablerows}
                              onPageSizeChange={onPageSizeChange}
                              ref={(r)=>this.rcTable=r}
                            />
                            <Button
                            onClick={()=>print({printable: this.rcTable.getResolvedState().sortedData,
                            properties: [
                            { field: 'card_id', displayName: 'البطاقة'},
                            { field: 'runner_id', displayName: 'الساحب'},
                            { field: 'type', displayName: 'النوع'},
                            { field: 'cause', displayName: 'السبب'},
                            { field: 'date', displayName: 'التاريخ'},
                            { field: 'amount', displayName: 'القيمه'},
                              ],
                              header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3">معاملات السحب و الديون</h3>',
                              style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                              Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                              type: 'json'})}>
                              طباعة
                              </Button>
                      </Tab>
                    </Tabs>


                  </Tab>
                  <Tab eventKey="contactus" title="الشركة">
                  <ReactTable
                          columns={[
                            {
                              Header: 'الإشاري',
                              accessor: 'id',
                              sortMethod: (a, b) => {
                                if (a === b) {
                                  return parseInt(a) > parseInt(b) ? 1 : -1;
                                }
                                return parseInt(a) > parseInt(b) ? 1 : -1;
                              },
                            },
                            {
                              Header: 'إشاري البطاقة',
                              accessor: 'card_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/card/${props.value}`}>{props.value}</Link></span>
                            }, {
                              Header: 'إشاري الساحب',
                              accessor: 'runner_id', // String-based value accessors!
                              Cell: props => <span className='number'><Link to={`/admin/runner/${props.value}`}>{props.value}</Link></span>
                            }, {
                              Header: 'القيمة',
                              accessor: 'amount',
                              id: 'amount',
                              Cell: props => <span className='number'>{props.value != null ? props.value : "0"}</span> // Custom cell components!
                            },{
                              Header: 'النوع',
                              accessor: 'type', // String-based value accessors!
                              Cell: props => props.value === "increase" ? (<span className='number' style={{backgroundColor: "green"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>) : (<span className='number' style={{backgroundColor: "red"}}>{props.value === "increase" ? "زيادة" : (props.value === "decrease"? "نقص":"خطأ")}</span>),
                              filterMethod: (filter, row) => {
                                if (filter.value === "all") {
                                  return true;
                                }
                                if (filter.value === "increase") {
                                  return row[filter.id] === "increase";
                                }
                                return row[filter.id] !== "increase";
                              },
                              Filter: ({ filter, onChange }) =>
                                <select
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: "100%" }}
                                  value={filter ? filter.value : "all"}
                                >
                                  <option value="all">الكل</option>
                                  <option value="increase">زيادة</option>
                                  <option value="decrease">نقص</option>
                                </select> // Custom cell components!
                            },{
                              Header: 'السبب',
                              accessor: 'cause' // String-based value accessors!
                            },{
                              Header: 'التاريخ',
                              accessor: 'date' // String-based value accessors!
                            },{
                              Header: 'تعديل',
                              Cell: row=>row.row.type==="increase"?<Button onClick={()=>this.editHouseFee(row)}>تعديل</Button>:<Button onClick={()=>this.editHouseRFee(row)}>تعديل</Button>
                            }
                            ]}
                          className="-striped -highlight"
                          data={hsdata}
                          //pages={pages} // Display the total number of pages
                          loading={loading} // Display the loading overlay when we need it
                          onFetchData={this.getHouseTransactions} // Request new data when things change
                          noDataText="ﻻ توجد بيانات مطابقة !"
                          loadingText={
                            <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                            </>
                            }
                          showPaginationTop={true}
                          nextText="التالي"
                          previousText="السابق"
                          rowsText="صفوف"
                          pageText="صفحة"
                          filterable
                          minRows={3}
                          pageSize={tablerows}
                          onPageSizeChange={onPageSizeChange}
                          ref={(r)=>this.houseTable=r}
                        />
                        <Button
                        onClick={()=>print({printable: this.houseTable.getResolvedState().sortedData,
                        properties: [
                        { field: 'card_id', displayName: 'البطاقة'},
                        { field: 'runner_id', displayName: 'الساحب'},
                        { field: 'type', displayName: 'النوع'},
                        { field: 'cause', displayName: 'السبب'},
                        { field: 'date', displayName: 'التاريخ'},
                        { field: 'amount', displayName: 'القيمه'},
                          ],
                          header: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1><h3 class="custom-h3">معاملات الشركه</h3>',
                          style: '.custom-h3 { font-style: italic; text-align: center; } .custom-h1 { font-style: italic; text-align: center; }',
                          Footer: '<h1 class="custom-h1"> '+process.env.REACT_APP_PRINT_TITLE+'</h1>',
                          type: 'json'})}>
                          طباعة
                          </Button>
                  </Tab>
                </Tabs>
              </div>
            );
          }
        }
        
    return (
      <div className="App">
        <Navbar dir="rtl" bg="light" variant="light" className="bs-navbar-collapse" expand="lg">
            <Navbar.Brand>
              <Link to="/fasi"><span className="company-name">{process.env.REACT_APP_COMPANY_NAME}</span> <small style={{color:"#ffd700", fontSize:"10px"}}>{packageJson.version}</small></Link>
            </Navbar.Brand>
              <LinkContainer to="#" title="تحديث البيانات" onClick={()=>this.componentDidMount()}>
                <Nav.Link href="#"><FontAwesomeIcon className={this.state.loading?"refresh":""} icon={faSync} /></Nav.Link>
              </LinkContainer>
              <LinkContainer to="#" title="وضع الظلام" onClick={this.darkreaderToggle}>
                <Nav.Link href="#"><FontAwesomeIcon icon={faLightbulb} /></Nav.Link>
              </LinkContainer>
            <Navbar.Toggle />
          <Navbar.Collapse>
            {this.state.isLoggedIn ? (
            <Nav className="mr-auto">
              <LinkContainer to="/admin/customers">
                <Nav.Link href="#/admin/customers">الزبائن</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin/runners">
                <Nav.Link href="#/admin/runners">الساحبون</Nav.Link>
              </LinkContainer>
              <NavDropdown title="البطاقات" id="basic-nav-dropdown">
                <LinkContainer to="/admin/cards">
                  <NavDropdown.Item href="#/admin/cards">البطاقات</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/debtcards">
                  <NavDropdown.Item href="#/admin/debtcards">بطاقات عليها ديون</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/creditcards">
                  <NavDropdown.Item href="#/admin/creditcards">بطاقات لها ديون</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/sendCard">
                  <NavDropdown.Item href="#/admin/sendCard">إرسال البطاقات</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/recCard">
                  <NavDropdown.Item href="#/admin/recCard">إستقبال البطاقات</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/queue">
                  <NavDropdown.Item href="#/admin/queue">بطاقات فالإنتظار</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title="الإيداعات" id="basic-nav-dropdown">
                <LinkContainer to="/admin/deposits">
                  <NavDropdown.Item href="#/admin/deposits">إيداعات غير مؤكدة</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/vdeposits">
                  <NavDropdown.Item href="#/admin/vdeposits">إيداعات مؤكدة</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title="المزيد" id="basic-nav-dropdown">
              <LinkContainer to="/admin/transactions">
                <NavDropdown.Item href="#/admin/transactions">المعاملات</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/reports">
                <NavDropdown.Item href="#/admin/reports">التقارير</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/banks">
                <NavDropdown.Item href="#/admin/banks">المصارف</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/logs">
                <NavDropdown.Item href="#/admin/logs">السجلات</NavDropdown.Item>
              </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/settings">
                  <NavDropdown.Item href="#/admin/settings">الإعدادات</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item href="#/admin/users">المستخدمون</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/logout" onClick={this.logout}>
                  <NavDropdown.Item href="#/logout">تسجيل الخروج</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>)
            :null
            }
          </Navbar.Collapse>
        </Navbar>

        <Switch>
        <Route path="/admin" render={() => (
          this.state.isLoggedIn ? (
            <Switch>
            <Route path="/admin/customers" render={pg_customer} />
            <Route path="/admin/cards" render={pg_card} />
            <Route path="/admin/debtcards" render={pg_debtcard} />
            <Route path="/admin/creditcards" render={pg_creditcard} />
            <Route path="/admin/addCustomer" render={pg_addCustomer} />
            <Route path="/admin/runners" render={pg_runner} />
            <Route path="/admin/runner/:id" component={Cmp_runner} />
            <Route path="/admin/addRunner" render={pg_addRunner} />
            <Route path="/admin/sendCard" render={sendCard}/>
            <Route path="/admin/recCard" component={recCard}/>
            <Route path="/admin/queue" render={pg_queue}/>
            <Route path="/admin/transactions" component={Transactions}/>
            <Route path="/admin/logs" render={Logs}/>
            <Route path="/admin/users" render={Users}/>
            <Route path="/admin/customer/:id" component={Custo} />
            <Route path="/admin/customertransaction/:id/:amount/:card" component={CustomerTransaction} />
            <Route path="/admin/card/:id" component={Card} />
            <Route path="/admin/settings" render={Settings} />
            <Route path="/admin/deposits" component={Deposits} />
            <Route path="/admin/vdeposits" render={VDeposits} />
            <Route path="/admin/banks" render={pg_bank} />
            <Route path="/admin/addBank" render={pg_addBank} />
            <Route path="/admin/editBank/:id/:fee" render={pg_editBank} />
            <Route path="/admin/addCard" />
            <Route path="/admin/reports" component={Reports}/>
            </Switch>

          ) : (
            <Redirect to="/login"/>
          )
        )}/>

        <Route path="/fasi" render={home_header} />
        <Route path="/login" render={()=>(
          this.state.isLoggedIn ? (
            <Redirect to="/admin/customers"/>
          ):
          <Login/>
        )} />
        <Route path="/" component={Welcome}/>
        <Route path="*" render={alert404} />
        </Switch>
        <div id="shiner" className="shiner"></div>
        <NotificationContainer/>
        <ProgressBar/>
      </div>
    );
  }
}