var vm = new Vue({
  el: "#app",
  data: {
    controls: {
      play: false,
      manual: true,
      stepping: true
    },
    settings: {
      displayed: {
        mazeRow: 10,
        mazeCol: 10,
        staticLength: true,
        startLength: 1,
        foodNumber: 1
      },
      saved: {}
    },
    logs: [
      "log test log test log test log test log test log test log test ",
      "log test",
      "log test",
      "log test",
      "log test",
      "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test",
      // "log test"
    ],
    accPoints: 0,
    playerList: [{
      value: "",
      label: ""
    }],
    selectedPlayer: "",
  },
  computed: {
    settingsModified: function () {
      return JSON.stringify(this.settings.displayed) !== JSON.stringify(this.settings.saved);
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
  },
  mounted: function () {
    this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed);
  },
  methods: {
    reset: function () {
      console.log("resetting");
    },
    showtrees: function () {
      console.log("showing search trees");
    },
    saveSettings: function () { this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed); },
    discardSettings: function () { this.settings.displayed = Object.assign({}, this.settings.displayed, this.settings.saved); },
    nextStep: function () {
      console.log("next step");
    }
  }
});