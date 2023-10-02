import { api } from "./api";
import { Url } from "../features/url.type";

export const baseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUrl: build.query<Url, void>({
      query: () => "createNewUrl",
      transformResponse: (resp: { url: Url }) => resp.url,
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
