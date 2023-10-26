import { api } from "./api";
import { PostPresignedRes } from "../features/postPresignedReq.type";
import { GetPresignedRes } from "../features/getPresignedReq.type";

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
    getPresignedUrls: build.mutation<GetPresignedRes, { keys: string[] }>({
      query: ({ keys }) => ({
        url: `getPresignedUrls`,
        method: "POST",
        body: { keys: keys },
      }),
      transformResponse: (resp: GetPresignedRes) => resp,
    }),

    // post PresignedUrl generation
    postPresignedUrls: build.mutation<PostPresignedRes, { numOfFiles: number }>({
      query: ({ numOfFiles }) => ({
        url: `postPresignedUrls`,
        method: "POST",
        body: { numOfFiles: numOfFiles },
      }),
      transformResponse: (resp: PostPresignedRes) => resp,
    }),
  }),
});

export const {
  usePostPresignedUrlsMutation,
  useGetPresignedUrlsMutation,
} = baseApi;

export const {
  endpoints: { 
    postPresignedUrls,
    getPresignedUrls,
  },
} = baseApi;
