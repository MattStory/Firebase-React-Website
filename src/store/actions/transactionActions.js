export const createTransaction = (transaction, history) => {
    return (dispatch, getState, {getFirebase, getFirestore} ) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;
        //check if user's collection has been created
        let docRef = firestore.collection("transactions").doc(userId);

        let dateParts = transaction.transactionDate.split("-"); // yyyy-mm-dd
        transaction['transactionDate'] = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];

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
                //alert("Transaction Created");
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

export const updateTransaction = (transactionToUpdate) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        //check if user's collection has been created
        let docRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('userTransactions')
            .doc(transactionToUpdate.id);

        let transactionUpdate = {};

        transactionUpdate[transactionToUpdate.dataField] = transactionToUpdate.newValue;

        docRef.update(transactionUpdate)
            .catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
};