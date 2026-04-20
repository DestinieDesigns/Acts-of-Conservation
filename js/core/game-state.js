(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.config = {
    startingStats: {
      money: 100,
      environment: 25,
      trust: 25
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
      return value;
    },
    clampStat: function (value) {
      return value;
    },
    formatDelta: function (value) {
      return value >= 0 ? "+" + value : String(value);
    }
  };

  AOC.createInitialState = function () {
    return {
      currentScreen: "home",
      stats: {
        money: AOC.config.startingStats.money,
        environment: AOC.config.startingStats.environment,
        trust: AOC.config.startingStats.trust
      },
      position: 0,
      year: 1,
      turnsTaken: 0,
      loopsCompleted: 0,
      selectedRounds: null,
      selectedMode: null,
      selectedToken: AOC.data && AOC.data.tokens && AOC.data.tokens.length ? AOC.data.tokens[0] : null,
      activeInvestments: [],
      availableInvestments: [],
      investmentPurchasedThisYear: false,
      activeLoan: null,
      awaitingLoanDecision: false,
      awaitingInvestmentDecision: false,
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
      homeScreen: null,
      startScreen: null,
      roundsScreen: null,
      rulesScreen: null,
      gameScreen: null,
      endScreen: null,
      homeStartButton: null,
      homeHowButton: null,
      howToModal: null,
      howToCloseButton: null,
      startButton: null,
      backButton: null,
      roundsNextButton: null,
      roundsBackButton: null,
      rulesStartButton: null,
      rulesBackButton: null,
      rollButton: null,
      restartButton: null,
      returnHomeButton: null,
      roundOptions: [],
      modeOptions: [],
      modePicker: null,
      modeName: null,
      modeDescription: null,
      modeWin: null,
      modeLose: null,
      modeGoal: null,
      modeRisk: null,
      tokenOptions: [],
      tokenPicker: null,
      selectedTokenName: null,
      rulesModeName: null,
      rulesLengthName: null,
      rulesModeGoal: null,
      rulesModeWin: null,
      rulesModeLose: null,
      board: null,
      boardPanel: null,
      boardTooltip: null,
      tooltipName: null,
      tooltipDescription: null,
      moneyStat: null,
      environmentStat: null,
      trustStat: null,
      moneyCondition: null,
      environmentCondition: null,
      trustCondition: null,
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
      cardTone: null,
      cardFeedback: null,
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
      yearInvestments: null,
      yearLoans: null,
      yearReflection: null,
      continueYearButton: null,
      reviewInvestmentsButton: null,
      loanModal: null,
      loanTitle: null,
      loanDescription: null,
      loanOptions: null,
      investmentModal: null,
      investmentTitle: null,
      investmentDescription: null,
      investmentOptions: null,
      closeInvestmentModal: null,
      yearEventNote: null,
      endingTitle: null,
      endingVerdict: null,
      strategySummary: null,
      educationSummary: null,
      performanceSummary: null,
      endMode: null,
      endYears: null,
      endTurns: null,
      endStrongest: null,
      endWeakest: null,
      endToken: null,
      endInvestments: null,
      endLoans: null,
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
