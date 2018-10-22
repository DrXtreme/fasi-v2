import React, {Component} from 'react';
import { Button } from 'react-bootstrap';


class Welcome extends Component {
 render() {
 return (
 <div className="row " id="Body">
 <div className="medium-12 columns">
 <h2 id="welcomeText">إجعل الناس تقع في حب أفكارك</h2>
 <Button href="/login" className="button">الدخول</Button>
 <Button href="/signup" className="button success">التسجيل</Button>
 </div>
 </div>
);
}
}
export default Welcome;