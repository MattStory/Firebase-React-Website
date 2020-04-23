import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateProfile, getProfileData} from '../../store/actions/updateActions'

class Profile extends Component {
    state ={
        email:'',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        studentId: '',
        address: ''
    }

    handleChange =(e)=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    handelSubmit =(e)=>{
        e.preventDefault();
        this.props.updateProfile(this.state)
        this.props.history.push('/');
    }

        
    
    render() {
        const {auth} =this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>
        return (
            
            <div className ="container">
                <form onSubmit={this.handelSubmit} className ="white">
                <h5 className ="grey-text text-darken-3">Profile</h5>
                <div className = "input-field">
                    <label htmlFor="email">Email</label>
                    <input  type ="email" id="email"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input type ="tel" id="phone"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="firstName">First Name</label>
                    <input type ="text" id="firstName"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input type ="text" id="lastName"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="studentId">Student Id</label>
                    <input type ="text" id="studentId"onChange ={this.handleChange}/>
                </div>
                <div className = "input-field">
                    <label htmlFor="address">Address</label>
                    <input type ="text" id="address"onChange ={this.handleChange}/>
                </div>
                <div className ="input-field">
                    <button className = "btn green lighten-1 z-depth-0">Update</button>
                </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps =(state)=>{
    return{
        userProfile: state.firebase.userProfile,
        auth: state.firebase.auth

    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        updateProfile: (userProfile)=> dispatch(updateProfile(userProfile))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile)
