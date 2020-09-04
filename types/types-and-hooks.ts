import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
import { FindUserQuery, FindUserQueryVariables } from "./operations-types";
export const UserFieldsFragmentDoc = gql`
  fragment UserFields on User {
    id
    username
    role
  }
`;
export const FindUserDocument = gql`
  query findUser($userId: ID!) {
    user(id: $userId) {
      ...UserFields
    }
  }
  ${UserFieldsFragmentDoc}
`;

/**
 * __useFindUserQuery__
 *
 * To run a query within a React component, call `useFindUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useFindUserQuery(
  baseOptions?: Apollo.QueryHookOptions<FindUserQuery, FindUserQueryVariables>
) {
  return Apollo.useQuery<FindUserQuery, FindUserQueryVariables>(
    FindUserDocument,
    baseOptions
  );
}
export function useFindUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FindUserQuery,
    FindUserQueryVariables
  >
) {
  return Apollo.useLazyQuery<FindUserQuery, FindUserQueryVariables>(
    FindUserDocument,
    baseOptions
  );
}
export type FindUserQueryHookResult = ReturnType<typeof useFindUserQuery>;
export type FindUserLazyQueryHookResult = ReturnType<
  typeof useFindUserLazyQuery
>;
export type FindUserQueryResult = Apollo.QueryResult<
  FindUserQuery,
  FindUserQueryVariables
>;
