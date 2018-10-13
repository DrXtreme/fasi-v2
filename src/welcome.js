import React, {Component} from 'react';
import { Button } from 'react-bootstrap';


class Welcome extends Component {
 render() {
 return (
 <div className="row " id="Body">
 <div className="medium-12 columns">
 <h2 id="welcomeText">Make people fall in love with your ideas</h2>
 <Button href="/login" className="button">Login</Button>
 <Button href="/signup" className="button success">Signup</Button>
 </div>
 </div>
);
}
}
export default Welcome;