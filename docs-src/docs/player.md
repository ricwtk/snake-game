# Use your script as agent/player

## Code location

1. Each agent/player is a direcotry resides in `root directory > app > players` directory.
2. To create a new agent/player, create a directory in the `players` directory, for example, a directory with the name of `super_player`. The agent/player is the `player.py` file inside that directory.

    <div style="display:flex;flex-direction:column;">
      <div>:material-folder-outline: snake-game</div>
      <div>&nbsp; :material-subdirectory-arrow-right: :material-folder-outline: app</div>
      <div>&nbsp; <span style="opacity:0">:material-subdirectory-arrow-right:</span>&nbsp; :material-subdirectory-arrow-right: :material-folder-outline: players</div>
      <div>&nbsp; <span style="opacity:0">:material-subdirectory-arrow-right:&nbsp; :material-subdirectory-arrow-right:</span>&nbsp;  :material-subdirectory-arrow-right: :material-folder-outline: super_players</div>
      <div>&nbsp; <span style="opacity:0">:material-subdirectory-arrow-right:&nbsp; :material-subdirectory-arrow-right:&nbsp; :material-subdirectory-arrow-right:</span>&nbsp;  :material-subdirectory-arrow-right: :material-language-python: `player.py`</div>
    </div>
    
## Code format

The `player.py` file should consist of the class `Player` as structured as follows:

```py
class Player():
  name = "testing player"
  informed = False
  group = "Children of Odin"
  members = [
    ["Thor", "12834823"],
    ["Loki", "98854678"],
    ["Hela", "87654654"]
  ]

  def __init__(self, setup):
    ...

  def run(self, problem):
    ...
    return solution, search_tree
```

### Class name

The name of the class must be `Player`.

### Agent/player information

Name your agent/player using the class attribute `name` and define if the agent/player is using informed or uninformed search with the class attribute `informed`.

=== "For informed search"

    ```
    informed = True
    ```

=== "For uninformed search"

    ```
    informed = False
    ```

### Group information

Include your group information as the class attributes for the `Player` class. This includes your group name (`group`) and group members (`members`).

### `__init__()` function

The `__init__` function is the function to initiate the player. Apart from `self`, the function will also receive `setup` as an input parameter. The format of the `setup` is

```py
{
  maze_size: [int, int],
  static_snake_length: bool
}
```

1. `maze_size` is an array of length two. The first item is the number of rows and the second item is the number of columns of the maze.
2. `static_snake_length` is a boolean object to indicate if the snake length is static (`True`) or dynamic (`False`).

### `run()` function

The `run` function is the function to implement the search algorithm. The function will take the input parameter of `problem`, which contains the current game state including the snake locations (`snake_locations`), current direction of the snake (`current_direction`), and the food locations (`food_locations`) in the following format:

```py
{
  snake_locations: [[int,int],[int,int],...],
  current_direction: str,
  food_locations: [[int,int],[int,int],...],
}
```

1. `snake_locations` is an array of the locations of the snake's body, starting from the head to the tail. The locations are given in the form of the coordinates `[x,y]`, i.e. `[column, row]`, with `[0,0]` at the top left corner of the maze. As an example, for a maze of 5 rows and 6 columns, the top right corner is `[5,0]`, the bottom left corner is `[0,4]`, and the bottom right corner is `[5,4]`.
2. `current_direction` is the current direction of the snake, specified as north `n`, south `s`, west `w`, or east `e`.
3. `food_locations` is an array of the locations of the food on the game field. The locations are specified in the form of coordinates identical to `snake_locations`.

The `run` function is expected to return two variables, `solution` and `search_tree`.

