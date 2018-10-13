import React, {Component} from 'react';
// import './Login.css';
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
 //API Action Here
}


onChange(e){
 this.setState({[e.target.name]:e.target.value});
}


render() {
 return (
 <div className="row" id="Body">
 <div className="medium-5 columns left">
 <h4>Login</h4>
 <label>Username</label>
 <input type="text" name="username" onChange={this.onChange}/>
 <label>Password</label>
 <input type="password" name="password" onChange={this.onChange}/>
 <input type="submit" value="Login" onClick={this.login}/>
 <a href="/signup">Registration</a>
 </div>
 </div>
);
}
}
export default Login;