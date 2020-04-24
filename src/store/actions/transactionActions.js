import {withRouter} from "react-router-dom";

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
                financialAccounts: [{
                    account: transaction.financialAcct,
                    percentage: 100
                }],
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

        console.log("transaction.financialAcct",transaction.financialAcct);
        console.log("transaction.acctBalance", transaction.acctBalance);
        console.log("transaction.amount", transaction.amount);

        fundDocRef.update({
            balance: parseInt(transaction.acctBalance) - parseInt(transaction.amount)
        }).catch(function (error) {
            console.log("Error updating document:", error);
        });


        // update running total of category, generate alert if necesarry
        let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
        catRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.data().category == transaction.transactionCategory) {
                    let currentTotal = doc.data().spendingTotal;
                    var newTotal;
                    if (currentTotal !== undefined) {
                        newTotal = parseInt(currentTotal) + parseInt(transaction.amount);
                    } else {
                        newTotal = parseInt(transaction.amount);
                    }
                    doc.ref.update({
                        spendingTotal: newTotal
                    });
                    if (newTotal > parseInt(doc.data().limit)) {
                        let alertRef = firestore
                                        .collection("alerts")
                                        .doc(userId);
                        alertRef.get().then((docSnapshot) => {
                            if (!docSnapshot.exists) {
                                alertRef.set({
                                    userID: userId
                                })
                            } 
                        });
                        alertRef.collection("userAlerts").add({
                            category: transaction.transactionCategory,
                            amount: transaction.amount,
                            limit: parseInt(doc.data().limit),
                            catSpent: newTotal,
                            alertType: "CATEGORY SPENDING ALERT"
                        })
                    }
                } 
            });
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
            })
        } else if (transactionToUpdate.dataField === 'amount') {
            let originalAmount = 0;
            let financialAccounts;
            let cat = '';

            // get original amount and account and category
            transactionDocRef.get().then(function (doc) {
                originalAmount = parseFloat(doc.data().amount);
                financialAccounts = doc.data().financialAccounts;
                cat = doc.data().transactionCategory;
            }).then(() => {
                // proceed to update transaction
                transactionDocRef.update(transactionUpdate)
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });

                financialAccounts.forEach(account => {
                    console.log(account)
                    // update fund account
                    let fundDocRef = firestore
                        .collection('funds')
                        .doc(account.account);

                    let fundBalance = 0;

                    fundDocRef.get().then(function (doc) {
                        fundBalance = parseFloat(doc.data().balance)
                    }).then(() => {
                        fundDocRef.update({
                            balance: fundBalance + (originalAmount - transactionToUpdate.newValue) * account.percentage / 100
                        })
                    })
                })
            }).then(() => {
                // Update category total
                let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
                catRef.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if(doc.data().category == cat) {
                            //original amount
                            //transactionToUpdate.newValue
                            let currentTotal = doc.data().spendingTotal;
                            let newTotal = parseInt(currentTotal) - originalAmount;
                            newTotal += transactionToUpdate.newValue;
                            doc.ref.update({
                                spendingTotal: newTotal
                            })
                        }
                    })
                })
            });

        } else if (transactionToUpdate.dataField === 'transactionCategory') {
             // get original amount and category
             console.log("UPDATING CATEGORY");
             let originalAmount = 0;
             let cat = '';
             transactionDocRef.get().then(function (doc) {
                originalAmount = parseFloat(doc.data().amount);
                cat = doc.data().transactionCategory;
            }).then(() => {
                //Update the transaction
                transactionDocRef.update(transactionUpdate)
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });
            }).then(() => {
                //Update old category spending total
                if (cat != transactionToUpdate.newValue) {
                    let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
                    catRef.get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            if(doc.data().category == cat) {
                                let currentTotal = doc.data().spendingTotal;
                                let newTotal = parseInt(currentTotal) - originalAmount;
                                doc.ref.update({
                                    spendingTotal: newTotal
                                })
                            }
                        })
                    })
                }
            }).then(() => {
                //Update new category spending total
                if (cat != transactionToUpdate.newValue) {
                    let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
                    catRef.get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            if(doc.data().category == transactionToUpdate.newValue) {
                                let currentTotal = doc.data().spendingTotal;
                                let newTotal = parseInt(currentTotal) + originalAmount;
                                doc.ref.update({
                                    spendingTotal: newTotal
                                })
                            }
                        })
                    })
                }
            })
        } else {
            console.log("UPDATING ELSE");
            console.log("field to update" + transactionToUpdate.dataField);
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

        let amount, financialAccounts, cat;

        transactions.forEach(transaction => {
            docRef.doc(transaction).get().then(function (doc) {
                amount = parseFloat(doc.data().amount);
                financialAccounts = doc.data().financialAccounts;
                cat = doc.data().transactionCategory;
            }).then(() => {
                docRef.doc(transaction).delete()
                    .then(() => {
                        financialAccounts.forEach(account => {
                            // proceed to update fund
                            let fundDocRef = firestore
                                .collection('funds')
                                .doc(account.account);

                            let fundBalance;

                            fundDocRef.get().then(function (doc) {
                                fundBalance = parseFloat(doc.data().balance)
                            }).then(() => {
                                fundDocRef.update({
                                    balance: fundBalance + amount * account.percentage / 100
                                })
                            })
                        })
                    })
                    .then(() => {
                        //update the category total
                        let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
                        catRef.get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                if(doc.data().category == cat) {
                                    let currentTotal = doc.data().spendingTotal;
                                    let newTotal = parseInt(currentTotal) - amount;
                                    doc.ref.update({
                                        spendingTotal: newTotal
                                    })
                                }
                            })
                        })
                    })
            })
        })
    }
};

