import { api } from "./api";
import { Url } from "../features/url.type";

export const baseApi = api.injectEndpoints({
  endpoints: (build) => ({
    // get url key
    getUrl: build.query<Url["url_key"], void>({
      query: () => "createNewUrl",
      transformResponse: (resp: { url_key: Url["url_key"] }) => resp.url_key,
      providesTags: ["BaseApi"],
    }),
    // get object
    getObjectWithKey: build.query<any, { objectKey: string }>({
      query: ({ objectKey }) => `download/${objectKey}`,
      transformResponse: (resp: any) => resp,
    }),
    // post zip files
    uploadZipFiles: build.mutation<Url["url_key"][], { urlKey: string, formData: FormData }>({
      query: ({ urlKey, formData }) => ({
        url: `share/${urlKey}`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (resp: Url["url_key"][]) => resp,
    }),
  }),
});

export const {
  useGetUrlQuery,
  useGetObjectWithKeyQuery,
  useUploadZipFilesMutation,
} = baseApi;

export const {
  endpoints: { 
    getUrl,
    getObjectWithKey,
    uploadZipFiles,
  },
} = baseApi;
