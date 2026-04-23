(function () {
  var AOC = window.AOC = window.AOC || {};

  function structuredMode(id) {
    return {
      id: id,
      supportsWinLose: true,
      supportsGameLength: true,
      supportsHardFailure: true,
      supportsStatCaps: false,
      freePlay: false
    };
  }

  AOC.modeRegistry = {
    modes: {
      guided: structuredMode("guided"),
      wealth: structuredMode("wealth"),
      conservation: structuredMode("conservation"),
      community: structuredMode("community"),
      survival: structuredMode("survival"),
      education: structuredMode("education"),
      sandbox: {
        id: "sandbox",
        supportsWinLose: false,
        supportsGameLength: false,
        supportsHardFailure: false,
        supportsStatCaps: false,
        freePlay: true
      }
    },

    getModeId: function (mode) {
      return mode && mode.id ? mode.id : "guided";
    },

    getRules: function (mode) {
      var modeId = this.getModeId(mode);
      return this.modes[modeId] || this.modes.guided;
    },

    supportsWinLose: function (mode) {
      return !!this.getRules(mode).supportsWinLose;
    },

    supportsGameLength: function (mode) {
      return !!this.getRules(mode).supportsGameLength;
    },

    supportsHardFailure: function (mode) {
      return !!this.getRules(mode).supportsHardFailure;
    },

    supportsStatCaps: function (mode) {
      return !!this.getRules(mode).supportsStatCaps;
    },

    isFreePlay: function (mode) {
      return !!this.getRules(mode).freePlay;
    }
  };
}());
