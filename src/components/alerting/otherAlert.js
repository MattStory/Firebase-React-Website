import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'

const otherAlert = (props) => {
    const {alert} = props;
    
    if (alert) {
            return (
                <div className = "card-content">
                    <h4>{alert.alertType}</h4>
                    <p>Fund: {alert.fund}, Amount: {alert.amount}, Fund Limit: {alert.limit}, Fund Balance: {alert.fundBalance}</p>
                </div>
            )
    } else {
        return (
            <div className ="container center">
                <p>Can't render other alert</p>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}
export default compose(
    connect(null,mapDispatchToProps)
)(otherAlert)