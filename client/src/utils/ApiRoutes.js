export const HOST ="http://localhost:4000";

const AUTH_ROUTE =`${HOST}/api/auth`;
const MESSAGES_ROUTE =`${HOST}/api/messages`

export const CHECK_USER_ROUTE =`${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE=`${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
export const ADD_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES_ROUTE =`${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE =`${MESSAGES_ROUTE}/add-image-message`