import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link, Redirect} from "react-router-dom";
import {components} from "react-select";
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
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userTransactions' }],
                    storeAs: 'transactions'
                }
            ]
        } else {
            return []
        }
    })
)(Transactions)