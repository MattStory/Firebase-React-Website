const apiUrl = "https://finnhub.io/api/v1/quote?token=bq4lq1frh5rc5os3t7vg";

export const getStock = (symbol) => {
    return (dispatch, getState) => {
        let localUrl = new URL(apiUrl);
        localUrl.searchParams.append("symbol", symbol);
        fetch(localUrl, {
            method: "GET"
        })
            .then(response => response.json())
            .then((json => {
                dispatch(
                    {
                        type: "GET_STOCK",
                        stock: {
                            "symbol": symbol,
                            "currentPrice": json.c,
                            "openingPrice": json.o,
                            "priceDiff": json.c - json.o
                        }
                    }
                );
            }))
            .catch((err) => {
                dispatch({type: "GET_STOCK_ERR", err})
            });
    }
};

export const getStockPrices = (symbols) => {
    return (dispatch, getState) => {
        let results = [];

        let promiseArr = symbols.map(function (symbol) {
            let localUrl = new URL(apiUrl);
            localUrl.searchParams.append("symbol", symbol);
            return fetch(localUrl, {
                method: "GET"
            })
                .then(function (response) {
                    response.json()
                        .then((json) => {
                            results.push({
                                "symbol": symbol,
                                "currentPrice": json.c,
                                "openingPrice": json.o,
                                "priceDiff": json.c - json.o
                            })
                        });

                    return response
                })
        });

        Promise.all(promiseArr).then(() => {
            dispatch({type: "GET_FAV_STOCK_PRICES", favStockPrices: results});
        }).catch((err) => {
            dispatch({type: "GET_STOCK_ERR", err})
        })
    }
};

export const newStock = (symbol) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        const profile = getState().firebase.profile;
        //check if user's collection has been created
        let stockDocRef = firestore.collection("stocks").doc(userId);

        // create record in favoriteStocks
        stockDocRef.get().then(function (doc) {
            if (!doc.exists) {
                stockDocRef.set({
                    owner: profile.firstName + ' ' + profile.lastName
                })
            }

            stockDocRef = stockDocRef.collection('favoriteStocks');

            stockDocRef.add({
                symbol: symbol,
                createdAt: new Date(),
                editedAt: new Date()
            }).then(() => {
                dispatch({type: 'CREATE_STOCK', symbol});
            }).catch((err) => {
                dispatch({type: 'CREATE_STOCK_ERR'}, err);
                alert('Create new stock symbol failed.\n' + err.message);
            })
        }).catch(function (err) {
            console.log("Error getting document: ", err);
            alert("Error getting document, please contact administrator.")
        })
    }
}