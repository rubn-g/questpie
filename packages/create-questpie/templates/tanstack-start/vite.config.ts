import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		devtools(),
		nitro({ preset: "bun" }) as any,
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
	optimizeDeps: {
		exclude: ["drizzle-kit"],
	},
	build: {
		rollupOptions: {
			external: ["bun", /^drizzle-kit/, /^@aws-sdk\//],
		},
	},
	resolve: {
		tsconfigPaths: true
	}
});
