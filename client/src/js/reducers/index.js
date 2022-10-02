import { REFRESH_DIR, SET_REL_DIR, REFRESH_CAST_DEVICES, SELECT_CAST_DEVICE } from "../constants/action-types"

const initialState = {
    files: {"loading": ""},
    relDir: "/",
    castDevices: [],
    selectedCastDevice: null
}
  
function rootReducer(state = initialState, action) {
    if (action.type === REFRESH_DIR) {
        return Object.assign({}, state, {
            files: action.payload
        })
    }
    if (action.type === SET_REL_DIR) {
        return Object.assign({}, state, {
            relDir: action.payload
        })
    }
    if (action.type === REFRESH_CAST_DEVICES) {
        return Object.assign({}, state, {
            castDevices: action.payload
        })
    }
    if (action.type === SELECT_CAST_DEVICE) {
        return Object.assign({}, state, {
            selectedCastDevice: action.payload
        })
    }
    return state
}

export default rootReducer
