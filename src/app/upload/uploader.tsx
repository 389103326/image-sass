"use client";

import React, { useEffect, useState } from "react";
import Uppy, { Meta, type UppyFile } from "@uppy/core";
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

  useEffect(() => {
    const handler: (
      file: UppyFile<Meta, AwsBody> | undefined,
      response: {
        body?: AwsBody | undefined;
        status: number;
        bytesUploaded?: number | undefined;
        uploadURL?: string | undefined;
      }
    ) => void = (file, res) => {
      console.log("on upload-success", file, res);
      // 上传成功之后保存到数据库
      trpcClient.file.savefile.mutate({
        name: file?.data instanceof File ? file?.data.name : "",
        path: res.uploadURL ?? "",
        type: file?.data?.type ?? "",
      });
    };

    uppy.on("upload-success", handler);
    return () => {
      uppy.off("upload-success", handler);
    };
  }, [uppy]);

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
