import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import firebase from 'firebase'
require('firebase/firestore')

let generation = 0;
const listeners = new Map();
const pendingUsers = new Map();
const reportError = error => console.warn('Firebase request failed:', error.message);
const postCollection = uid => firebase.firestore().collection('posts').doc(uid).collection('userPosts');

function stopListeners(prefix = '') {
    for (const [key, unsubscribe] of listeners) {
        if (key.startsWith(prefix)) { unsubscribe(); listeners.delete(key); }
    }
}

export function clearData() {
    return dispatch => {
        generation++;
        stopListeners();
        pendingUsers.clear();
        dispatch({ type: CLEAR_DATA });
    };
}

export function fetchUser() {
    return dispatch => {
        const uid = firebase.auth().currentUser.uid;
        return firebase.firestore().collection('users').doc(uid).onSnapshot(snapshot => {
            dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.exists ? { ...snapshot.data(), uid } : null });
        }, reportError);
    };
}

export function fetchUserPosts() {
    return dispatch => postCollection(firebase.auth().currentUser.uid)
        .orderBy('creation', 'desc').onSnapshot(snapshot => {
            dispatch({ type: USER_POSTS_STATE_CHANGE,
                posts: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
        }, reportError);
}

export function fetchUserFollowing() {
    return (dispatch, getState) => {
        const session = generation;
        return firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid)
            .collection('userFollowing').onSnapshot(snapshot => {
                if (session !== generation) return;
                const following = snapshot.docs.map(doc => doc.id);
                const previous = getState().userState.following;
                previous.filter(uid => !following.includes(uid)).forEach(uid => stopListeners(`${uid}/`));
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
                following.forEach(uid => { dispatch(fetchUsersData(uid, true)); });
            }, reportError);
    };
}

export function fetchUsersData(uid, getPosts) {
    return async (dispatch, getState) => {
        const session = generation;
        try {
            let user = getState().usersState.users.find(user => user.uid === uid);
            if (!user) {
                let request = pendingUsers.get(uid);
                if (!request) {
                    request = firebase.firestore().collection('users').doc(uid).get();
                    pendingUsers.set(uid, request);
                }
                const snapshot = await request;
                if (pendingUsers.get(uid) === request) pendingUsers.delete(uid);
                if (session !== generation || !snapshot.exists) return;
                user = { ...snapshot.data(), uid };
                dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            }
            if (getPosts && getState().userState.following.includes(uid)) {
                dispatch(fetchUsersFollowingPosts(uid));
            }
        } catch (error) { reportError(error); }
    };
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        const key = `${uid}/posts`;
        if (listeners.has(key)) return;
        const session = generation;
        const unsubscribe = postCollection(uid).orderBy('creation', 'desc').onSnapshot(snapshot => {
            if (session !== generation || !getState().userState.following.includes(uid)) return;
            const user = getState().usersState.users.find(user => user.uid === uid);
            const posts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, user }));
            stopListeners(`${uid}/likes/`);
            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
            posts.forEach(post => dispatch(fetchUsersFollowingLikes(uid, post.id)));
        }, reportError);
        listeners.set(key, unsubscribe);
    };
}

export function fetchUsersFollowingLikes(uid, postId) {
    return (dispatch, getState) => {
        const key = `${uid}/likes/${postId}`;
        if (listeners.has(key)) return;
        const session = generation;
        const unsubscribe = postCollection(uid).doc(postId).collection('likes')
            .doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
                if (session !== generation || !getState().userState.following.includes(uid)) return;
                dispatch({ type: USERS_LIKES_STATE_CHANGE, uid, postId, currentUserLike: snapshot.exists });
            }, reportError);
        listeners.set(key, unsubscribe);
    };
}
