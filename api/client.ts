import { setIsRefreshTokenFailed, setTokens } from "store/slices/user-slice";
import Axios, { AxiosResponse } from "axios";
import store from "store";
import auth from "./modules/auth";

/*
 * Setup axios
 */
export const ENV_NAME = process.env.NEXT_PUBLIC_ENV_NAME;
export const POOL_ID: string = process.env.NEXT_PUBLIC_POOL_ID as string;
export const POOL_CLIENT: string = process.env.NEXT_PUBLIC_POOL_CLIENT as string;

console.log(`============================ Environment = ${ENV_NAME} ============================`);

export const axios = Axios.create();

const BASE_URL = `https://${ENV_NAME}-api.mintoon.io/v1`;
axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(function (config) {
  const token = store.getState().user.tokens.idToken;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 0) {
      const prevTokens = store.getState().user.tokens;
      let tokens = {};
      try {
        tokens = await auth.getTokens();
        store.dispatch(setTokens({ ...prevTokens, ...tokens }));
      } catch (e) {
        store.dispatch(setIsRefreshTokenFailed(true));
      }
    } else return error;
  }
);

/**
 * Convert Axios Response into 'Message {status, message}'
 */
function toMessage(res: any) {
  if (!res || !res.status) {
    return { status: 408, message: "Check your internet connection" };
  }

  if (res.status === 401) {
    if (res.data && res.data.data && res.data.data.expired) {
      // Vue.prototype.$vToastify.error("Session expired, please login again");
    }
  }

  return { status: res.status, message: res.data.message };
}

/**
 * Resolve Axios response
 * @param axiosRes
 */
export async function resolve(axiosRes: Promise<AxiosResponse>) {
  try {
    return await axiosRes;
  } catch (e: any) {
    return e.response;
  }
}

export async function extractData(response: any) {
  const resp = await response;
  const msg = toMessage(resp);
  const data = msg.status === 200 ? resp.data.data : null;
  return [msg, data];
}

export async function extractBody(response: any) {
  const resp = await response;
  const msg = toMessage(resp);
  const data = msg.status === 200 ? resp.data : null;
  return [msg, data];
}

export async function extractDataResolve(axiosRes: Promise<AxiosResponse>) {
  return extractData(resolve(axiosRes));
}

export async function extractBodyResolve(axiosRes: Promise<AxiosResponse>) {
  return extractBody(resolve(axiosRes));
}
