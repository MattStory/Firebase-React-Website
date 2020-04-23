export const createFund = (fund) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid
        firestore.collection('funds').add({
            ...fund,
            owner: profile.firstName + ' ' + profile.lastName,
            uid: userId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_FUND', fund });
        }).catch((err) => {
            dispatch({ type: 'CREATE_FUND_ERR'}, err);
        })
    }
};

export const editFund = (fund) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        console.log(fund);
        firestore.collection('funds').doc(fund.fundSelected).set({
            nickname: fund.nickname ? fund.nickname : '',
            balance: fund.balance ? fund.balance : 0,
            lowBalanceLimit: fund.lowBalanceLimit ? fund.lowBalanceLimit : 0,
            largeTransacationLimit: fund.largeTransactionLimit ? fund.largeTransactionLimit : 0,
            spendingLimit: fund.spendingLimit ? fund.spendingLimit : 0,
            fundType: fund.fundType ? fund.fundType : 'PayPal',
            owner: profile.firstName + ' ' + profile.lastName,
            uid: userId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'SET_FUND', fund });
        }).catch((err) => {
            dispatch({ type: 'SET_FUND_ERR'}, err);
        })
    }
};

export const delFund = (fund) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        console.log(fund)
        firestore.collection('funds').doc().set({
            balance: 245762548
        }).then(() => {
            dispatch({ type: 'SET_FUND', fund });
        }).catch((err) => {
            dispatch({ type: 'SET_FUND_ERR'}, err);
        })
    }
};

export const setFund = (fund) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const userId = getState().firebase.auth.uid;
        let docid = '4HCMIlNug3Z1dg67nVHc'
        firestore.collection('funds').doc(docid).set({
            balance: 245762548
        }).then(() => {
            dispatch({ type: 'SET_FUND', fund });
        }).catch((err) => {
            dispatch({ type: 'SET_FUND_ERR'}, err);
        })
    }
};