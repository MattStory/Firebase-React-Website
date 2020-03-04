import authReducer from './authReducer'
import projectReducer from './projectReducer'
import {combineReducers} from 'redux'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'
import updateReducer from './updateReducer'
import fundReducer from './fundReducer'
import memReducer from './memReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    userProfile: updateReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    fund: fundReducer,
    memo: memReducer,
});

export default rootReducer