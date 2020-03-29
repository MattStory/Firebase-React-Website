import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboard/Dashboard'
import ProjectDetails from './components/projects/ProjectDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject'
import Profile from './components/profile/profile'
import Financials from './components/financials/Financials'
import createFund from './components/financials/CreateFund'
import reset from './components/auth/reset'
import Memos from './components/Memos/memos'
import Messages from './components/messaging/messages'
import Transactions from "./components/transactions/Transactions";
import CreateTransaction from "./components/transactions/CreateTransaction";
import Visualizations from "./components/visualizations/chart"

class App extends Component {
  render(){
  return (
    <BrowserRouter>
    <div className="App">
     <Navbar/>
     <Switch>
       <Route exact path ='/' component ={Dashboard}/>
       <Route path ='/project/:id' component={ProjectDetails}/>
       <Route path ='/signin' component ={SignIn}/>
       <Route path ='/signup' component ={SignUp}/>
       <Route path ='/create' component ={CreateProject}/>
       <Route path ='/financials' component ={Financials}/>
       <Route path ='/transactions' component={Transactions}/>
       <Route path ='/create_transaction' component={CreateTransaction}/>
       <Route path ='/profile' component ={Profile}/>
       <Route path ='/createFund' component ={createFund}/>
       <Route path ='/reset' component ={reset}/>
       <Route path='/memos' component={Memos}/>
       <Route path='/messages' component={Messages}/>
       <Route path='/visualizations' component={Visualizations}/>
     </Switch>
    </div>
    </BrowserRouter>
  );
}
}
export default App;
