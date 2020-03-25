import {withRouter} from "react-router-dom";

export const createTransaction = (transaction, history) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;
        //check if user's collection has been created
        let docRef = firestore.collection("transactions").doc(userId);

        // transform date format
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
        let tDate = new Date(transaction.transactionDate);

        transaction['transactionDate'] = dtf.format(tDate);

        docRef.get().then(function(doc) {
            if (!doc.exists) {
                docRef.set({
                    owner: profile.firstName + ' ' + profile.lastName
                })
            }

            docRef = docRef.collection('userTransactions');

            docRef.add({
                ...transaction,
                createdAt: new Date()
            }).then(() => {
                dispatch({ type: 'CREATE_FUND', transaction });
                alert("Transaction Created");
            }).catch((err) => {
                dispatch({ type: 'CREATE_FUND_ERR'}, err);
                alert("Create transaction failed.\n" + err.message);
            })
        }).then((response) =>{
            history.push('/transactions')
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });


    }
};