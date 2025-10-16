import { createSlice } from "@reduxjs/toolkit";

const likeSlice=createSlice({
    name:"like",
    initialState:null,
    reducers:{
        addLike:(state,action)=>{
            return action.payload
        }
    }
})
export const{addLike}=likeSlice.actions
export default likeSlice.reducer