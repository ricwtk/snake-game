import random

class Player():
  name = "testing player"
  group = "Children of Odin"
  members = [
    ["Thor", "12834823"],
    ["Loki", "98854678"],
    ["Hela", "87654654"]
  ]
  informed = False

  def __init__(self, setup):
    # setup = {
    #   maze_size: [int, int],
    #   static_snake_length: bool
    # }
    self.setup = setup

  def run(self, problem):
    # problem = {
    #   snake_locations: [[int,int],[int,int],...],
    #   current_direction: str,
    #   food_locations: [[int,int],[int,int],...],
    # }
    solution = []
    directions = "nswe"
    # the following algorithm is NOT a valid algorithm
    # it randomly generates solution that is invalid
    # its purpose is to show you how this class will work
    # not a guide to how to write your algorithm
    solution = [random.choice(directions) for step in range(random.randint(1,10))]
    # the following search tree is a static search tree 
    # to show you the format of the variable 
    # to generate a search tree that can be displayed in the frontend.
    # you are required to generate the search tree based on your search algorithm
    search_tree = [
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
    # this function should return the solution and the search_tree
    return solution, search_tree