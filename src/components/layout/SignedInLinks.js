import React, { Profiler } from 'react'
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux'
import {signOut} from '../../store/actions/authActions'
const SignedInLinks =(props) =>{
    
    return (
        <ul className ="right">
            <li><NavLink to='/create'>New Post</NavLink></li>
            <li><NavLink to='/financials'>Financials</NavLink></li>
            <li><NavLink to='/profile'>Edit Profile</NavLink></li>
            <li><NavLink to='/memos '>Memos</NavLink> </li>
            <li><NavLink to='/profile' className ='btn btn -floating green lighten-1'>{props.profile.firstName}</NavLink></li>
            <li><a onClick={props.signOut} >Log Out</a></li>
        </ul>
    )
}
const mapDispatchToProps= (dispatch)=>{
    return{
        signOut:()=> dispatch(signOut())
    }
}
export default connect(null,mapDispatchToProps)(SignedInLinks)