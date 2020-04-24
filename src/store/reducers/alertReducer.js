const initState= {
    alerts:[{placeholder: 'placeholder'}]
};

const alertReducer =(state = initState, action)=>{
    switch(action.type){
        case 'DELETE_ALERT':
            console.log('deleted alert')
            return state;
        case 'DELETE_ALERT_ERR':
            console.log("delete alert err");
            return state;
        default:
            return state;
    }
};

export default alertReducer