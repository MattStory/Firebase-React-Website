const initState= {
    transactions:[{placeholder: 'placeholder'}]
};

const transactionReducer =(state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TRANSACTION':
            console.log('created transaction', action.transaction)
            return state;
        case 'CREATE_TRANSACTION_ERROR':
            console.log('create transaction err', action.err);
            return state;
        default:
            return state;
    }
};

export default transactionReducer