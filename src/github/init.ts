import { generateYaml } from "./config.ts";

generateYaml().save(".github/workflows/terragrunt-apply.yml");
