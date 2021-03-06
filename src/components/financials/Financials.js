import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from "react-router-dom";
import './Financials.css'
import FundList from './FundList'
import CreateFund from "./CreateFund";
import {editFund} from "../../store/actions/fundActions";
import Select from "react-select";
import {getStock, newStock, getStockPrices, deleteStocks, updateStock} from "../../store/actions/stockActions";

// Basic Table Module
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Cell Editing Module
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import paginationFactory from "react-bootstrap-table2-paginator";
import materialize from "materialize-css";

const cellEdit = {
    mode: 'click',
    blurToSave: true
};

const defaultSorted = [{
    dataField: 'symbol',
    order: 'desc'
}];

class Financials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateFund: false,
            showEditFund: false,
            completeFavStockPrices: []
        };
    }

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
        materialize.Modal.init(this.newStockModal, options);
        materialize.Modal.init(this.deleteModal, options);

        this.exportForm = React.createRef()
    }

    toggleCreateFund() {
        this.setState({
            showCreateFund: !this.state.showCreateFund
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.props.editFund(this.state)
    }

    handleDel = (e) => {
        e.preventDefault();
        this.props.delFund(this.state)
    }

    handleSelectChange = (e) => {
        this.setState({
            fundSelected: e.value
        })
    }

    handleEditSelectChange = (e) => {
        this.setState({
            fundType: e.value
        })
    }

    handleGetStock = (e) => {
        e.preventDefault();
        this.props.getStock(this.state.symbol)
    };

    handleGetStocks = (stocks) => {
        this.props.getStocks(stocks)
    };

    handleNewStock = (e) => {
        e.preventDefault();
        this.props.newStock(this.state.newSymbol)
    }

    handleDeleteStocks = (e) => {
        e.preventDefault();

        if (this.state === null || this.state.rowsSelected === undefined || this.state.rowsSelected.length === 0)
            alert("Oops! No stock selected to delete!");
        else
            this.props.deleteStocks(this.state.rowsSelected);
    }

    // onTableChange = (type, newState) => {
    //
    //     if (type === "cellEdit"){
    //         let stockToUpdate = {
    //             "id": newState.cellEdit.rowId,
    //             "dataField": newState.cellEdit.dataField,
    //             "newValue": newState.cellEdit.newValue
    //         };
    //
    //
    //         this.props.updateStock(stockToUpdate);
    //
    //         // update page
    //         this.props.history.push('/financials')
    //
    //
    //     }
    // };

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

    columns = [
        {
            dataField: 'id',
            hidden: true,
            text: ''
        },
        {
            dataField: 'symbol',
            sort: true,
            text: 'Symbol'
        },
        {
            dataField: 'currentPrice',
            formatter: (cell) => {
                return '$' + cell.toFixed(2)
            },
            text: 'Current Price',
            editable: false
        },
        {
            dataField: 'priceDiff',
            formatter: (cell) => {
                if (cell === undefined)
                    return ''

                cell = cell.toFixed(2)

                if (cell >= 0) {
                    return (
                        <label className={"green-text"} style={{"fontSize": "15px"}}>+{cell}</label>
                    )
                } else {
                    return (
                        <label className={"red-text"} style={{"fontSize": "15px"}}>{cell}</label>
                    )
                }
            },
            text: 'Since Open',
            editable: false
        }
    ]

    lastFavStocks;

    render() {
        const {auth} = this.props;
        if (auth.isLoaded && auth.isEmpty) return <Redirect to='/signin'/>;

        const funds = this.props.funds;

        let fundOptions;

        let userFunds = []

        if (this.props.funds != null) {
            funds.forEach(f => {
                if (f.uid === auth.uid) {
                    userFunds.push(f);
                }
            })
        }

        fundOptions = userFunds.map(v => ({
            label: v.fundType + ': ' + v.nickname,
            value: v.id
        }))

        let queriedStock;

        if (this.props.stock && this.props.stock.priceDiff >= 0) {
            queriedStock = <div>
                <h6 className={"grey-text text-darken-3"}>{this.props.stock.symbol}: ${this.props.stock.currentPrice},
                    Since Open: </h6>
                <h6 className={"h6 green-text inline"}>+{this.props.stock.priceDiff.toFixed(2)}</h6>
            </div>

        } else if (this.props.stock && this.props.stock.priceDiff < 0) {
            queriedStock = <div>
                <h6 className={"h4 grey-text text-darken-3"}>{this.props.stock.symbol}: ${this.props.stock.currentPrice},
                    Since Open: </h6>
                <h6 className={"h6 red-text inline"}>{this.props.stock.priceDiff.toFixed(2)}</h6>
            </div>
        }

        if ((this.props.favStocks !== undefined && this.props.favStockPrices === null) || this.lastFavStocks !== this.props.favStocks) { // need to get symbols' current prices
            let stocks = []
            this.lastFavStocks = this.props.favStocks

            this.props.favStocks.forEach(stock => {
                stocks.push(stock)
            })

            let apiUrl = "https://finnhub.io/api/v1/quote?token=bq4lq1frh5rc5os3t7vg"

            let results = []

            stocks.forEach(stock => {
                let localUrl = new URL(apiUrl);
                localUrl.searchParams.append("symbol", stock.symbol);
                fetch(localUrl, {method: "GET"})
                    .then(response => response.json())
                    .then(json => {
                        results.push({
                            "id": stock.id,
                            "symbol": stock.symbol,
                            "currentPrice": json.c,
                            "openingPrice": json.o,
                            "priceDiff": json.c - json.o
                        })
                        this.setState({completeFavStockPrices: results})
                    })
            })
        }
        return (
            <div className={"container mt-10"}>
                <div className ="card z-depth-0">
                    {this.state.showCreateFund
                        ?
                        <CreateFund
                            closePopup={this.toggleCreateFund.bind(this)}
                        />
                        :
                        <div className={"container center"}>
                            <button className="btn green lighten-1 center mt-10 mb-10"
                                    onClick={this.toggleCreateFund.bind(this)}>New Financial Account
                            </button>
                        </div>
                    }
                </div>
                <div className={"row"}>
                    <div className={"col s12 m6"}>
                        {userFunds.length === 0
                            ?
                            null
                            :
                            <FundList funds={userFunds}/>
                        }
                        {userFunds.length === 0
                            ?
                            null
                            :
                            <div className={"card z-depth-0 fund-operation"}>
                                <div className={"card-content grey-text text-darken-3"}>
                                    <Select
                                        className={"funds"}
                                        name={"funds"}
                                        onChange={this.handleSelectChange}
                                        options={fundOptions}
                                    />
                                    <div className={"container"}>
                                        <form className={"white"} onSubmit={this.handleSubmit}>
                                            <div className={"input-field"}>
                                                <input type={"text"} id={'nickname'} onChange={this.handleChange}/>
                                                <label htmlFor={"nickname"}>Nickname</label>
                                            </div>
                                            <div className={"input-field"}>
                                                <input type={"number"} id={'balance'} onChange={this.handleChange}
                                                       required/>
                                                <label htmlFor={"balance"}>Balance</label>
                                            </div>
                                            <div className={"input-field"}>
                                                <input type={"number"} id={'lowBalanceLimit'}
                                                       onChange={this.handleChange}/>
                                                <label htmlFor={"lowBalanceLimit"}>Low Balance Limit</label>
                                            </div>
                                            <div className={"input-field"}>
                                                <input type={"text"} id={'largeTransactionLimit'}
                                                       onChange={this.handleChange}/>
                                                <label htmlFor={"largeTransactionLimit"}>Large Transaction Limit</label>
                                            </div>
                                            <div className={"input-field"}>
                                                <input type={"text"} id={'spendingLimit'} onChange={this.handleChange}/>
                                                <label htmlFor={"spendingLimit"}>Spending Limit</label>
                                            </div>
                                            <div className={"input-field"}>
                                                <Select
                                                    className={"fundtype"}
                                                    name={"fundtype"}
                                                    placeholder={"Fund Type"}
                                                    options={[
                                                        {value: 'PayPal', label: 'PayPal'},
                                                        {value: 'Dining Dollar', label: 'Dining Dollar'},
                                                        {value: 'Boiler Express', label: 'Boiler Express'},
                                                        {value: 'Financial Aid', label: 'Financial Aid'},
                                                        {value: 'Bank', label: 'Bank'}
                                                    ]}
                                                    onChange={this.handleEditSelectChange}
                                                    defaultValue={{value: 'paypal', label: 'PayPal'}}
                                                />
                                            </div>
                                        </form>
                                        <button className={"btn green lighten-1"} onClick={this.handleEdit}>Edit Account</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={"col s12 m6"}>
                        <div className="card z-depth-0">
                            <div className={"container center"}>
                                <div className={"input-field"}>
                                    <input type={"text"} id={'symbol'} className={"center"}
                                           onChange={this.handleChange} style={{"marginTop": "10%"}}/>
                                    <label htmlFor={'symbol'} style={{"marginTop": "10%"}}>Stock Symbol to Query</label>
                                </div>
                                <button className={"btn green lighten-1 center"} onClick={this.handleGetStock}>Get Stock
                                    Symbol
                                </button>
                                <div>
                                    {queriedStock}
                                </div>
                                {this.state.completeFavStockPrices !== []
                                    ?
                                    <div style={{"marginTop": "10%"}}>
                                        <BootstrapTable
                                            keyField="id"
                                            data={this.state.completeFavStockPrices}
                                            columns={this.columns}
                                            selectRow={{
                                                mode: 'checkbox',
                                                // clickToSelect: true,
                                                bgColor: '#68DE11',
                                                selectColumnStyle: {
                                                    backgroundColor: '#68DE11'
                                                },
                                                onSelect: (row, isSelect, rowIndex, e) => {
                                                    this.handleSelectRow(row.id, isSelect)
                                                }
                                            }}
                                            defaultSorted={defaultSorted}
                                            noDataIndication="No Stocks"
                                        />
                                        <button data-target={"newStockModal"}
                                                className={"btn modal-trigger green lighten-1 ms-5"} style={{"margin": "10%"}}>+
                                        </button>
                                        <button data-target={"deleteModal"}
                                                className={"btn modal-trigger green lighten-1"} style={{"margin": "10%"}}>Delete...
                                        </button>
                                    </div>
                                    :
                                    <span>Updating...</span>
                                }
                                <div>
                                    <div ref={Modal => {
                                        this.newStockModal = Modal;
                                    }}
                                         id={"newStockModal"}
                                         className={"modal"}>
                                        <div className={"modal-content"}>
                                            <form>
                                                <h4 className={"grey-text text-darken-3"}>New stock symbol</h4>
                                                <div className={"form-group"}>
                                                    <div className={"input-field"}>
                                                        <input type={"text"} id={'newSymbol'}
                                                               onChange={this.handleChange} required={true}/>
                                                        <label htmlFor={"newSymbol"}>Symbol</label>
                                                    </div>
                                                    <button className={"modal-close btn green lighten-1"}
                                                            onClick={this.handleNewStock}>Save
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
                                                            onClick={this.handleDeleteStocks}>Delete
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
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        funds: state.firestore.ordered.funds,
        auth: state.firebase.auth,
        stock: state.stock,
        favStocks: state.firestore.ordered.favStocks,
        // favStockPrices: state.favStockPrices
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editFund: (fund) => dispatch(editFund(fund)),
        getStock: (symbol) => dispatch(getStock(symbol)),
        getStocks: (symbols) => dispatch(getStockPrices(symbols)),
        newStock: (symbol) => dispatch(newStock(symbol)),
        deleteStocks: (symbolIDs) => dispatch(deleteStocks(symbolIDs)),
        // updateStock: (stock) => dispatch(updateStock(stock))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined") {
            return [
                {
                    collection: 'funds',
                    storeAs: 'funds'
                }, {
                    collection: 'stocks',
                    doc: props.auth.uid,
                    subcollections: [{collection: 'favoriteStocks'}],
                    storeAs: 'favStocks'
                }
            ]
        } else {
            return [{collection: 'funds', storeAs: 'funds'}]
        }
    })
)(Financials)