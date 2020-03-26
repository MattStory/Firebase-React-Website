import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Redirect} from 'react-router-dom'
import { createMessage, getThreadKey, closeThread } from '../../store/actions/msgActions'
import messageList from './messageList'
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
        this.setState ({
            content: ""
        })
    }

    render() {
        const {auth} = this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>
        this.state.email = auth.email;

        return (
            <div className ="container">
                <form onSubmit={this.handelSubmit} className ="white">
                    <h5 className ="grey-text text-darken-3">Message Support</h5>
                    {/*
                    <div className = "msgsContainer">
                        { this.props.messages && this.props.messages.map(message => {
                            return (
                                <messageList message={message} uid={message.id} />
                            )
                        })}
                    </div>  
                    */}
                    <div className = "input-field">
                        <label htmlFor="content">Enter Message Here</label>
                        <input  type ="text" id="content"onChange ={this.handleChange}/>
                    </div>
                    <div className ="input-field">
                        <button className = "btn green lighten-1 z-depth-0">Send New Ticket</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messages : state.firestore.ordered.messages,
        auth: state.firebase.auth,
        userProfile: state.firebase.userProfile
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
        if (typeof props.auth.uid != "undefined"){
            return [
                {
                    collection: 'messages',
                    doc: 'supportMsgs',
                    subcollections: [{ collection: 'msgThreads' }],
                    doc: props.auth.uid,
                    subcollections: [{ collection: 'userSupportMsgs' }],
                    storeAs: 'messages'
                }
            ]
        } else {
            return [];
        }
    })
)(Messages)