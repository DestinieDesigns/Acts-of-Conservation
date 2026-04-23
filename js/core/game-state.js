(function () {
  var AOC = window.AOC = window.AOC || {};

  AOC.config = {
    startingStats: {
      money: 1000,
      environment: 25,
      trust: 25
    },
    voiceSettings: {
      enabled: false,
      readCards: true,
      readWarnings: true,
      readEndings: true,
      rate: 0.95,
      pitch: 1,
      lang: "en-US",
      voiceName: null
    }
  };

  AOC.storage = {
    read: function (key, fallback) {
      try {
        var value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    write: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return;
      }
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
      theme: AOC.storage.read("aoc.theme", "light"),
      simpleMode: AOC.storage.read("aoc.simpleMode", false),
      voiceSettings: {
        enabled: AOC.storage.read("aoc.voice.enabled", AOC.config.voiceSettings.enabled),
        readCards: AOC.storage.read("aoc.voice.readCards", AOC.config.voiceSettings.readCards),
        readWarnings: AOC.storage.read("aoc.voice.readWarnings", AOC.config.voiceSettings.readWarnings),
        readEndings: AOC.storage.read("aoc.voice.readEndings", AOC.config.voiceSettings.readEndings),
        rate: AOC.storage.read("aoc.voice.rate", AOC.config.voiceSettings.rate),
        pitch: AOC.storage.read("aoc.voice.pitch", AOC.config.voiceSettings.pitch),
        lang: AOC.storage.read("aoc.voice.lang", AOC.config.voiceSettings.lang),
        voiceName: AOC.storage.read("aoc.voice.voiceName", AOC.config.voiceSettings.voiceName)
      },
      stats: {
        money: AOC.config.startingStats.money,
        environment: AOC.config.startingStats.environment,
        trust: AOC.config.startingStats.trust
      },
      position: 0,
      year: 0,
      turnsTaken: 0,
      yearlyRollCount: 0,
      loopsCompleted: 0,
      hasGameStarted: false,
      islandReaction: "",
      islandGrid: null,
      selectedRounds: null,
      selectedMode: null,
      selectedCharacter: null,
      selectedToken: null,
      selectedIsland: null,
      unlockedCharacters: AOC.storage.read("aoc.unlockedCharacters", { boy: true, girl: true }),
      activeInvestments: [],
      availableInvestments: [],
      investmentPurchasedThisYear: false,
      activePromises: [],
      activeShortcuts: [],
      debtOwed: 0,
      interestThisYear: 0,
      debtAtYearStart: 0,
      awaitingLoanDecision: false,
      awaitingPromiseDecision: false,
      awaitingShortcutDecision: false,
      awaitingDebtDecision: false,
      awaitingInvestmentDecision: false,
      pendingDebtSummary: null,
      lastFinancialEventIndex: null,
      yearFinancialLog: [],
      loanOfferTurn: null,
      promiseOfferTurn: null,
      shortcutOfferTurn: null,
      promiseBudgetPaidThisYear: 0,
      promiseTrustPenaltyThisYear: 0,
      shortcutDamageThisYear: 0,
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
      islandScreen: null,
      roundsScreen: null,
      rulesScreen: null,
      gameScreen: null,
      endScreen: null,
      homeStartButton: null,
      homeHowButton: null,
      homeSettingsButton: null,
      simpleModeToggle: null,
      howToModal: null,
      howToCloseButton: null,
      settingsModal: null,
      settingsCloseButton: null,
      settingsThemeLight: null,
      settingsThemeDark: null,
      voiceEnabledToggle: null,
      voiceCardsToggle: null,
      voiceWarningsToggle: null,
      voiceEndingsToggle: null,
      voiceRateSlider: null,
      voiceRateValue: null,
      voiceVoiceSelect: null,
      settingsSimpleModeToggle: null,
      startButton: null,
      backButton: null,
      characterScreen: null,
      characterNextButton: null,
      characterBackButton: null,
      islandPicker: null,
      islandName: null,
      islandDescription: null,
      islandStats: null,
      islandWin: null,
      islandLose: null,
      islandNextButton: null,
      islandBackButton: null,
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
      characterPicker: null,
      characterOptions: [],
      characterName: null,
      characterDescription: null,
      characterBonus: null,
      tokenOptions: [],
      tokenPicker: null,
      selectedTokenName: null,
      rulesModeName: null,
      rulesCharacterName: null,
      rulesIslandName: null,
      rulesLengthName: null,
      rulesModeGoal: null,
      rulesModeWin: null,
      rulesModeLose: null,
      readyMoney: null,
      readyEnvironment: null,
      readyTrust: null,
      simpleModeBadge: null,
      board: null,
      boardPanel: null,
      boardTooltip: null,
      tooltipName: null,
      tooltipDescription: null,
      moneyStat: null,
      debtStat: null,
      environmentStat: null,
      trustStat: null,
      moneyCondition: null,
      debtCondition: null,
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
      yearDebt: null,
      yearInterest: null,
      yearFinancialState: null,
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
      loanSummary: null,
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
      centerTrustMini: null,
      centerIntro: null,
      islandVisual: null,
      islandGrid: null,
      islandStageLabel: null,
      islandStageMessage: null
    };
  };
}());
