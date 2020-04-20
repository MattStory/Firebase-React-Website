import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link} from "react-router-dom";
import './Transactions.css'
import materialize from 'materialize-css'
import {exportCSV, exportJSON} from "./exportTransactions";
import {updateTransaction, deleteTransactions} from "../../store/actions/transactionActions";

// Basic Table Module
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Cell Editing Module (Doesnt work for some reason lol)
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';

// Pagination Module
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const transactionCategory = [
    {value: "Dining", label: "Dining"},
    {value: "Travel", label: "Travel"},
    {value: "Tuition", label: "Tuition"},
    {value: "Grocery", label: "Grocery"},
    {value: "Bar & Coffee Shop", label: "Bar & Coffee Shop"},
    {value: "Fee", label: "Fee"}];

// Page pagination options
const paginationOption = {
    sizePerPage: 10,
    hideSizePerPage: true,
    withFirstAndLast: false,
    hidePageListOnlyOnePage: true
};

// Set default sorted state to descending by transaction date
const defaultSorted = [{
    dataField: 'transactionDate',
    order: 'desc'
}];

const cellEdit = {
    mode: 'click',
    blurToSave: true
};

class Transactions extends Component {
    // For Modal
    componentDidMount() {
        const options = {
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: true,
            startingTop: "4%",
            endingTop: "10%"
        };
        materialize.Modal.init(this.deleteModal, options);
        materialize.Modal.init(this.exportModal, options);
        materialize.Modal.init(this.splitModal, options)
        materialize.Modal.init(this.newSplitAccountModal, options)

        this.exportForm = React.createRef()
    }

    handleExport = (e) => {
        // performs form validation
        if (!this.exportForm.current.reportValidity())
            return;

        e.preventDefault();

        let transactionsToExport = [];

        if (e.target.id === 'export-all')
            transactionsToExport = this.props.transactions;
        else if (e.target.id === 'export-selected') {
            if (this.state.rowsSelected === undefined) {
                alert("Oops! No row selected to export!");
                return;
            }

            this.state.rowsSelected.forEach(row => {
                let transaction = this.props.transactions.find(t => t.id === row);

                transactionsToExport.push(transaction)
            })
        }

        switch (this.state.exportOption) {
            case 'json':
                exportJSON(transactionsToExport);
                break;
            case 'csv':
                exportCSV(transactionsToExport);
                break;
            default:
                break;
        }
    };

    handleExportOptionChange = (e) => {
        this.setState({
            exportOption: e.target.value
        });
    };

    handleSelectRow(transactionID, isSelect) {
        if (this.state === null || this.state.rowsSelected === undefined) {
            let rowsSelected = [transactionID];

            this.setState({
                rowsSelected: rowsSelected
            })
        } else {
            // avoid directly modify array in state
            let rowsSelected = this.state.rowsSelected;

            if (isSelect) //on select
                rowsSelected.push(transactionID);
            else { //on deselect
                let indexToRemove = rowsSelected.indexOf(transactionID);

                if (indexToRemove > -1)
                    rowsSelected.splice(indexToRemove, 1)
            }

            this.setState({
                rowsSelected: rowsSelected
            });
        }
    };

    handleDeleteTransactions = (e) => {
        e.preventDefault();

        if (this.state === null || this.state.rowsSelected === undefined || this.state.rowsSelected.length === 0)
            alert("Oops! No row selected to delete!");
        else
            this.props.deleteTransactions(this.state.rowsSelected);
    };

