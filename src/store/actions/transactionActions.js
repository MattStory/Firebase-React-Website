import {withRouter} from "react-router-dom";

export const createTransaction = (transaction, history) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;
        //check if user's collection has been created
        let docRef = firestore.collection("transactions").doc(userId);

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

export const largeTransactionAlert = (transaction) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        var largeTransactionLimit = -1;
        const uid = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("funds")
            .doc(transaction.financialAcct);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("updating");
                largeTransactionLimit = parseInt(doc.data().largeTransactionLimit);
            } else {
                console.log("error retrieving doc in largeTransactionAlert");
            }
        }).catch(function(err) {
            console.log("Error getting doc:", err);
        })

        console.log("Large transaction limit: " + largeTransactionLimit);
        if (largeTransactionLimit > -1) {
            console.log("Transaction amount: " + parseInt(transaction.amount));
            if (parseInt(transaction.amount) >= parseInt(largeTransactionLimit)) {
                console.log("making large transaction alert");
                let alertRef = firestore
                                .collection("alerts")
                                .doc(uid);
                alertRef.get().then((docSnapshot) => {
                    if (!docSnapshot.exists) {
                        docRef.set({
                            userID: uid
                        })
                    } 
                });
                alertRef.collection("userAlerts").add({
                    fund: transaction.financialAcct,
                    amount: transaction.amount,
                    limit: largeTransactionLimit,
                    alertType: "LARGE TRANSACTION"
                })
            }
        }
    }
}

export const lowBalanceAlert = (transaction) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        let lowBalance = undefined;
        let fundBalance = undefined;
        const uid = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("funds")
            .doc(transaction.financialAcct);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                lowBalance = doc.data().lowBalanceLimit;
                fundBalance = doc.data().balance;
                console.log("Low balance: " + lowBalance);
                console.log("FundBalance: " + fundBalance);
            } else {
                console.log("error retrieving doc in lowBalanceAlert");
            }
        }).catch(function(err) {
            console.log("Error getting doc:", err);
        })

        if (lowBalance !== undefined && fundBalance !== undefined) {
            if (parseInt(fundBalance) <= parseInt(lowBalance)) {
                let alertRef = firestore
                                .collection("alerts")
                                .doc(uid);
                alertRef.get().then((docSnapshot) => {
                    if (!docSnapshot.exists) {
                        docRef.set({
                            userID: uid
                        })
                    } 
                });
                alertRef.collection("userAlerts").add({
                    fund: transaction.financialAcct,
                    amount: transaction.amount,
                    limit: lowBalance,
                    alertType: "LOW BALANCE"
                })
            }
        }
    }
}