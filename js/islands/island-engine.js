(function () {
  var AOC = window.AOC = window.AOC || {};

  function cloneStats(stats) {
    return {
      money: stats.money || 0,
      environment: stats.environment || 0,
      trust: stats.trust || 0
    };
  }

  function pickRandom(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function getIslandId(stateOrIsland) {
    if (!stateOrIsland) {
      return "grassland";
    }
    if (stateOrIsland.selectedIsland) {
      return stateOrIsland.selectedIsland.id || "grassland";
    }
    return stateOrIsland.id || "grassland";
  }

  var islandConfigs = {
    grassland: {
      id: "grassland",
      name: "Grassland Island",
      shortDescription: "Balanced / Beginner Friendly",
      description: "A lush and peaceful island with rich soil and steady growth. Perfect for learning and long-term planning.",
      theme: "grassland",
      difficulty: "Beginner",
      baseStats: { money: 1000, environment: 25, trust: 25 },
      startingStats: { money: 0, environment: 0, trust: 0 },
      goal: "Keep all systems stable and growing. Build a thriving, balanced community.",
      winConditionText: "Keep all systems stable and growing. Build a thriving, balanced community.",
      loseConditionText: "Neglecting one system can weaken the island over time.",
      terrainStages: [
        { min: 76, terrain: "grassland-thriving", label: "Thriving Grassland", message: "Bright grass, clean water, and full vegetation show strong recovery." },
        { min: 26, terrain: "grassland-healthy", label: "Healthy Grassland", message: "The island is green, resilient, and steadily growing." },
        { min: 1, terrain: "grass", label: "Stable Grassland", message: "The grassland is holding steady, though it still needs care." },
        { min: -49, terrain: "grassland-struggling", label: "Struggling Grassland", message: "Dry grass, weak trees, and murky water show environmental stress." },
        { min: -999, terrain: "grassland-dead", label: "Dead Grassland", message: "The land is brown and brittle, with dry waterbeds and little visible life." }
      ],
      positiveObjects: {
        environment: ["tree", "bush", "flower", "water"],
        trust: ["market", "bush", "person"],
        money: ["house", "market"]
      },
      initialTerrain: {
        "dirt-path": [2, 8, 14, 20, 26, 32],
        water: [4, 5, 11, 17],
        rock: [28, 29, 34, 35]
      },
      fixedTerrain: [2, 4, 5, 8, 11, 14, 17, 20, 26, 28, 29, 32, 34, 35],
      initialObjects: [
        { index: 0, object: "tree", stage: 1 },
        { index: 6, object: "flower", stage: 1 },
        { index: 10, object: "tree", stage: 1 },
        { index: 13, object: "bush", stage: 1 },
        { index: 21, object: "house", stage: 1 },
        { index: 22, object: "market", stage: 1 },
        { index: 24, object: "bush", stage: 1 },
        { index: 27, object: "tree", stage: 1 }
      ],
      damageOverlay: "crack"
    },
    desert: {
      id: "desert",
      name: "Desert Island",
      shortDescription: "Restore a dry island into a living ecosystem.",
      description: "The land begins dry and damaged. Your choices can bring water, shade, and life back over time.",
      theme: "desert",
      difficulty: "Medium",
      startingStats: { money: 0, environment: -125, trust: 0 },
      goal: "Restore the ecosystem while keeping enough budget and trust to continue.",
      winConditionText: "Aim for Environment 75+, Money 0+, and Trust 50+ by the end.",
      loseConditionText: "Restoration fails if the final year ends with severe environmental damage or social collapse.",
      terrainStages: [
        { min: 75, terrain: "lush", label: "Desert Oasis", message: "The desert has become a living oasis." },
        { min: 25, terrain: "grass", label: "Green Shoots", message: "Grass and small life are returning." },
        { min: -50, terrain: "dirt", label: "Cracked Earth", message: "The ground is fragile, but recovery is possible." },
        { min: -999, terrain: "sand", label: "Dry Sand", message: "The island is dry, damaged, and waiting for care." }
      ],
      positiveObjects: {
        environment: ["water", "tree", "bush"],
        trust: ["market", "bush"],
        money: ["shelter", "market"]
      },
      initialTerrain: {
        "dirt-path": [1, 7, 13, 19, 25, 31],
        water: [15, 16, 21, 22],
        rock: [4, 5, 10, 29, 35]
      },
      fixedTerrain: [1, 4, 5, 7, 10, 13, 15, 16, 19, 21, 22, 25, 29, 31, 35],
      initialObjects: [
        { index: 6, object: "tree", stage: 1 },
        { index: 14, object: "bush", stage: 1 },
        { index: 20, object: "shelter", stage: 1 },
        { index: 27, object: "market", stage: 1 },
        { index: 32, object: "bush", stage: 1 }
      ],
      damageOverlay: "crack"
    },
    volcanic: {
      id: "volcanic",
      name: "Volcanic Island",
      shortDescription: "A risky island shaped by heat, stone, and resilience.",
      description: "A rugged volcanic world where resources can grow quickly, but instability creates sharper consequences.",
      theme: "volcanic",
      difficulty: "Hard",
      startingStats: { money: 150, environment: -35, trust: -5 },
      goal: "Turn a dangerous volcanic island into a safe, thriving community.",
      winConditionText: "Finish with strong budget reserves and enough trust to manage the island's risks.",
      loseConditionText: "Severe environmental collapse or public breakdown can overwhelm the island.",
      terrainStages: [
        { min: 60, terrain: "basalt-lush", label: "Living Basalt", message: "Life is growing over the dark volcanic stone." },
        { min: 20, terrain: "basalt", label: "Cooling Stone", message: "The island is stabilizing around the old lava fields." },
        { min: -50, terrain: "ash", label: "Ash Fields", message: "Ash and heat still shape daily life." },
        { min: -999, terrain: "lava", label: "Lava Scars", message: "The volcanic landscape is unstable and dangerous." }
      ],
      positiveObjects: {
        environment: ["tree", "bush"],
        trust: ["shelter", "bush"],
        money: ["market", "shelter"]
      },
      initialTerrain: {
        lava: [4, 5, 10, 11],
        basalt: [1, 2, 7, 8, 13, 19, 25],
        rock: [28, 29, 34, 35]
      },
      fixedTerrain: [1, 2, 4, 5, 7, 8, 10, 11, 13, 19, 25, 28, 29, 34, 35],
      initialObjects: [
        { index: 6, object: "shelter", stage: 1 },
        { index: 14, object: "bush", stage: 1 },
        { index: 20, object: "market", stage: 1 },
        { index: 24, object: "tree", stage: 1 },
        { index: 32, object: "bush", stage: 1 }
      ],
      damageOverlay: "heat"
    }
  };

  AOC.islands = {
    configs: islandConfigs,

    list: function () {
      return [
        islandConfigs.grassland,
        islandConfigs.desert,
        islandConfigs.volcanic
      ];
    },

    getConfig: function (stateOrIsland) {
      return islandConfigs[getIslandId(stateOrIsland)] || islandConfigs.grassland;
    },

    hasConfig: function (stateOrIsland) {
      return !!islandConfigs[getIslandId(stateOrIsland)];
    },

    getStage: function (state) {
      var config = this.getConfig(state);
      var stages = config.terrainStages;
      var env = state.stats.environment;
      var i;

      for (i = 0; i < stages.length; i += 1) {
        if (env >= stages[i].min) {
          return stages[i];
        }
      }
      return stages[stages.length - 1];
    },

    getTerrain: function (state) {
      return this.getStage(state).terrain;
    },

    getStartingStats: function (island) {
      return cloneStats(this.getConfig(island).startingStats);
    },

    createGrid: function (state) {
      var size = 6;
      var cells = [];
      var config = this.getConfig(state);
      var terrain = this.getTerrain(state);
      var i;
      var terrainType;
      var indexes;
      var item;
      var fixed;

      for (i = 0; i < size * size; i += 1) {
        cells.push({
          id: i,
          terrain: terrain,
          fixedTerrain: false,
          object: null,
          objectRoot: null,
          objectStage: 0,
          overlay: "",
          changed: true
        });
      }

      if (config.initialTerrain) {
        for (terrainType in config.initialTerrain) {
          if (Object.prototype.hasOwnProperty.call(config.initialTerrain, terrainType)) {
            indexes = config.initialTerrain[terrainType];
            for (i = 0; i < indexes.length; i += 1) {
              if (cells[indexes[i]]) {
                cells[indexes[i]].terrain = terrainType;
              }
            }
          }
        }
      }

      fixed = config.fixedTerrain || [];
      for (i = 0; i < fixed.length; i += 1) {
        if (cells[fixed[i]]) {
          cells[fixed[i]].fixedTerrain = true;
        }
      }

      if (config.initialObjects) {
        for (i = 0; i < config.initialObjects.length; i += 1) {
          item = config.initialObjects[i];
          if (cells[item.index]) {
            cells[item.index].object = item.object;
            cells[item.index].objectRoot = null;
            cells[item.index].objectStage = item.stage || 0;
          }
        }
      }

      return {
        size: size,
        islandType: config.id,
        cells: cells,
        lastEnvironmentTerrain: terrain,
        mutationCount: 0
      };
    },

    getNeighborIndexes: function (grid, index) {
      var size = grid.size;
      var row = Math.floor(index / size);
      var col = index % size;
      var neighbors = [];

      if (row > 0) neighbors.push(index - size);
      if (row < size - 1) neighbors.push(index + size);
      if (col > 0) neighbors.push(index - 1);
      if (col < size - 1) neighbors.push(index + 1);
      return neighbors;
    },

    updateTerrain: function (state) {
      var grid = this.ensureGrid(state);
      var terrain = this.getTerrain(state);
      var i;

      if (grid.lastEnvironmentTerrain === terrain) {
        return;
      }

      grid.lastEnvironmentTerrain = terrain;
      for (i = 0; i < grid.cells.length; i += 1) {
        if (!grid.cells[i].fixedTerrain) {
          grid.cells[i].terrain = terrain;
          grid.cells[i].changed = true;
        }
      }
    },

    ensureGrid: function (state) {
      var islandId = this.getConfig(state).id;
      if (!state.islandGrid || !state.islandGrid.cells || state.islandGrid.islandType !== islandId) {
        state.islandGrid = this.createGrid(state);
      }
      return state.islandGrid;
    },

    findCellForObject: function (state, preferredObjects) {
      var grid = this.ensureGrid(state);
      var clustered = [];
      var empty = [];
      var i;
      var j;
      var neighbors;
      var cell;

      for (i = 0; i < grid.cells.length; i += 1) {
        cell = grid.cells[i];
        if (cell.object || cell.objectRoot != null) {
          continue;
        }
        empty.push(cell);
        neighbors = this.getNeighborIndexes(grid, i);
        for (j = 0; j < neighbors.length; j += 1) {
          if (preferredObjects.indexOf(grid.cells[neighbors[j]].object) !== -1) {
            clustered.push(cell);
            break;
          }
        }
      }

      return clustered.length ? pickRandom(clustered) : (empty.length ? pickRandom(empty) : null);
    },

    clearFootprint: function (grid, rootIndex) {
      var i;

      for (i = 0; i < grid.cells.length; i += 1) {
        if (grid.cells[i].objectRoot === rootIndex && i !== rootIndex) {
          grid.cells[i].object = null;
          grid.cells[i].objectRoot = null;
          grid.cells[i].objectStage = 0;
          grid.cells[i].changed = true;
        }
      }
    },

    reserveLargeObject: function (grid, rootIndex, objectType) {
      var size = grid.size;
      var col = rootIndex % size;
      var indexes;
      var i;

      if (col >= size - 1 || rootIndex + size + 1 >= grid.cells.length) {
        return false;
      }

      indexes = [rootIndex, rootIndex + 1, rootIndex + size, rootIndex + size + 1];
      for (i = 0; i < indexes.length; i += 1) {
        if (indexes[i] !== rootIndex && (grid.cells[indexes[i]].object || grid.cells[indexes[i]].objectRoot != null)) {
          return false;
        }
      }

      for (i = 1; i < indexes.length; i += 1) {
        grid.cells[indexes[i]].object = objectType;
        grid.cells[indexes[i]].objectRoot = rootIndex;
        grid.cells[indexes[i]].objectStage = 2;
        grid.cells[indexes[i]].overlay = "";
        grid.cells[indexes[i]].changed = true;
      }
      return true;
    },

    placeOrGrowObject: function (state, objectType) {
      var grid = this.ensureGrid(state);
      var candidates = [];
      var i;
      var cell;

      for (i = 0; i < grid.cells.length; i += 1) {
        cell = grid.cells[i];
        if (cell.object === objectType && (cell.objectRoot == null || cell.objectRoot === cell.id) && cell.objectStage < 2) {
          candidates.push(cell);
        }
      }

      if (candidates.length) {
        cell = pickRandom(candidates);
        this.clearFootprint(grid, cell.id);
        cell.objectStage += 1;
        if (cell.objectStage >= 2) {
          this.reserveLargeObject(grid, cell.id, objectType);
        }
        cell.overlay = "";
        cell.changed = true;
        grid.mutationCount += 1;
        return;
      }

      cell = this.findCellForObject(state, [objectType]);
      if (cell) {
        cell.object = objectType;
        cell.objectRoot = null;
        cell.objectStage = 0;
        cell.overlay = "";
        cell.changed = true;
        grid.mutationCount += 1;
      }
    },

    damageGrid: function (state, severity) {
      var grid = this.ensureGrid(state);
      var config = this.getConfig(state);
      var candidates = [];
      var i;
      var cell;

      for (i = 0; i < grid.cells.length; i += 1) {
        if (grid.cells[i].objectRoot == null && (grid.cells[i].object || grid.cells[i].terrain !== "sand")) {
          candidates.push(grid.cells[i]);
        }
      }
      if (!candidates.length) return;

      cell = pickRandom(candidates);
      if (cell.object && severity >= 2) {
        this.clearFootprint(grid, cell.objectRoot == null ? cell.id : cell.objectRoot);
        if (cell.objectStage > 0) {
          cell.objectStage -= 1;
        } else {
          cell.object = null;
          cell.objectRoot = null;
        }
      }
      cell.overlay = config.damageOverlay || "crack";
      cell.changed = true;
      grid.mutationCount += 1;
    },

    mutate: function (state, effects) {
      var config = this.getConfig(state);
      var environment = effects.environment || 0;
      var trust = effects.trust || 0;
      var money = effects.money || 0;

      this.ensureGrid(state);
      this.updateTerrain(state);

      if (environment > 0) {
        this.placeOrGrowObject(state, pickRandom(config.positiveObjects.environment));
      }
      if (environment >= 15) {
        this.placeOrGrowObject(state, pickRandom(config.positiveObjects.environment));
      }
      if (trust > 0) {
        this.placeOrGrowObject(state, pickRandom(config.positiveObjects.trust));
      }
      if (money > 0 || trust >= 12) {
        this.placeOrGrowObject(state, pickRandom(config.positiveObjects.money));
      }
      if (environment < 0) {
        this.damageGrid(state, Math.abs(environment) >= 15 ? 2 : 1);
      }
      if (trust < 0 || money < 0) {
        this.damageGrid(state, Math.abs(trust) >= 12 || Math.abs(money) >= 120 ? 2 : 1);
      }
    }
  };
}());
