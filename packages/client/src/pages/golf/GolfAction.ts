export const GolfAction = {
  sendState(state: any) {
    return {
      type: 'puttclub.GAME_STATE' as const,
      state
    }
  },

  playerJoined(playerId: string) {
    return {
      type: 'puttclub.PLAYER_JOINED' as const,
      playerId
    }
  },

  playerReady(playerId: string) {
    return {
      type: 'puttclub.PLAYER_READY' as const,
      playerId
    }
  },

  playerStroke(playerId: string) {
    return {
      type: 'puttclub.PLAYER_STROKE' as const,
      playerId
    }
  },

  ballStopped(playerId: string) {
    return {
      type: 'puttclub.BALL_STOPPED' as const,
      playerId
    }
  },

  nextTurn() {
    return {
      type: 'puttclub.NEXT_TURN' as const
    }
  },

  resetBall() {
    return {
      type: 'puttclub.RESET_BALL' as const
    }
  },

  nextHole() {
    return {
      type: 'puttclub.NEXT_HOLE' as const
    }
  }
}

export type GolfActionType = ReturnType<typeof GolfAction[keyof typeof GolfAction]>
