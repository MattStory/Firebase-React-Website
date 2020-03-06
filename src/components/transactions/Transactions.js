import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Link, Redirect} from "react-router-dom";
import {components} from "react-select";
import CreateEditTransaction from "./CreateEditTransaction";

class Transactions extends Component{

    render() {
        return(
            <div className={"container center"}>
                <Link to={"/create_edit_transaction"} className={"btn green lighten-1 center mt-10 mb-10"}>New Transaction</Link>
            </div>
        )
    }
}

export default (Transactions)