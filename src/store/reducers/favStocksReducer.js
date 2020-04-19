const initState = null
    // [
    //     {placeholder: 'placeholder'}
    // ]
    // [{
    //         id: 1,
    //         symbol: 'SNAP'
    // }];

const favStockReducer = (state = initState, action) => {
    switch (action.type) {
        case "GET_FAV_STOCK_PRICES":
            return action.favStockPrices
        case "GET_FAV_STOCK_ERR":
            alert("Failed to get stock info! " + action.err);
            return state;
        default:
            return state;
    }
};

export default favStockReducer