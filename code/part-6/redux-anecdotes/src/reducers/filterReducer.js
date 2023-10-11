const initialState = {
    search: ''
}

export const FILTER_REDUCER_STATES  = {
    'SEARCH': 'SEARCH'
}

export default function filterReducer(state = initialState, action){
    switch(action.type){
        case FILTER_REDUCER_STATES.SEARCH:
            return {
                ...state, search: action.payload
            }
        default: return initialState
    }
}

export function searchFilterChange(filter){
    return {
        type: FILTER_REDUCER_STATES.SEARCH,
        payload: filter
    }
}