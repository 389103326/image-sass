"use client";

import React, { useState } from "react";
import Uppy, { Meta } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AWSS3, { type AwsBody } from "@uppy/aws-s3";
import { trpcClient } from "../../utils/client";
import { useUppyState } from "./useUppyState";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

const Uploader = () => {
  const [uppy] = useState(() => {
    const uppy = new Uppy<Meta, AwsBody>({
      restrictions: {
        allowedFileTypes: ["image/*"],
      },
    });
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        console.log(file);
        return trpcClient.file.createPresignedUrl.mutate({
          fileName: file.data instanceof File ? file.data.name : "test",
          contentType: file.data instanceof File ? file.data.type : "",
          size: file.size || 0,
        });
      },
    }); // Using a public demo endpoint
    return uppy;
  });

  const files = useUppyState(uppy, (s) => Object.values(s.files));
  const progress = useUppyState(uppy, (s) => s.totalProgress);

  return (
    <div className="flex flex-col items-center gap-8">
      <Dashboard theme="dark" uppy={uppy} />
      <div>progress: {progress}</div>
      <div className="flex gap-4 items-center">
        {files.map((file) => {
          const url = URL.createObjectURL(file?.data);
          return <img src={url} key={file?.id} className="w-50" />;
        })}
      </div>
    </div>
  );
};

export default Uploader;
