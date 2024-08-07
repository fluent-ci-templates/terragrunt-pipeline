# Terragrunt Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/terragrunt_pipeline)](https://pkg.fluentci.io/terragrunt_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/terragrunt-pipeline)](https://codecov.io/gh/fluent-ci-templates/terragrunt-pipeline)

A ready-to-use CI/CD Pipeline for managing your infrastructure with [Terragrunt](https://terragrunt.gruntwork.io/).

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run terragrunt_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t terragrunt
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger install github.com/fluent-ci-templates/terragrunt-pipeline@main
```


## Environment variables

| Variable                    | Description                                        |
| --------------------------- | -------------------------------------------------- |
| TERRAGRUNT_CONFIG           | The path to the Terragrunt config file. Default is terragrunt.hcl.          |
| TERRAGRUNT_DEBUG            | Write terragrunt-debug.tfvars to working folder to help root-cause issues.                                  |
| TERRAGRUNT_DISABLE_BUCKET_UPDATE | When this flag is set Terragrunt will not update the remote state bucket. |
| TERRAGRUNT_DOWNLOAD | The path where to download Terraform code. Default is .terragrunt-cache in the working directory. |
| TERRAGRUNT_EXCLUDE_DIR | Unix-style glob of directories to exclude when running *-all commands. |
| TERRAGRUNT_FAIL_ON_STATE_BUCKET_CREATION | When this flag is set Terragrunt will fail if the remote state bucket needs to be created. |
|  TERRAGRUNT_FETCH_DEPENDENCY_OUTPUT_FROM_STATE | The option fetchs dependency output directly from the state file instead of init dependencies and running terraform on them. |
| TERRAGRUNT_IAM_ASSUME_ROLE_DURATION | Session duration for IAM Assume Role session. Can also be set via the TERRAGRUNT_IAM_ASSUME_ROLE_DURATION environment variable. |
| TERRAGRUNT_IAM_ASSUME_ROLE_SESSION_NAME | Name for the IAM Assummed Role session. Can also be set via TERRAGRUNT_IAM_ASSUME_ROLE_SESSION_NAME environment variable. |
| TERRAGRUNT_IAM_ROLE | Assume the specified IAM role before executing Terraform. Can also be set via the TERRAGRUNT_IAM_ROLE environment variable. |
| TERRAGRUNT_INCLUDE_EXTERNAL_DEPENDENCIES | *-all commands will include external dependencies |
| TERRAGRUNT_INCLUDE_MODULE_PREFIX | When this flag is set output from Terraform sub-commands is prefixed with module path. |
| TERRAGRUNT_LOG_LEVEL | Sets the logging level for Terragrunt. Supported levels: panic, fatal, error, warn, info, debug, trace. (default: info) |
| TERRAGRUNT_NO_AUTO_APPROVE | Don't automatically append -auto-approve to the underlying Terraform commands run with 'run-all'. (default: true) |
| TERRAGRUNT_NO_AUTO_INIT |  Don't automatically run 'terraform init' during other terragrunt commands. You must run 'terragrunt init' manually. (default: true) |
| TERRAGRUNT_NO_AUTO_RETRY | Don't automatically re-run command in case of transient errors. (default: true) |
| TERRAGRUNT_NO_COLOR | If specified, Terragrunt output won't contain any color. |
| TERRAGRUNT_NON_INTERACTIVE | Assume "yes" for all prompts. |
| TERRAGRUNT_PARALLELISM |  *-all commands parallelism set to at most N modules (default: 2147483647) |
| TERRAGRUNT_SOURCE | Download Terraform configurations from the specified source into a temporary folder, and run Terraform in that temporary folder.  |
| TERRAGRUNT_SOURCE_MAP | Replace any source URL (including the source URL of a config pulled in with dependency blocks) that has root source with dest. |
| TERRAGRUNT_SOURCE_UPDATE | Delete the contents of the temporary folder to clear out any old, cached source code before downloading new source code into it. |
| TERRAGRUNT_TFPATH | Path to the Terraform binary. Default is terraform (on PATH). (default: terraform) |
| TERRAGRUNT_USE_PARTIAL_PARSE_CONFIG_CACHE | Enables caching of includes during partial parsing operations. Will also be used for the --terragrunt-iam-role option if provided. |
| TERRAGRUNT_WORKING_DIR | The path to the Terraform templates. Default is current directory. |

## Jobs

| Job       | Description                            |
| --------- | -------------------------------------- |
| validate  | Validate the configuration files       |
| apply     | Apply infrastructure changes          |

```typescript
apply(
  src: Directory | string,
  tfVersion?: string
): Promise<string>

validate(
  src: Directory | string,
  tfVersion?: string
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { validate, apply } from "jsr:@fluentci/terragrunt";

await validate(".");
await apply(".");
```
