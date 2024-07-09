import { gql } from "@apollo/client";

export const START_GAME = gql`
  mutation StartGame($betAmount: Float!, $mineCount: Int!) {
    startGame(betAmount: $betAmount, mineCount: $mineCount) {
      gameId
    }
  }
`;

export const SELECT_TILE = gql`
  mutation SelectTile($gameId: String!, $position: Int!) {
    selectTile(gameId: $gameId, position: $position) {
      isMine
      mineField
      updatedAt
    }
  }
`;

export const GET_GAME_RESULTS = gql`
  query GetGameResults($gameId: String!) {
    getGameResults(gameId: $gameId) {
      mineField
      updatedAt
    }
  }
`;
