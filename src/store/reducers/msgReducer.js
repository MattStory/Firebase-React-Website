const InitState = {
    supportTickets:[
        {content: 'I love pineapples expressly', email: 'sethrogen@collegecap.org'},
        {content: 'There is pizza on my pants', email: 'jonahhill@collegecap.org'}
    ]
}

const msgReducer = (state = InitState, action) => {
    switch(action.type){
        case 'CREATE_TICKET':
            console.log('created ticket', action.newMsg)
            return state;
        case 'CREATE_TICKET_ERR':
            console.log('create transaction err', action.err)
            return state;
        case 'CLOSE_TICKET':
            console.log('close ticket', action.docID)
            return state;
        case 'CLOSE_TICKET_ERR':
            console.log('close ticket err', action.err)
            return state;
        default:
            return state;
    }
}

export default msgReducer;