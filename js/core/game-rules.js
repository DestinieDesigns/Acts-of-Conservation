(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.rules = {
    applyStatEffects: function (stats, effects) {
      stats.money += effects.money || 0;
      stats.environment = AOC.utils.clampMeter(stats.environment + (effects.environment || 0));
      stats.trust = AOC.utils.clampMeter(stats.trust + (effects.trust || 0));
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

      return {
        choiceId: choice.id,
        label: choice.label,
        outcomeIndex: outcomeIndex,
        money: outcome.money,
        environment: outcome.environment,
        trust: outcome.trust,
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

      if (!event) {
        return null;
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        money: event.effects.money || 0,
        environment: event.effects.environment || 0,
        trust: event.effects.trust || 0
      };
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
      if (money < 10) {
        return "crisis";
      }
      if (money < 20) {
        return "warning";
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
      } else if (level === "warning") {
        text = "Budget warning: low reserves are increasing risk. Preserving operating funds now matters more than ever.";
      } else if (level === "crisis") {
        text = "Budget crisis: reserves are critically low. Repairs, staffing, and restoration work are now at risk.";
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

      return {
        strongest: strongest,
        weakest: weakest,
        summary: summary,
        reflection: reflection
      };
    },

    getFinalEnding: function (stats) {
      var minValue = Math.min(stats.money, stats.environment, stats.trust);
      var maxValue = Math.max(stats.money, stats.environment, stats.trust);
      var spread = maxValue - minValue;

      if (stats.money >= 45 && stats.environment >= 45 && stats.trust >= 45 && spread <= 32) {
        return "Thriving Future";
      }
      if (stats.environment <= 25) {
        return "Environmental Decline";
      }
      if (stats.trust <= 25) {
        return "Community Breakdown";
      }
      if (stats.money <= 25) {
        return "Financial Collapse";
      }
      return "Fragile Progress";
    },

    getOutcomeVerdict: function (endingType) {
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

    buildEndContent: function (stats, endingType) {
      var strategyStyle = this.describeStrategy(stats);
      var content = {
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
      };
      return content[endingType];
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
