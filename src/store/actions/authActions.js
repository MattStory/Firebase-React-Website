export const signIn =(credentials) =>{
    return (dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({type: 'LOGIN_SUCCESS'});
        }).catch((err)=>{
            dispatch({type: 'LOGIN_ERROR',err});
        });
    }
}

export const signOut =()=>{
    return (dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();

        firebase.auth().signOut().then(()=>{
            dispatch({type: 'SIGNOUT_SUCCESS'});
        });
    }
}

export const signUp =(newUser)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const firebase = getFirebase();
        const firestore =getFirestore();

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((resp)=>{
            firebase.auth().currentUser.sendEmailVerification();
            return firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                address: newUser.address,
                phone: newUser.phone,
                studentId: newUser.studentId
            })
        }).then(()=>{
            dispatch({type: 'SIGNUP_SUCCESS'})
        }).catch(err=>{
            dispatch({type: 'SIGNUP_ERROR',err})
        })
    }
}

export const resetPassword =(email)=>{
    return (dispatch, getState, {getFirebase})=>{
        const firebase = getFirebase();
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            // Email sent.
          }).catch(function(error) {
            // An error happened.
          });    }
}
