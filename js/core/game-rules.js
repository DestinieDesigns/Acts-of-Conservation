(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.rules = {
    getModeId: function (mode) {
      return AOC.modeRegistry ? AOC.modeRegistry.getModeId(mode) : (mode && mode.id ? mode.id : "guided");
    },

    getModeRules: function (mode) {
      return AOC.modeRegistry ? AOC.modeRegistry.getRules(mode) : {
        supportsWinLose: true,
        supportsGameLength: true,
        supportsHardFailure: true,
        supportsStatCaps: false,
        freePlay: false
      };
    },

    modeSupportsWinLose: function (mode) {
      return this.getModeRules(mode).supportsWinLose;
    },

    modeSupportsGameLength: function (mode) {
      return this.getModeRules(mode).supportsGameLength;
    },

    modeSupportsHardFailure: function (mode) {
      return this.getModeRules(mode).supportsHardFailure;
    },

    modeSupportsStatCaps: function (mode) {
      return this.getModeRules(mode).supportsStatCaps;
    },

    isFreePlayMode: function (mode) {
      return this.getModeRules(mode).freePlay;
    },

    getModeStartingStats: function (mode) {
      var base = (mode && mode.startingStats) || AOC.config.startingStats;
      return {
        money: base.money,
        environment: base.environment,
        trust: base.trust
      };
    },

    getStartingStatsPreview: function (mode, character, island) {
      var base = this.getModeStartingStats(mode);
      var bonus = character && character.bonuses ? character.bonuses : { money: 0, environment: 0, trust: 0 };
      var islandStats = island && island.startingStats ? island.startingStats : { money: 0, environment: 0, trust: 0 };

      return {
        money: base.money + (islandStats.money || 0) + (bonus.money || 0),
        environment: base.environment + (islandStats.environment || 0) + (bonus.environment || 0),
        trust: base.trust + (islandStats.trust || 0) + (bonus.trust || 0)
      };
    },

    getEnvironmentStage: function (state) {
      var env = state.stats.environment;
      var islandStage;

      if (AOC.islands) {
        islandStage = AOC.islands.getStage(state);
        return {
          id: islandStage.terrain,
          label: islandStage.label,
          message: islandStage.message
        };
      }

      if (env >= 76) return { id: "paradise", label: "Thriving Island", message: "The island feels alive and resilient." };
      if (env >= 51) return { id: "lush", label: "Healthy Ecosystem", message: "Habitats are strong and recovery is visible." };
      if (env >= 26) return { id: "growing", label: "Stable Nature", message: "The ecosystem is holding steady." };
      if (env >= 1) return { id: "grass", label: "Stressed", message: "Nature is under pressure but still recovering." };
      if (env >= -49) return { id: "cracked", label: "Damaged", message: "Environmental damage is spreading." };
      return { id: "dead", label: "Severe Damage", message: "The island needs urgent ecological repair." };
    },

    getGridTerrainForEnvironment: function (environment) {
      if (AOC.islands) {
        return AOC.islands.getTerrain({ stats: { environment: environment }, selectedIsland: null });
      }
      if (environment >= 60) return "lush";
      if (environment >= 20) return "grass";
      if (environment >= -25) return "dirt";
      return "sand";
    },

    createIslandGrid: function (state) {
      if (AOC.islands) {
        return AOC.islands.createGrid(state);
      }
      var size = 6;
      var cells = [];
      var terrain = this.getGridTerrainForEnvironment(state.stats.environment);
      var i;

      for (i = 0; i < size * size; i += 1) {
        cells.push({
          id: i,
          terrain: terrain,
          object: null,
          objectRoot: null,
          objectStage: 0,
          overlay: "",
          changed: true
        });
      }

      return {
        size: size,
        cells: cells,
        lastEnvironmentTerrain: terrain,
        mutationCount: 0
      };
    },

    ensureIslandGrid: function (state) {
      if (AOC.islands) {
        return AOC.islands.ensureGrid(state);
      }
      if (!state.islandGrid || !state.islandGrid.cells) {
        state.islandGrid = this.createIslandGrid(state);
      }
      return state.islandGrid;
    },

    updateIslandGridTerrain: function (state) {
      if (AOC.islands) {
        AOC.islands.updateTerrain(state);
        return;
      }
      var grid = this.ensureIslandGrid(state);
      var terrain = this.getGridTerrainForEnvironment(state.stats.environment);
      var i;

      if (grid.lastEnvironmentTerrain === terrain) {
        return;
      }

      grid.lastEnvironmentTerrain = terrain;
      for (i = 0; i < grid.cells.length; i += 1) {
        grid.cells[i].terrain = terrain;
        grid.cells[i].changed = true;
      }
    },

    getNeighborIndexes: function (grid, index) {
      if (AOC.islands) {
        return AOC.islands.getNeighborIndexes(grid, index);
      }
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

    findGridCellForObject: function (state, preferredObjects) {
      if (AOC.islands) {
        return AOC.islands.findCellForObject(state, preferredObjects);
      }
      var grid = this.ensureIslandGrid(state);
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

      if (clustered.length) {
        return this.pickRandomValue(clustered);
      }
      if (empty.length) {
        return this.pickRandomValue(empty);
      }
      return null;
    },

    clearGridObjectFootprint: function (grid, rootIndex) {
      if (AOC.islands) {
        AOC.islands.clearFootprint(grid, rootIndex);
        return;
      }
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

    reserveLargeGridObject: function (grid, rootIndex, objectType) {
      if (AOC.islands) {
        return AOC.islands.reserveLargeObject(grid, rootIndex, objectType);
      }
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

    placeOrGrowGridObject: function (state, objectType) {
      if (AOC.islands) {
        AOC.islands.placeOrGrowObject(state, objectType);
        return;
      }
      var grid = this.ensureIslandGrid(state);
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
        cell = this.pickRandomValue(candidates);
        this.clearGridObjectFootprint(grid, cell.id);
        cell.objectStage += 1;
        if (cell.objectStage >= 2) {
          this.reserveLargeGridObject(grid, cell.id, objectType);
        }
        cell.overlay = "";
        cell.changed = true;
        grid.mutationCount += 1;
        return;
      }

      cell = this.findGridCellForObject(state, [objectType]);
      if (cell) {
        cell.object = objectType;
        cell.objectRoot = null;
        cell.objectStage = 0;
        cell.overlay = "";
        cell.changed = true;
        grid.mutationCount += 1;
      }
    },

    damageIslandGrid: function (state, severity) {
      if (AOC.islands) {
        AOC.islands.damageGrid(state, severity);
        return;
      }
      var grid = this.ensureIslandGrid(state);
      var candidates = [];
      var i;
      var cell;

      for (i = 0; i < grid.cells.length; i += 1) {
        if (grid.cells[i].objectRoot == null && (grid.cells[i].object || grid.cells[i].terrain !== "sand")) {
          candidates.push(grid.cells[i]);
        }
      }

      if (!candidates.length) {
        return;
      }

      cell = this.pickRandomValue(candidates);
      if (cell.object && severity >= 2) {
          this.clearGridObjectFootprint(grid, cell.objectRoot == null ? cell.id : cell.objectRoot);
          if (cell.objectStage > 0) {
            cell.objectStage -= 1;
          } else {
            cell.object = null;
            cell.objectRoot = null;
          }
      } else if (cell.terrain === "lush") {
        cell.terrain = "grass";
      } else if (cell.terrain === "grass") {
        cell.terrain = "dirt";
      } else {
        cell.terrain = "sand";
      }
      cell.overlay = "crack";
      cell.changed = true;
      grid.mutationCount += 1;
    },

    mutateIslandGrid: function (state, effects) {
      if (AOC.islands) {
        AOC.islands.mutate(state, effects || {});
        return;
      }
      var environment = effects.environment || 0;
      var trust = effects.trust || 0;
      var money = effects.money || 0;

      this.ensureIslandGrid(state);
      this.updateIslandGridTerrain(state);

      if (environment > 0) {
        this.placeOrGrowGridObject(state, "tree");
        if (environment >= 15) {
          this.placeOrGrowGridObject(state, "water");
        }
      }
      if (trust > 0) {
        this.placeOrGrowGridObject(state, "person");
      }
      if (money > 0 || trust >= 12) {
        this.placeOrGrowGridObject(state, "building");
      }
      if (environment < 0) {
        this.damageIslandGrid(state, Math.abs(environment) >= 15 ? 2 : 1);
      }
      if (trust < 0 || money < 0) {
        this.damageIslandGrid(state, Math.abs(trust) >= 12 || Math.abs(money) >= 120 ? 2 : 1);
      }
    },

    getModeModifiers: function (mode) {
      return (mode && mode.modifiers) || {};
    },

    scaleEffectValue: function (value, positiveMultiplier, negativeMultiplier) {
      if (value > 0) {
        return Math.round(value * (positiveMultiplier || 1));
      }
      if (value < 0) {
        return Math.round(value * (negativeMultiplier || 1));
      }
      return 0;
    },

    applyModeMultipliers: function (effects, modifiers) {
      return {
        money: this.scaleEffectValue(effects.money || 0, modifiers.moneyGainMultiplier, modifiers.moneyLossMultiplier),
        environment: this.scaleEffectValue(effects.environment || 0, modifiers.environmentGainMultiplier, modifiers.environmentLossMultiplier),
        trust: this.scaleEffectValue(effects.trust || 0, modifiers.trustGainMultiplier, modifiers.trustLossMultiplier)
      };
    },

    applyStatEffects: function (stats, effects) {
      stats.money += effects.money || 0;
      stats.environment += effects.environment || 0;
      stats.trust += effects.trust || 0;
    },

    applyModeStatEffects: function (state, effects) {
      this.applyStatEffects(state.stats, effects);
      if (this.modeSupportsStatCaps(state.selectedMode)) {
        state.stats.money = AOC.utils.clampStat(state.stats.money);
        state.stats.environment = AOC.utils.clampStat(state.stats.environment);
        state.stats.trust = AOC.utils.clampStat(state.stats.trust);
      }
    },

    pickRandomValue: function (values) {
      return values[Math.floor(Math.random() * values.length)];
    },

    findTileIndexesByType: function (board, tileType) {
      var indexes = [];
      var plots = board && board.plots ? board.plots : [];
      var i;

      for (i = 0; i < plots.length; i += 1) {
        if ((plots[i].type || "normal") === tileType) {
          indexes.push(i);
        }
      }

      return indexes;
    },

    handleTile: function (tile, state, board, options) {
      var tileType = tile && tile.type ? tile.type : "normal";
      var change;
      var crisisIndexes;
      var destination;
      var crisisEffects;

      options = options || {};

      if (!tile || tileType === "normal") {
        return { type: "normal", effects: { money: 0, environment: 0, trust: 0 } };
      }

      if (tileType === "start") {
        return {
          type: "start",
          title: "Start Bonus",
          message: "You landed on Start and received +250 available budget.",
          feedbackText: "+250 Budget",
          effects: { money: 250, environment: 0, trust: 0 }
        };
      }

      if (tileType === "community") {
        change = this.pickRandomValue([-20, -10, -5, 5, 10, 20]);
        return {
          type: "community",
          title: "Community Boost",
          message: change >= 0 ? "Community support grew at this stop." : "Community trust took a hit at this stop.",
          feedbackText: (change > 0 ? "+" : "") + change + " Trust",
          effects: { money: 0, environment: 0, trust: change }
        };
      }

      if (tileType === "environment") {
        change = this.pickRandomValue([-25, -15, -10, -5, 5]);
        return {
          type: "environment",
          title: "Environment Crisis",
          message: change >= 0 ? "A small recovery effort helped nature rebound." : "Environmental pressure worsened here.",
          feedbackText: (change > 0 ? "+" : "") + change + " Environment",
          effects: { money: 0, environment: change, trust: 0 }
        };
      }

      if (tileType === "crisis") {
        crisisEffects = [
          { money: -120, environment: -10, trust: 0 },
          { money: -80, environment: 0, trust: -10 },
          { money: 0, environment: -20, trust: -5 },
          { money: -150, environment: -8, trust: -8 }
        ];
        change = this.pickRandomValue(crisisEffects);
        return {
          type: "crisis",
          title: "Crisis Tile",
          message: "A sudden island crisis created immediate pressure.",
          feedbackText: "Crisis",
          effects: change
        };
      }

      if (tileType === "goToCrisis") {
        if (options.isTeleport) {
          return { type: "goToCrisis", effects: { money: 0, environment: 0, trust: 0 } };
        }

        crisisIndexes = this.findTileIndexesByType(board, "crisis");
        if (!crisisIndexes.length) {
          return { type: "goToCrisis", effects: { money: 0, environment: 0, trust: 0 } };
        }

        destination = this.pickRandomValue(crisisIndexes);
        return {
          type: "goToCrisis",
          title: "Go To Crisis",
          message: "This tile sends you directly to a crisis space in the same turn.",
          feedbackText: "Go to Crisis",
          teleportTo: destination,
          effects: { money: 0, environment: 0, trust: 0 }
        };
      }

      return { type: tileType, effects: { money: 0, environment: 0, trust: 0 } };
    },

    pickScenarioIndex: function (state, plotIndex) {
      var scenarioCount = AOC.data.plots[plotIndex].scenarios.length;
      var previous = state.lastScenarioByTile[plotIndex];
      var nextIndex;

      if (scenarioCount <= 1) {
        state.lastScenarioByTile[plotIndex] = 0;
        return 0;
      }

      nextIndex = Math.floor(Math.random() * scenarioCount);
      if (nextIndex === previous) {
        nextIndex = (nextIndex + 1) % scenarioCount;
      }
      state.lastScenarioByTile[plotIndex] = nextIndex;
      return nextIndex;
    },

    pickOutcomeIndex: function (state, choice) {
      var previous = state.lastOutcomeByChoice[choice.id];
      var nextIndex;

      if (!choice.outcomes || choice.outcomes.length <= 1) {
        state.lastOutcomeByChoice[choice.id] = 0;
        return 0;
      }

      nextIndex = Math.floor(Math.random() * choice.outcomes.length);
      if (nextIndex === previous) {
        nextIndex = (nextIndex + 1) % choice.outcomes.length;
      }
      state.lastOutcomeByChoice[choice.id] = nextIndex;
      return nextIndex;
    },

    resolveChoiceOutcome: function (state, choice) {
      var outcomeIndex = this.pickOutcomeIndex(state, choice);
      var outcome = choice.outcomes[outcomeIndex];
      var modifiers = this.getModeModifiers(state.selectedMode);
      var adjusted = this.applyModeMultipliers(outcome, modifiers);
      var simpleAdjusted = state.simpleMode ? this.applySimpleModeEffects(adjusted) : adjusted;

      return {
        choiceId: choice.id,
        label: choice.label,
        outcomeIndex: outcomeIndex,
        money: simpleAdjusted.money,
        environment: simpleAdjusted.environment,
        trust: simpleAdjusted.trust,
        feedback: outcome.feedback
      };
    },

    applySimpleModeEffects: function (effects) {
      function soften(value) {
        if (value > 0) {
          return Math.max(1, Math.round(value * 0.8));
        }
        if (value < 0) {
          return Math.min(-1, Math.round(value * 0.6));
        }
        return 0;
      }

      return {
        money: soften(effects.money || 0),
        environment: soften(effects.environment || 0),
        trust: soften(effects.trust || 0)
      };
    },

    buildScenarioSummary: function (plot, scenarioObj) {
      return "You've arrived at " + plot.tileName + ". " + scenarioObj.scenario;
    },

    buildDecisionCard: function (plot, scenarioObj) {
      return {
        title: scenarioObj.issueTitle,
        description: scenarioObj.scenario,
        placeLabel: plot.tileName + " - " + plot.locationDescription,
        choices: [scenarioObj.optionA, scenarioObj.optionB]
      };
    },

    getSimpleScenarioText: function (text) {
      return text
        .replace(/environmental/gi, "nature")
        .replace(/community trust/gi, "people's trust")
        .replace(/infrastructure/gi, "shared systems")
        .replace(/ecosystem/gi, "nature")
        .replace(/resilience/gi, "strength")
        .replace(/pollution/gi, "harm")
        .replace(/development/gi, "building");
    },

    pickFinancialEvent: function (state) {
      var total = AOC.data.financialEvents.length;
      var nextIndex;

      if (!total) {
        return null;
      }

      nextIndex = Math.floor(Math.random() * total);
      if (total > 1 && nextIndex === state.lastFinancialEventIndex) {
        nextIndex = (nextIndex + 1) % total;
      }
      state.lastFinancialEventIndex = nextIndex;
      return AOC.data.financialEvents[nextIndex];
    },

    resolveFinancialEvent: function (state) {
      var event = this.pickFinancialEvent(state);
      var modifiers;
      var adjusted;
      var trustCondition;
      var environmentCondition;
      var description;

      if (!event) {
        return null;
      }

      modifiers = this.getModeModifiers(state.selectedMode);
      adjusted = {
        money: this.scaleEffectValue(event.effects.money || 0, modifiers.positiveEventMultiplier, modifiers.negativeEventMultiplier),
        environment: this.scaleEffectValue(event.effects.environment || 0, modifiers.positiveEventMultiplier, modifiers.negativeEventMultiplier),
        trust: this.scaleEffectValue(event.effects.trust || 0, modifiers.positiveEventMultiplier, modifiers.negativeEventMultiplier)
      };
      description = event.description;
      trustCondition = this.getTrustCondition(state.stats.trust);
      environmentCondition = this.getEnvironmentCondition(state.stats.environment);

      if (trustCondition.level <= -50 && (adjusted.money < 0 || adjusted.trust < 0)) {
        adjusted.trust -= 3;
        description += " Public resistance made the situation harder to stabilize.";
      } else if (trustCondition.level >= 51 && (adjusted.money > 0 || adjusted.trust > 0)) {
        adjusted.trust += 3;
        description += " Strong public cooperation helped the island absorb the change.";
      }

      if (environmentCondition.level <= -50 && adjusted.environment < 0) {
        adjusted.environment -= 3;
        adjusted.money -= 5;
        description += " Existing ecological weakness increased the damage and recovery cost.";
      } else if (environmentCondition.level >= 51 && adjusted.environment > 0) {
        adjusted.environment += 2;
        description += " Healthy ecosystems improved the island's ability to recover.";
      }

      return {
        id: event.id,
        title: event.title,
        description: description,
        money: adjusted.money,
        environment: adjusted.environment,
        trust: adjusted.trust
      };
    },

    pickInvestmentOffer: function (state, excludeIds) {
      var pool = [];
      var i;
      var investment;
      var excludeLookup = {};

      excludeIds = excludeIds || [];
      for (i = 0; i < excludeIds.length; i += 1) {
        excludeLookup[excludeIds[i]] = true;
      }

      for (i = 0; i < AOC.data.investments.length; i += 1) {
        investment = AOC.data.investments[i];
        if (!excludeLookup[investment.id]) {
          pool.push(investment);
        }
      }

      if (!pool.length) {
        return null;
      }

      return pool[Math.floor(Math.random() * pool.length)];
    },

    summarizeInvestments: function (investments) {
      var names = [];
      var i;

      if (!investments || !investments.length) {
        return "None yet.";
      }

      for (i = 0; i < investments.length; i += 1) {
        names.push(investments[i].name);
      }

      return names.join(", ");
    },

    summarizeLoan: function (state) {
      if (!state.debtOwed || state.debtOwed <= 0) {
        return "No debt owed.";
      }

      return "Debt Owed: " + Math.round(state.debtOwed) + ". " + this.getDebtPressure(state.debtOwed).label + ".";
    },

    applyAnnualInvestmentEffects: function (state) {
      var notes = [];
      var i;
      var investment;
      var note;

      for (i = 0; i < state.activeInvestments.length; i += 1) {
        investment = state.activeInvestments[i];
        this.applyModeStatEffects(state, investment.annualEffects);
        note = {
          type: "investment",
          title: investment.name,
          description: investment.description,
          money: investment.annualEffects.money,
          environment: investment.annualEffects.environment,
          trust: investment.annualEffects.trust
        };
        notes.push(note);
      }

      return notes;
    },

    getLoanInterestRate: function () {
      return 0.005;
    },

    getLoanTriggerThreshold: function () {
      return 250;
    },

    shouldOfferLoan: function (money) {
      return money <= this.getLoanTriggerThreshold();
    },

    getPromiseTriggerThreshold: function () {
      return 30;
    },

    shouldOfferPromise: function (trust) {
      return trust <= this.getPromiseTriggerThreshold();
    },

    shouldOfferShortcut: function (money, resolvedOption) {
      var riskyDecision = !!(resolvedOption && resolvedOption.money > 0 && resolvedOption.environment < 0);
      return money <= this.getLoanTriggerThreshold() || riskyDecision;
    },

    takeLoan: function (state, amount) {
      state.debtOwed += amount;
      state.stats.money += amount;
      return {
        type: "loan",
        title: "Loan Accepted",
        description: "You gained " + amount + " in available budget and added the same amount to Debt Owed.",
        money: amount,
        environment: 0,
        trust: 0
      };
    },

    takePromise: function (state, promise) {
      state.activePromises.push({
        id: promise.id,
        name: promise.name,
        trustGain: promise.trustGain,
        fulfillmentCost: promise.fulfillmentCost,
        penalty: promise.penalty
      });
      state.stats.trust += promise.trustGain;
      return {
        type: "promise",
        title: "Promise Made",
        description: "You gained " + promise.trustGain + " trust now, but you will need " + promise.fulfillmentCost + " in budget later to keep this promise.",
        money: 0,
        environment: 0,
        trust: promise.trustGain
      };
    },

    takeShortcut: function (state, shortcut) {
      state.activeShortcuts.push({
        id: shortcut.id,
        name: shortcut.name,
        moneyGain: shortcut.moneyGain,
        delayedEnvironmentLoss: shortcut.delayedEnvironmentLoss
      });
      state.stats.money += shortcut.moneyGain;
      return {
        type: "shortcut",
        title: "Shortcut Taken",
        description: "You gained " + shortcut.moneyGain + " in budget now, but environmental damage will land at year end.",
        money: shortcut.moneyGain,
        environment: 0,
        trust: 0
      };
    },

    applyYearEndInterest: function (state) {
      var interest;

      if (state.debtOwed <= 0) {
        state.interestThisYear = 0;
        state.debtAtYearStart = 0;
        return 0;
      }

      state.debtAtYearStart = state.debtOwed;
      interest = state.debtOwed * (state.yearlyRollCount * this.getLoanInterestRate());
      state.interestThisYear = Math.round(interest * 100) / 100;
      state.debtOwed = Math.round((state.debtOwed + state.interestThisYear) * 100) / 100;
      return state.interestThisYear;
    },

    payDebt: function (state, amount) {
      var payment = Math.min(amount, state.stats.money, state.debtOwed);
      payment = Math.max(payment, 0);
      state.stats.money -= payment;
      state.debtOwed = Math.round((state.debtOwed - payment) * 100) / 100;
      return payment;
    },

    getDebtPressure: function (debt) {
      if (debt >= 600) {
        return { label: "Severe Debt Pressure", message: "Debt is now high enough to shape nearly every future planning choice.", tone: "danger", trustPenalty: -10 };
      }
      if (debt >= 300) {
        return { label: "Debt Pressure", message: "Debt is putting visible pressure on future budgets and public confidence.", tone: "warning", trustPenalty: -5 };
      }
      if (debt >= 100) {
        return { label: "Warning", message: "Debt is growing and will need attention before interest builds too far.", tone: "warning", trustPenalty: 0 };
      }
      if (debt > 0) {
        return { label: "Manageable", message: "Debt is still manageable, but unpaid borrowing will keep growing.", tone: "secondary", trustPenalty: 0 };
      }
      return { label: "No Debt", message: "No debt is being carried into the next year.", tone: "positive", trustPenalty: 0 };
    },

    applyDebtPressureEffects: function (state) {
      var pressure = this.getDebtPressure(state.debtOwed);

      if (!pressure.trustPenalty) {
        return null;
      }

      state.stats.trust += pressure.trustPenalty;
      return {
        type: "debt-pressure",
        title: pressure.label,
        description: "Debt that stays too high can weaken public confidence in the island's direction.",
        money: 0,
        environment: 0,
        trust: pressure.trustPenalty
      };
    },

    buildDebtSummary: function (state) {
      var pressure = this.getDebtPressure(state.debtOwed);
      var hasConsequences = !!(
        state.debtOwed > 0 ||
        state.interestThisYear > 0 ||
        state.promiseBudgetPaidThisYear > 0 ||
        state.promiseTrustPenaltyThisYear < 0 ||
        state.shortcutDamageThisYear < 0
      );
      return {
        debtAtStart: Math.round((state.debtAtYearStart || 0) * 100) / 100,
        interest: Math.round((state.interestThisYear || 0) * 100) / 100,
        totalDebt: Math.round((state.debtOwed || 0) * 100) / 100,
        availableBudget: Math.round((state.stats.money || 0) * 100) / 100,
        promiseBudgetPaid: Math.round((state.promiseBudgetPaidThisYear || 0) * 100) / 100,
        promiseTrustPenalty: Math.round((state.promiseTrustPenaltyThisYear || 0) * 100) / 100,
        shortcutDamage: Math.round((state.shortcutDamageThisYear || 0) * 100) / 100,
        pressure: pressure,
        hasConsequences: hasConsequences,
        message: state.simpleMode ?
          (hasConsequences ? "Your choices from earlier in the year are now catching up." : "Nothing extra carried into this year-end review.") :
          (hasConsequences ? "This summary shows how delayed costs from borrowing, promises, and shortcuts shaped the year." : "No delayed consequences were carried into this year-end review.")
      };
    },

    resolveYearEndPromises: function (state) {
      var notes = [];
      var i;
      var promise;

      state.promiseBudgetPaidThisYear = 0;
      state.promiseTrustPenaltyThisYear = 0;

      for (i = 0; i < state.activePromises.length; i += 1) {
        promise = state.activePromises[i];
        if (state.stats.money >= promise.fulfillmentCost) {
          state.stats.money -= promise.fulfillmentCost;
          state.promiseBudgetPaidThisYear += promise.fulfillmentCost;
          notes.push({
            type: "promise-kept",
            title: promise.name + " Fulfilled",
            description: "You spent budget to keep a public promise and protect trust.",
            money: -promise.fulfillmentCost,
            environment: 0,
            trust: 0
          });
        } else {
          state.stats.trust += promise.penalty;
          state.promiseTrustPenaltyThisYear += promise.penalty;
          notes.push({
            type: "promise-broken",
            title: promise.name + " Broken",
            description: "You could not afford to follow through, so public trust dropped harder than it rose before.",
            money: 0,
            environment: 0,
            trust: promise.penalty
          });
        }
      }

      state.activePromises = [];
      return notes;
    },

    resolveYearEndShortcuts: function (state) {
      var notes = [];
      var i;
      var shortcut;

      state.shortcutDamageThisYear = 0;

      for (i = 0; i < state.activeShortcuts.length; i += 1) {
        shortcut = state.activeShortcuts[i];
        state.stats.environment += shortcut.delayedEnvironmentLoss;
        state.shortcutDamageThisYear += shortcut.delayedEnvironmentLoss;
        notes.push({
          type: "shortcut-damage",
          title: shortcut.name + " Cost",
          description: "The environmental shortcut saved money earlier, but the damage appeared at year end.",
          money: 0,
          environment: shortcut.delayedEnvironmentLoss,
          trust: 0
        });
      }

      state.activeShortcuts = [];
      return notes;
    },

    getBudgetWarningLevel: function (money) {
      if (money < -100) {
        return "crash";
      }
      if (money < 0) {
        return "debt";
      }
      if (money < 250) {
        return "critical";
      }
      if (money < 500) {
        return "risky";
      }
      if (money < 800) {
        return "balanced";
      }
      return "stable";
    },

    buildBudgetWarning: function (money, debtOwed) {
      var level = this.getBudgetWarningLevel(money);
      var text = "";
      var debtPressure = this.getDebtPressure(debtOwed || 0);

      if (level === "balanced") {
        text = debtOwed > 0 ? "Your budget is still workable, but debt will keep growing if it is not paid down." : "Available budget is balanced, but careful planning still matters.";
      } else if (level === "risky") {
        text = "Your available budget is entering a risky range. Large costs will be harder to absorb.";
      } else if (level === "critical") {
        text = "Your available budget is critical. Loan options are now available, but borrowing adds pressure later.";
      } else if (level === "debt") {
        text = "You are below zero budget now. Debt and interest will make later years harder to manage.";
      } else if (level === "crash") {
        text = "Available budget has collapsed below the safe limit. The island can no longer keep operating.";
      } else {
        text = debtOwed > 0 ? "Reserves are stable for now, but unpaid debt still needs attention." : "Operating funds are stable enough to support steady planning.";
      }

      if (debtOwed > 0) {
        text += " Debt Owed is " + Math.round(debtOwed) + " and is currently " + debtPressure.label.toLowerCase() + ".";
      }

      return {
        level: level,
        text: text
      };
    },

    getEnvironmentCondition: function (value) {
      if (value >= 51) {
        return { level: value, label: "Thriving", message: "The island's ecosystems are recovering strongly and helping stabilize the future.", tone: "positive" };
      }
      if (value >= 26) {
        return { level: value, label: "Stable", message: "Ecological conditions are holding steady, though careful planning still matters.", tone: "positive" };
      }
      if (value >= 1) {
        return { level: value, label: "Stressed", message: "Nature is still functioning, but the strain is becoming visible.", tone: "warning" };
      }
      if (value === 0) {
        return { level: value, label: "Warning", message: "This is the start of something going wrong.", tone: "warning" };
      }
      if (value >= -24) {
        return { level: value, label: "Early Damage", message: "Environmental damage is beginning to spread.", tone: "warning" };
      }
      if (value >= -49) {
        return { level: value, label: "Close Call", message: "The island is approaching a dangerous ecological state.", tone: "danger" };
      }
      if (value >= -74) {
        return { level: value, label: "Critical", message: "Systems are failing and recovery is becoming difficult.", tone: "danger" };
      }
      if (value >= -99) {
        return { level: value, label: "Severe Collapse", message: "Environmental breakdown is widespread.", tone: "danger" };
      }
      return { level: value, label: "Full Environmental Crash", message: "The ecosystem has completely crashed.", tone: "collapse" };
    },

    getTrustCondition: function (value) {
      if (value >= 51) {
        return { level: value, label: "Strong Trust", message: "People believe in the direction of the island and are more willing to cooperate.", tone: "positive" };
      }
      if (value >= 26) {
        return { level: value, label: "Stable Trust", message: "Public confidence is holding, even if not every choice feels easy.", tone: "positive" };
      }
      if (value >= 1) {
        return { level: value, label: "Uneasy", message: "Support still exists, but many people are beginning to worry.", tone: "warning" };
      }
      if (value === 0) {
        return { level: value, label: "Warning", message: "This is the point where confidence begins to slip.", tone: "warning" };
      }
      if (value >= -24) {
        return { level: value, label: "Distrust Growing", message: "More people feel unheard and disconnected from leadership.", tone: "warning" };
      }
      if (value >= -49) {
        return { level: value, label: "Fractured", message: "The community is divided and support is weakening.", tone: "danger" };
      }
      if (value >= -74) {
        return { level: value, label: "Unrest", message: "Public frustration is rising and cooperation is becoming difficult.", tone: "danger" };
      }
      if (value >= -99) {
        return { level: value, label: "Severe Breakdown", message: "Trust in leadership has nearly collapsed.", tone: "danger" };
      }
      return { level: value, label: "Social Collapse", message: "The community no longer supports the system guiding the island.", tone: "collapse" };
    },

    getMoneyCondition: function (value) {
      var level = this.getBudgetWarningLevel(value);

      if (level === "stable") {
        return { level: value, label: "Stable Reserves", message: "Operating funds are strong enough to support planning flexibility.", tone: "positive" };
      }
      if (level === "balanced") {
        return { level: value, label: "Balanced Budget", message: "The budget is healthy, but it is no longer comfortably buffered.", tone: "positive" };
      }
      if (level === "risky") {
        return { level: value, label: "Risky Budget", message: "The budget can still function, but risk is becoming visible.", tone: "warning" };
      }
      if (level === "critical") {
        return { level: value, label: "Critical Budget", message: "Budget pressure is high and reserves are almost exhausted.", tone: "danger" };
      }
      if (level === "debt") {
        return { level: value, label: "Debt State", message: "The island is operating below zero and carrying growing pressure into future years.", tone: "danger" };
      }
      return { level: value, label: "Financial Collapse", message: "Debt has overwhelmed the island's operating capacity.", tone: "collapse" };
    },

    buildAnnualFinancialSummary: function (items) {
      var parts = [];
      var i;

      for (i = 0; i < items.length; i += 1) {
        parts.push(items[i].title + ": " + items[i].description);
      }

      return parts.join(" ");
    },

    buildChoiceSummary: function (option) {
      var parts = [];
      parts.push(this.describeDelta(option.environment, "environmental health"));
      parts.push(this.describeDelta(option.trust, "community trust"));
      parts.push(this.describeDelta(option.money, "available budget"));
      return "Your decision " + parts.join(", ") + ".";
    },

    buildEducationNote: function (state, option) {
      var environmentCondition;
      var trustCondition;

      if (this.getModeId(state.selectedMode) !== "education") {
        return "";
      }

      environmentCondition = this.getEnvironmentCondition(state.stats.environment);
      trustCondition = this.getTrustCondition(state.stats.trust);

      if (option.money > 0 && option.environment < 0) {
        return "Short-term revenue can feel helpful, but environmental strain often creates delayed repair costs and weaker resilience later. The island is now in " + environmentCondition.label.toLowerCase() + " ecological condition.";
      }
      if (option.money < 0 && option.trust > 0) {
        return "Funding public support can reduce reserves now, yet stronger trust often makes future plans easier to carry through. Community confidence now sits in " + trustCondition.label.toLowerCase() + ".";
      }
      if (option.environment > 0 && option.money < 0) {
        return "Environmental protection usually asks for early investment, but it can prevent larger losses from erosion, pollution, and habitat decline. The island is now in " + environmentCondition.label.toLowerCase() + " ecological condition.";
      }
      if (option.trust < 0) {
        return "When trust drops, even financially useful decisions can become harder to sustain because cooperation and public confidence weaken. The community is now in " + trustCondition.label.toLowerCase() + ".";
      }

      return "Trade-offs rarely stay in one category. Budget, ecology, and community outcomes tend to reinforce each other over time.";
    },

    describeDelta: function (value, label) {
      if (value > 0) {
        return "improved " + label;
      }
      if (value < 0) {
        return "reduced " + label;
      }
      return "left " + label + " unchanged";
    },

    buildYearSummaryContent: function (stats) {
        var ranked = [
          { label: "Available Budget", value: stats.money },
          { label: "Environment Health", value: stats.environment },
          { label: "Community Trust", value: stats.trust }
        ];
      var strongest;
      var weakest;
      var envCondition = this.getEnvironmentCondition(stats.environment);
      var trustCondition = this.getTrustCondition(stats.trust);
      var moneyCondition = this.getMoneyCondition(stats.money);
      var summary = "This year stayed fairly balanced, with no single priority completely taking over the board.";
      var reflection = "Sustainable progress requires balancing growth with environmental care.";

      ranked.sort(function (a, b) { return b.value - a.value; });
      strongest = ranked[0].label;
      weakest = ranked[2].label;

      if (strongest === "Community Trust" && weakest === "Environment Health") {
        summary = "Your investments this year strengthened the community, but environmental pressure is increasing.";
      } else if (strongest === "Environment Health" && weakest === "Available Budget") {
        summary = "You protected habitats and long-term resilience this year, though your operating budget took the strain.";
      } else if (strongest === "Available Budget" && weakest === "Community Trust") {
        summary = "Your reserves grew this year, but community confidence is becoming harder to hold onto.";
      } else if (strongest === "Available Budget" && weakest === "Environment Health") {
        summary = "Economic momentum improved this year, but environmental stress is becoming more visible.";
      } else if (strongest === "Environment Health" && weakest === "Community Trust") {
        summary = "Nature is recovering under your watch, but people may need more visible support and inclusion.";
      } else if (strongest === "Community Trust" && weakest === "Available Budget") {
        summary = "People feel supported this year, though your reserves will need careful attention moving forward.";
      }

      if (weakest === "Environment Health") {
        reflection = "Habitat loss and pollution often create costs later that are harder to reverse than to prevent.";
      } else if (weakest === "Community Trust") {
        reflection = "Public trust and cooperation make long-term plans easier to carry through when tradeoffs get difficult.";
      } else if (weakest === "Available Budget") {
        reflection = "Even strong community and environmental plans need stable reserves, grants, and realistic budgeting to last.";
      }

      if (envCondition.tone === "danger" || envCondition.tone === "collapse") {
        summary = "Ecological systems are under heavy strain this year, and recovery is becoming more difficult.";
      }
      if (trustCondition.tone === "danger" || trustCondition.tone === "collapse") {
        summary = "Social stability weakened this year, and people are finding it harder to trust the island's direction.";
      }
      if (moneyCondition.tone === "danger" || moneyCondition.tone === "collapse") {
        reflection = "Low reserves and debt pressure can quietly reshape every later decision, even when the original goals were sound.";
      }

      return {
        strongest: strongest,
        weakest: weakest,
        summary: summary,
        reflection: reflection,
        environmentCondition: envCondition,
        trustCondition: trustCondition,
        moneyCondition: moneyCondition
      };
    },

    buildInvestmentChoiceLabel: function (investment) {
      return "Fund " + investment.name;
    },

    getModeFailureEnding: function (state) {
      var modeId = this.getModeId(state.selectedMode);
      var islandId = state.selectedIsland && state.selectedIsland.id;

      if (!this.modeSupportsHardFailure(state.selectedMode)) {
        return null;
      }

      if (islandId === "desert") {
        if (state.stats.money < -200) {
          return "Financial Collapse";
        }
        if (state.stats.trust <= 0) {
          return "Community Breakdown";
        }
        return null;
      }

      if (state.stats.money < -100) {
        return "Financial Collapse";
      }
      if (state.stats.environment <= -100) {
        return "Environmental Decline";
      }
      if (modeId !== "conservation" && state.stats.trust <= -100) {
        return "Community Breakdown";
      }

      return null;
    },

    getModeFinalEnding: function (state) {
      var modeId = this.getModeId(state.selectedMode);
      var stats = state.stats;
      var balanced = stats.money >= 40 && stats.environment >= 25 && stats.trust >= 25;
      var islandId = state.selectedIsland && state.selectedIsland.id;

      if (!this.modeSupportsWinLose(state.selectedMode)) {
        return "Free Play Summary";
      }

      if (islandId === "desert") {
        if (stats.money < -200 || stats.trust <= 0 || stats.environment < -25) {
          return stats.money < -200 ? "Financial Collapse" : stats.trust <= 0 ? "Community Breakdown" : "Environmental Decline";
        }
        if (stats.environment >= 75 && stats.money >= 0 && stats.trust >= 50) {
          return "Thriving Future";
        }
        return "Fragile Progress";
      }

      if (stats.money < -100) {
        return "Financial Collapse";
      }
      if (stats.environment <= -100) {
        return "Environmental Decline";
      }
      if (stats.trust <= -100) {
        return "Community Breakdown";
      }

      if (modeId === "guided") {
        if (balanced) {
          return "Thriving Future";
        }
        return this.getFinalEnding(stats);
      }

      if (modeId === "wealth") {
        if (stats.money >= 1300 && stats.environment > -25 && stats.trust > -25) {
          return "Thriving Future";
        }
        if (stats.environment <= -75) {
          return "Environmental Decline";
        }
        if (stats.trust <= -75) {
          return "Community Breakdown";
        }
        return stats.money >= 1100 ? "Fragile Progress" : this.getFinalEnding(stats);
      }

      if (modeId === "conservation") {
        if (stats.environment >= 60 && stats.money > -25) {
          return "Thriving Future";
        }
        if (stats.money <= -75) {
          return "Financial Collapse";
        }
        if (stats.trust <= -75) {
          return "Community Breakdown";
        }
        return stats.environment >= 10 ? "Fragile Progress" : "Environmental Decline";
      }

      if (modeId === "survival") {
        if (stats.money >= 20 && stats.environment >= -10 && stats.trust >= -10) {
          return "Thriving Future";
        }
        return "Fragile Progress";
      }

      if (modeId === "community") {
        if (stats.trust >= 60 && stats.money > -25 && stats.environment > -25) {
          return "Thriving Future";
        }
        if (stats.money <= -75) {
          return "Financial Collapse";
        }
        if (stats.environment <= -75) {
          return "Environmental Decline";
        }
        return stats.trust >= 20 ? "Fragile Progress" : "Community Breakdown";
      }

      if (modeId === "education") {
        if (stats.money > -25 && stats.environment >= 10 && stats.trust >= 10) {
          return "Thriving Future";
        }
        return this.getFinalEnding(stats);
      }

      return this.getFinalEnding(stats);
    },

    getFinalEnding: function (stats) {
      var minValue = Math.min(stats.money, stats.environment, stats.trust);
      var maxValue = Math.max(stats.money, stats.environment, stats.trust);
      var spread = maxValue - minValue;

      if (stats.money >= 40 && stats.environment >= 25 && stats.trust >= 25 && spread <= 90) {
        return "Thriving Future";
      }
      if (stats.environment <= -75) {
        return "Environmental Decline";
      }
      if (stats.trust <= -75) {
        return "Community Breakdown";
      }
      if (stats.money <= -75) {
        return "Financial Collapse";
      }
      return "Fragile Progress";
    },

    getOutcomeVerdict: function (mode, endingType) {
      var modeId = this.getModeId(mode);

      if (modeId === "sandbox" || endingType === "Free Play Summary") {
        return {
          label: "Free Play",
          tone: "mixed"
        };
      }
      if (endingType === "Thriving Future") {
        return {
          label: "Win",
          tone: "win"
        };
      }
      if (endingType === "Fragile Progress") {
        return {
          label: "Mixed Outcome",
          tone: "mixed"
        };
      }
      return {
        label: "Collapse",
        tone: "loss"
      };
    },

    rankStats: function (stats) {
      var ranked = [
        { label: "Available Budget", value: stats.money },
        { label: "Environment Health", value: stats.environment },
        { label: "Community Trust", value: stats.trust }
      ];

      ranked.sort(function (a, b) {
        return b.value - a.value;
      });

      return {
        strongest: ranked[0],
        weakest: ranked[2]
      };
    },

    describeStrategy: function (stats) {
      if (stats.money > stats.environment && stats.money > stats.trust) {
        return "You often favored preserving reserves and financial momentum over the other two pillars.";
      }
      if (stats.environment > stats.money && stats.environment > stats.trust) {
        return "You regularly leaned toward environmental protection, even when it slowed short-term gains.";
      }
      if (stats.trust > stats.money && stats.trust > stats.environment) {
        return "You consistently prioritized public support and community stability.";
      }
      return "You spread attention across all three pillars, even if the balance was not perfect every round.";
    },

    buildEndContent: function (state, endingType) {
      var stats = state.stats;
      var modeId = this.getModeId(state.selectedMode);
      var strategyStyle = this.describeStrategy(stats);
      var balanced = stats.money >= 40 && stats.environment >= 25 && stats.trust >= 25;

      if (modeId === "sandbox" || endingType === "Free Play Summary") {
        return {
          strategy: "Sandbox is free play, so this is a reflection instead of a win or loss. " + strategyStyle + " Your island can keep going without forced collapse or a final score.",
          education: "Open-ended simulations are useful for experimentation. Because there is no hard fail state here, you can safely test extreme budgets, damaged environments, or low trust and observe how the systems respond over time.",
          reflection: "Free play is for curiosity, testing, and learning at your own pace."
        };
      }

      if (modeId === "wealth" && stats.money >= 160 && stats.trust < 35) {
        return {
          strategy: "You built extraordinary wealth, but your island no longer feels united. " + strategyStyle,
          education: "Economic growth can expand services and options, but when communities feel excluded from that growth, prosperity can arrive with social fragmentation and weakened long-term cooperation.",
          reflection: "Prosperity means more when people can still recognize themselves in it."
        };
      }

      if (modeId === "conservation" && stats.environment >= 75 && stats.money < 35) {
        return {
          strategy: "You protected the island's ecosystems with real conviction, even as the budget tightened around you. " + strategyStyle,
          education: "Ecological recovery often requires early sacrifice. Real-world conservation can succeed environmentally while still leaving leaders under financial strain if funding and reserves are not stabilized alongside it.",
          reflection: "Protection lasts longer when care for nature is backed by durable resources."
        };
      }

      if (modeId === "community" && stats.trust >= 75 && stats.money < 30) {
        return {
          strategy: "People felt supported under your leadership, even though the island's reserves stayed under pressure. " + strategyStyle,
          education: "Community-centered planning builds loyalty and cooperation, but trusted systems still need enough budget to maintain infrastructure, health services, and environmental care over time.",
          reflection: "Belonging is powerful, but it still needs material support to endure."
        };
      }

      if (modeId === "wealth" && stats.money >= 160 && stats.environment <= -50) {
        return {
          strategy: "You built a powerful economy, but much of that growth came by hollowing out the land that sustained it. " + strategyStyle,
          education: "Real-world growth can look successful on paper while eroding coastlines, habitats, water quality, and long-term resilience underneath it. Ecological debt eventually becomes economic debt too.",
          reflection: "A strong balance sheet cannot replace a damaged living system."
        };
      }

      if (balanced && endingType === "Thriving Future") {
        return {
          strategy: "You reached a hopeful balance across budget, environment, and trust. " + strategyStyle + " The island feels governed with restraint, care, and long-term perspective.",
          education: "This reflects sustainable planning in the real world: reserves, ecological resilience, and public trust reinforce each other when decisions are paced carefully instead of optimized for a single short-term win.",
          reflection: "Harmony is built through repeated choices, not one perfect decision."
        };
      }

      if (stats.money < 0 && stats.environment < -25 && stats.trust < -25) {
        return {
          strategy: "By the end, every pillar was under strain. " + strategyStyle + " The island could no longer absorb the weight of so many unresolved trade-offs at once.",
          education: "System-wide collapse rarely arrives from one decision alone. It usually grows from repeated shortfalls in funding, environmental care, and public cooperation that compound over time.",
          reflection: "Collapse is often cumulative long before it becomes visible."
        };
      }

      return {
        "Thriving Future": {
          strategy: "You finished with a healthy balance across budget, environment, and trust. " + strategyStyle + " Your decisions suggest a steady strategy built on sustainable development rather than quick wins alone.",
          education: "This kind of outcome reflects how real communities benefit when habitat protection, pollution prevention, reserve management, grants, repairs, and local cooperation are treated as connected goals. Balanced planning often avoids the long-term costs that come from chasing short-term profit too aggressively.",
          reflection: "Small choices create long-term impact."
        },
        "Fragile Progress": {
          strategy: "You kept the community moving forward, but one area remained noticeably weaker than the others. " + strategyStyle + " The result is progress with a fragile foundation.",
          education: "In real life, even partial success can leave communities exposed. A place may earn revenue or win grants, but still struggle if pollution rises, repairs are delayed, reserves run thin, or public trust starts to fade.",
          reflection: "Progress lasts longer when balance is part of the plan."
        },
        "Environmental Decline": {
          strategy: "Your final path left environmental health too weak to support long-term stability. " + strategyStyle + " The short-term gains did not offset the ecological strain.",
          education: "This mirrors real environmental decline: habitat loss, shoreline erosion, pollution, and unmanaged extraction often create hidden costs later. Damage to forests, wetlands, reefs, and animal populations can raise cleanup bills and reduce resilience.",
          reflection: "Protecting nature early is often less costly than repairing damage later."
        },
        "Community Breakdown": {
          strategy: "Your choices left community trust too low to hold the system together. " + strategyStyle + " Even useful projects lose strength when people feel unheard or unsupported.",
          education: "Public trust and cooperation are practical resources in real communities. When access to water, animal care, jobs, safety, fair process, or transparent budgeting is neglected, support fades and coordination becomes harder.",
          reflection: "Communities grow stronger when people feel included in the future being built."
        },
        "Financial Collapse": {
          strategy: "You ran out of financial stability before the community could fully carry your plans. " + strategyStyle + " Strong ideas still need durable funding and reserve planning to last.",
          education: "In real life, operating funds shape what communities can maintain. If reserves collapse or debt pressure overwhelms a budget, it becomes harder to support water systems, habitat restoration, animal care, cleanup work, and trusted public services.",
          reflection: "A resilient future needs both resources and restraint."
        }
      }[endingType];
    },

    buildPerformanceSummary: function (state, endingType) {
      var ranking = this.rankStats(state.stats);
      var decisionCount = state.history.length;
      var tokenName = state.selectedToken ? state.selectedToken.name : "your token";
      var yearsCompleted = state.loopsCompleted;
      var base = "You completed " + yearsCompleted + " year" + (yearsCompleted === 1 ? "" : "s") +
        " across " + state.turnsTaken + " roll" + (state.turnsTaken === 1 ? "" : "s") +
        " while guiding the " + tokenName + " token around the island.";

      if (endingType === "Thriving Future") {
        return base + " Your " + decisionCount + " decisions kept the strongest stat at " +
          ranking.strongest.label + " while avoiding any major collapse.";
      }
      if (endingType === "Fragile Progress") {
        return base + " Your " + decisionCount + " decisions kept the island moving, but " +
          ranking.weakest.label + " became a visible weak point by the end.";
      }
      if (endingType === "Free Play Summary") {
        return base + " Sandbox mode does not score this as a win or loss, so these results are a snapshot of your experiment.";
      }
      return base + " Your " + decisionCount + " decisions left " + ranking.weakest.label +
        " too weak to sustain the island's future.";
    }
  };
}());
