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

export const getStocks = (symbols) => {
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
            dispatch({type: "GET_STOCK", stocks: results});
        }).catch((err) => {
            dispatch({type: "GET_STOCK_ERR", err})
        })
    }
};