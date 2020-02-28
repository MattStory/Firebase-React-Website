export const updateProfile =(userProfile)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const firebase = getFirebase();
        const firestore =getFirestore();
        const userId= getState().firebase.auth.uid;
        firestore.collection('users').doc(userId).update({
            firstName : userProfile.firstName,
            lastName : userProfile.lastName,
            email : userProfile.email,
            phone : userProfile.phone,
            address: userProfile.address,
            studentId: userProfile.studentId

        }).then(()=>{
            dispatch({type: 'UPDATE_SUCCESS',userProfile})
            alert("update success");
            
        }).catch(err=>{
            dispatch({type: 'UPDATE_ERROR',err})
            alert("update failure");
        })
    }
}

