import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import Paymentfunc from './Paymentfunc'
import {editFund} from "../../store/actions/fundActions";
import {createTransaction} from "../../store/actions/transactionActions";
import {addpayment} from '../../store/actions/paymentAction';

class Payments extends Component {


    state = {
        title : "",
        amount: "",
        account: "",
        category:"", 
        date : "",
        time: "",
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        })
    }

    checkTime = (time) => {
        console.log("In the function");
        const regex = /[0-9]{2}\:[0-9]{2}/;
        if (time.match(regex)){
            console.log("Caught");
            return true;
        } else {
            console.log ("fucked");
            return false;
        }
    }

    checkAccount = (account) => {
        // console.log(this.props.funds);
        var flag = false;
        if (this.props.funds) {
             this.props.funds.map(funds => {
                if (funds.fundType === account) {
                    flag = true;
                }
            })
        }
        return flag;
    }


    handelSubmit = (event) => {
        event.preventDefault();
        if (!this.checkAccount(this.state.account)) {
            console.log ("fUcKeD aGaIn")
            window.alert("This fund type does not exsist please enter an exsisting account");
            this.setState({
                account: "",
            })
        } else { 
            if (this.checkTime(this.state.time)) {
                this.props.addpayment(this.state);
                this.setState ({
                    title : "",
                    amount: "",
                    account: "", 
                    date : "",
                    time: "",
                });
                window.alert("Your Recurring Payment is going to start from the next date.")

            } else {
                window.alert("Please enter the time in \"HH:MM\" format pleas");
                this.setState ({
                    time: "",
                });
            }
    }
}

    
    render() { 
        console.log(this.props);
        let data = undefined;
        //        console.log("UID", this.props.auth.uid);
                if (this.props.payments !== undefined) {
                  data = this.props.payments.filter( payments => {
                     return this.props.auth.uid === payments.uid
                 });
                }
        return ( 
            <div className="container">
            <form onSubmit={this.handelSubmit} className ="white">
            <h5 className ="grey-text text-darken-3">Create Payments</h5>
            <div id = "title" className = "input-field">
                <label htmlFor="title">Title</label>
                <input type ="text" id="title" onChange ={this.handleChange} value={this.state.title}/>
            </div>
            <div className = "input-field">
                <label htmlFor="amount">Amount</label>
                <textarea  id="amount"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.amount} required={true}></textarea>
            </div>
            <div className = "input-field">
                <label htmlFor="account">Financial account</label>
                <textarea  id="account"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.account} required={true}></textarea>
            </div>
            <div className = "input-field">
                <label htmlFor="category">Category</label>
                <textarea  id="category"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.category} required={true}></textarea>
            </div>
            <div className = "input-field">
                <label htmlFor="time">Time</label>
                <textarea  id="time"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.time} placeholder="hh:mm" required={true}></textarea>
            </div>
            <div className={"input-field"}>
                        <input type={"date"} id={'date'} required={true} onChange={this.handleChange} value={this.state.date}/>
                        <label htmlFor={'transactionDate'}>Date</label>
            </div>
            <div className ="input-field">
                <button className = "btn green lighten-1 z-depth-0">Create</button>
            </div>
            </form>
            <Paymentfunc data={data}/>
            </div>
         );
    }
}

const mapStateToProps = (state) => {
    return {
        payments : state.firestore.ordered.payments,
        funds : state.firestore.ordered.funds,
        transactions: state.firestore.ordered.transactions,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        addpayment: (id) => { dispatch(addpayment(id))},
        editFund: (fund) => {dispatch(editFund(fund))},
        createTransaction: (transaction, history) => dispatch(createTransaction(transaction, history)),
    }
}


//export default connect(matchStatetoProps , mapDispatchToProps)(Memos);
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'payments', 
                    where: ['uid', '==', props.auth.uid]
                },
                {
                    collection: 'funds', 
                    where: ['uid', '==', props.auth.uid]
                },
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userTransactions' }],
                    storeAs: 'transactions'
                }
            ]
        } else{
            return []
        }
    })
)(Payments)
 
