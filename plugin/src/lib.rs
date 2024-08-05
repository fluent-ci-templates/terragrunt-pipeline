use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup() -> FnResult<String> {
    let tf_version = dag().get_env("TF_VERSION").unwrap_or_default();
    let mut tf_version = tf_version.as_str();
    if tf_version.is_empty() {
        tf_version = "latest";
    }

    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "install",
            &format!("terraform@{}", tf_version),
            "terragrunt",
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn validate(args: String) -> FnResult<String> {
    let args = args.split_whitespace().collect::<Vec<&str>>();
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "terragrunt",
            "run-all",
            "validate",
            "--terragrunt-non-interactive",
            &args.join(" "),
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn hclfmt(args: String) -> FnResult<String> {
    let args = args.split_whitespace().collect::<Vec<&str>>();
    let stdout = dag()
        .pkgx()?
        .with_exec(vec!["terragrunt", "hclfmt", &args.join(" ")])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn init(args: String) -> FnResult<String> {
    let args = args.split_whitespace().collect::<Vec<&str>>();
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "terragrunt",
            "run-all",
            "init",
            "--terragrunt-non-interactive",
            &args.join(" "),
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn plan(args: String) -> FnResult<String> {
    let args = args.split_whitespace().collect::<Vec<&str>>();
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "terragrunt",
            "run-all",
            "plan",
            "--terragrunt-non-interactive",
            &args.join(" "),
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn apply(args: String) -> FnResult<String> {
    let args = args.split_whitespace().collect::<Vec<&str>>();
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "terragrunt",
            "run-all",
            "apply",
            "--terragrunt-non-interactive",
            &args.join(" "),
        ])?
        .stdout()?;
    Ok(stdout)
}
