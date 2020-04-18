import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link, Redirect} from "react-router-dom";
import {components} from "react-select";
import {createTransaction} from "../../store/actions/transactionActions"
import {addpayment} from '../../store/actions/paymentAction';
import {deletePayment} from '../../store/actions/paymentAction'

import CreateEditTransaction from "./CreateEditTransaction";
import TransactionList from "./TransactionList";

// Basic Table Module
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Cell Editing Module (Doesnt work for some reason lol)
import cellEditFactory from 'react-bootstrap-table2-editor';

// Pagination Module
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// Columns for table
const columns = [{
    dataField: 'id',
    hidden: true
}, {
    dataField: 'merchant',
    text: 'Merchant',
    sort: true
}, {
    dataField: 'amount',
    text: 'Amount',
    sort: true,
    sortFunc: (a, b, order) => {
        if(order === 'desc') {
            return a - b;
        }
        else {
            return b - a;
        }
    }
}, {
    dataField: 'transactionDate',
    text: 'Transaction Date',
    sort: true
}];

// Page pagination options
const paginationOption = {
    sizePerPage: 10,
    hideSizePerPage: true,
    withFirstAndLast: false,
    hidePageListOnlyOnePage: true
};

// Options for when selecting a row
const selectRows = {
    mode: 'checkbox',
    clickToSelect: true,
    bgColor: '#68DE11',
    selectColumnStyle: {
        backgroundColor: '#68DE11'
    },
    clickToEdit: true
};

// Set default sorted state to descending by transaction date
const defaultSorted = [{
    dataField: 'transactionDate',
    order: 'desc'
}];

const cellEdit = {
    mode: 'dbclick'
};


class Transactions extends Component{

    componentDidMount() {
            // ----------- Haiders code --------
            var l;
            console.log(this.props);
            var today = new Date();
            if ((today.getMonth() + 1) < 10) {
                var todayDate = today.getFullYear() + "-" + "0" +  (today.getMonth() + 1) + "-" + today.getDate();
            } else {
                var todayDate = today.getFullYear() + "-" +  (today.getMonth() + 1) + "-" + today.getDate();
            }
            if (this.props.payments) {
                for (var i = 0; i < this.props.payments.length; i++) {
                    if (todayDate === this.props.payments[i].date) {
                        console.log(this.props.payments[i].date);
                        const obj = {
                            amount: this.props.payments[i].amount,
                            merchant: this.props.payments[i].title,
                            id: this.props.payments[i].id,
                            transactionDate: todayDate,
                        };
                        console.log("Here wanting to create a trans");
                        this.props.deleting(this.props.payments[i].id);
                        this.props.createTransaction(obj,this.props.history);
                       if ((today.getMonth() + 1) < 10) {                       
                        var todayDate1 = today.getFullYear() + "-" + "0" +  (today.getMonth() + 2) + "-" + today.getDate();
                    } else {
                        var todayDate1 = today.getFullYear() + "-" +  (today.getMonth() + 2) + "-" + today.getDate();
                    }
                    
                     l = {
                        amount: this.props.payments[i].amount,
                        account: this.props.payments[i].account,
                        category: this.props.payments[i].category,
                        date: todayDate1,
                        title: this.props.payments[i].title,
                    };
                    console.log(l.date);
                    console.log(this.props.payments[i]);
                    console.log("i", i);
                    this.props.addpayment(l);
                    }
                    // console.log("In the array", f.date);
                    // console.log("TodayDate: ", todayDate);
                }
            }
            // ----------- Haiders code --------
    }
    
    render() {

        return(
            <div className={"container mt"}>       
                <div className ="card z-depth-3">
                    {this.props.transactions != null
                        ?
                        <BootstrapTable
                            keyField="id"
                            data={ this.props.transactions }
                            columns={ columns }
                            pagination={ paginationFactory(paginationOption) }
                            selectRow={ selectRows }
                            defaultSorted={ defaultSorted }
                            cellEdit={ cellEditFactory(cellEdit) }
                            noDataIndication="Table is Empty"
                        />
                        :
                        null
                    }                    
                </div>

                <Link to={"/create_edit_transaction"} className={"btn green lighten-1 center mt"}>New Transaction</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        transactions: state.firestore.ordered.transactions,
        payments: state.firestore.ordered.payments,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        createTransaction: (transaction, history) => dispatch(createTransaction(transaction, history)),
        deleting : (id) => { dispatch(deletePayment(id)) },
        addpayment: (id) => { dispatch(addpayment(id))},


    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userTransactions' }],
                    storeAs: 'transactions'
                },
                {
                    collection: 'payments', 
                    where: ['uid', '==', props.auth.uid]
                }
            ]
        } else {
            return []
        }
    })
)(Transactions)