// export const createMemo = (id) => {
//     return {
//         type : 'CREATE_MEM',
//         id : id,
//     }

// }

export const createMemo = (mem) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        firestore.collection('memos').add({
            ...mem,
            owner: profile.firstName + ' ' + profile.lastName,
            uid: userId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_MEM', mem });
        }).catch((err) => {
            dispatch({ type: 'CREATE_FUND_ERR'}, err);
        })
    }
};

export const deleteMemo = (mem) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        firestore.collection('memos').doc(mem).delete().then(() => {
            dispatch({ type: 'DELTE_DOC', mem });
        }).catch((err) => {
            dispatch({ type: 'CREATE_FUND_ERR'}, err);
        })
    }
};