import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Redirect} from 'react-router-dom'
import { createMessage, xorSupport } from '../../store/actions/msgActions'
import './messages.css'

class Messages extends Component {

    state = {
        content: ""
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        })
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

        var key = xorSupport(auth.uid);
        var data = [];

        if (this.props.messages !== undefined) {
            data.push(this.props.messages.filter( thread => {
                return key === thread.threadID;
            }));
        }

        console.log("data: ", data);

        return (
            <div className ="container">
                <form onSubmit={this.handelSubmit} className ="white">
                    <h5 className ="grey-text text-darken-3">Message Support</h5>
                    <div className = "msgsContainer">
                        
                    </div> 
                    <div className = "input-field">
                        <label htmlFor="content">Enter Message Here</label>
                        <input  type ="text" id="content"onChange ={this.handleChange}/>
                    </div>
                    <div className ="input-field">
                        <button className = "btn green lighten-1 z-depth-0">Send</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messages : state.firestore.ordered.messages,
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
    firestoreConnect([
        {collection: 'messages'}
    ])
)(Messages)