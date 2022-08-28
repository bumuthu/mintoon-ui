import app from "api/modules/app";
import auth from "api/modules/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "store";
import {
  setUser,
  setHeroImages,
  setTokens,
  setCurrentPlan,
  setPlans,
  setIsRefreshTokenFailed,
  setIsSignIn,
} from "store/slices/user-slice";
import { axios } from "api/client";

const MainLayout = ({ children }: { children: any }) => {
  const isSignIn = useSelector((state: RootState) => state.user.isSignIn);
  const prevToken = useSelector((state: RootState) => state.user.tokens);
  const isRefreshTokenFailed = useSelector(
    (state: RootState) => state.user.isRefreshTokenFailed
  );
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSignIn) {
      app.getUser().then((res) => {
        dispatch(setUser(res[1] ? res[1].payload : {}));
        const user = res[1] ? res[1].payload : {};
        app.getPricingPlans().then(([{ status }, payload]) => {
          if (status === 200 && payload) {
            const allPlans = { ...payload.payload };
            if (user && user.currentPlan) {
              dispatch(setCurrentPlan(allPlans[user.currentPlan]));
              // delete allPlans[user.currentPlan];
              if (Object.keys(allPlans).includes("FREE"))
                delete allPlans["FREE"];
              dispatch(setPlans(allPlans));
            }
          }
        });
      });
      app
        .getPromoImages()
        .then((res) =>
          dispatch(
            setHeroImages(res[1] && res[1].payload ? res[1].payload.images : [])
          )
        );
      const intervalId = setInterval(async () => {
        auth
          .getTokens()
          .then((res) => {
            dispatch(setTokens({ ...prevToken, ...res }));
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.idToken}`;
          })
          .catch((err) => {
            console.error("Error while token retrieval:", err);
            // retry 3 times and redirect to login page
          });
      }, 250000);
      () => clearInterval(intervalId);
    } else router.push("/auth/sign-in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignIn]);
  useEffect(() => {
    if (isRefreshTokenFailed) {
      router.push("/auth/sign-in");
      dispatch(setIsSignIn(false));
      dispatch(setIsRefreshTokenFailed(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshTokenFailed]);
  return (
    <>
      {isSignIn
        ? children
        : router.pathname.includes("/auth")
        ? children
        : null}
    </>
  );
};

export default MainLayout;
