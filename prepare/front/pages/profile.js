import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Router from "next/router";

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    //프로필 페이지에 있다가 로그아웃을 하는 경우
    if (!(me && me.id)) {
      Router.push("/");
    }
  });
  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
