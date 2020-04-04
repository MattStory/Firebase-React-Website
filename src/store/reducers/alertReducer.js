const initState= {
    alerts:[{placeholder: 'placeholder'}]
};

const alertReducer = (state = [], action) => {
    switch(action.type){
        case 'LOW_BALANCE_ALERT':
            console.log('fund has low balance')
            return state;
        case 'LARGE_TRANSACTION_ALERT':
            console.log('a large transaction was made')
            return state;
        case 'CLOSE_ALERT':
            console.log('closed alert')
            return state;
        default:
            return state;
    }
}

export default alertReducer;