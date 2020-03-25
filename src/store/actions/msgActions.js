export const closeThread =(newMsg)=>{
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const uid = getState().firebase.auth.uid;
        //const supportID = Rs5NBrhOlTSsKBurH9JnfpTpxUO2;
        // key = supportID ^ uid;
        //const docRef = firestore.collection('messages').doc('supportMsgs').collection('msgThreads').doc(key);

        
    }
}

export const createMessage =(newMsg)=>{
    return(dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const uid = getState().firebase.auth.uid.toString();
        const profile = getState().firebase.profile;
        var docRef;
        
        var key = xorSupport(uid);

        //console.log("supportID: ", supportID);
        //console.log("uid: ", uid);
        //console.log("key: ", key);
    
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
            msgCont: newMsg.content,
            msgTime: new Date(),
            name: profile.firstName,
            id: uid
        }).then(() => {
            dispatch({ type: 'CREATE_MSG', newMsg });
        }).catch((err) => {
            dispatch({ type: 'CREATE_MSG_ERR'}, err);
        })
    }
}

export const xorSupport = (uid) => {
    const supportID = "Rs5NBrhOlTSsKBurH9JnfpTpxUO2";
    var i = uid.length;
    var j = supportID.length;
    var key = "";

    while (i-- > 0 && j-- > 0) {
        key = (parseInt(uid.charAt(i), 16) ^ parseInt(supportID.charAt(j), 16)).toString(16) + key;
    }

    return key;
}

export const fetchMessages = (messageList) => {
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const firestore = getFirestore();
        var listener = firestore.collection('messages').onSnapshot(function(snapshot) {
            snapshot.forEach(function(doc) {
                messageList.push(doc.data());
            });
            dispatch({ type: 'FETCH_MSGS'})
        }, function(error) {
            dispatch({ type: 'FETCH_MSGS_ERR'}, error)
        });
        //listener();
    }
}