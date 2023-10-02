import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const apiURL = process.env.NEXT_PUBLIC_API_URL ?? "";
// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: `${apiURL}`,
  // NOTE: Quoted from https://redux-toolkit.js.org/rtk-query/usage/examples
  // TODO: Use token as auth header
  // prepareHeaders: (headers, { getState }) => {
  // By default, if we have a token in the store, let's use that for authenticated requests
  // const token = (getState() as RootState).auth.token;
  // if (token) {
  //   headers.set("authentication", `Bearer ${token}`);
  // }
  // return headers;
  // },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

export const api = createApi({
  reducerPath: "filelinkAPI",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "BaseApi",
  ],
  endpoints: () => ({}),
});