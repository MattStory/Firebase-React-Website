const initState= {
    projects:[
        {id: '1', title: 'something something 1', content: 'blah blah blah 1'},
        {id: '2', title: 'something something 2', content: 'blah blah blah 2'},
        {id: '3', title: 'something something 3', content: 'blah blah blah 3'}
    ]
}

const projectReducer =(state =initState, action)=>{
    switch(action.type){
        case 'CREATE_PROJECT': 
            console.log('created project', action.project)
            return state;
        case 'CREATE_PROJECT_ERROR':
            console.log('create project eror', action.err);
            return state;
        default:
            return state;
    }
}

export default projectReducer