import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js'
import PostReducer from './postSlice.js'
import suggestionsReducer from './suggestionsSlice.js'
import requestReducer from './requestSlice.js'
import connectionReducer from './connectionSlice.js'
import likeReducer from './likeSlice.js'
import allUserReducer from './allUserSlice.js'
const  appStore=configureStore({
    reducer:{
        user:userReducer,
        post:PostReducer,
        suggestions:suggestionsReducer,
        request:requestReducer,
        connection:connectionReducer,
        like:likeReducer,
        allUser:allUserReducer
    }
})
export default appStore