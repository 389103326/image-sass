import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "./schema";
import { z } from "zod";

// 插入
export const insertUserSchema = createInsertSchema(users, {
  email: () => z.email(), // 增加 email 的校验规则，数据库默认没有 email 格式的校验
});

// 只更新 name
export const updateUserSchema = insertUserSchema.pick({ name: true })

// 查询
export const queryUserSchema = createSelectSchema(users);
