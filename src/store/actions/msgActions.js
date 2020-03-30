export const createMessage =(newMsg)=>{
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const uid = getState().firebase.auth.uid.toString();
        const profile = getState().firebase.profile;
        var docRef;
    
        docRef = firestore.collection('supportTickets').doc(uid);

        docRef.get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
                docRef.set({
                    user: profile.firstName,
                    userID: uid
                })
            } 
        })

        docRef.collection("userTickets").add({
            ...newMsg,
            msgTime: new Date(),
            uid: uid,
            email: profile.email
        }).then(() => {
            dispatch({ type: 'CREATE_TICKET', newMsg });
        }).catch((err) => {
            dispatch({ type: 'CREATE_TICKET_ERR'}, err);
        })
    }
}

export const closeTicket = (docID) => {
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const uid = getState().firebase.auth.uid.toString();
        firestore.collection('supportTickets').doc(uid).collection("userTickets").doc(docID).delete().then(() => {
            dispatch({ type: 'CLOSE_TICKET', docID });
        }).catch((err) => {
            dispatch({ type: 'CLOSE_TICKET_ERR'}, err);
        })
    }
}

