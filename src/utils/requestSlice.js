import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:'request',
    initialState:[],
    reducers:{
        addRequest:(state,action)=>{
            return action.payload
        },
        removeRequests:(state,action)=>{
            return state.filter(user=>user._id!==action.payload)
        }
    }
})
export const{addRequest,removeRequests}=requestSlice.actions
export default requestSlice.reducer