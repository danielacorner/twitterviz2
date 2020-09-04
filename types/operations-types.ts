import { Scalars, Exact, Maybe, User } from "./types-cogeden";

export type FindUserQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type FindUserQuery = { __typename?: "Query" } & {
  user?: Maybe<{ __typename?: "User" } & UserFieldsFragment>;
};

export type UserFieldsFragment = { __typename?: "User" } & Pick<
  User,
  "id_str" | "screen_name"
>;
