import os, importlib, sys, json
import server
from snakemap import snakemap

players = server.getPlayerList()
smap = snakemap(10, 10)

for player in players[:1]:
  # prepare player
  thisplayer = server.checkPlayerAvail(player["folder"])
  # initialise player
  thisplayer = server.initPlayer(thisplayer, smap.getsetup())
  while ("result" not in locals() or not result["gameover"] or result["points"] > 50):
    # map sending current state
    problem = smap.getstate()
    # player provide solution
    solution, search_tree = thisplayer["player"].run(problem)
    # move the snake in map
    result = smap.movesnake(solution)
  print(result)

