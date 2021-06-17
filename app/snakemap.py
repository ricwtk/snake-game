import math, random
def getlocbydir(oldloc, direction):
  alldirs = ["n", "s", "w", "e"]
  diroperations = [ [0, -1], [0, +1], [-1, 0], [+1, 0] ]
  operation = diroperations[alldirs.index(direction)]
  return [oldloc[0] + operation[0], oldloc[1] + operation[1]]

class snake:
  def __init__(self, locations=[], direction="e", staticsnake=False, startlength=1, map=None):
    self.setlocations(locations)
    self.setstartlength(startlength)
    self.setsnakelength(startlength)
    self.setdir(direction)
    self.setstatic(staticsnake)
    self.map = map
    self.point = 0

  def setlocations(self, locations):
    self.locations = locations
  
  def setdir(self, direction):
    self.direction = direction

  def setstatic(self, staticsnake):
    self.staticsnake = staticsnake

  def setstartlength(self, startlength):
    self.startlength = startlength
  
  def setsnakelength(self, snakelength):
    self.snakelength = snakelength

  def addpoint(self, points=1):
    self.point += points
  
  def move(self):
    nextloc = getlocbydir(self.locations[0], self.direction)
    if nextloc[0] in range(self.map.ncol) and nextloc[1] in range(self.map.nrow):
      if nextloc in self.map.food:
        self.eat(nextloc)
      elif nextloc in self.locations:
        print("stop biting yourself")
        return { "gameover": True, "why": "bite" }
      self.locations.insert(0, nextloc)
      self.locations = self.locations[:self.snakelength]
      if len(self.map.food) == 0: self.map.generateallfood()
    else:
      print("hit a wall")
      return { "gameover": True, "why": "wall" }
    return { "gameover": False }

  def eat(self, nextloc):
    self.addpoint()
    self.map.food.remove(nextloc)
    if not self.staticsnake: self.snakelength += 1

class snakemap:
  def __init__(self, nrow=10, ncol=10, staticsnake=False, snakelength=1, nfood=1):
    self.setrow(nrow)
    self.setcol(ncol)
    self.snake = snake(staticsnake=staticsnake,startlength=snakelength,map=self)
    self.setnfood(nfood)
    self.food = []
    self.setsnakeinitiallocations()
    self.generateallfood()
  
  def setrow(self, nrow):
    self.nrow = nrow

  def setcol(self, ncol):
    self.ncol = ncol

  def setnfood(self, nfood):
    self.nfood = nfood

  def getsetup(self):
    return {
      "maze_size": [self.nrow, self.ncol],
      "static_snake_length": self.snake.staticsnake
    }

  def generateallfood(self):
    for _ in range(self.nfood - len(self.food)):
      self.generatefood()

  def generatefood(self):
    occupied = self.food + self.snake.locations
    avail = []
    for x in range(self.nrow):
      for y in range(self.ncol):
        if [x,y] not in occupied:
          avail.append([x,y])
    self.food.append(avail[ math.floor( random.random() * len(avail) ) ])

  def setsnakeinitiallocations(self):
    grow = "tail"
    growdir = "s"
    self.snake.locations = [[0, math.floor(self.nrow/2)]]
    while (len(self.snake.locations) < min(self.snake.startlength, self.nrow * self.ncol - self.nfood)):
      loc = {
        "head": self.snake.locations[0],
        "tail": self.snake.locations[-1]
      }
      nextloc = getlocbydir(loc[grow], growdir)
      # if nextloc is outside of maze
      while nextloc[0] in [-1, self.ncol] or nextloc[1] in [-1, self.nrow]:
        # if row is filled
        if nextloc[0] in [-1, self.ncol]:
          if grow == "head": growdir = "n"
          else: growdir = "s"
        if nextloc[1] == self.nrow:
          grow = "head"
          growdir = "e"
        if nextloc[1] == -1:
          nextloc = [loc[grow][0], loc[grow][1]]
        else:
          nextloc = getlocbydir(loc[grow], growdir)

      # add nextloc to head or tail
      if grow == "head": self.snake.locations.insert(0, nextloc)
      else: self.snake.locations.append(nextloc)

      # identify next growing direction
      if growdir in ["s", "n"]:
        if nextloc[0] == 0: growdir = "e"
        else: growdir = "w"
  
  def getstate(self):
    return {
      "snake_locations": self.snake.locations,
      "current_direction": self.snake.direction,
      "food_locations": self.food
    }

  def movesnake(self, directions=[]):
    dirtillnow = []
    if len(directions) > 0:
      for i,d in enumerate(directions):
        print("[{}/{}] Move snake in direction {}".format(i, len(directions), d))
        self.snake.setdir(d)
        dirtillnow.append(d)
        situation = self.snake.move()
        if situation["gameover"]:
          return { "gameover": situation["gameover"], "points": self.snake.point, "moved": dirtillnow }
    return { "gameover": False, "points": self.snake.point, "moved": dirtillnow}
