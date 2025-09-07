import z from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const fileRoute = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const date = new Date();
      const dateString = date.toISOString().replace(/:/g, "-");

      // To send a request, you:
      // Initiate client with configuration (e.g. credentials, region).
      // Initiate command with input parameters.
      // Call send operation on client with command object as input.
      // If you are using a custom http handler, you may call destroy() to close open connections.
      const { COS_APP_ID, COS_APP_KEY } = process.env;
      console.log('mutation', COS_APP_ID, COS_APP_KEY)
      const client = new S3Client({
        endpoint: process.env.API_ENDPOINT,
        region: process.env.REGION,
        credentials: {
          accessKeyId: process.env.COS_APP_ID as string,
          secretAccessKey: process.env.COS_APP_KEY as string,
        },
      });

      const { fileName } = input;
      const params: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${dateString}-${fileName.replaceAll(" ", "_")}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(client, command, {
        expiresIn: 60, // 秒
      });

      return {
        url,
        method: "PUT" as const,
      };
    }),
});
