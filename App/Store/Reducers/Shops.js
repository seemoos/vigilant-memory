import { ActionTypes } from '../Actions';

const INITIAL_STATE = {
    isLoading: false,
    shops: null,
    error: null
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case ActionTypes.GET_SHOPS_REQUEST_STARTED:
            return { ...state, isLoading: true };

        case ActionTypes.GET_SHOPS_REQUEST_SUCCESS:
            return { ...state, isLoading: false, shops: action.shops };

        case ActionTypes.GET_SHOPS_REQUEST_FAILED:
            return { ...state, isLoading: false, error: action.error };

        default: 
            return state;
    }
}