import { api } from "./api";
import { PresignedStruct } from "../features/url.type";

export const baseApi = api.injectEndpoints({
  endpoints: (build) => ({
    // // get url key
    // getUrl: build.query<Url["url_key"], void>({
    //   query: () => "createNewUrl",
    //   transformResponse: (resp: { url_key: Url["url_key"] }) => resp.url_key,
    //   providesTags: ["BaseApi"],
    // }),
    // // get object
    // getObjectWithKey: build.query<any, { objectKey: string }>({
    //   query: ({ objectKey }) => `download/${objectKey}`,
    //   transformResponse: (resp: any) => resp,
    // }),

    // post PresignedUrl generation
    generatePresignedUrl: build.mutation<PresignedStruct, { numOfFiles: number }>({
      query: ({ numOfFiles }) => ({
        url: `generatePresignedUrl`,
        method: "POST",
        body: { numOfFiles },
      }),
      transformResponse: (resp: PresignedStruct) => resp,
    }),
  }),
});

export const {
  useGeneratePresignedUrlMutation,
} = baseApi;

export const {
  endpoints: { 
    generatePresignedUrl,
  },
} = baseApi;
