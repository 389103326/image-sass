import z from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../db/index";
import { files } from "../db/schema";

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
      console.log("createPresignedUrl mutation", COS_APP_ID, COS_APP_KEY);
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
        // ContentDisposition: "inline",
      };

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(client, command, {
        expiresIn: 60, // 秒
      });

      console.log("createPresignedUrl result", url);

      return {
        url,
        method: "PUT" as const,
      };
    }),
  savefile: protectedProcedure
    // 输入参数校验（Zod  schema）
    .input(
      z.object({
        name: z.string(), // 文件名
        path: z.string().url(), // 文件路径（确保是合法 URL）
        type: z.string(), // 文件类型
      })
    )
    // 处理突变操作（写数据）
    .mutation(async ({ ctx, input }) => {
      try {
        // 从上下文获取用户会话（已通过 protectedProcedure 验证登录状态）
        const { session } = ctx;

        // 解析输入的路径为 URL 对象，提取路径和完整 URL
        const fileUrl = new URL(input.path);

        console.log("saveFile mutation", session, fileUrl);
        // 插入数据到 files 表并返回完整记录
        const [savedFile] = await db
          .insert(files)
          .values({
            // 透传输入的基础字段
            name: input.name,
            type: input.type,
            // 处理 URL 相关字段
            path: fileUrl.pathname, // 提取路径部分（如 /uploads/123.png）
            url: fileUrl.toString(), // 完整 URL（如 https://example.com/uploads/123.png）
            // 关联当前用户
            userId: session.user.id,
            // 映射文件类型到 contentType 字段
            contentType: input.type,
          })
          .returning(); // 返回插入后的完整记录（包含自动生成的 id、createdAt 等）

        // 返回保存的文件信息
        return savedFile;
      } catch (error) {
        // 错误处理（实际项目中可更详细）
        console.error("保存文件失败:", error);
        throw new Error("保存文件时发生错误");
      }
    }),
  listFiles: protectedProcedure.query(async ({ ctx }) => {
    console.log("listFiles query", ctx);
    const { session } = ctx;
    const files = await db.query.files.findMany({
      where: (files, { eq }) => eq(files.userId, session.user.id),
      orderBy: (files, { desc }) => desc(files.createdAt),
    });
    return files;
  }),
});
