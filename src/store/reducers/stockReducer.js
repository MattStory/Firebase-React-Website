const initState = [];

const stockReducer = (state = initState, action) => {
    switch (action.type) {
        case "GET_STOCK":
            return action.stock;
        case "GET_STOCK_ERR":
            alert("Failed to get stock info! " + action.err);
            return state;
        default:
            return state;
    }
};

export default stockReducer