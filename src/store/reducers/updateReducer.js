const initState={
        userProfile:[{placeholder: 'placeholder'}]
}

const updateReducer=(state=initState,action) =>{
    switch(action.type){
        case 'UPDATE_SUCCESSFUL': 
            console.log('created project', action.project)
            return state;
        case 'UPDATE_ERROR':
            console.log('create project eror', action.err);
            return state;
        default:
            return state;
    }

}

export default updateReducer