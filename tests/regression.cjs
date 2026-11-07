const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');
const vm = require('vm');
const babel = require('@babel/core');
function load(file, dependencies = {}) {
    const exports = {};
    const code = babel.transformSync(fs.readFileSync(file, 'utf8'), {
        configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-modules-commonjs']
    }).code;
    vm.runInNewContext(code, { exports, console, require(name) {
        if (name in dependencies) return dependencies[name];
        if (name.includes('constants')) return constants;
        throw new Error(`Unexpected import: ${name}`);
    } });
    return exports;
}
const constants = load('redux/constants/index.js');
const { users } = load('redux/reducers/users.js');
const { user } = load('redux/reducers/user.js');
const post = (uid, id) => ({ id, user: { uid }, currentUserLike: false });
test('feed refresh replaces owner posts; unfollow removes only that owner', () => {
    let state = users(undefined, {});
    state = users(state, { type: constants.USERS_POSTS_STATE_CHANGE, uid: 'a', posts: [post('a', '1')] });
    state = users(state, { type: constants.USERS_POSTS_STATE_CHANGE, uid: 'b', posts: [post('b', '1')] });
    state = users(state, { type: constants.USERS_POSTS_STATE_CHANGE, uid: 'a', posts: [post('a', '2')] });
    assert.equal(state.feed.length, 2);
    assert.equal(state.feed.some(p => p.user.uid === 'a' && p.id === '1'), false);
    state = users(state, { type: constants.USER_FOLLOWING_STATE_CHANGE, following: ['b'] });
    assert.equal(state.feed.length, 1);
    assert.equal(state.feed[0].user.uid, 'b');
    state = users(state, { type: constants.USER_FOLLOWING_STATE_CHANGE, following: [] });
    assert.equal(state.feed.length, 0);
});
test('likes are scoped to owner and reducer does not mutate prior posts', () => {
    const original = { users: [], feed: [post('a', 'same'), post('b', 'same')] };
    const next = users(original, { type: constants.USERS_LIKES_STATE_CHANGE, uid: 'a', postId: 'same', currentUserLike: true });
    assert.equal(next.feed[0].currentUserLike, true);
    assert.equal(next.feed[1].currentUserLike, false);
    assert.equal(original.feed[0].currentUserLike, false);
});
test('cached users are updated without duplication and logout clears both stores', () => {
    let state = users(undefined, { type: constants.USERS_DATA_STATE_CHANGE, user: { uid: 'a', name: 'Old' } });
    state = users(state, { type: constants.USERS_DATA_STATE_CHANGE, user: { uid: 'a', name: 'New' } });
    assert.equal(state.users.length, 1);
    assert.equal(state.users[0].name, 'New');
    assert.equal(users(state, { type: constants.CLEAR_DATA }).users.length, 0);
    assert.equal(user({ currentUser: {} }, { type: constants.CLEAR_DATA }).currentUser, null);
});
function harness() {
    const subscriptions = [];
    const reads = [];
    const firebase = {
        auth: () => ({ currentUser: { uid: 'me' } }),
        firestore: () => ref('')
    };
    function ref(path) {
        return {
            collection: name => ref(`${path}/${name}`), doc: name => ref(`${path}/${name}`),
            orderBy: () => ref(path),
            get: () => new Promise(resolve => reads.push({ path, resolve })),
            onSnapshot: callback => {
                const entry = { path, callback, stopped: false };
                subscriptions.push(entry);
                return () => { entry.stopped = true; };
            }
        };
    }
    const actions = load('redux/actions/index.js', { firebase, 'firebase/firestore': {} });
    let state = { userState: user(undefined, {}), usersState: users(undefined, {}) };
    function dispatch(action) {
        if (typeof action === 'function') return action(dispatch, () => state);
        state = { userState: user(state.userState, action), usersState: users(state.usersState, action) };
    }
    return { actions, dispatch, reads, subscriptions, state: () => state };
}
test('profile must resolve before posts subscribe; cached users can be followed', async () => {
    const h = harness();
    h.dispatch({ type: constants.USER_FOLLOWING_STATE_CHANGE, following: ['a'] });
    const pending = h.dispatch(h.actions.fetchUsersData('a', true));
    assert.equal(h.subscriptions.length, 0);
    h.reads[0].resolve({ exists: true, data: () => ({ name: 'Alice' }) });
    await pending;
    assert.equal(h.subscriptions.length, 1);
    h.subscriptions[0].callback({ docs: [{ id: 'recipe', data: () => ({ title: 'Soup' }) }] });
    assert.equal(h.state().usersState.feed[0].user.name, 'Alice');
    h.subscriptions[1].callback({ exists: true });
    assert.equal(h.state().usersState.feed[0].currentUserLike, true);
    await h.dispatch(h.actions.fetchUsersData('a', true));
    assert.equal(h.subscriptions.length, 2);
    h.dispatch(h.actions.clearData());
    assert.ok(h.subscriptions.every(s => s.stopped));
    h.subscriptions[0].callback({ docs: [] });
    assert.equal(h.state().usersState.feed.length, 0);
});
test('logout discards an in-flight profile response', async () => {
    const h = harness();
    const pending = h.dispatch(h.actions.fetchUsersData('a', false));
    h.dispatch(h.actions.clearData());
    h.reads[0].resolve({ exists: true, data: () => ({ name: 'Late response' }) });
    await pending;
    assert.equal(h.state().usersState.users.length, 0);
});
test('unfollow stops post and like subscriptions; refollow cached user resubscribes', async () => {
    const h = harness();
    const stop = h.dispatch(h.actions.fetchUserFollowing());
    h.subscriptions[0].callback({ docs: [{ id: 'a' }] });
    h.reads[0].resolve({ exists: true, data: () => ({ name: 'Alice' }) });
    await new Promise(resolve => setImmediate(resolve));
    h.subscriptions[1].callback({ docs: [{ id: 'recipe', data: () => ({}) }] });
    h.subscriptions[0].callback({ docs: [] });
    assert.equal(h.subscriptions[1].stopped, true);
    assert.equal(h.subscriptions[2].stopped, true);
    assert.equal(h.state().usersState.feed.length, 0);
    h.subscriptions[0].callback({ docs: [{ id: 'a' }] });
    assert.equal(h.subscriptions.length, 4);
    stop();
    h.dispatch(h.actions.clearData());
});
