const InitState = {
    messages:[
        {name: 'Seth Rogen', content: 'I love pineapples expressly', timestamp: '42:04:20'},
        {name: 'Jonah Hill', content: 'There is pizza on my pants', timestamp: '24:40:02'}
    ]
}

const msgReducer = (state = InitState, action) => {
    if (action.type === "CREATE_MSG") {
        console.log("message created")
    } else if (action.type === "CREATE_MSG_ERR") {
        console.log("error creating message");
    } else if (action.type === 'CLOSE_THREAD') {
        console.log("successfully closed message thread");
    } else if (action.type === 'FETCH_MSGS_ERR') {
        console.log("error closing message thread");
    }
    return state;
}

export default msgReducer;