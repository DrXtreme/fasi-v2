import React, {Component} from 'react';
import './Login.css';
import { NotificationManager } from 'react-notifications';
import {Button} from 'react-bootstrap';

class Login extends Component {

  constructor(){
    super();

    this.state = {
     username: '',
     password: '',
     redirectToReferrer: false,
     disabled: false
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);

  }



  login(e) {
    e.preventDefault();
    this.setState({disabled:true});
    if(this.state.username && this.state.password){
      fetch(''+process.env.REACT_APP_SERVER_URL+'/login',{
        method: 'POST',
        body: JSON.stringify(this.state)
      })
      .then((result) => {
       if(result.status===200){         
        //  sessionStorage.setItem('userData',JSON.stringify(responseJson));
        //  this.props.afterLogin();
         NotificationManager.success("تم الدخول بنجاح كمدير","نجاح");
         window.location.replace('/admin/customers');
       }else{
         NotificationManager.error("لا يمكنك تسجيل الدخول","خطأ");
         this.setState({disabled:false});
       }
      });
    }
   }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  //  componentDidMount(){

  //  }

  render() {

    // if (this.state.redirectToReferrer || sessionStorage.getItem('userData')){
    //   return (<Redirect to={'/home'}/>)
    //   }

     return (
      <div style={{textAlign:"center",width:"100%"}}>
          <h4>تسجيل الدخول</h4><br />
          <form onSubmit={this.login} style={{textAlign:"center",width:"100%"}}>
            <label>معرف الدخول</label><br />
            <input type="text" name="username" placeholder="Username" className="form-control" onChange={this.onChange} style={{width:'300px',margin: 'auto'}} disabled={this.state.disabled}/><br />
            <label>كلمة السر</label><br />
            <input type="password" name="password"  placeholder="Password" className="form-control" onChange={this.onChange} style={{width:'300px',margin: 'auto'}} disabled={this.state.disabled}/><br /><br />
            <Button type="submit" className="btn btn-info" value="Login" onClick={this.login} disabled={this.state.disabled}>دخول</Button>
          </form>
      </div>
    );
  }
}

export default Login;
