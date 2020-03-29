export const createTransaction = (transaction, history) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;
        //check if user's collection has been created
        let transactionDocRef = firestore.collection("transactions").doc(userId);

        let dateParts = transaction.transactionDate.split("-"); // yyyy-mm-dd
        transaction['transactionDate'] = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];

        // create record in userTransactions
        transactionDocRef.get().then(function (doc) {
            if (!doc.exists) {
                transactionDocRef.set({
                    owner: profile.firstName + ' ' + profile.lastName
                })
            }

            transactionDocRef = transactionDocRef.collection('userTransactions');

            transactionDocRef.add({
                amount: transaction.amount,
                merchant: transaction.merchant,
                transactionCategory: transaction.transactionCategory,
                transactionDate: transaction.transactionDate,
                financialAcct: transaction.financialAcct,
                createdAt: new Date(),
                editedAt: new Date()
            }).then(() => {
                dispatch({type: 'CREATE_FUND', transaction});
                //alert("Transaction Created");
            }).catch((err) => {
                dispatch({type: 'CREATE_FUND_ERR'}, err);
                alert("Create transaction failed.\n" + err.message);
            })
        }).then((response) => {
            history.push('/transactions')
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });


        // update financial account balance

        let fundDocRef = firestore.collection("funds").doc(transaction.financialAcct);

        fundDocRef.update({
            balance: transaction.acctBalance - transaction.amount
        }).catch(function (error) {
            console.log("Error updating document:", error);
        });

    }
};

export const updateTransaction = (transactionToUpdate) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('userTransactions')
            .doc(transactionToUpdate.id);

        let transactionUpdate = {};

        transactionUpdate[transactionToUpdate.dataField] = transactionToUpdate.newValue;
        transactionUpdate['editedAt'] = new Date();

        docRef.update(transactionUpdate)
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
    }
};

export const deleteTransactions = (transactions) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('userTransactions');

        transactions.forEach(transaction => {
            docRef.doc(transaction)
                .delete()
                .catch(function (error) {
                    console.log("Error getting document:", error);
                })
        })
    }
};

export const newCustomCategory = (category) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;

        //check if user's collection has been created
        let docRef = firestore.collection("transactions").doc(userId);

        docRef.get().then(function (doc) {
            if (!doc.exists) {
                docRef.set({
                    owner: profile.firstName + ' ' + profile.lastName // initialize transaction document
                })
            }

            docRef = docRef.collection('customCategories');

            docRef.add({
                category: category,
                createdAt: new Date(),
                editedAt: new Date()
            })


        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export const updateCustomCategory = (categoryToUpdate) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('customCategories')
            .doc(categoryToUpdate.id);

        let categoryUpdate = {};

        categoryUpdate['category'] = categoryUpdate.value;
        categoryUpdate['editedAt'] = new Date();

        docRef.update(categoryUpdate)
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
    }
};

export const deleteCustomCategories = (categories) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;

        let docRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('customCategories');

        categories.forEach(category => {
            docRef.doc(category)
                .delete()
                .catch(function (error) {
                    console.log("Error getting document:", error);
                })
        })
    }
};