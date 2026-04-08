import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrate: {
    adapter: async () => {
      const { PrismaSQLite } = await import("@prisma/adapter-sqlite");
      return new PrismaSQLite({ url: "file:./prisma/dev.db" });
    },
  },
});
