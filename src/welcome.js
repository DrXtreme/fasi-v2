import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Welcome extends Component {
 render() {
 return (
 <div className="row " id="Body">
 <div className="medium-12 columns">
 <h2 id="welcomeText">إجعل الناس تقع في حب أفكارك</h2>
 <LinkContainer to="/build/login"><Button className="button">الدخول</Button></LinkContainer>
 <LinkContainer to="/build/signup"><Button className="button success">التسجيل</Button></LinkContainer>
 </div>
 </div>
);
}
}
export default Welcome;