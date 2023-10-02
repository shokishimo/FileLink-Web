module.exports = {
  async headers() {
    return [
      {
        // API向けのCORS設定, ローカルデバッグ用
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination:
          "https://c17074xlzc.execute-api.us-east-2.amazonaws.com/prod/" // Proxy to Backend
      },
    ];
  },
};
