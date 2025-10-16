import { createSlice } from "@reduxjs/toolkit";

const likeSlice=createSlice({
    name:"like",
    initialState:{},
    reducers:{
        addLike:(state,action)=>{
            return action.payload
        }
    }
})
export const{addLike}=likeSlice.actions
export default likeSlice.reducer