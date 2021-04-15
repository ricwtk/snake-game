// custom components registration
Vue.component("button-with-label", {
  template: "#button-with-label",
  props: ["icon", "disabled"]
});
Vue.component("button-only", {
  template: "#button-only",
  props: ["icon", "disabled"]
});
Vue.component("text-button", {
  template: "#text-button",
  props: ["disabled", "button-class"]
});
Vue.component("overlay", {
  template: "#overlay",
  props: ["dialog-class"]
});
Vue.component("select-with-action", {
  template: "#select-with-action",
  props: ["disabled", "label", "value", "action-icon", "options", "value-key", "display-key"]
});
Vue.component('search-tree', {
  template: "#search-tree-template",
  props: {
    width: {
      type: String,
      default: "100%"
    },
    tree: {
      type: Array,
      default: []
    },
    font: {
      type: Object,
      default: () => ({
        state: 12,
        action: 10
      }),
    },
    dimension: {
      type: Object,
      default: () => ({
        node_height: 50,
        node_width: 50,
        link_height: 50,
        node_sep: 50
      })
    }
  },
  data: function () {
    return { }
  },
  computed: {
    font_size: function () {
      return {
        state: this.font && this.font.state ? this.font.state == "" ? 12 : this.font.state : 12,
        action: this.font && this.font.action ? this.font.action == "" ? 10 : this.font.action : 10,
      }
    },
    node_height: function () {
      return this.dimension && this.dimension.node_height ? isNaN(this.dimension.node_height) || Number(this.dimension.node_height) < 10 ? 50 : Number(this.dimension.node_height) : 50;
    },
    node_width: function () {
      return this.dimension && this.dimension.node_width ? isNaN(this.dimension.node_width) || Number(this.dimension.node_width) < 10 ? 50 : Number(this.dimension.node_width) : 50;
    },
    link_height: function () {
      return this.dimension && this.dimension.link_height ? isNaN(this.dimension.link_height) || Number(this.dimension.link_height) < 10 ? 50 : Number(this.dimension.link_height) : 50;
    },
    node_sep: function () {
      return this.dimension && this.dimension.node_sep ? isNaN(this.dimension.node_sep) || Number(this.dimension.node_sep) < 10 ? 50 : Number(this.dimension.node_sep) : 50;
    },
    tree_array: function () {
      let st_arr = [];
      if (this.tree && this.tree.length > 0) {
        st_arr.push([[this.tree.find(v => !v.parent)]]);
        while (!st_arr[st_arr.length - 1].every(arr => arr.every(v => v < 1))) {
          st_arr.push(
            st_arr[st_arr.length - 1].flat()
            .map(n => n < 1 ?
                [n - 1]
                : (n.children.length == 0 ? [0] : n.children.map(i => this.tree.find(v => v.id == i)).filter(v => v !== undefined))
            )
          );
        }
      }
      return st_arr;
    },
    view_box: function () {
      let vb = "0 0 0 0";
      if (this.tree_array.length > 0) {
        let width = 
          this.tree_array[this.tree_array.length - 1].length * this.node_width
          + (this.tree_array[this.tree_array.length - 1].length - 1) * this.node_sep + 10 + .5*this.node_width + .1*this.node_width;
        let height = 
          (this.tree_array.length - 1)* this.node_height
          + (this.tree_array.length - 2) * this.link_height + 10 + this.node_height + .1*this.node_height;
        vb = [-.1*this.node_width, -5-.1*this.node_height, width, height].join(" ");
      } else {
        vb = [0, 0, this.node_width, this.node_height].join(" ");
      }
      return vb;
    },
    node_x: function () {
      let x = [];
      if (this.tree_array.length > 0) {
        x.push(this.tree_array[this.tree_array.length - 2].flat().map((node,n) => n * (this.node_width + this.node_sep) + 5));
        for ( let i = this.tree_array.length - 3; i > -1; i-- ) {
          x.push(
            this.tree_array[i].flat().map((node,n) => {
              let first_child_idx = this.tree_array[i+1].slice(0,n).reduce((acc,curr) => acc + curr.length, 0);
              let last_child_idx = first_child_idx + this.tree_array[i+1][n].length - 1;
              return (x[x.length - 1][first_child_idx] + x[x.length - 1][last_child_idx])/2;
            })
          );
        }
      }
      return x.reverse();
    },
    linkage: function () {
      let links = [];
      if (this.tree_array.length > 0) {
        for ( let i = this.tree_array.length - 2; i > 0; i-- ) {
          links.push(
            this.tree_array[i].flatMap((siblings,s) => {
              let parent = this.node_x[i-1][s];
              let parent_node = this.tree_array[i-1].flat()[s];
              return siblings.map((node,n) => {
                let node_idx = this.tree_array[i].slice(0,s).reduce((acc,curr) => acc + curr.length, 0) + n;
                return {
                  parent_loc: parent,
                  child_loc: this.node_x[i][node_idx],
                  label: parent_node.actions ? parent_node.actions[n] : ''
                }
              });
            })
          );
        }
      }
      return links.reverse();
    },
  }
});

