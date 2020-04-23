import React from 'react'
import {NavLink} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown'
const SignedOutLinks =() =>{
    return (
        <div >
            <Dropdown.Item><NavLink to='/signup' className ='btn btn -floating green lighten-1'>SignUp</NavLink></Dropdown.Item>
            <Dropdown.Item><NavLink to='/signin' className ='btn btn -floating green lighten-1'>Log In</NavLink></Dropdown.Item>
        </div>
    )
}

export default SignedOutLinks