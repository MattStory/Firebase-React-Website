import React, { Component } from 'react'
import {connect} from 'react-redux'
import {resetPassword} from '../../store/actions/authActions'
import {Redirect} from 'react-router-dom'
import {Link} from 'react-router-dom';
import {googleLogin} from '../../store/actions/authActions'


class google extends Component {
    state ={
        email:'',
    }

    handleChange =(e)=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    handelSubmit =(e)=>{
        e.preventDefault();
        this.props.googleLogin(this.state.email);
        this.props.history.push('/SignIn');
        //firebase.auth().sendPasswordResetEmail(this.state.email);
    }

    render() {
        const {authError,auth} =this.props;
        return (
            <div className ="container">
                <form onSubmit={this.handelSubmit} className ="white">
                <h5 className ="grey-text text-darken-3">Login with Google</h5>
               
                <div className ="input-field">
                    <button className = "btn green lighten-1 z-depth-0">Login</button>
                    <div className="red-text center">
                        {authError? <p>{authError}</p>:null}
                    </div>
                </div>
              


                </form>
            </div>

           

        )
    }
}

const mapStateToProps =(state)=>{
    return{
        auth: state.firebase.auth,
        authError: state.auth.authError
    }
}

const mapDispatchToProps= (dispatch)=>{
    return{
        googleLogin: (email) => dispatch(googleLogin(email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(google)
