import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {closeTicket} from '../../store/actions/msgActions'

const MessageList = (props) => {
    console.log("retrieving tickets from props");

    const {tickets} = props;
    //var tickets = props;

   const handleClick = (id) => {
    props.closing(id);
   }

   console.log(tickets);
    if(tickets){
        const TicketArray = tickets.map (tickets => {
            return(
                <div className ="container section project-details" >
                <div className ="card z-depth-0" id ={tickets.id}>
                    <div className ="card-content">
                        <p>{tickets.content}</p>
                    </div>
                    <div className =" card-action.grey.lighten-4 grey-text">
                        <div>Opened by {tickets.email}</div>
                    </div>
                </div>

                <button onClick={() => {handleClick(tickets.id)}}>Close Ticket</button>
            </div>
            )
        });
        return(
            <div>
           { TicketArray }
           </div>
        )
    } else {
        return (
            <div className ="container center">
                <p>No open tickets</p>
            </div>
        )
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        closing : (id) => { dispatch(closeTicket(id)) }
    }
}

export default compose(
    connect(null,mapDispatchToProps)
)(MessageList)