1. `solution` is the series of actions for the snake from the current location to capture the food. The actions should be specified as north `n`, south `s`, west `w`, and east `e`. Each action will move the snake for 1 square in the specified direction.
2. `search_tree` is the search tree that has been generated from the search algorithm the snake used to obtain the `solution`. `search_tree` should be a list of dictionary objects that gives us the information of each node in the search tree. Each object should be
    
    ```py
    {
      "id": 2,
      "state": "5,0,0",
      "expansionsequence": 2,
      "children": [5,6,7],
      "actions": ["src2one","src2two","one2three"],
      "removed": False,
      "parent": 1
    },
    ```

    - `id` is the ID of this node, which should be unique for every node
    - `state` is the state of this node, which should be a string (the display format is not constrained)
    - `expansionsequence` is the order of this node being expanded
    - `children` is the ID of the nodes that are children to this node, which should be a list (empty list if no children)
    - `actions` is the list of actions that correspond to the children in children, which should be a list of equal length with children (the display format is not constrained)
    - `removed` indicates if this node has been removed due to being a duplicated node or creating a redundant path
    - `parent` is the ID of the node that is parent to this node

For example, to produce a search tree as follows,

<div style="text-align:center">
<svg width="60%" viewBox="-5 -10 490 315"><style>.expseq { font: normal 10px sans-serif; }</style> <rect x="255" y="0" width="50" height="50" stroke="gray" fill="white"></rect> <text x="280" y="25" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">0,0</text> <text x="317.5" y="25" font-weight="thin" dominant-baseline="middle" text-anchor="middle" class="expseq">1</text> <circle cx="317.5" cy="25" r="10" fill="none" stroke="#009688"></circle> <!----> <!----> <!----> <!----><rect x="105" y="100" width="50" height="50" stroke="gray" fill="white"></rect> <text x="130" y="125" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">5,0</text> <text x="167.5" y="125" font-weight="thin" dominant-baseline="middle" text-anchor="middle" class="expseq">2</text> <circle cx="167.5" cy="125" r="10" fill="none" stroke="#009688"></circle> <!----> <!----> <line x1="280" y1="50" x2="130" y2="100" stroke="gray"></line> <text x="205" y="75" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">n</text><rect x="305" y="100" width="50" height="50" stroke="gray" fill="white"></rect> <text x="330" y="125" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">0,3</text> <!----> <!----> <!----> <!----> <line x1="280" y1="50" x2="330" y2="100" stroke="gray"></line> <text x="305" y="75" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">w</text><rect x="405" y="100" width="50" height="50" stroke="gray" fill="white"></rect> <text x="430" y="125" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">0,4</text> <!----> <!----> <!----> <!----> <line x1="280" y1="50" x2="430" y2="100" stroke="gray"></line> <text x="355" y="75" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">e</text><rect x="5" y="200" width="50" height="50" stroke="gray" fill="white"></rect> <text x="30" y="225" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">5,0</text> <!----> <!----> <line stroke="red" stroke-width="3" x1="0" y1="195" x2="60" y2="255"></line> <line stroke="red" stroke-width="3" x1="60" y1="195" x2="0" y2="255"></line> <line x1="130" y1="150" x2="30" y2="200" stroke="gray"></line> <text x="80" y="175" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">n</text><rect x="105" y="200" width="50" height="50" stroke="gray" fill="white"></rect> <text x="130" y="225" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">5,3</text> <!----> <!----> <!----> <!----> <line x1="130" y1="150" x2="130" y2="200" stroke="gray"></line> <text x="130" y="175" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">s</text><rect x="205" y="200" width="50" height="50" stroke="gray" fill="white"></rect> <text x="230" y="225" font-weight="thin" font-size="12px" dominant-baseline="middle" text-anchor="middle">1,0</text> <!----> <!----> <!----> <!----> <line x1="130" y1="150" x2="230" y2="200" stroke="gray"></line> <text x="180" y="175" stroke="white" stroke-width=".5pt" font-weight="900" font-size="10px" dominant-baseline="middle" text-anchor="middle">w</text><!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----><!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----></svg>
</div>

this is the value of the `search_tree`.

