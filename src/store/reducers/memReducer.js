const InitState = {
    memos :[
    {mem_title: "Haider", content : "Haider is the best" },
    {mem_title: "Pay the electric bill", content :"Please do it I want electricity"}
    ]

}

const paymentReducer = (state = InitState, action) => {
    if (action.type === "CREATE_MEM") {
        console.log("Memo Created");
        return state;
    } else if (action.type === "DELTE_MEM_DOC") {
        console.log("PAYMENT Deleted");
        return state;
    }
    return state;
}

export default paymentReducer ;