    onTableChange = (type, newState) => {
        if (type === "cellEdit") {
            let transactionToUpdate = {
                "id": newState.cellEdit.rowId,
                "dataField": newState.cellEdit.dataField,
                "newValue": newState.cellEdit.newValue
            };

            if (transactionToUpdate['dataField'] === 'transactionDate') { // format date before entering database
                let dateParts = transactionToUpdate['newValue'].split("-"); // yyyy-mm-dd
                transactionToUpdate['newValue'] = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];
            }

            this.props.updateTransaction(transactionToUpdate);
        }
    };

    accountFormatter = (id) => {
        let targetFund = this.props.userFunds.find(fund => fund.id === id);
        return (<span>{targetFund.nickname + ' ' + targetFund.fundType}</span>)
    };

    getAccountOptions = () => {
        let userFunds = [];
        this.props.userFunds.forEach(userFund => {
            let formattedFund = {};
            let label = userFund.nickname + ' ' + userFund.fundType + ', Balance: $' + userFund.balance;
            let value = userFund.id;
            formattedFund['label'] = label;
            formattedFund['value'] = value;

            userFunds.push(formattedFund);
        });

        return userFunds
    }

    // Columns for table, moved here to access class methods
    columns = [{
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
        },
        type: 'number'
    }, {
        dataField: 'transactionCategory',
        text: 'Category',
        sort: true,
        editor: {
            type: Type.SELECT,
            options: transactionCategory
        },
        editorClasses: "browser-default"
    }, {
        dataField: 'financialAcct',
        text: 'Account',
        sort: true,
        formatter: this.accountFormatter,
        editor: {
            type: Type.SELECT,
            getOptions: (setOptions, {row, column}) => {
                return this.getAccountOptions()
            }
        },
        editorClasses: "browser-default"
    }, {
        dataField: 'transactionDate',
        text: 'Transaction Date',
        sort: true,
        type: 'string',
        editor: {type: Type.DATE}
    }
    ];

    splitAccountColumns = [
        {
            dataField: 'id',
            hidden: true
        },
        {
            dataField: 'account',
            text: 'Account',
            sort: true
        },
        {
            dataField: 'percentage',
            text: 'Percentage'
        }
    ]

    render() {
        return (
            <div className={"container mt"}>
                <div className="card z-depth-3">
                    {this.props.transactions != null
                        ?
                        <BootstrapTable
                            keyField="id"
                            data={this.props.transactions}
                            columns={this.columns}
                            pagination={paginationFactory(paginationOption)}
                            selectRow={{
                                mode: 'checkbox',
                                //clickToSelect: true,
                                bgColor: '#68DE11',
                                selectColumnStyle: {
                                    backgroundColor: '#68DE11'
                                },
                                onSelect: (row, isSelect, rowIndex, e) => {
                                    this.handleSelectRow(row.id, isSelect)
                                }
                                //clickToEdit: true
                            }}
                            defaultSorted={defaultSorted}
                            cellEdit={cellEditFactory(cellEdit)}
                            noDataIndication="No Transactions"
                            remote={{cellEdit: true}}
                            onTableChange={this.onTableChange}
                        />
                        :
                        null
                    }
                </div>
                <Link to={"/create_transaction"} className={"btn green lighten-1 center mt"}>New Transaction</Link>
                <button data-target={"exportModal"} className={"btn modal-trigger green lighten-1 ms-5"}>Export...
                </button>
                <button data-target={"deleteModal"} className={"btn modal-trigger green lighten-1"}>Delete...</button>
                <button data-target={"splitModal"} className={"btn modal-trigger green lighten-1 ms-5"}>Split...</button>
                <div>
                    <div ref={Modal => {
                        this.deleteModal = Modal;
                    }}
                         id={"deleteModal"}
                         className={"modal"}>
                        <div className={"modal-content"}>
                            <form>
                                <h4 className={"grey-text text-darken-3"}>Confirm to delete?</h4>
                                <h6 className={"black-txt"}>This operation is irreversible.</h6>
                                <div className={"form-group"}>
                                    <button className={"modal-close btn red lighten-1"}
                                            onClick={this.handleDeleteTransactions}>Delete
                                    </button>
                                    <a className="modal-close btn grey darken-3 white-text"
                                       style={{"marginLeft": "2%"}}>
                                        Cancel
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={Modal => {
                        this.exportModal = Modal;
                    }}
                         id={"exportModal"}
                         className={"modal"}>
                        <div className={"modal-content"}>
                            <form ref={this.exportForm}>
                                <h4 className={"grey-text text-darken-3"}>Export Options</h4>
                                <div>
                                    <label>
                                        <input className={"with-gap"} name={"optionGroup"} id="json" value="json"
                                               type="radio" onChange={this.handleExportOptionChange} required={true}/>
                                        <span>JSON</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input className={"with-gap"} name={"optionGroup"} id="csv" value="csv"
                                               onChange={this.handleExportOptionChange} type="radio"/>
                                        <span>CSV</span>
                                    </label>
                                </div>
                                <button id={"export-all"} type={"submit"} className={"btn green lighten-1"}
                                        onClick={this.handleExport}>Export All
                                </button>
                                <button id={"export-selected"} className={"btn green lighten-1 ms-5"}
                                        onClick={this.handleExport}>Export Selected
                                </button>
                                <a className="modal-close btn grey darken-3 white-text"
                                   style={{"marginLeft": "2%"}}>
                                    Close
                                </a>
                                <div className={"form-group"}>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={Modal => {
                        this.splitModal = Modal;
                    }}
                         id={"splitModal"}
                         className={"modal"}>
                        <div className={"modal-content"} style={{"height": "100%"}}>
                            <BootstrapTable
                                keyField="id"
                                data={[]}
                                columns={this.splitAccountColumns}
                                defaultSorted={defaultSorted}
                                noDataIndication="No Account Configured"
                                remote={{cellEdit: true}}
                                onTableChange={this.onTableChange}
                            />
                        </div>
                        <button data-target={"newSplitAccountModal"}
                                className={"btn modal-trigger green lighten-1 ms-5"} style={{"margin": "10%"}}>+
                        </button>
                        <div>
                            <div ref={Modal => {
                                this.newSplitAccountModal = Modal;
                            }}
                                 id={"newSplitAccountModal"}
                                 className={"modal"}>
                                <div className={"modal-content"} style={{"maxHeight": "100%"}}>
                                    <form>
                                        <h4 className={"grey-text text-darken-3"}>New account to split transaction</h4>
                                        <div className={"form-group"}>
                                            <div className={"input-field"}>
                                                <input type={"text"} id={'newSplitAccount'}
                                                       required={true}/>
                                                <label htmlFor={"newSplitAccount"}>Account</label>
                                            </div>
                                            <button className={"modal-close btn green lighten-1"}
                                                    >Save
                                            </button>
                                            <a className="modal-close btn grey darken-3 white-text"
                                               style={{"marginLeft": "2%"}}>
                                                Cancel
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransaction: (transactionToUpdate) => dispatch(updateTransaction(transactionToUpdate)),
        deleteTransactions: (transactions) => dispatch(deleteTransactions(transactions))
    }
};

const mapStateToProps = (state) => {
    return {
        transactions: state.firestore.ordered.transactions,
        auth: state.firebase.auth,
        userFunds: state.firestore.ordered.userFunds
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined") {
            return [
                {
                    collection: 'funds',
                    where: [
                        ['uid', '==', props.auth.uid]
                    ],
                    storeAs: 'userFunds'
                }, {
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