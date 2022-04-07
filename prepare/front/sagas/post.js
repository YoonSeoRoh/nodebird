import { all, delay, put, takeLatest, fork } from "redux-saga/effects";
import axios from "axios";

function addPostAPI(data) {
  //실제 서버에 요청
  return axios.post("/api/post", data);
}
function* addPost(action) {
  //로그인 요청에 대한 결과를 받음
  //요청 성공, 실패에 대비
  //put은 dispatch와 같은 역할
  //액션 객체를 dispatch하는 것
  try {
    //const result = yield call(addPostAPI, action.data);
    yield delay(2000);
    //성공
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    //실패
    yield put({
      type: "ADD_POST_FAILURE",
      data: err.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
