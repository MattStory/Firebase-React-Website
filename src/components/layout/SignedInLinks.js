import React, { Profiler } from 'react'
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux'
import {signOut} from '../../store/actions/authActions'
import Dropdown from 'react-bootstrap/Dropdown'


const SignedInLinks =(props) =>{
    
    return (
        <div id ="signedIn">
            <Dropdown.Item><NavLink to='/messages'  className ='btn btn -floating green lighten-1'>Support</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to='/create'  className ='btn btn -floating green lighten-1'>New Post</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to='/financials'  className ='btn btn -floating green lighten-1'>Financials</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to='/transactions'  className ='btn btn -floating green lighten-1'>Transactions</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to='/visualizations'  className ='btn btn -floating green lighten-1'>Visualizations</NavLink> </Dropdown.Item>
            <Dropdown.Item><NavLink to='/memos'  className ='btn btn -floating green lighten-1'>Memos</NavLink> </Dropdown.Item>
            <Dropdown.Item><NavLink to='/profile' className ='btn btn -floating green lighten-1'>{props.profile.firstName}</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to = '/signin' className ='btn btn -floating green lighten-1' onClick={props.signOut} >Log Out</NavLink></Dropdown.Item>
        </div>
    )
}
const mapDispatchToProps= (dispatch)=>{
    return{
        signOut:()=> dispatch(signOut())
    }
}
export default connect(null,mapDispatchToProps)(SignedInLinks)