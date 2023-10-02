import { Alert, Stack } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import React from "react";

export type Props = {
  error?: FetchBaseQueryError | SerializedError;
  message?: string;
};
const APIErrorAlert: React.FC<Props> = (props) => {
  const { error, message } = props;
  const myMessage = message ?? "Failed to read data";

  const errorString = React.useMemo<string>(() => {
    if (typeof error === "undefined") {
      return "unclear error";
    }
    if ("status" in error) {
      switch (error.status) {
        case "FETCH_ERROR":
          return `network error: ${error.error}`;
        case "PARSING_ERROR":
          return `parsing error: ${error.error}`;
        case "TIMEOUT_ERROR":
          return `timeout: ${error.error}`;
        case "CUSTOM_ERROR":
          return error.error;
        default: // WIP
          // TODO: It'll be great if we could show errors which golang throws
          // something like {"error_message":"not found error","validation_errors":null}) comes in error.data
          const data = error.data as { error_message?: string };
          if (typeof data.error_message === "string") {
            return `HTTP error (${error.status}): ${data.error_message}`;
          }
          return `HTTP error (${error.status}): ${JSON.stringify(error.data)}`;
      }
    }
    return `${error.name}, ${error.message}`;
  }, [error]);

  return (
    <Stack sx={(theme) => ({ margin: theme.spacing(2) })} spacing={2}>
      <Alert severity="error">
        {myMessage}
        {errorString ? ` (${errorString})` : ""}
      </Alert>
    </Stack>
  );
};

export { APIErrorAlert };
