import React, {Component} from 'react';
import {PostData} from './PostData';
import './Login.css';
import { NotificationManager } from 'react-notifications';

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

  

  login() {
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
      <div className="row" id="Body">
        <div className="medium-5 columns left">
        <h4>Login</h4><br />
        <label>Username</label><br />
        <input type="text" name="username" placeholder="Username" onChange={this.onChange}/><br />
        <label>Password</label><br />
        <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/><br />
        <input type="submit" className="button success" value="Login" onClick={this.login}/>
        </div>
      </div>
    );
  }
}

export default Login;