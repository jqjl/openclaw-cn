import { z } from "zod";
import { sensitive } from "./zod-schema.sensitive.js";

function isHttpProxyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:";
  } catch {
    return false;
  }
}

<<<<<<< HEAD
=======
export const ProxyLoopbackModeSchema = z.enum(["gateway-only", "proxy", "block"]);

>>>>>>> upstream/main
export const ProxyConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    proxyUrl: z
<<<<<<< HEAD
      .string()
=======
>>>>>>> upstream/main
      .url()
      .refine(isHttpProxyUrl, {
        message: "proxyUrl must use http://",
      })
      .register(sensitive)
      .optional(),
<<<<<<< HEAD
=======
    loopbackMode: ProxyLoopbackModeSchema.optional(),
>>>>>>> upstream/main
  })
  .strict()
  .optional();

export type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
