import type { NextPage } from "next";
import * as React from "react";
import { Stack } from "@mui/material";
import Head from "next/head";
import Dropzone from "react-dropzone"
import {useDropzone} from "react-dropzone";

const SharesUrlKey: NextPage = () => {

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.size}>
      {file.name}
    </li>
  ));

  return (
    <>
      <Head>
        <title>FileLink Shares UrlKey</title>
      </Head>
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        <div style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "black" }}>
          <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <section className="container" style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "black" }}>
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
        </section>
      </Stack>
    </>
  );
};

export default SharesUrlKey;