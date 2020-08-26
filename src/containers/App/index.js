import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import './App.css';

import ErrorMessage from '../../components/errorMessages'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Home from '../Home'
import NoMatch from '../NoMatch'

const ERROR_TIMELIFE = 13000
const ERROR_CHECK_TIME = 10000

function App() {
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
        if(errors.length && errors[0].date + ERROR_TIMELIFE < Date.now()){ 
            const [, ...newError] = errors
            setErrors(newError)
        }
    }, ERROR_CHECK_TIME);

    return () => clearInterval(interval)
  })

  return (
    <div className="App">
      <Router>
        {errors.length? <ErrorMessage errors={errors} />:''}

        <Header />
        
        <div className="container content">
          <Switch>
            <Route exact path="/">
              <Home errors={errors} setErrors={setErrors} />
            </Route>
            <Route path="/*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
