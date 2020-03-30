const initState= {
    funds:[{placeholder: 'placeholder'}]
}

const fundReducer =(state = initState, action)=>{
    switch(action.type){
        case 'CREATE_FUND':
            console.log('created project', action.fund)
            return state;
        case 'CREATE_FUND_ERROR':
            console.log('create project err', action.err);
            return state;
        default:
            return state;
    }
}

export default fundReducer