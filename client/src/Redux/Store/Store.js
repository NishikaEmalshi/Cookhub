import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import thunk from "redux-thunk";
import { AuthReducer } from "../Auth/Reducer";
import { commentReducer } from "../Comment/Reducer";
import { postReducer } from "../Post/Reducer";
import { userReducer } from "../User/Reducer";
import { learningPlanReducer } from "../LearningPlan/Reducer";
import { progressReducer } from "../LearningProgress/Reducer";

const rootReducers=combineReducers({

    post:postReducer,
    comments:commentReducer,
    user:userReducer,
    auth:AuthReducer,
    learningPlan:learningPlanReducer,
    learningProgress:progressReducer,

});

export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))