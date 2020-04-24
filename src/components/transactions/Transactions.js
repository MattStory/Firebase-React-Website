import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link} from "react-router-dom";
import './Transactions.css'
import materialize from 'materialize-css'
import {exportCSV, exportJSON} from "./exportTransactions";
import {updateTransaction, deleteTransactions, newSplitAccount} from "../../store/actions/transactionActions";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import bootstrapTable from 'react-bootstrap-table-next/lib/src/bootstrap-table';
import propsResolver from 'react-bootstrap-table-next/lib/src/props-resolver';
import Select from "react-select";
import {createTransaction} from "../../store/actions/transactionActions"
import {addpayment} from '../../store/actions/paymentAction';
import {deletePayment} from '../../store/actions/paymentAction';
// Basic Table Module
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Cell Editing Module (Doesnt work for some reason lol)
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';

// Pagination Module
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
const { SearchBar, ClearSearchButton } = Search;
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
    constructor(props) {
        	
            // For Modal
        	
                super(props);
        	
        	
                this.state= {
        	
                    splitAccounts: []
        	
                }
        	
            }
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
        // ----------- Haiders code --------
        var l;
        console.log(this.props);
        var today = new Date();
        if ((today.getMonth() + 1) < 10) {
            var todayDate = today.getFullYear() + "-" + "0" +  (today.getMonth() + 1) + "-" + today.getDate();
        } else {
            var todayDate = today.getFullYear() + "-" +  (today.getMonth() + 1) + "-" + today.getDate();
        }
        var comapare_today = todayDate.split("-");
        console.log(comapare_today[0]);
        console.log(comapare_today[1]);
        console.log(comapare_today[2]);
        comapare_today = comapare_today[2] + comapare_today[1] + comapare_today[0];
        console.log(parseInt(comapare_today));
        if (this.props.payments) {
            for (var i = 0; i < this.props.payments.length; i++) {
                //Change the date to less then equal
                var comapare_payment = this.props.payments[i].date.split("-");
                console.log(comapare_payment[0]);
                console.log(comapare_payment[1]);
                console.log(comapare_payment[2]);
                comapare_payment = comapare_payment[2] + comapare_payment[1] + comapare_payment[0];
                console.log(parseInt(comapare_payment));
                console.log("Here");
                if (todayDate === this.props.payments[i].date || parseInt(comapare_today) > parseInt(comapare_payment) ) {
                    console.log(this.props.payments[i].date);
                    const obj = {
                        amount: this.props.payments[i].amount,
                        merchant: this.props.payments[i].title,
                        id: this.props.payments[i].id,
                        transactionDate: todayDate,
                        financialAcct: this.props.payments[i].account,
                        transactionCategory: this.props.payments[i].category,
                        
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
                    date: todayDate1 ,
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
        //______________________________Haiders Code
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
        materialize.Modal.getInstance(this.exportModal).close()

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

    accountFormatter = (accounts) => {
        if (this.props.userFunds === undefined)
            return ''

        let funds = []

        accounts.forEach(account => {
            let targetFund = this.props.userFunds.find(fund => fund.id === account.account);

            funds.push(<ul key={targetFund.id}>{targetFund.nickname} {targetFund.fundType}, {account.percentage}%</ul>)
        })


        return (
            <div>
                {funds}
            </div>
        )
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

    categoryFormatter = (cell) => {
        if (this.props.userCategories === undefined)
            return ''
        let targetCategory = this.props.userCategories.find(category => category.category === cell);
        console.log("targetCategory: " + targetCategory);
        return (<span>{targetCategory.category}</span>)
    };

    getCategoryOptions = () => {
        let userCategories = [];
        this.props.userCategories.forEach(userCategory => {
            let formattedCategory = {};
            let label = userCategory.category;
            let value = userCategory.category;
            formattedCategory['label'] = label;
            formattedCategory['value'] = value;

            userCategories.push(formattedCategory);
        });

        return userCategories
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSelectChange = (selectorID, e) => {
        let newState;

        if (selectorID === 'splitAccount'){
            newState = {
                splitAccountID: e.value,
                splitAccount: e.label
            }
        }else {
            newState = {
                [selectorID]: e.value
            }
        }


        this.setState(newState)
    }

    handleNewSplitAccount = (e) => {
        e.preventDefault()

        let unallocatedPercentage = 100

        this.state.splitAccounts.forEach(account => {
            unallocatedPercentage -= account.percentage
        })

        if (unallocatedPercentage - this.state.splitPercentage < 0){
            alert("The total percentage must be 100%!")
        }else {
            let splitAccounts = this.state.splitAccounts
            splitAccounts.push(
                {
                    splitAccountID: this.state.splitAccountID,
                    splitAccount: this.state.splitAccount,
                    percentage: this.state.splitPercentage
                }
            )

            this.setState({splitAccounts: splitAccounts})

            materialize.Modal.getInstance(this.newSplitAccountModal).close()
        }
    }

    clearSplitAccounts = (e) => {
        this.setState({splitAccounts: []})
    }

    updateSplitAccounts = (e) => {
        e.preventDefault()

        let unallocatedPercentage = 100

        this.state.splitAccounts.forEach(account => {
            unallocatedPercentage -= account.percentage
        })

        if (unallocatedPercentage > 0)
            alert("The split percentages must add up to 100%!")
        else {
            console.log(this.state)

            let transactionToUpdate = this.props.transactions.find(transaction => transaction.id === this.state.rowsSelected[0])

            this.props.newSplitAccount(this.state.splitAccounts, transactionToUpdate)

            materialize.Modal.getInstance(this.splitModal).close()
        }
    }

    closeModal = (modal) => {
        materialize.Modal.getInstance(modal).close()
    }

    checkSelectionForSplit = () => {
        if (this.state.rowsSelected.length > 1){
            alert("Please only select one transaction before splitting!")
        } else {
            materialize.Modal.getInstance(this.splitModal).open()
        }
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
        /*
        dataField: 'transactionCategory',
        text: 'Category',
        sort: true,
        editor: {
            type: Type.SELECT,
            options: transactionCategory
        },
        editorClasses: "browser-default"
        */
       dataField: 'transactionCategory',
       text: 'Category',
       sort: true,
       formatter: this.categoryFormatter,
       editor: {
           type: Type.SELECT,
           getOptions: (setOptions, {row, column}) => {
               return this.getCategoryOptions()
           }
       },
       editorClasses: "browser-default"
    }, {
        dataField: 'financialAccounts',
        text: 'Account',
        sort: true,
        formatter: this.accountFormatter,
        editable:false
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
            dataField: 'splitAccountID',
            hidden: true
        },
        {
            dataField: 'splitAccount',
            text: 'Account',
            sort: true
        },
        {
            dataField: 'percentage',
            text: 'Percentage'
        }
    ]
    render() {
        let fundOptions;

        if (this.props.userFunds !== undefined){
            fundOptions = this.props.userFunds.map(v => ({
                label: v.fundType + ': ' + v.nickname,
                value: v.id
            }))
        }

        let unallocatedPercentage = 100

        this.state.splitAccounts.forEach(account => {
            unallocatedPercentage -= account.percentage
        })
        
        return (
            <div className={"container mt"}>
                <div className="card z-depth-3">
                    {this.props.transactions != null
                        ?
                        <ToolkitProvider
                            keyField="id"
                            data={this.props.transactions}
                            columns={this.columns}
                            search
                        >
                            {
                                props => (
                                    <div>
                                        <SearchBar { ...props.searchProps } />
                                        <ClearSearchButton { ...props.searchProps } />
                                        <BootstrapTable
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
                                            { ...props.baseProps}
                                        />
                                    </div>
                                )
                            }
                        </ToolkitProvider>
                        :
                        null
                    }
                </div>
                <Link to={"/create_transaction"} className={"btn green lighten-1 center mt"}>New Transaction</Link>
                <Link to={"/categories"} className={"btn modal-trigger green lighten-1 ms-5"}>Manage Categories</Link>
                <button data-target={"exportModal"} className={"btn modal-trigger green lighten-1 ms-5"}>Export...
                </button>
                <button data-target={"deleteModal"} className={"btn modal-trigger green lighten-1"}>Delete...</button>
                <button data-target={"splitModal"} className={"btn green lighten-1 ms-5"} onClick={this.checkSelectionForSplit}>Split...</button>
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
                         className={"modal"} style={{"height": "60%", "width": "60%"}}>
                        <div className={"modal-content"} >
                            <BootstrapTable
                                keyField="splitAccount"
                                data={this.state.splitAccounts}
                                columns={this.splitAccountColumns}
                                defaultSorted={defaultSorted}
                                noDataIndication="No Account Configured"
                                remote={{cellEdit: true}}
                                onTableChange={this.onTableChange}
                            />
                        </div>
                        <h6 style={{"margin": "5%"}}>Unallocated Percentage: {unallocatedPercentage}%</h6>
                        <button className={"btn green lighten-1 ms-5"} onClick={this.updateSplitAccounts}>Update</button>
                        <button data-target={"newSplitAccountModal"}
                                className={"btn modal-trigger green lighten-1 ms-5"} style={{"margin": "10%"}}>
                            Add Split
                        </button>
                        <a className="modal-close btn grey darken-3 white-text"
                           style={{"marginLeft": "2%"}} onClick={this.clearSplitAccounts}>
                            Close
                        </a>
                        <div>
                            <div ref={Modal => {
                                this.newSplitAccountModal = Modal;
                            }}
                                 id={"newSplitAccountModal"}
                                 className={"modal"}>
                                <div className={"modal-content"} style={{"maxHeight": "100%"}}>
                                    <form>
                                        <h4 className={"grey-text text-darken-3"}>New Account to Split</h4>
                                        <div className={"form-group"}>
                                            <Select
                                                className={"funds"}
                                                name={"funds"}
                                                onChange={(e) => {this.handleSelectChange("splitAccount", e)}}
                                                options={fundOptions}
                                            />
                                            <div className={"input-field"}>
                                                <input type={"number"} id={'splitPercentage'} required={true} style={{"marginTop": "5%"}} onChange={this.handleChange}/>
                                                <label htmlFor={'splitPercentage'} style={{"marginTop": "5%"}}>Percentage</label>
                                            </div>
                                            <button className={"btn green lighten-1"}
                                                    onClick={this.handleNewSplitAccount}>
                                                Save
                                            </button>
                                            <a className="btn grey darken-3 white-text"
                                               style={{"marginLeft": "2%"}} onClick={() => this.closeModal(this.newSplitAccountModal)}>
                                                Cancel
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
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
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTransaction: (transactionToUpdate) => dispatch(updateTransaction(transactionToUpdate)),
        deleteTransactions: (transactions) => dispatch(deleteTransactions(transactions)),
        newSplitAccount: (newAccounts, transactionToUpdate) => dispatch(newSplitAccount(newAccounts, transactionToUpdate)),
        deleting : (id) => { dispatch(deletePayment(id)) },
        addpayment: (id) => { dispatch(addpayment(id))},
        createTransaction: (transaction, history) => dispatch(createTransaction(transaction, history))
    }
};

const mapStateToProps = (state) => {
    return {
        transactions: state.firestore.ordered.transactions,
        auth: state.firebase.auth,
        userFunds: state.firestore.ordered.userFunds,
        userCategories: state.firestore.ordered.userCategories,
        payments: state.firestore.ordered.payments
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined") {
            return [
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{collection: 'customCategories'}],
                    storeAs: 'userCategories'
                }, {
                    collection: 'funds',
                    where: [
                        ['uid', '==', props.auth.uid]
                    ],
                    storeAs: 'userFunds'
                },
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