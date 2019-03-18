import React, {Component} from 'react';
import {PostData} from './PostData';
import './Login.css';
import { NotificationManager } from 'react-notifications';
import {Button} from 'react-bootstrap';
import { MDBInput, Table } from "mdbreact";

class Login extends Component {

  constructor(){
    super();
   
    this.state = {
     username: '',
     password: '',
     redirectToReferrer: false
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  

  login(e) {
    e.preventDefault();
    if(this.state.username && this.state.password){
      PostData('login',this.state).then((result) => {
       let responseJson = result;
       if(responseJson.userData){         
         sessionStorage.setItem('userData',JSON.stringify(responseJson));
         this.setState({redirectToReferrer: true});
         NotificationManager.success("تم الدخول بنجاح كمدير","نجاح");
         window.location.replace('/build/admin/customers');
       }else{
         NotificationManager.error(responseJson.error.text,"خطأ");
       }
       
      });
    }
    
   }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  
  

  render() {

    // if (this.state.redirectToReferrer || sessionStorage.getItem('userData')){
    //   return (<Redirect to={'/home'}/>)
    //   }

     return (
      <div style={{textAlign:"center",width:"100%"}}>
          <h4>تسجيل الدخول</h4><br />
          <form onSubmit={this.login} style={{textAlign:"center",width:"100%"}}>
            <label>معرف الدخول</label><br />
            <input type="text" name="username" placeholder="Username" className="form-control" onChange={this.onChange} style={{width:'300px',margin: 'auto'}}/><br />
            <label>كلمة السر</label><br />
            <input type="password" name="password"  placeholder="Password" className="form-control" onChange={this.onChange} style={{width:'300px',margin: 'auto'}}/><br /><br />
            <Button type="submit" className="btn btn-info" value="Login" onClick={this.login}>دخول</Button>
          </form>
      </div>
    );
  }
}

export default Login;