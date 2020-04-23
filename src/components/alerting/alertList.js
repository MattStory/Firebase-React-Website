import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {deleteAlert} from '../../store/actions/alertActions'
import CategoryAlert from './catAlert'
import OtherAlert from './otherAlert'

const AlertList = (props) => {
    const {alerts} = props;

    const handleClick = (id) => {
        props.deleteAlert(id);
    }

    if (alerts) {
        const alertsArray = alerts.map (alerts => {
            return (
                <div className = "white" >
                    <div className = "cardz-depth-0" id = {alerts.id}>
                        {alerts.alertType == "CATEGORY SPENDING ALERT"
                            ?
                            <CategoryAlert alert = {alerts} />
                            :
                            <OtherAlert alert = {alerts} />
                        }
                    </div>
                    <button onClick={() => {handleClick(alerts.id)}}>Delete Alert</button>
                </div>
            )
        })
        return(
            <div>
           { alertsArray }
           </div>
        )
    } else {
        return (
            <div className ="container center">
                <p>No Alerts to Show</p>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteAlert : (id) => { dispatch(deleteAlert(id)) }
    }
}
export default compose(
    connect(null,mapDispatchToProps)
)(AlertList)