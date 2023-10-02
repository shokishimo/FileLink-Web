import { api } from "./api";
import { Url } from "../features/url.type";

export const baseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUrl: build.query<Url["url_key"], void>({
      query: () => "createNewUrl",
      transformResponse: (resp: { url_key: Url["url_key"] }) => resp.url_key,
      providesTags: ["BaseApi"],
    }),
  }),
});

export const {
  useGetUrlQuery,
} = baseApi;

export const {
  endpoints: { 
    getUrl,
  },
} = baseApi;
