import { Client } from "@dagger.io/dagger";
import { filterObjectByPrefix, withEnvs } from "./lib.ts";

export enum Job {
  validate = "validate",
  apply = "apply",
}

const exclude = [".terraform", ".terragrunt-cache", ".git", ".fluentci"];

const envs = filterObjectByPrefix(Deno.env.toObject(), [
  "TF_",
  "TERRAGRUNT_",
  "AWS_",
]);

export const validate = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const TF_VERSION = Deno.env.get("TF_VERSION") || "latest";

  const baseCtr = withEnvs(
    client
      .pipeline(Job.validate)
      .container()
      .from(`alpine/terragrunt:${TF_VERSION}`),
    envs
  );

  const ctr = baseCtr
    .withMountedCache(
      "/app/.terragrunt-cache",
      client.cacheVolume("terragrunt")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["terraform", "--version"])
    .withExec(["terragrunt", "--version"])
    .withExec(["terragrunt", "run-all", "init", "--terragrunt-non-interactive"])
    .withExec([
      "terragrunt",
      "run-all",
      "validate",
      "--terragrunt-non-interactive",
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export const apply = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const TF_VERSION = Deno.env.get("TF_VERSION") || "latest";

  const baseCtr = withEnvs(
    client
      .pipeline(Job.apply)
      .container()
      .from(`alpine/terragrunt:${TF_VERSION}`),
    envs
  );

  const ctr = baseCtr
    .withMountedCache(
      "/app/.terragrunt-cache",
      client.cacheVolume("terragrunt")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["terraform", "--version"])
    .withExec(["terragrunt", "--version"])
    .withExec(["terragrunt", "run-all", "init", "--terragrunt-non-interactive"])
    .withExec(["terragrunt", "run-all", "plan", "--terragrunt-non-interactive"])
    .withExec([
      "terragrunt",
      "run-all",
      "apply",
      "--terragrunt-non-interactive",
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.validate]: validate,
  [Job.apply]: apply,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.validate]: "Validate the configuration files",
  [Job.apply]: "Builds or changes infrastructure",
};
