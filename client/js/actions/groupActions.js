import {SET_GROUPS, ADD_GROUP, EDIT_GROUP, SELECT_GROUP, CHANGE_GROUP_ORDER, DELETE_GROUP} from './actionsTypes';

export const setGroups = (groups) => {
    console.log('setGroups ACTION');
    return {
        type: SET_GROUPS,
        payload: groups
    };
};

export const addGroup = (group) => {
    return {
        type: ADD_GROUP,
        payload: group
    };
};

export const editGroup = (group) => {
    return {
        type: EDIT_GROUP,
        payload: group
    };
};

export const changeGroupOrder = (group) => {
    return {
        type: CHANGE_GROUP_ORDER,
        payload: group
    };
};

export const selectGroup = (groupId) => {
    return {
        type: SELECT_GROUP,
        payload: groupId
    };
};

export const deleteGroup = (group) => {
    return {
        type: DELETE_GROUP,
        payload: group
    };
};
