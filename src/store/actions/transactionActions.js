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

        let transactionDocRef = firestore
            .collection("transactions")
            .doc(userId)
            .collection('userTransactions')
            .doc(transactionToUpdate.id);

        let transactionUpdate = {};

        transactionUpdate[transactionToUpdate.dataField] = transactionToUpdate.newValue;
        transactionUpdate['editedAt'] = new Date();

        if (transactionToUpdate.dataField === 'financialAcct') {
            let originalAcct = '';
            let transactionAmount = 0;

            transactionDocRef.get().then(function (doc) {
                originalAcct = doc.data().financialAcct;
                transactionAmount = parseFloat(doc.data().amount);
            }).then(() => {
                // update original account
                let originalAcctDocRef = firestore
                    .collection('funds')
                    .doc(originalAcct);

                let originalAcctBalance = 0;

                originalAcctDocRef.get().then(function (doc) {
                    originalAcctBalance = parseFloat(doc.data().balance)
                }).then(() => {
                    originalAcctDocRef.update({
                        balance: originalAcctBalance + transactionAmount
                    });
                });


            }).then(() => {
                // update new account

                let newAcctDocRef = firestore
                    .collection('funds')
                    .doc(transactionToUpdate.newValue);

                let newAcctBalance = 0;

                newAcctDocRef.get().then(function (doc) {
                    newAcctBalance = parseFloat(doc.data().balance)
                }).then(() => {
                    newAcctDocRef.update({
                        balance: newAcctBalance - transactionAmount
                    });
                });
            }).then(() => {
                transactionDocRef.update(transactionUpdate)
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });
            });
        } else if (transactionToUpdate.dataField === 'amount') {
            let originalAmount = 0;
            let financialAcct = '';

            // get original amount and account
            transactionDocRef.get().then(function (doc) {
                originalAmount = parseFloat(doc.data().amount);
                financialAcct = doc.data().financialAcct;
            }).then(() => {
                // proceed to update transaction
                transactionDocRef.update(transactionUpdate)
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });

                // update fund account
                let fundDocRef = firestore
                    .collection('funds')
                    .doc(financialAcct);

                let fundBalance = 0;

                fundDocRef.get().then(function (doc) {
                    fundBalance = parseFloat(doc.data().balance)
                }).then(() => {
                    fundDocRef.update({
                        balance: fundBalance + originalAmount - transactionToUpdate.newValue
                    })
                })
            });


        } else {
            transactionDocRef.update(transactionUpdate)
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });
        }
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

        let amount, financialAcct;

        transactions.forEach(transaction => {
            docRef.doc(transaction).get().then(function (doc) {
                amount = parseFloat(doc.data().amount);
                financialAcct = doc.data().financialAcct;
            }).then(() => {
                docRef.doc(transaction).delete()
                    .then(() => {
                        // proceed to update fund
                        let fundDocRef = firestore
                            .collection('funds')
                            .doc(financialAcct);

                        let fundBalance;

                        fundDocRef.get().then(function (doc) {
                            fundBalance = parseFloat(doc.data().balance)
                        }).then(() => {
                            fundDocRef.update({
                                balance: fundBalance + amount
                            })
                        })
                    })
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