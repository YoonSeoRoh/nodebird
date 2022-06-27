import { all, delay, put, takeLatest, fork, call } from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from "../reducers/user";

function followAPI(data) {
  //실제 서버에 요청
  return axios.post("/api/follow", data);
}
function* follow(action) {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    //const result = yield call(followAPI, action.data);
    //fake 서버 효과 주기 위해
    yield delay(2000);
    //성공
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  //실제 서버에 요청
  return axios.post("/api/unfollow", data);
}
function* unfollow(action) {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    //const result = yield call(unfollowAPI, action.data);
    //fake 서버 효과 주기 위해
    yield delay(2000);
    //성공
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}
function logInAPI(data) {
  //실제 서버에 요청
  return axios.post("/user/login", data);
}
function* logIn(action) {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    console.log("saga login");
    const result = yield call(logInAPI, action.data);
    //성공
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  //실제 서버에 요청
  return axios.post("/user/logout");
}

function* logOut() {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    //const result = yield call(logOutAPI);
    yield delay(2000);
    //성공
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    //실패
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  //실제 서버에 요청
  return axios.post("/user", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    //성공
    yield put({
      type: SIGN_UP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
