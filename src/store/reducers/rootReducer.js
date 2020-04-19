import authReducer from './authReducer'
import projectReducer from './projectReducer'
import {combineReducers} from 'redux'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'
import updateReducer from './updateReducer'
import fundReducer from './fundReducer'
import memReducer from './memReducer';
import msgReducer from './msgReducer';
import transactionReducer from "./transactionReducer";
import stockReducer from "./stockReducer";
import favStocksReducer from "./favStocksReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    userProfile: updateReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    fund: fundReducer,
    memo: memReducer,
    messages: msgReducer,
    transaction: transactionReducer,
    stock: stockReducer,
    favStockPrices: favStocksReducer
});

export default rootReducer