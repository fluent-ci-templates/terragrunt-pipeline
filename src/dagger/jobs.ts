import { type Directory, dag } from "../../sdk/client.gen.ts";
import { filterObjectByPrefix, withEnvs, getDirectory } from "./lib.ts";

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

/**
 * @function
 * @description Validate the configuration files
 * @param {string | Directory} src
 * @param {string} tfVersion
 * @returns {Promise<string>}
 */
export async function validate(
  src: Directory | string | undefined = ".",
  tfVersion?: string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const TF_VERSION = Deno.env.get("TF_VERSION") || tfVersion || "latest";

  const baseCtr = withEnvs(
    dag
      .pipeline(Job.validate)
      .container()
      .from(`alpine/terragrunt:${TF_VERSION}`),
    envs
  );

  const ctr = baseCtr
    .withMountedCache("/app/.terragrunt-cache", dag.cacheVolume("terragrunt"))
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
  return result;
}

/**
 * @function
 * @description Builds or changes infrastructure
 * @param {string | Directory} src
 * @param {string} tfVersion
 * @returns {Promise<string>}
 */
export async function apply(
  src: Directory | string,
  tfVersion?: string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const TF_VERSION = Deno.env.get("TF_VERSION") || tfVersion || "latest";

  const baseCtr = withEnvs(
    dag.pipeline(Job.apply).container().from(`alpine/terragrunt:${TF_VERSION}`),
    envs
  );

  const ctr = baseCtr
    .withMountedCache("/app/.terragrunt-cache", dag.cacheVolume("terragrunt"))
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
  return result;
}

export type JobExec = (
  src: Directory | string,
  tfVersion?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.validate]: validate,
  [Job.apply]: apply,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.validate]: "Validate the configuration files",
  [Job.apply]: "Builds or changes infrastructure",
};
