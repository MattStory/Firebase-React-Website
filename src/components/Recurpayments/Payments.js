import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import Paymentfunc from './Paymentfunc'
import Select from 'react-select';
import materialize from "materialize-css";
import {editFund} from "../../store/actions/fundActions";
import {createTransaction} from "../../store/actions/transactionActions";
import {addpayment} from '../../store/actions/paymentAction';


const transactionCategory = [
    { value: "Dining", label: "Dining"},
    { value: "Travel", label: "Travel"},
    { value: "Tuition", label: "Tuition"},
    { value: "Grocery", label: "Grocery"},
    { value: "Bar & Coffee Shop", label: "Bar & Coffee Shop"},
    { value: "Fee", label: "Fee"}];

class Payments extends Component {
    
    componentDidMount() {
        const options = {
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: true,
            startingTop: "4%",
            endingTop: "10%"
        };
        materialize.Modal.init(this.newCategoryModal, options);
    }

    state = {
        title : "",
        amount: "",
        account: "",
        category:"", 
        date : "",
        //time: "",
    }
    
    handleCategoryChange = (e) => {
        this.setState({
            category: e.value
        })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        })
    }

    handleFinancialAcctChange = (e) => {
        let acctBalance = 0;
        // add original account balance to state for fund update
        for (let i = 0; i < this.props.userFunds.length; i++){
            if (this.props.userFunds[i].id === e.value){
                acctBalance = this.props.userFunds[i].balance;
                break;
            }
        }
        this.setState({
            account: e.value,
            acctBalance: acctBalance
        });
    };

    // checkTime = (time) => {
    //     console.log("In the function");
    //     const regex = /[0-9]{2}\:[0-9]{2}/;
    //     if (time.match(regex)){
    //         console.log("Caught");
    //         return true;
    //     } else {
    //         console.log ("fucked");
    //         return false;
    //     }
    // }

    // checkAccount = (account) => {
    //     // console.log(this.props.funds);
    //     var flag = false;
    //     if (this.props.funds) {
    //          this.props.funds.map(funds => {
    //             if (funds.fundType === account) {
    //                 flag = true;
    //             }
    //         })
    //     }
    //     return flag;
    // }


    handelSubmit = (event) => {
        event.preventDefault();
        // if (!this.checkAccount(this.state.account)) {
        //     console.log ("fUcKeD aGaIn")
        //     window.alert("This fund type does not exsist please enter an exsisting account");
        //     this.setState({
        //         account: "",
        //     })
        // } else { 
            this.setState({
                ...this.state,
                nickname: this.state.title,
            })
                this.props.addpayment(this.state);
                this.setState ({
                    title : "",
                    amount: "",
                    account: "", 
                    date : "",
                    category:"", 
                });
                window.alert("Your Recurring Payment is going to start from the next date.")
    
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
        let userFunds = [];
        let categories = [];

        if (this.props.userFunds !== undefined) {
            this.props.userFunds.forEach(userFund => {
                let formattedFund = {};
                let label = userFund.nickname + ' ' + userFund.fundType + ', Balance: $' + userFund.balance;
                let value = userFund.id;
                formattedFund['label'] = label;
                formattedFund['value'] = value;

                userFunds.push(formattedFund);
            }) 
        } else {
            userFunds = [{value: '', label: 'loading...'}];
        }
        if (this.props.categories !== undefined) {
            this.props.categories.forEach(categorie => {
                let formattedCategory = {};
                let label = categorie.category;
                let value = categorie.category;
                formattedCategory['label'] = label;
                formattedCategory['value'] = value;

                categories.push(formattedCategory);
            })
        } else {
            categories = [{value: '', label: 'loading...'}];
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
            {/* <div className = "input-field">
                <label htmlFor="account">Financial account</label>
                <textarea  id="account"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.account} required={true}></textarea>
            </div> */}
            <div className={"input-field"}>
                        <Select
                            className={"financialAccount"}
                            name={"financialAccount"}
                            placeholder={"Financial Account"}
                            options={userFunds}
                            onChange={this.handleFinancialAcctChange}
                        />
                    </div>
            
            {/* { <div className = "input-field">
                <label htmlFor="time">Time</label>
                <textarea  id="time"  className="materialize-textarea" onChange ={this.handleChange} value={this.state.time} placeholder="hh:mm" required={true}></textarea>
            </div> } */}
            <div className={"input-field"}>
                        <input type={"date"} id={'date'} required={true} onChange={this.handleChange} value={this.state.date}/>
                        <label htmlFor={'transactionDate'}>Date</label>
            </div>
            {/* <div className={"input-field"}>
                        <Select
                            className={"category"}
                            name={"category"}
                            placeholder={"Category"}
                            options={transactionCategory}
                            onChange={this.handleCategoryChange}
                        />
                    </div> */}
                    <div className={"input-field"}>
                        <Select
                            className={"transactionCategory"}
                            name={"transactionCategory"}
                            placeholder={"Category"}
                            options={categories}
                            onChange={this.handleCategoryChange}
                        />
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
        categories: state.firestore.ordered.categories,
        userFunds: state.firestore.ordered.userFunds,
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
                    where: [
                        ['uid', '==', props.auth.uid]
                    ],
                    storeAs: 'userFunds'
                },
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userTransactions' }],
                    storeAs: 'transactions'
                },
                 {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{collection: 'customCategories'}],
                    storeAs: 'categories'
                }
            ]
        } else{
            return []
        }
    })
)(Payments)
 
