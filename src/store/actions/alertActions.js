export const deleteAlert = (docID) => {
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const uid = getState().firebase.auth.uid.toString();
        firestore.collection('alerts').doc(uid).collection("userAlerts").doc(docID).delete().then(() => {
            dispatch({ type: 'DELETE_ALERT', docID });
        }).catch((err) => {
            dispatch({ type: 'DELETE_ALERT_ERR'}, err);
        })
    }
}