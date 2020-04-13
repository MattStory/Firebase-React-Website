export const addpayment = (mem) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        firestore.collection('payments').add({
            ...mem,
            owner: profile.firstName + ' ' + profile.lastName,
            uid: userId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_PAYMENT', mem });
        }).catch((err) => {
            dispatch({ type: 'CREATE_PAYMENT_ERR'}, err);
        })
    }
};

export const deletePayment = (mem) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        firestore.collection('payments').doc(mem).delete().then(() => {
            dispatch({ type: 'DELTE_PAYMENT_DOC', mem });
        }).catch((err) => {
            dispatch({ type: 'DELETE_PAYMENT_ERR'}, err);
        })
    }
};