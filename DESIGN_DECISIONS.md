# Design Decisions



- Coin flip result visibility and announcement:
    - After each coin flip, the coin result is shown for 1.8 seconds before announcing the winner/loser, allowing players to focus on the coin outcome.
    - The result message ("X won!" or "X lost and progresses!") is delayed for clarity and suspense.

- End-of-game experience:
    - In **Win** mode, fireworks animation is shown for the winner.
    - In **Lose** mode, no animation is shown; only the result message is displayed for the loser.

- User experience improvements:



- Player entry and persistence:
    - Users can dynamically add or remove player name fields, with a minimum of two players required.
    - Player names are saved in localStorage and pre-filled on reload for convenience.

- Tournament structure:
    - Supports odd numbers of players by automatically assigning a bye to the last player in a round.
    - Tournament proceeds in knockout rounds until a single winner or loser remains, depending on the selected mode.

- UI and interaction:
    - All UI is rendered dynamically using JavaScript, including player entry, game mode selection, and bracket diagram.
    - Coin flip animation uses SVG graphics for heads/tails and a flipping effect for suspense.
    - Game mode ("Play to: Win/Lose") is selected via radio buttons before the tournament starts.
