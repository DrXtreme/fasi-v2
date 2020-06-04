import React, {Component} from 'react';
import { Button, Carousel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// import LazyLoad from 'react-lazy-load';

class Welcome extends Component {
    
 render() {
   
 return (
 <div style={{alignContent:"center"}}>
 
 <Carousel controls={true}>
    <Carousel.Item>
    {/* <LazyLoad height={400}> */}
        {/* <img
            className="d-block w-100"
            src="https://source.unsplash.com/random/1600x900"
            style={{"width":"100%","max-height":"500px"}}
        /> */}
    {/* </LazyLoad> */}
    <div style={{height:"300px",width:"100%",padding:"10px",margin:"10px"}}></div>
    <div className="filler"/>
        <Carousel.Caption>
        <h3 style={{color:"#ffd700"}}>التكنولوجيا هي أي شيء لم يكن موجودًا عند ولادتك</h3>
        <LinkContainer to="/login"><Button className="btn btn-info">الدخول</Button></LinkContainer>
        </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
        {/* <img
        className="d-block w-100"
        src="https://source.unsplash.com/random/1600x900"
        alt="loading..."
        style={{"width":"100%","max-height":"500px"}}
        /> */}
        <div style={{height:"300px",width:"100%"}}></div>
        <Carousel.Caption>
        <h3 style={{color:"#ffd700"}}>لإتقان تقنية جديدة ، عليك اللعب بها.</h3>
        <LinkContainer to="/login"><Button className="btn btn-info">الدخول</Button></LinkContainer>
        </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
        {/* <img
        className="d-block w-100"
        src="https://source.unsplash.com/random/1600x900"
        alt="loading..."
        style={{"width":"100%","max-height":"500px"}}
        /> */}
        <div style={{height:"300px",width:"100%"}}></div>
        <Carousel.Caption>
        <h3 style={{color:"#ffd700"}}>العصر الحجري. العصر البرونزي. العصر الحديدي. نحدد ملاحم كاملة للبشرية من خلال التكنولوجيا التي يستخدمونها.</h3>
        <LinkContainer to="/login"><Button className="btn btn-info">الدخول</Button></LinkContainer>
        </Carousel.Caption>
    </Carousel.Item>
</Carousel>
 {/* <LinkContainer to="/signup"><Button className="button success">التسجيل</Button></LinkContainer> */}
 </div>
);
}
}
export default Welcome;