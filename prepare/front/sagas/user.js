import { all, delay, put, takeLatest, fork } from "redux-saga/effects";
import axios from "axios";

function logInAPI(data) {
  //실제 서버에 요청
  return axios.post("/api/login", data);
}
function* logIn(action) {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    console.log("saga login");
    //const result = yield call(logInAPI, action.data);
    //fake 서버 효과 주기 위해
    yield delay(2000);
    //성공
    yield put({
      type: "LOG_IN_SUCCESS",
      data: action.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  //실제 서버에 요청
  return axios.post("/api/logout");
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
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  //LOG_IN_REQUEST이라는 액션이 실행될때까지 기다리겠다는 의미
  //액션이 실행되면 logIn이 실행됨
  yield takeLatest("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
