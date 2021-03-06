import { z } from "zod";
import { BasePackageConfigSchema } from "./BasePackageConfigSchema";
import { CustomPackageConfigSchema } from "./CustomPackageConfigSchema";
import { ReactAppPackageConfigSchema } from "./react-app/ReactAppPackageConfigSchema";
import { ReactLibraryPackageConfigSchema } from "./ReactLibraryPackageConfigSchema";
import { TypescriptCliPackageConfigSchema } from "./typescript-cli/TypescriptCliPackageConfigSchema";
import { TypescriptLibraryPackageConfigSchema } from "./TypescriptLibraryPackageConfigSchema";

export const PackageConfigSchema = z.union([
    BasePackageConfigSchema.merge(CustomPackageConfigSchema),
    BasePackageConfigSchema.merge(ReactAppPackageConfigSchema),
    BasePackageConfigSchema.merge(ReactLibraryPackageConfigSchema),
    BasePackageConfigSchema.merge(TypescriptLibraryPackageConfigSchema),
    BasePackageConfigSchema.merge(TypescriptCliPackageConfigSchema),
]);

export type PackageConfigSchema = z.infer<typeof PackageConfigSchema>;
