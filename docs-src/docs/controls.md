# Game controls

The snake game can be controlled in two different modes: :material-account-outline:`Human` mode and :material-robot-outline:`Agent` mode.

## :material-account-outline: Human mode

In :material-account-outline:`Human` mode, you will control the snake's direction using the keyboard. This mode is to help you to be familiar with the game to design the agent to solve the problem.

1. Click :material-play: or press <kbd>P</kbd> to start the game.
2. Use the arrow keys <kbd>&#9666;</kbd> <kbd>&#9656;</kbd> <kbd>&#9662;</kbd> <kbd>&#9652;</kbd> to control the direction of the snake. 
3. Each food eaten by the snake will contribute a point.
4. If the snake hits the wall or bites itself, the snake will die and the game is over.
5. You may change the moving speed of the snake before you start the game or when you pause the game.
   
    === "Moving speed == 0"

        The snake will move one square with each keypress.

    === "Moving speed > 0"

        The snake will move according to the specified speed. The direction of the snake will be updated if any arrow key is pressed.

## :material-robot-outline: Agent mode

In :material-robot-outline:`Agent` mode, the snake's direction will be controlled by an agent/a player/a code that you create.

1. Choose the agent/player from the dropdown list. (Refresh :material-sync: the list if your agent is not in the list after you set it up correctly following the instructions in [Use your script as agent/player](../player))
2. Choose between :material-chevron-right:`Step-by-step` mode or :material-chevron-triple-right:`Automatic progression` mode.

    === ":material-chevron-right: Step-by-step"

        When the solution is returned by the agent/player, the next game state will not be sent immediate to prompt the agent/player to provide the next solution. The agent/player will only be provided with the next game state when `Next step` button is clicked.

    === ":material-chevron-triple-right: Automatic progression"

        When the solution is returned by the agent/player, the next game state will be sent immediately to prompt the agent/player to provide the next solution. No user interaction is required.

3. Click :material-play: or press <kbd>P</kbd> to start the game.

    === ":material-chevron-right: Step-by-step"

        The current game state will be sent to the agent/player when `Next step` button is clicked.

    === ":material-chevron-triple-right: Automatic progression"

        The current game state will be sent immediately to prompt the agent/player to provide the solution.

4. When at least one solution has been provided by the agent/player, click :material-family-tree:`Show search trees` to show the previous and the current game state, solution, and search tree. 

