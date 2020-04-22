import React, { Component } from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Redirect} from 'react-router-dom'
import AlertList from './alertList'

class Alerts extends Component {

    render() {
        const {auth} = this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>

        var userAlerts;
        if (this.props.alerts != undefined) {
            userAlerts = this.props.alerts;
        }
        return (
            <div className="container">
                {this.props.alerts != null
                    ?
                    <AlertList alerts = {userAlerts} />
                    :
                    console.log("not rendering")
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        alerts: state.firestore.ordered.alerts,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return{}
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
