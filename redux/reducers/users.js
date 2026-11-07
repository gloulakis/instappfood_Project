import { USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from '../constants'

const initialState = { users: [], feed: [] };

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return { ...state, users: [...state.users.filter(user => user.uid !== action.user.uid), action.user] };
        case USER_FOLLOWING_STATE_CHANGE:
            return { ...state, feed: state.feed.filter(post => post.user && action.following.includes(post.user.uid)) };
        case USERS_POSTS_STATE_CHANGE:
            return { ...state, feed: [...state.feed.filter(post => post.user?.uid !== action.uid), ...action.posts] };
        case USERS_LIKES_STATE_CHANGE:
            return { ...state, feed: state.feed.map(post => post.id === action.postId && post.user?.uid === action.uid
                ? { ...post, currentUserLike: action.currentUserLike } : post) };
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
};
