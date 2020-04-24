import React, {Component, withRouter} from "react";
import {connect} from "react-redux";
import {createTransaction, newCustomCategory, largeTransactionAlert, lowBalanceAlert} from "../../store/actions/transactionActions"
import Select from 'react-select';
import {Link} from "react-router-dom";
import materialize from "materialize-css";
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

const transactionCategory = [
    { value: "Dining", label: "Dining"},
    { value: "Travel", label: "Travel"},
    { value: "Tuition", label: "Tuition"},
    { value: "Grocery", label: "Grocery"},
    { value: "Bar & Coffee Shop", label: "Bar & Coffee Shop"},
    { value: "Fee", label: "Fee"}];

class CreateTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
        materialize.Modal.init(this.newCategoryModal, options);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.transactionCategory === undefined)
            alert("Please select a category!");
        else if (this.state.financialAcct === undefined)
            alert("Please select a financial account! If no account is available, please add one in Financials page");
        else
        if (this.state.fundType === "Financial Aid") {
            if (this.state.transactionCategory === "Tuition" || this.state.transactionCategory === "Room & Board") {
                this.props.createTransaction(this.state, this.props.history);
                this.props.largeTransactionAlert(this.state);
                this.props.lowBalanceAlert(this.state);
            } else {
                alert("Financial Aid must go towards Tuition or Room and Board!!");
            }
        } else {
            this.props.createTransaction(this.state, this.props.history);
            this.props.largeTransactionAlert(this.state);
            this.props.lowBalanceAlert(this.state);
        }
    };

    handleCategoryChange = (e) => {
        this.setState({
            transactionCategory: e.value
        })
    };

    handleFinancialAcctChange = (e) => {
        let acctBalance;
        let fundType;
        let nickName;
        // add original account balance to state for fund update
        let targetFund = this.props.userFunds.find(fund => fund.id === e.value)
        acctBalance = targetFund.balance;
        fundType = targetFund.fundType;
        nickName = targetFund.nickname;
        this.setState({
            financialAcct: e.value,
            acctBalance: acctBalance,
            fundType: fundType,
            nickName: nickName
        });
    };

    handleNewCustomCategory = (e) => {
        e.preventDefault();
        this.props.newCustomCategory(this.state['new-category'], this.state['category-limit']);
        this.setState({
            'new-category': '',
            'category-limit': ''
        })
    };



    render() {
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
            <div className={"container"}>
                <form className={"white"} onSubmit={this.handleSubmit}>
                    <h5 className={"grey-text text-darken-3"}>Create New Transaction</h5>
                    <div className={"input-field"}>
                        <input type={"number"} id={'amount'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'amount'}>Amount</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"date"} id={'transactionDate'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'transactionDate'}>Date</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"text"} id={'merchant'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'merchant'}>Merchant</label>
                    </div>
                    <div className={"input-field"}>
                        <Select
                            className={"transactionCategory"}
                            name={"transactionCategory"}
                            placeholder={"Category"}
                            options={categories}
                            onChange={this.handleCategoryChange}
                        />
                    </div>
                    <button data-target={"newCategoryModal"} className={"btn modal-trigger green lighten-1"}>New Category</button>
                    <div>
                       <div ref={Modal => {
                            this.newCategoryModal = Modal;
                        }}
                             id={"newCategoryModal"}
                            className={"modal"}>
                            <div className={"modal-content"}>
                               <form>
                                    <h4 className={"grey-text text-darken-3"}>New Custom Category</h4>
                                    <div className={"input-field"}>
                                       <input type={"text"} id={'new-category'} required={true} onChange={this.handleChange} value={this.state['new-category']}/>
                                        <label htmlFor={'new-category'}>Category Name</label>
                                    </div>
                                    <div className={"input-field"}>
                                       <input type={"number"} id={'category-limit'} required={true} onChange={this.handleChange} value={this.state['category-limit']} min="0"/>
                                        <label htmlFor={'category-limit'}>Spending Limit</label>
                                    </div>
                                   <div className={"form-group"}>
                                        <button className={"modal-close btn green lighten-1"}
                                                onClick={this.handleNewCustomCategory}>Save
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
                    <div className={"input-field"}>
                        <Select
                            className={"financialAccount"}
                            name={"financialAccount"}
                            placeholder={"Financial Account"}
                            options={userFunds}
                            onChange={this.handleFinancialAcctChange}
                        />
                    </div>
                    <div className={"input-field"}>
                        <button className={"btn green lighten-1"}>Create</button>
                        <Link to={"/transactions"} className={"btn grey darken-3 white-text"} style={{"marginLeft": "2%"}}>Close</Link>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        createTransaction: (transaction, history) => dispatch(createTransaction(transaction, history)),
        newCustomCategory: (category, limit) => dispatch(newCustomCategory(category, limit)),
        largeTransactionAlert: (transaction) => dispatch(largeTransactionAlert(transaction)),
        lowBalanceAlert: (transaction) => dispatch(lowBalanceAlert(transaction))
    }
};

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        userFunds: state.firestore.ordered.userFunds,
        categories: state.firestore.ordered.categories
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
                    subcollections: [{collection: 'customCategories'}],
                    storeAs: 'categories'
                }
            ]
        } else {
            return []
        }
    })
)
(CreateTransaction)