// initiation of Vue app
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
      },
      animation: {
        current: 1,
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
    // selectedPlayer: {
    //   folder: "",
    //   socket: null,
    //   setup: {},
    //   states: [],
    //   solutions: [],
    //   searchTrees: [],
    //   historyDisplay: 0
    // },
    selectedPlayer: {"folder":"tests","socket":null,"setup":{"maze_size":[10,10],"static_snake_length":false},"states":[{"snake_locations":[[0,5]],"current_direction":"e","food_locations":[[8,9],[5,1]]}],"solutions":[["w","w","n","s","n"]],"searchTrees":[[{"id":1,"state":"0,0","expansionsequence":1,"children":[2,3,4],"actions":["n","w","e"],"removed":false,"parent":null},{"id":2,"state":"5,0","expansionsequence":2,"children":[5,6,7],"actions":["n","s","w"],"removed":false,"parent":1},{"id":3,"state":"0,3","expansionsequence":-1,"children":[],"actions":[],"removed":false,"parent":1},{"id":4,"state":"0,4","expansionsequence":-1,"children":[],"actions":[],"removed":false,"parent":1},{"id":5,"state":"5,0","expansionsequence":-1,"children":[],"actions":[],"removed":true,"parent":2},{"id":6,"state":"5,3","expansionsequence":-1,"children":[],"actions":[],"removed":false,"parent":2},{"id":7,"state":"1,0","expansionsequence":-1,"children":[],"actions":[],"removed":false,"parent":2}]],"historyDisplay":0},
    snakeLength: 0,
    snakeDotR: 10,
    snakeDotDirScale: 0.5,
    allDirs: ["n", "s", "w", "e"],
    dirOperations: [ [0, -1], [0, +1], [-1, 0], [+1, 0] ],
    failed: false,
    failedFace: 0,
    numberOfFailedFace: 7,
    overlay: {
      gameControls: false,
      searchTrees: true
    },
    searchTreeWidthPercentage: {
      current: 100,
      min: 10,
      max: 1000
    }
  },
  computed: {
    settingsModified: function () {
      return JSON.stringify(this.settings.displayed) !== JSON.stringify(this.settings.saved);
    },
  },
  mounted: function () {
    this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed);
    this.initialiseGame();
    this.getPlayerList();
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
        if (this.failed) { this.initialiseGame(); }
        if (this.controls.manual) { // human mode
          this.logs.push("Game started");
          if (this.controls.interval.current > 0) {
            this.controls.interval.id = setInterval(this.moveSnake, 1000/this.controls.interval.current);
          }
        } else { // agent mode
          if (this.selectedPlayer.socket) { 
            // returning from paused
            if (!this.controls.stepping) { this.nextAgentStep(); }
          } else {
            this.initiateAgent();
          }
        }
      }
      else {
        this.logs.push("Game is paused");
        if (this.controls.manual) { // human mode
          if (this.controls.interval.id) clearInterval(this.controls.interval.id);
          this.controls.interval.id = null;
        } else { // agent mode
          this.controls.stepping = true;
        }
      }
    },
    failed: function (newfailed) {
      if (newfailed) {
        this.controls.play = false;
        if (this.selectedPlayer.socket) { 
          this.selectedPlayer.socket.close();
          this.selectedPlayer.socket = null;
        }
        if (this.controls.animation.id) {
          clearInterval(this.controls.animation.id);
          this.controls.animation.id = null;
        }
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
    },
    "controls.stepping": function (newstepping, oldstepping) {
      if (this.controls.play) {
        if (!newstepping) {
          if (!this.controls.animation.id) { this.nextAgentStep(); }
        }
      }
    }
  },
  methods: {
    getMazeViewBox: function (row, col) {
      return [
        0, 0, 
        col * this.mazeSettings.unit + Math.max(col + 1, 0) * this.mazeSettings.gap, 
        row * this.mazeSettings.unit + Math.max(row + 1, 0) * this.mazeSettings.gap
      ];
    },
    getMazePadLoc: function (row, col) {
      let locs = [];
      [...Array(col).keys()].forEach((cval,cidx,carr) => {
        [...Array(row).keys()].forEach((rval,ridx,rarr) => {
          locs.push([cval * this.mazeSettings.unit + Math.max(cval + 1, 0) * this.mazeSettings.gap, rval * this.mazeSettings.unit + Math.max(rval + 1, 0) * this.mazeSettings.gap]);
        });
      });
      return locs;
    },
    getSnakeColor: function (fullLength, index) {
      return Math.ceil((fullLength-index)/fullLength *10)*10;
    },
    getSnakeDotDirs: function (locations, firstDir) {
      return locations.map((val,idx,arr) => {
        if (idx == 0) {
          return firstDir;
        } else {
          let delta = JSON.stringify([arr[idx-1][0] - val[0], arr[idx-1][1] - val[1]]);
          return this.allDirs[ this.dirOperations.map(x => JSON.stringify(x)).indexOf(delta) ];
        }
      });
    },
    initialiseGame: function () {
      this.controls.play = false;
      this.moveDir = "e";
      this.setSnakeInitialLocations();
      this.foodLocations.splice(0, this.foodLocations.length);
      [...Array(this.settings.saved.foodNumber).keys()].forEach(() => this.generateFoodLocation());
      this.snakeLength = this.settings.saved.startLength;
      this.failed = false;
      this.failedFace = Math.floor(Math.random() * this.numberOfFailedFace);
      if (this.selectedPlayer.socket) { 
        this.selectedPlayer.socket.close();
        this.selectedPlayer.socket = null;
      }
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
    saveSettings: function () { 
      this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed); 
      this.initialiseGame();
    },
    discardSettings: function () { this.settings.displayed = Object.assign({}, this.settings.displayed, this.settings.saved); },
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
    },
    getPlayerList: function () {
      let req = new Request("./get-player-list");
      fetch(req)
      .then(r => r.json())
      .then(r => { this.playerList = r.content; })
      .then(() => {
        if (!this.playerList.map(it => it.folder).includes(this.selectedPlayer.folder)) this.selectedPlayer.folder = this.playerList[0].folder;
      });
    },
    initiateAgent: function () {
      this.selectedPlayer.socket = new WebSocket(`ws://${location.host}/select-player/${this.selectedPlayer.folder}`);
      this.selectedPlayer.socket.onopen = (ev) => {
        this.selectedPlayer.setup = {};
        this.selectedPlayer.states = [];
        this.selectedPlayer.solutions = [];
        this.selectedPlayer.searchTrees = [];
      };
      this.selectedPlayer.socket.onclose = (ev) => {
        this.selectedPlayer.socket = null;
      };
      this.selectedPlayer.socket.onmessage = (ev) => {
        let data = JSON.parse(ev.data);
        if (data.err) {
          this.logs.push(data.data);
        } else if (data.purpose == "player check") {
          if (data.err) { this.logs.push(data.data); }
          else { this.logs.push(`Player ${data.data.name} module is available`); }
          this.selectedPlayer.setup = {
            maze_size: [this.settings.saved.mazeRow, this.settings.saved.mazeCol],
            static_snake_length: this.settings.saved.staticLength
          };
          ev.target.send(JSON.stringify({
            purpose: "setup",
            data: this.selectedPlayer.setup
          }));
        } else if (data.purpose == "initiation") {
          if (data.err) { this.logs.push(data.data); }
          else { 
            this.logs.push(`Player ${data.data.name} is initiated`); 
            if (!this.controls.stepping) { // auto progression
              this.nextAgentStep();
            }
          }
        } else if (data.purpose == "init execution") {
          this.logs.push(data.data);
        } else if (data.purpose == "notification") {
          this.logs.push(data.data);
        } else if (data.purpose == "solution") {
          this.logs.push("Solution returned");
          this.selectedPlayer.solutions.push(data.data.solution);
          this.selectedPlayer.searchTrees.push(data.data.search_tree);
          // show animation
          this.showAgentSolution(this.selectedPlayer.solutions[this.selectedPlayer.solutions.length-1]);
        }
      }
    },
    nextAgentStep: function () {
      if (this.selectedPlayer.socket) {
        this.selectedPlayer.states.push({
          snake_locations: JSON.parse(JSON.stringify(this.snakeLocations)),
          current_direction: this.moveDir,
          food_locations: JSON.parse(JSON.stringify(this.foodLocations))
        });
        this.selectedPlayer.socket.send(JSON.stringify({
          purpose: "next step",
          data: this.selectedPlayer.states[this.selectedPlayer.states.length - 1]
        }));
      }
    },
    showAgentSolution: function (solution) {
      // counter for solution
      let solCounter = 0;
      // initiate animation timer to move snake
      this.controls.animation.id = setInterval(
        () => {
          this.moveDir = solution[solCounter];
          this.moveSnake();
          solCounter += 1;
          if (solCounter >= solution.length) { 
            clearInterval(this.controls.animation.id); 
            this.controls.animation.id = null;
            if (!this.controls.stepping) {
              this.nextAgentStep();
            }
          }
        }
        , 1000/this.controls.animation.current);
    }
  }
});