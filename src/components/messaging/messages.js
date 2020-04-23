import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Redirect} from 'react-router-dom'
import { createMessage } from '../../store/actions/msgActions'
import Axios from 'axios'
import MessageList from './messageList'
import './messages.css'

class Messages extends Component {

    state = {
        content: "",
        email: ""
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        })
    }

    handleClose = (event) => {
        event.preventDefault();
        this.props.closeThread(this.props.auth.uid);
    }

    handelSubmit = (event) => {
        event.preventDefault();
        this.props.createMessage(this.state);
        Axios.post('https://us-central1-college-capital-ed06f.cloudfunctions.net/submit', this.state).catch(error => {
            console.log(error);
        })
        this.setState ({
            content: '',
            email: ''
        })
    }

    render() {
        const {auth} = this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>
        this.state.email = auth.email;

        console.log(this.props);
       console.log(this.props.supportTickets);
       var supportTickets;
       if (this.props.supportTickets != undefined) {
        supportTickets = this.props.supportTickets;
       }
       console.log(supportTickets);
        return (
            <div className ="container">
                <form onSubmit={this.handelSubmit} className ="white">
                    <h5 className ="grey-text text-darken-3">Message Support</h5>
                    <div className = "input-field">
                        <label htmlFor="content">Enter Message Here</label>
                        <input type ="text" value={this.state.content} id="content" onChange={this.handleChange}/>
                    </div>
                    <div className ="input-field">
                        <button className = "btn green lighten-1 z-depth-0">Send New Ticket</button>
                    </div>
                </form> 
                {this.props.supportTickets != null
                        ?
                        <MessageList tickets = {supportTickets} />
                        :
                        console.log("not rendering" )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        supportTickets: state.firestore.ordered.supportTickets,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        createMessage: (msg) => { dispatch(createMessage(msg))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        //console.log(props.auth.uid + "3");
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'supportTickets',
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userTickets' }],
                    storeAs: "supportTickets"
                }
            ]
        } else {
            return [];
        }
    })
)(Messages)