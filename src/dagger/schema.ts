import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { validate, apply } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("validate", {
      args: {
        src: nonNull(stringArg()),
        tfVersion: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await validate(args.src, args.tfVersion),
    });
    t.string("apply", {
      args: {
        src: nonNull(stringArg()),
        tfVersion: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await apply(args.src, args.tfVersion),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
