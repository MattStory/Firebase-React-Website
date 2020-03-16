import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link, Redirect} from "react-router-dom";
import './Transactions.css'
import materialize from 'materialize-css'

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
        if (order === 'desc') {
            return a - b;
        } else {
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

class Transactions extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { open: false };
        this.openExportPopup = this.openExportPopup.bind(this);
        this.closeExportPopup = this.closeExportPopup.bind(this);
    }

    // For Modal
    componentDidMount() {
        const options = {
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: false,
            startingTop: "4%",
            endingTop: "10%"
        };
        materialize.Modal.init(this.Modal, options)
    }

    openExportPopup() {
        this.setState({ open: true })
    }

    closeExportPopup() {
        this.setState({ open: false })
    }

    handleExport = (e) => {
        e.preventDefault();
        let dataStr = JSON.stringify(this.props.transactions);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'data.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }


    render() {
        return (
            <div className={"container mt"}>
                <div className="card z-depth-3">
                    {this.props.transactions != null
                        ?
                        <BootstrapTable
                            keyField="id"
                            data={this.props.transactions}
                            columns={columns}
                            pagination={paginationFactory(paginationOption)}
                            selectRow={selectRows}
                            defaultSorted={defaultSorted}
                            cellEdit={cellEditFactory(cellEdit)}
                            noDataIndication="Table is Empty"
                        />
                        :
                        null
                    }
                </div>
                <Link to={"/create_edit_transaction"} className={"btn green lighten-1 center mt"}>New Transaction</Link>
                <button data-target={"optionModal"} className={"btn modal-trigger green lighten-1 ms-5"}>Export...</button>
                <div>
                    <div ref={Modal => {
                        this.Modal = Modal;
                    }}
                         id={"optionModal"}
                         className={"modal"}>
                        <div className={"modal-content"}>
                            <form>
                                <h4>Export Options</h4>
                                <div>
                                    <label>
                                        <input className={"with-gap"} name={"optionGroup"} id="json" value="json" type="radio" checked/>
                                        <span>JSON</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input className={"with-gap"} name={"optionGroup"} id="csv" value="csv" type="radio"/>
                                        <span>CSV</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input className={"with-gap"} name={"optionGroup"} id="xml" value="xml" type="radio"/>
                                        <span>XML</span>
                                    </label>
                                </div>
                                <div className={"form-group"}>
                                    <button className={"btn green lighten-1"} onClick={this.handleExport}>Export</button>
                                    <a className="modal-close btn-flat">
                                        Cancel
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        transactions: state.firestore.ordered.transactions,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined") {
            return [
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{collection: 'userTransactions'}],
                    storeAs: 'transactions'
                }
            ]
        } else {
            return []
        }
    })
)(Transactions)