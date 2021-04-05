var vm = new Vue({
  el: "#app",
  data: {
    showControls: true,
    controls: {
      play: false,
      manual: true,
      stepping: true,
      interval: {
        current: 0,
        max: 10,
        id: null
      }
    },
    settings: {
      displayed: {
        mazeRow: 10,
        mazeCol: 10,
        staticLength: false,
        startLength: 1,
        foodNumber: 2
      },
      saved: {}
    },
    mazeSettings: {
      unit: 25,
      gap: 1
    },
    foodLocations: [],
    snakeLocations: [], // head to tail
    moveDir: "e", // 'n' 's' 'w' 'e'
    logs: [],
    showLogs: true,
    accPoints: 0,
    playerList: [{
      value: "",
      label: ""
    }],
    selectedPlayer: "",
    snakeLength: 0,
    snakeDotR: 10,
    snakeDotDirScale: 0.5,
    allDirs: ["n", "s", "w", "e"],
    dirOperations: [ [0, -1], [0, +1], [-1, 0], [+1, 0] ],
    failed: false,
    failedFace: 0,
    numberOfFailedFace: 7,
    overlay: {
      gameControls: false
    }
  },
  computed: {
    settingsModified: function () {
      return JSON.stringify(this.settings.displayed) !== JSON.stringify(this.settings.saved);
    },
    mazePadLoc: function () {
      let locs = [];
      [...Array(this.settings.saved.mazeCol).keys()].forEach((cval,cidx,carr) => {
        [...Array(this.settings.saved.mazeRow).keys()].forEach((rval,ridx,rarr) => {
          locs.push([cval * this.mazeSettings.unit + Math.max(cval + 1, 0) * this.mazeSettings.gap, rval * this.mazeSettings.unit + Math.max(rval + 1, 0) * this.mazeSettings.gap]);
        });
      });
      return locs;
    },
    mazeViewBox: function () {
      return [
        0, 0, 
        this.settings.saved.mazeCol * this.mazeSettings.unit + Math.max(this.settings.saved.mazeCol + 1, 0) * this.mazeSettings.gap, 
        this.settings.saved.mazeRow * this.mazeSettings.unit + Math.max(this.settings.saved.mazeRow + 1, 0) * this.mazeSettings.gap
      ];
    },
    snakeColors: function () {
      return this.snakeLocations.map((val,idx,arr) => Math.ceil((arr.length-idx)/arr.length *10)*10);
    },
    snakeDotDir: function () {
      return this.snakeLocations.map((val,idx,arr) => {
        if (idx == 0) {
          return this.moveDir;
        } else {
          let delta = JSON.stringify([arr[idx-1][0] - val[0], arr[idx-1][1] - val[1]]);
          return this.allDirs[ this.dirOperations.map(x => JSON.stringify(x)).indexOf(delta) ];
        }
      });
    }
  },
  components: {
    "button-with-label": {
      template: "#button-with-label",
      props: ["icon", "label"]
    },
    "button-only": {
      template: "#button-only",
      props: ["icon"]
    },
    "text-button": {
      template: "#text-button"
    },
    "overlay": {
      template: "#overlay",
      props: ["dialog-class"]
    }
  },
  mounted: function () {
    this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed);
    this.initialiseGame();
    document.onkeydown = (e) => {      
      if (e.target.tagName !== "INPUT") {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          if (this.controls.manual && this.controls.play) {
            this.moveSnakeByKeyboard(e.key);
          }
        } else if (["p","r"].includes(e.key.toLowerCase())) {
          this.keyboardControl(e.key.toLowerCase());
        }
      }
    }
  },
  watch: {
    "controls.play": function (newplay, oldplay) {
      if (newplay) {
        this.logs.push("Game started");
        if (this.controls.interval.current > 0) {
          this.controls.interval.id = setInterval(this.moveSnake, 1000/this.controls.interval.current);
        }
      }
      else {
        this.logs.push("Game is paused");
        if (this.controls.interval.id) clearInterval(this.controls.interval.id);
        this.controls.interval.id = null;
      }
    },
    failed: function (newfailed) {
      if (newfailed) {
        this.controls.play = false;
      }
    },
    logs: function () {
      if (this.$refs.log) {
        this.$nextTick(() => {
          if ((this.$refs.logs.scrollTopMax - this.$refs.log[this.$refs.log.length-1].offsetHeight) <= this.$refs.logs.scrollTop) {
            this.$refs.logs.scrollTop = this.$refs.logs.scrollTopMax
          }
        })
      }
    }
  },
  methods: {
    initialiseGame: function () {
      this.controls.play = false;
      this.setSnakeInitialLocations();
      this.foodLocations.splice(0, this.foodLocations.length);
      [...Array(this.settings.saved.foodNumber).keys()].forEach(() => this.generateFoodLocation());
      this.snakeLength = this.settings.saved.startLength;
      this.failed = false;
      this.failedFace = Math.floor(Math.random() * this.numberOfFailedFace);
    },
    setSnakeInitialLocations: function () {
      this.snakeLocations.splice(0, this.snakeLocations.length);
      this.snakeLocations.push([0, Math.floor(this.settings.saved.mazeRow/2)]);
      let grow = "tail"; // "head" "tail"
      let growDir = "s"; // "n" "s" "w" "e"
      while (this.snakeLocations.length < Math.min(this.settings.saved.startLength, this.settings.saved.mazeRow * this.settings.saved.mazeCol - this.settings.saved.foodNumber)) {
        let loc = {
          head: this.snakeLocations[0],
          tail: this.snakeLocations[this.snakeLocations.length - 1]
        };
        let nextLoc = this.getNewLocByDir(loc[grow], growDir);
        // if nextloc is outside of maze
        while ( [-1, this.settings.saved.mazeCol].includes(nextLoc[0]) || [-1, this.settings.saved.mazeRow].includes(nextLoc[1]) ) {
          if ( [-1, this.settings.saved.mazeCol].includes(nextLoc[0]) ) { // if row is filled
            if (grow == "head") { growDir = "n"; }
            else { growDir = "s"; }
          }
          if ( nextLoc[1] == this.settings.saved.mazeRow ) { // if bottom all filled
            grow = "head";
            growDir = "e";
          }
          if ( nextLoc[1] == -1 ) { // if all is filled
            nextLoc = [loc[grow][0], loc[grow][1]];
          } else {
            nextLoc = this.getNewLocByDir(loc[grow], growDir);
          }
        }

        // add nextloc to head or tail
        if (grow == "head") { this.snakeLocations.splice(0, 0, nextLoc); }
        else { this.snakeLocations.push(nextLoc); }

        // identify next growing direction
        if ( ["s", "n"].includes(growDir) ) {
          if (nextLoc[0] == 0) { growDir = "e"; }
          else { growDir = "w"; }
        }
      }
    },
    getNewLocByDir: function (oldLoc, dir) {
      let operation = this.dirOperations[this.allDirs.indexOf(dir)];
      return [oldLoc[0] + operation[0], oldLoc[1] + operation[1]];
    },
    generateFoodLocation: function () {
      let occupied = this.foodLocations.concat(this.snakeLocations);
      let occupiedString = occupied.map(x => String(x));
      let locs = [];
      [...Array(this.settings.saved.mazeCol).keys()].forEach((cval,cidx,carr) => {
        [...Array(this.settings.saved.mazeRow).keys()].forEach((rval,ridx,rarr) => {
          if (!occupiedString.includes(String([cval, rval]))) {
            locs.push([cval, rval]);
          }
        });
      });
      this.foodLocations.push(locs[ Math.floor( Math.random() * locs.length ) ]);
    },
    getCoord: function (idx) {
      return this.mazeSettings.unit/2 + idx * this.mazeSettings.unit + Math.max(idx+1,0) * this.mazeSettings.gap;
    },
    showtrees: function () {
      console.log("showing search trees");
    },
    saveSettings: function () { 
      this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed); 
      this.initialiseGame();
    },
    discardSettings: function () { this.settings.displayed = Object.assign({}, this.settings.displayed, this.settings.saved); },
    nextStep: function () {
      console.log("next step");
    },
    keyboardControl: function (key) {
      if (key == "p") {
        if (this.failed) { this.initialiseGame(); }
        this.controls.play = !this.controls.play;
      }
      if (key == "r") {
        this.initialiseGame();
      }
    },
    moveSnakeByKeyboard: function (key) {
      let keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      let dirs = ["n", "s", "w", "e"];
      let notDir = ["s", "n", "e", "w"]; // direction of index i is not permitted if current direction is index i of dirs

      let nextDir = dirs[keys.indexOf(key)];
      let newDirInfeasible = this.snakeLength > 1 && nextDir == notDir[dirs.indexOf(this.moveDir)];      
      if (newDirInfeasible) {
        this.logs.push("Invalid direction");
      } else if (nextDir == this.moveDir) {
        this.logs.push("Direction unchanged");
      } else {
        this.moveDir = nextDir;
        this.logs.push(`Direction changed to ${this.moveDir}`);
      } 

      if (this.controls.interval.current == 0 &&  !newDirInfeasible) {
        this.moveSnake();
      }
    },
    moveSnake: function () {
      let nextLoc = this.getNewLocByDir(this.snakeLocations[0], this.moveDir);
      if (nextLoc[0] > -1 && nextLoc[0] < this.settings.saved.mazeCol && nextLoc[1] > -1 && nextLoc[1] < this.settings.saved.mazeRow) { // if within maze
        let strSnakeLocs = this.snakeLocations.map(x => JSON.stringify(x));
        let strFoodLocs = this.foodLocations.map(x => JSON.stringify(x));
        let strNextLoc = JSON.stringify(nextLoc);
        if (strFoodLocs.includes(strNextLoc)) {
          this.foodLocations.splice(strFoodLocs.indexOf(strNextLoc), 1);
          if (!this.settings.saved.staticLength) this.snakeLength += 1;
          if (this.foodLocations.length == 0) { // generate food only when all food is taken
            [...Array(this.settings.saved.foodNumber-this.foodLocations.length).keys()].forEach(() => this.generateFoodLocation());
          }
          this.$nextTick(() => {this.logs.push("Yay! Just ate a food!")});
          this.accPoints += 1;
        } 
        if (strSnakeLocs.includes(strNextLoc)) {
          this.$nextTick(() => {this.logs.push("stop biting yourself!")});
          this.failed = true;
        } else {
          this.snakeLocations.splice(0, 0, nextLoc);
          this.snakeLocations.splice(this.snakeLength, this.snakeLocations.length - this.snakeLength);
        }
      } else {
        this.$nextTick(() => {this.logs.push("hit a wall")});
        this.failed = true;
      }
    }
  }
});