import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../Header';
import Landing from '../Landing';
import Footer from '../Footer';
import Welcome from '../Welcome';
import Login from '../Login';
import Signup from '../Signup';
import ErrorPage from '../ErrorPage';
import ForgetPassword from '../ForgetPassword';
import { IconContext } from "react-icons";

import '../../App.css';

function App() {
  return (
    <Router>
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Header />

        <Switch>
          <Route exact path='/' component={Landing} />
          <Route path='/Welcome' component={Welcome} />
          <Route path='/Login' component={Login} />
          <Route path='/Signup' component={Signup} />
          <Route path='/ForgetPassword' component={ForgetPassword} />
          <Route component={ErrorPage} />
        </Switch>

          <Footer />
      </IconContext.Provider>
    </Router>
  );
}

export default App;
