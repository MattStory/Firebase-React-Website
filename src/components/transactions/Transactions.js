import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link, Redirect} from "react-router-dom";
import {components} from "react-select";
import CreateEditTransaction from "./CreateEditTransaction";
import TransactionList from "./TransactionList";

class Transactions extends Component{

    render() {
        return(
            <div className={"container mt-10"}>
                <div className ="card z-depth-0">
                    <div className={"container center"}>
                        <div className={"row"}>
                            <Link to={"/create_edit_transaction"} className={"btn green lighten-1 center mt-10 mb-10"}>New Transaction</Link>
                        </div>
                    </div>
                </div>
                <div className ="card z-depth-0">
                <div className={"container center "}>
                    <div className={"row"}>
                        {this.props.transactions != null
                            ?
                            <TransactionList transactions = {this.props.transactions}/>
                            :
                            null
                        }
                    </div>
                </div>
                </div>
            </div>

        )
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
        console.log(props)
        return [
            {
                collection: 'transactions',
                doc: props.auth.uid,
                subcollections: [{ collection: 'userTransactions' }],
                storeAs: 'transactions'
            }
        ]
    })
)(Transactions)