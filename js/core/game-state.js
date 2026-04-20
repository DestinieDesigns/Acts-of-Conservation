(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.config = {
    startingStats: {
      money: 100,
      environment: 50,
      trust: 50
    }
  };

  AOC.utils = {
    byId: function (id) {
      return document.getElementById(id);
    },
    wait: function (ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    },
    capitalize: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    clampMeter: function (value) {
      return Math.max(0, Math.min(100, value));
    },
    clampStat: function (value) {
      return Math.max(0, Math.min(100, value));
    },
    formatDelta: function (value) {
      return value >= 0 ? "+" + value : String(value);
    }
  };

  AOC.createInitialState = function () {
    return {
      stats: {
        money: AOC.config.startingStats.money,
        environment: AOC.config.startingStats.environment,
        trust: AOC.config.startingStats.trust
      },
      position: 0,
      year: 1,
      turnsTaken: 0,
      loopsCompleted: 0,
      selectedRounds: 10,
      selectedMode: null,
      selectedToken: null,
      activeLoan: null,
      awaitingLoanDecision: false,
      pendingLoanContext: null,
      lastFinancialEventIndex: null,
      yearFinancialLog: [],
      loanOfferedThisYear: false,
      lastRoll: null,
      isAnimating: false,
      awaitingChoice: false,
      awaitingYearSummary: false,
      gameOver: false,
      lastScenarioByTile: [],
      lastOutcomeByChoice: {},
      history: [],
      pendingLanding: null
    };
  };

  AOC.createElementRegistry = function () {
    return {
      startScreen: null,
      gameScreen: null,
      endScreen: null,
      startButton: null,
      rollButton: null,
      restartButton: null,
      roundOptions: [],
      modeOptions: [],
      modePicker: null,
      modeName: null,
      modeDescription: null,
      modeWin: null,
      modeLose: null,
      tokenOptions: [],
      tokenPicker: null,
      selectedTokenName: null,
      board: null,
      boardPanel: null,
      boardTooltip: null,
      tooltipName: null,
      tooltipDescription: null,
      moneyStat: null,
      environmentStat: null,
      trustStat: null,
      yearCounter: null,
      turnCounter: null,
      diceResult: null,
      statusText: null,
      financeAlert: null,
      choiceModal: null,
      modalPlace: null,
      cardBox: null,
      cardTitle: null,
      cardDescription: null,
      choiceA: null,
      choiceB: null,
      yearModal: null,
      yearTitle: null,
      yearMoney: null,
      yearEnvironment: null,
      yearTrust: null,
      yearSummary: null,
      yearStrongest: null,
      yearWeakest: null,
      yearReflection: null,
      continueYearButton: null,
      loanModal: null,
      loanTitle: null,
      loanDescription: null,
      loanOptions: null,
      yearEventNote: null,
      endingTitle: null,
      endingVerdict: null,
      strategySummary: null,
      educationSummary: null,
      performanceSummary: null,
      endYears: null,
      endTurns: null,
      endStrongest: null,
      endWeakest: null,
      endToken: null,
      endMoney: null,
      endEnvironment: null,
      endTrust: null,
      reflectionLine: null,
      statFeedback: null,
      centerMessageTitle: null,
      centerMessageBody: null,
      centerMoneyMini: null,
      centerEnvironmentMini: null,
      centerTrustMini: null
    };
  };
}());
