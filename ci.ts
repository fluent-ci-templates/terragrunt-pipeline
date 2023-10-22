import {
  validate,
  apply,
} from "https://pkg.fluentci.io/terragrunt_pipeline@v0.4.1/mod.ts";

await validate();
await apply();
