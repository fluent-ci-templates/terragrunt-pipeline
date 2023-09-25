import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  validate,
  apply,
} from "https://pkg.fluentci.io/terragrunt_pipeline@v0.3.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await validate(client, src);
    await apply(client, src);
  });
}

pipeline();
