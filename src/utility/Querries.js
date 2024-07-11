import { gql } from "@apollo/client";

export const START_GAME = gql`
  mutation StartGame($betAmount: Float!, $mineCount: Int!) {
    startGame(betAmount: $betAmount, mineCount: $mineCount) {
      gameId
      mineCount
      betAmount
      updatedAt
    }
  }
`;

export const SELECT_TILE = gql`
  mutation SelectTile($gameId: String!, $position: Int!) {
    selectTile(gameId: $gameId, position: $position) {
      isMine
      multiplier
      winningAmount
      updatedAt
    }
  }
`;

export const GET_GAME_RESULTS = gql`
  query GetGameResults($gameId: String!) {
    getGameResults(gameId: $gameId) {
      mineField
      betAmount
      mineCount
      multiplier
      winningAmount
      updatedAt
    }
  }
`;

export const CASHOUT_RESULT = gql`
  mutation cashoutResult($gameId: String!) {
    cashoutResult(gameId: $gameId) {
      mineCount
      mineField
      betAmount
      multiplier
      winningAmount
      updatedAt
    }
  }
`;
