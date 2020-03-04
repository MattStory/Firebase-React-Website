import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {createMemo} from "../../store/actions/memActions"
import MemFunc from "./memFunc";
import {Redirect} from 'react-router-dom'




class Memos extends Component {

    state = {
        title : "",
        content : "",
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        })
    }


    handelSubmit = (event) => {
        event.preventDefault();
        this.props.creatememo(this.state);
    }

    



    render () {      
        let data = undefined;
//        console.log("UID", this.props.auth.uid);
        if (this.props.memos !== undefined) {
          data = this.props.memos.filter( memo => {
             return this.props.auth.uid == memo.uid
         });
        }


        return (
            <div className="container">
                <form onSubmit={this.handelSubmit} className ="white">
                <h5 className ="grey-text text-darken-3">Create Memos</h5>
                <div id = "title" className = "input-field">
                    <label htmlFor="title">Title</label>
                    <input type ="text" id="title"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="content">Content</label>
                    <textarea  id="content"  className="materialize-textarea" onChange ={this.handleChange}></textarea>
                </div>
                <div className ="input-field">
                    <button className = "btn green lighten-1 z-depth-0">Create</button>
                </div>
                </form>

                <MemFunc data={data} />

            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        memos : state.firestore.ordered.memos,
        auth: state.firebase.auth

    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        creatememo: (id) => { dispatch(createMemo(id))}
    }
}


//export default connect(matchStatetoProps , mapDispatchToProps)(Memos);
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        {collection: 'memos'}
    ])
)(Memos)