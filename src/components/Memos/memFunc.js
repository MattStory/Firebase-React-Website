import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase';
import {deleteMemo} from '../../store/actions/memActions'



const MemFunc = (props) => {
    console.log(props);
    const {data} = props;

   const handleClick = (id) => {
    props.deleting(id);
   }


    if(data){
        const MemoArray = data.map (data => {
            return(
                <div className ="container section project-details" >
                <div className ="card z-depth-0" id ={data.id}>
                    <div className ="card-content">
                        <span className ="card-title">{data.title}</span>
                        <p>{data.content}</p>
                    </div>
                    <div className =" card-action.grey.lighten-4 grey-text">
                        <div>Posted by {data.owner}</div>
                        <div>{moment(data.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>

                <button onClick={() => {handleClick(data.id)}}>Delete</button>
            </div>
            )
        }
            );
        return(
            <div>
           { MemoArray }
           </div>
        )
    } else{
        return (
            <div className ="container center">
                <p>Loading memo...</p>
            </div>
        )
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
    deleting : (id) => { dispatch(deleteMemo(id)) }
    
    }
}
export default compose(
    connect(null,mapDispatchToProps),
    firestoreConnect([
        {collection: 'memos'}
    ])
)(MemFunc)