export const newCustomCategory = (category, spendingLimit) => {
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
                editedAt: new Date(),
                limit: spendingLimit
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

export const deleteCustomCategories = (category) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;

        let catRef = firestore.collection("transactions").doc(userId).collection("customCategories");
        console.log("------------------------ RUNNING -------------------------");
        catRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.data().category == category) {
                    doc.ref.delete();
                }
            })
        })
    }
};

export const largeTransactionAlert = (transaction) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        var largeTransactionLimit;
        const uid = getState().firebase.auth.uid;
        let fundBalance = undefined;

        let docRef = firestore
            .collection("funds")
            .doc(transaction.financialAcct);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                largeTransactionLimit = parseInt(doc.data().largeTransactionLimit);
                fundBalance = doc.data().balance;
                console.log("large transaction limit first: " + largeTransactionLimit);
                if (parseInt(transaction.amount) >= parseInt(largeTransactionLimit)) {
                    let alertRef = firestore
                                    .collection("alerts")
                                    .doc(uid);
                    alertRef.get().then((docSnapshot) => {
                        if (!docSnapshot.exists) {
                            alertRef.set({
                                userID: uid
                            })
                        } 
                    });
                    alertRef.collection("userAlerts").add({
                        fund: transaction.nickName,
                        amount: transaction.amount,
                        limit: largeTransactionLimit,
                        fundBalance: fundBalance,
                        alertType: "LARGE TRANSACTION"
                    })
                }
            } else {
                console.log("error retrieving doc in largeTransactionAlert");
            }
        }).catch(function(err) {
            console.log("Error getting doc:", err);
        })
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
                if (parseInt(fundBalance) <= parseInt(lowBalance)) {
                    let alertRef = firestore
                                    .collection("alerts")
                                    .doc(uid);
                    alertRef.get().then((docSnapshot) => {
                        if (!docSnapshot.exists) {
                            alertRef.set({
                                userID: uid
                            })
                        } 
                    });
                    alertRef.collection("userAlerts").add({
                        fund: transaction.nickName,
                        amount: transaction.amount,
                        limit: lowBalance,
                        fundBalance: fundBalance,
                        alertType: "LOW BALANCE"
                    })
                }
            } else {
                console.log("error retrieving doc in lowBalanceAlert");
            }
        }).catch(function(err) {
            console.log("Error getting doc:", err);
        })
    }
}

export const newSplitAccount = (newAccounts, transactionToUpdate) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;

        let transactionDocRef = firestore.collection("transactions").doc(userId).collection("userTransactions").doc(transactionToUpdate.id);

        let transactionDoc, financialAccounts;

        transactionDocRef.get().then(function (doc) {
            transactionDoc = doc.data()
        }).then(() => {
            // restore previous split accounts' balances
            financialAccounts = transactionDoc.financialAccounts

            let promiseArr = financialAccounts.map(function (account) {
                let accountRef = firestore.collection("funds").doc(account.account)

                return accountRef.get().then(function (doc) {
                    let update = {
                        balance: doc.data().balance + (account.percentage / 100) * transactionToUpdate.amount
                    }

                    console.log(newAccounts)

                    console.log(update)

                    return accountRef.update(update)
                })
            })

            Promise.all(promiseArr).then(() => {
                // write new split accounts to transaction
                newAccounts = newAccounts.map(account => (
                        {
                            account: account.splitAccountID,
                            percentage: account.percentage
                        }
                    )
                )
                transactionDocRef.update({
                    financialAccounts: newAccounts
                })

                // update new accounts' balances

                newAccounts.forEach(account => {
                    console.log(account)
                    let accountRef = firestore.collection("funds").doc(account.account)

                    accountRef.get().then(function (doc) {
                        console.log(doc.data())
                        let update = {
                            balance: doc.data().balance - (account.percentage / 100) * transactionToUpdate.amount
                        }

                        console.log(update)

                        accountRef.update(update)
                    })
                })
            })
        }).catch((err) => {
            dispatch('UPDATE_SPLIT_ACCOUNT_ERR', err)
        })
    }
}