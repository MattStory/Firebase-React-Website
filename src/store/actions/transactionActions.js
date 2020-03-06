export const createTransaction = (transaction) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;

        //check if user's collection has been created
        let docRef = firestore.collection('transactions').doc(userId);

        docRef.get().then(function (doc) {
            if (!doc.exists){
                docRef = firestore.collection('transactions').add({
                    userId: userId,
                    owner: profile.firstName + ' ' + profile.lastName,
                    createdAt: new Date()
                })
            }
        }).catch(function (err) {
            console.log("Error getting document:", err);
        });

        docRef.set({
            ...transaction
        }).then(() => {
            dispatch({ type: 'CREATE_FUND', transaction });
            alert("Transaction Created");
        }).catch((err) => {
            dispatch({ type: 'CREATE_FUND_ERR'}, err);
            alert("Create transaction failed.\n" + err.message);
        })
    }
};