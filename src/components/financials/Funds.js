import React from 'react'
import{connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import moment from 'moment'

const Funds=(props) =>{
    const {fund,auth} =props;
    if(!auth.uid) return <Redirect to= '/signin'/>
    if(fund){
        return(
            <div className ="container section project-details">
                <div className ="card z-depth-0">
                    <div className ="card-content">
                        <span className ="card-title">{fund.title}</span>
                        <p>{fund.content}</p>
                    </div>
                    <div className =" card-action.grey.lighten-4 grey-text">
                        <div>Posted by {fund.authorFirstName} {fund.authorLastName}</div>
                        <div>{moment(fund.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className ="container center">
                <p>Loading memo...</p>
            </div>
        )
    }

}

const mapStateToProps =(state, ownProps) =>{

    const id = ownProps.match.params.id;
    const funds = state.firestore.data.funds;
    const fund = funds ? funds[id]: null
    return{
        project: fund,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'funds'}
    ])
)(Funds)
