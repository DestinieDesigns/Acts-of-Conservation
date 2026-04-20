(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.rules = {
    getModeId: function (mode) {
      return mode && mode.id ? mode.id : "classic";
    },

    getModeStartingStats: function (mode) {
      var base = (mode && mode.startingStats) || AOC.config.startingStats;
      return {
        money: base.money,
        environment: base.environment,
        trust: base.trust
      };
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

      return {
        choiceId: choice.id,
        label: choice.label,
        outcomeIndex: outcomeIndex,
        money: adjusted.money,
        environment: adjusted.environment,
        trust: adjusted.trust,
        feedback: outcome.feedback
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

    summarizeLoan: function (loan) {
      if (!loan) {
        return "No active loans.";
      }

      return loan.name + " with " + loan.remainingYears + " year" + (loan.remainingYears === 1 ? "" : "s") + " of repayments remaining.";
    },

    applyAnnualInvestmentEffects: function (state) {
      var notes = [];
      var i;
      var investment;
      var note;

      for (i = 0; i < state.activeInvestments.length; i += 1) {
        investment = state.activeInvestments[i];
        this.applyStatEffects(state.stats, investment.annualEffects);
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

    applyAnnualLoanEffects: function (state) {
      var note;

      if (!state.activeLoan) {
        return null;
      }

      this.applyStatEffects(state.stats, state.activeLoan.annualEffects);
      state.activeLoan.remainingYears -= 1;
      note = {
        type: "loan",
        title: state.activeLoan.name + " Repayment Due",
        description: "Debt service reduces available reserves and puts pressure on trust while the loan remains active.",
        money: state.activeLoan.annualEffects.money,
        environment: state.activeLoan.annualEffects.environment,
        trust: state.activeLoan.annualEffects.trust
      };

      if (state.activeLoan.remainingYears <= 0) {
        note.resolved = true;
        note.resolution = state.activeLoan.name + " fully repaid.";
        state.activeLoan = null;
      }

      return note;
    },

    getBudgetWarningLevel: function (money) {
      if (money < -100) {
        return "crash";
      }
      if (money < 0) {
        return "debt";
      }
      if (money < 10) {
        return "critical";
      }
      if (money < 40) {
        return "caution";
      }
      return "stable";
    },

    buildBudgetWarning: function (money, activeLoan) {
      var level = this.getBudgetWarningLevel(money);
      var text = "";

      if (level === "caution") {
        text = "Budget caution: reserves are getting tight. Delayed repairs or rising costs could disrupt your plan.";
      } else if (level === "critical") {
        text = "Budget critical: operating funds are nearly exhausted, and one more setback could trigger debt pressure.";
      } else if (level === "debt") {
        text = "Debt state: the island is now operating below zero reserves. Loans may help in the short term, but debt pressure will shape future choices.";
      } else if (level === "crash") {
        text = "Total financial collapse: debt pressure has overwhelmed the island's ability to keep functioning.";
      } else {
        text = activeLoan ? "Operating funds are stable for now, but debt repayments still need attention." : "Operating funds are stable enough to support steady planning.";
      }

      if (activeLoan) {
        text += " Active loan repayments continue for " + activeLoan.remainingYears + " more year" + (activeLoan.remainingYears === 1 ? "" : "s") + ".";
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
      if (level === "caution") {
        return { level: value, label: "Caution", message: "Reserves are thinning and future risk is increasing.", tone: "warning" };
      }
      if (level === "critical") {
        return { level: value, label: "Critical", message: "Budget pressure is high and reserves are almost exhausted.", tone: "danger" };
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

      if (modeId === "sandbox") {
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

      if (stats.money < -100) {
        return "Financial Collapse";
      }
      if (stats.environment <= -100) {
        return "Environmental Decline";
      }
      if (stats.trust <= -100) {
        return "Community Breakdown";
      }

      if (modeId === "classic") {
        if (balanced) {
          return "Thriving Future";
        }
        return this.getFinalEnding(stats);
      }

      if (modeId === "wealth") {
        if (stats.money >= 180 && stats.environment > -25 && stats.trust > -25) {
          return "Thriving Future";
        }
        if (stats.environment <= -75) {
          return "Environmental Decline";
        }
        if (stats.trust <= -75) {
          return "Community Breakdown";
        }
        return stats.money >= 140 ? "Fragile Progress" : this.getFinalEnding(stats);
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

      if (modeId === "sandbox") {
        return this.getFinalEnding(stats);
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

        if (modeId === "sandbox") {
        return {
          label: endingType === "Thriving Future" ? "Reflective Outcome" : "Open Outcome",
          tone: endingType === "Thriving Future" ? "win" : "mixed"
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
        " across " + state.turnsTaken + " turn" + (state.turnsTaken === 1 ? "" : "s") +
        " while guiding the " + tokenName + " token around the island.";

      if (endingType === "Thriving Future") {
        return base + " Your " + decisionCount + " decisions kept the strongest stat at " +
          ranking.strongest.label + " while avoiding any major collapse.";
      }
      if (endingType === "Fragile Progress") {
        return base + " Your " + decisionCount + " decisions kept the island moving, but " +
          ranking.weakest.label + " became a visible weak point by the end.";
      }
      return base + " Your " + decisionCount + " decisions left " + ranking.weakest.label +
        " too weak to sustain the island's future.";
    }
  };
}());
