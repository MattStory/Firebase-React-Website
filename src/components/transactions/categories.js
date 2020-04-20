import React, {Component, withRouter} from "react";
import {connect} from "react-redux";
import {deleteCustomCategories} from "../../store/actions/transactionActions"
import Select from 'react-select';
import {Link} from "react-router-dom";
import materialize from "materialize-css";
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleSubmit = (e) => {
        if (this.state.transactionCategory === undefined) {
            alert("Please select a category!");
        } else {
            let transactionCategories = [];
            if (this.props.transactions !== undefined) {
                this.props.transactions.forEach(transac => {
                    transactionCategories.push(transac.transactionCategory);
                })
            } 
            if (transactionCategories.includes(this.state.transactionCategory)) {
                alert("Deletion Error - Transaction Exists with Category!");
            } else {
                deleteCustomCategories(this.state.transactionCategory)
            }
        }
    };

    handleCategoryChange = (e) => {
        this.setState({
            transactionCategory: e.value
        })
    };

    render() {
        //Grab Categories and funds
        let userCategories = [];
        let fundCategories = [];
        if (this.props.categories !== undefined) {
            this.props.categories.forEach(categorie => {
                let formattedCategory = {};
                let label = categorie.category;
                let value = categorie.category;
                formattedCategory['label'] = label;
                formattedCategory['value'] = value;

                userCategories.push(formattedCategory);
            })
        } else {
            userCategories = [{value: '', label: 'loading...'}];
        }

        if (this.props.transactions !== undefined) {
            this.props.transactions.forEach(transac => {
                fundCategories.push(transac.transactionCategory);
            })
        } 

        return (
            <div className="container">
                <form className={"white"} onSubmit={this.handleSubmit}>
                <div className={"input-field"}>
                    <h3>Manage Categories</h3>
                        <Select
                            placeholder={"Category"}
                            options={userCategories}
                            onChange={this.handleCategoryChange}
                        />
                    </div>
                    <button className={"btn modal-trigger green lighten-1"}>Delete Category</button>
                    <Link to={"/transactions"} className={"btn grey darken-3 white-text"} style={{"marginLeft": "2%"}}>Close</Link>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        deleteCustomCategories: (category) => dispatch(deleteCustomCategories(category))
    }
};

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        transactions: state.firestore.ordered.transactions,
        categories: state.firestore.ordered.categories
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
                    subcollections: [{collection: 'userTransactions'}],
                    storeAs: 'transactions'
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
(Categories)