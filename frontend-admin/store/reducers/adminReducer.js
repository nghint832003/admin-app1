import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: true,
    adminInfo: null,
    adminPersist: null
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADMIN_LOGIN_OR_REGISTER:
            return {
                ...state,
                isLoggedIn: true,
                adminInfo: action.adminInfo,
                adminPersist: action.adminInfo,
            };

        case actionTypes.ADMIN_LOGOUT:
            return {
                ...state,
                isLoggedIn: true,
                adminInfo: null,
                adminPersist: null,
            };

        default:
            return state;
    }
};

export default adminReducer;