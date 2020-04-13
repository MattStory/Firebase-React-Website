const InitState = {
    payments :[
    {title: "Haider", amount : "Haider is the best" , account : " ", date: " " }
    ]

}

const memReducer = (state = InitState, action) => {
    if (action.type === "CREATE_PAYMENT") {
        console.log("PAYMENT Created");
        return state;   
    } else if (action.type === "DELTE_PAYMENT_DOC") {
        console.log("Memo Deleted");
        return state;
    }
    return state;
}

export default memReducer;