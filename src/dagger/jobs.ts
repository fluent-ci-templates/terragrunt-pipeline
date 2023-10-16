import Client, { connect } from "../../deps.ts";
import { filterObjectByPrefix, withEnvs } from "./lib.ts";

export enum Job {
  validate = "validate",
  apply = "apply",
}

export const exclude = [".terraform", ".terragrunt-cache", ".git", ".fluentci"];

const envs = filterObjectByPrefix(Deno.env.toObject(), [
  "TF_",
  "TERRAGRUNT_",
  "AWS_",
]);

export const validate = async (src = ".", tfVersion?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const TF_VERSION = Deno.env.get("TF_VERSION") || tfVersion || "latest";

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
      .withExec([
        "terragrunt",
        "run-all",
        "init",
        "--terragrunt-non-interactive",
      ])
      .withExec([
        "terragrunt",
        "run-all",
        "validate",
        "--terragrunt-non-interactive",
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export const apply = async (src = ".", tfVersion?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const TF_VERSION = Deno.env.get("TF_VERSION") || tfVersion || "latest";

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
      .withExec([
        "terragrunt",
        "run-all",
        "init",
        "--terragrunt-non-interactive",
      ])
      .withExec([
        "terragrunt",
        "run-all",
        "plan",
        "--terragrunt-non-interactive",
      ])
      .withExec([
        "terragrunt",
        "run-all",
        "apply",
        "--terragrunt-non-interactive",
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.validate]: validate,
  [Job.apply]: apply,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.validate]: "Validate the configuration files",
  [Job.apply]: "Builds or changes infrastructure",
};
