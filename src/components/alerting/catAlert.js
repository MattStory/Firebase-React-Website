import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {deleteAlert} from '../../store/actions/alertActions'

const catAlert = (props) => {
    const {alert} = props;
    
    if (alert) {
            return (
                <div className = "card-content" color="white">
                    <h4>{alert.alertType}</h4>
                    <p>Category: {alert.category}, Amount: {alert.amount}, Category Limit: {alert.limit}, Total Category Expenditures: {alert.catSpent}</p>
                </div>
            )
    } else {
        return (
            <div className ="container center">
                <p>Can't render category alert</p>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}
export default compose(
    connect(null,mapDispatchToProps)
)(catAlert)