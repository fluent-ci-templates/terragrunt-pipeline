import { gql } from "../../deps.ts";

export const validate = gql`
  query validate($src: String!, $tfVersion: String) {
    validate(src: $src, tfVersion: $tfVersion)
  }
`;

export const apply = gql`
  query apply($src: String!, $tfVersion: String) {
    apply(src: $src, tfVersion: $tfVersion)
  }
`;
