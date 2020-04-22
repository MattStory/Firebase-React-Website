import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase';
import {deletePayment} from '../../store/actions/paymentAction'



const Paymentfunc = (props) => {
    //console.log(props);
    const {data} = props;

   const handleClick = (id) => {
    props.deleting(id);
   }


    if(data){
        const PaymentArray = data.map (data => {
            return(
                <div className ="container section project-details" >
                <div className ="card z-depth-0" id ={data.id}>
                    <div className ="card-content">
                        <span className ="card-title">{data.title}</span>
                        <h4 style={{fontSize: "30px"}}>Amount</h4>
                        <p style={{fontSize: "20px"}}>{data.amount}</p>
                        <h4 style={{fontSize: "30px"}}>Date</h4>
                        <p style={{fontSize: "20px"}}>{data.date}</p>
                    </div>
                    <div className =" card-action.grey.lighten-4 grey-text">
                        <div>Posted by {data.owner}</div>
                        <div>{moment(data.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>

                <button onClick={() => {handleClick(data.id)}}>Delete</button>
            </div>
            )
        }
            );
        return(
            <div>
           { PaymentArray }
           </div>
        )
    } else{
        return (
            <div className ="container center">
                <p>Loading memo...</p>
            </div>
        )
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
    deleting : (id) => { dispatch(deletePayment(id)) }
    
    }
}
export default compose(
    connect(null,mapDispatchToProps)
    // firestoreConnect([
    //     {collection: 'memos'}
    // ])
)(Paymentfunc)