export const createMessage =(newMsg)=>{
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const uid = getState().firebase.auth.uid.toString();
        const email = getState().firebase.auth.email.toString();
        const profile = getState().firebase.profile;
        const content = newMsg.content;
        var docRef;
        
        var key = uid;
    
        docRef = firestore.collection('messages').doc('supportMsgs').collection('msgThreads').doc(key);

        docRef.get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
                docRef.set({
                    threadStatus: "active",
                    threadID: key
                }).then(() => {
                    dispatch({ type: 'CREATE_THREAD' });
                }).catch((err) => {
                    dispatch({ type: 'CREATE_THREAD_ERR'}, err);
                })
            } 
        })

        docRef.collection("userSupportMsgs").add({
            ...newMsg,
            //msgCont: newMsg.content,
            msgTime: new Date(),
            name: profile.firstName,
            id: uid
        }).then(() => {
            dispatch({ type: 'CREATE_MSG', newMsg });
        }).catch((err) => {
            dispatch({ type: 'CREATE_MSG_ERR'}, err);
        })

        //sendEmail(email, content);
    }
}

