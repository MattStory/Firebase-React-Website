import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from "react-router-dom";
import {components} from "react-select";
import CreateEditTransaction from "./CreateEditTransaction";

class Transactions extends Component{
    render() {
        return(
            <CreateEditTransaction/>
        )
    }
}

export default (Transactions)