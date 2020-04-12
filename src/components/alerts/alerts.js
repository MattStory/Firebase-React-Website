import React, { Component } from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Redirect} from 'react-router-dom'

class Alerts extends Component {
    render() {
        const {auth} = this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>
    }
}

const mapStateToProps = (state) => {
    return {
        alerts: state.firestore.ordered.alerts,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'alerts',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userAlerts' }],
                    storeAs: "alerts"
                }
            ]
        } else {
            return [];
        }
    })
)(Alerts)