```py
[
  {
    "id": 1,
    "state": "0,0",
    "expansionsequence": 1,
    "children": [2,3,4],
    "actions": ["n","w","e"],
    "removed": False,
    "parent": None
  },
  {
    "id": 2,
    "state": "5,0",
    "expansionsequence": 2,
    "children": [5,6,7],
    "actions": ["n","s","w"],
    "removed": False,
    "parent": 1
  },
  {
    "id": 3,
    "state": "0,3",
    "expansionsequence": -1,
    "children": [],
    "actions": [],
    "removed": False,
    "parent": 1
  },
  {
    "id": 4,
    "state": "0,4",
    "expansionsequence": -1,
    "children": [],
    "actions": [],
    "removed": False,
    "parent": 1
  },
  {
    "id": 5,
    "state": "5,0",
    "expansionsequence": -1,
    "children": [],
    "actions": [],
    "removed": True,
    "parent": 2
  },
  {
    "id": 6,
    "state": "5,3",
    "expansionsequence": -1,
    "children": [],
    "actions": [],
    "removed": False,
    "parent": 2
  },
  {
    "id": 7,
    "state": "1,0",
    "expansionsequence": -1,
    "children": [],
    "actions": [],
    "removed": False,
    "parent": 2
  }
]
```

## Disclaimer on the testing player example

An example of an/a agent/player named `testing player` is included under the subdirectory of `players > tests`. `testing player` provides a structure to the `Player` class. The solutions generated by `testing player` are random and disregarding the current game state. The search trees returned by `testing player` are hardcoded and therefore static. Your agent/player should generate the solutions and search trees using a search algorithm.

## Interaction between this platform and your agent

This section is to provide the information of how the game platform interacts with the agent/player. You only need to focus on the coding of the agent/player. 

<svg width="100%" viewBox="-450 -30 900 400">
  <text x="-100" y="0" text-anchor="end" dominant-baseline="middle">
    <tspan style="font-weight:bolder">Game</tspan>
    <tspan x="-100" y="40">Agent selected</tspan>
    <tspan x="-100" dy="40">Notified of success initiation</tspan>
    <tspan x="-100" dy="120">Next step</tspan>
    <tspan x="-100" dy="120">Solution animation display</tspan>
  </text>
  <text x="100" y="0" text-anchor="start" dominant-baseline="middle">
    <tspan style="font-weight:bolder">Agent/Player</tspan>
    <tspan x="100" y="40" style="font-family:monospace">init</tspan>
    <tspan x="100" y="200" style="font-family:monospace">run</tspan>
  </text>
  <path d="M -90 40 H 90 l -10 -5 l 3 5 l -3 5 l 10 -5" stroke="black" fill="black" />
  <text style="font-size:smaller" x="0" y="30" text-anchor="middle" dominant-baseline="auto">with game settings</text>
  <path d="M 115 50 V 80" stroke="black" />
  <path d="M 115 80 H -90 l 10 5 l -3 -5 l 3 -5 l -10 5" stroke="black" fill="black" />
  <path d="M -115 90 V 180 l 5 -10 l -5 3 l -5 -3 l 5 10" stroke="black" fill="black" />
  <text style="font-size:smaller" x="-120" y="140" text-anchor="end" dominant-baseline="middle">if auto progression</text>
  <path d="M -90 200 H 90 l -10 -5 l 3 5 l -3 5 l 10 -5" stroke="black" fill="black" />
  <text style="font-size:smaller" x="0" y="190" text-anchor="middle" dominant-baseline="auto">with game states</text>
  <path d="M 115 210 V 320" stroke="black" />
  <path d="M 115 320 H -90 l 10 5 l -3 -5 l 3 -5 l -10 5" stroke="black" fill="black" />
  <text style="font-size:smaller" x="0" y="310" text-anchor="middle" dominant-baseline="auto">solution, search_tree</text>
  <path d="M -115 310 V 220 l 5 10 l -5 -3 l -5 3 l 5 -10" stroke="black" fill="black" />
  <text style="font-size:smaller" x="-120" y="260" text-anchor="end" dominant-baseline="middle">if auto progression</text>
  <text style="font-size:smaller" x="-250" y="200" text-anchor="end" dominant-baseline="middle">if step-by-step, click button</text>
  <path d="M -240 200 h 50 l -10 -5 l 3 5 l -3 5 l 10 -5" stroke="black" fill="black" />
  <rect stroke="teal" stroke-width="5" stroke-opacity="0.5" x="70" y="-20" fill="none" width="170" height="380" />
</svg>