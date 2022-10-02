import { REFRESH_DIR, SET_REL_DIR, REFRESH_CAST_DEVICES, SELECT_CAST_DEVICE } from "../constants/action-types"

export function setFiles(payload) {
  return { type: REFRESH_DIR, payload }
}
export function setRelDir(payload) {
  return { type: SET_REL_DIR, payload }
}
export function setCastDevices(payload) {
  return { type: REFRESH_CAST_DEVICES, payload }
}
export function setSelectedCastDevice(payload) {
  return { type: SELECT_CAST_DEVICE, payload }
}

