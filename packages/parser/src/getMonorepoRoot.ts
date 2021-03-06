import { MonorepoRoot } from "@mrlint/commons";
import execa from "execa";
import findUp from "find-up";
import path from "path";
import { z } from "zod";
import { readConfig } from "./readConfig";

const MONOREPO_ROOT_FILES = [".mrlint.root.json", ".mrlint.root.yml"];

const RootConfigSchema = z.strictObject({
    packages: z.string(),
});

export async function getMonorepoRoot(): Promise<MonorepoRoot> {
    const configPath = await findUp(MONOREPO_ROOT_FILES);
    if (configPath == null) {
        throw new Error("Failed to find mrlint root config");
    }

    const config = await readConfig(configPath, (contents) => RootConfigSchema.parseAsync(contents));
    if (config == null) {
        throw new Error("Failed to read config: " + configPath);
    }

    const getRemoteCommand = await execa("git", ["config", "--get", "remote.origin.url"]);
    const repository = getRemoteCommand.stdout.trim();
    if (repository.length === 0) {
        throw new Error("Could not determine remote repository");
    }

    const fullPath = path.dirname(configPath);

    return {
        fullPath,
        config: {
            packages: config.packages,
            absolutePathToSharedConfigs: path.join(fullPath, "shared"),
            absolutePathToScripts: path.join(fullPath, "scripts"),
            repository,
        },
    };
}
