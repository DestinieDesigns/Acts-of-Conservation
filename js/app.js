window.VOTF_BOOTED = true;

(function () {
  var state = AOC.createInitialState();
  var el = AOC.createElementRegistry();

  function selectRounds(rounds) {
    state.selectedRounds = rounds;
    AOC.ui.updateUI(el, state);
  }

  function selectMode(modeId) {
    var i;

    for (i = 0; i < AOC.data.modes.length; i += 1) {
      if (AOC.data.modes[i].id === modeId) {
        state.selectedMode = AOC.data.modes[i];
        break;
      }
    }
    AOC.ui.updateUI(el, state);
  }

  function selectToken(tokenId) {
    var i;

    for (i = 0; i < AOC.data.tokens.length; i += 1) {
      if (AOC.data.tokens[i].id === tokenId) {
        state.selectedToken = AOC.data.tokens[i];
        break;
      }
    }
    AOC.ui.updateUI(el, state);
  }

  function goToScreen(screenId) {
    state.currentScreen = screenId;
    AOC.ui.showScreen(el, screenId);
  }

  function openHowTo() {
    AOC.ui.showHowToModal(el);
  }

  function closeHowTo() {
    AOC.ui.hideHowToModal(el);
  }

  function goToModeSelect() {
    closeHowTo();
    goToScreen("modeSelect");
  }

  function continueFromMode() {
    if (!state.selectedMode) {
      return;
    }
    goToScreen("roundSelect");
  }

  function continueFromRounds() {
    if (!state.selectedRounds) {
      return;
    }
    goToScreen("rules");
  }

  function startGame() {
    if (!state.selectedMode || !state.selectedRounds) {
      return;
    }
    resetStateForNewSession();
    applySelectedModeSetup();
    seedInvestmentOffers(4);
    goToScreen("playing");
    AOC.ui.updateStatus(el, state.selectedMode.name + " is active. Roll to move and face new planning challenges.");
    AOC.ui.setCenterMessage(el, state.selectedMode.name, state.selectedMode.description);
  }

  function resetSetupSelections() {
    state.selectedMode = null;
    state.selectedRounds = null;
    AOC.ui.updateUI(el, state);
  }

  function returnHome() {
    closeHowTo();
    resetSetupSelections();
    resetStateForNewSession();
    goToScreen("home");
  }

  function applySelectedModeSetup() {
    var startingStats = AOC.rules.getModeStartingStats(state.selectedMode);

    state.stats.money = startingStats.money;
    state.stats.environment = startingStats.environment;
    state.stats.trust = startingStats.trust;
  }

  function collectUnavailableInvestmentIds() {
    var ids = [];
    var i;

    for (i = 0; i < state.availableInvestments.length; i += 1) {
      ids.push(state.availableInvestments[i].id);
    }
    for (i = 0; i < state.activeInvestments.length; i += 1) {
      ids.push(state.activeInvestments[i].id);
    }

    return ids;
  }

  function seedInvestmentOffers(targetCount) {
    var nextOffer;
    var unavailableIds;

    targetCount = targetCount || 4;
    while (state.availableInvestments.length < targetCount) {
      unavailableIds = collectUnavailableInvestmentIds();
      nextOffer = AOC.rules.pickInvestmentOffer(state, unavailableIds);
      if (!nextOffer) {
        break;
      }
      state.availableInvestments.push(nextOffer);
    }
  }

  async function handleRoll() {
    var roll;
    var rawPosition;
    var plot;
    var scenarioIndex;
    var scenarioObj;
    var completedLoop;
    var startingPosition;

    if (state.awaitingChoice || state.awaitingYearSummary || state.awaitingLoanDecision || state.gameOver || state.isAnimating) {
      return;
    }

    state.isAnimating = true;
    AOC.ui.updateUI(el, state);
    AOC.ui.hideBoardTooltip(el);
    roll = Math.floor(Math.random() * 6) + 1;
    startingPosition = state.position;
    state.turnsTaken += 1;
    state.lastRoll = roll;
    AOC.ui.updateUI(el, state);
    await AOC.ui.animateDiceDisplay(el, roll);

    rawPosition = startingPosition + roll;
    completedLoop = false;
    await animateTokenMovement(roll);
    completedLoop = rawPosition >= AOC.data.plots.length || state.position === 0;

    plot = AOC.data.plots[state.position];
    scenarioIndex = AOC.rules.pickScenarioIndex(state, state.position);
    scenarioObj = plot.scenarios[scenarioIndex];
    AOC.ui.updateStatus(el, "You rolled a " + roll + " and arrived at " + plot.tileName + ".");
    AOC.ui.setCenterMessage(el, "Arrived at " + plot.tileName, AOC.rules.buildScenarioSummary(plot, scenarioObj));
    AOC.ui.updateUI(el, state);
    await AOC.utils.wait(200);

    if (completedLoop) {
      state.loopsCompleted += 1;
      state.year += 1;
      processNewYearBudgetCycle();
      state.awaitingYearSummary = true;
      state.isAnimating = false;
      state.pendingLanding = { plotIndex: state.position, scenarioIndex: scenarioIndex };
      AOC.ui.updateUI(el, state);
      AOC.ui.showYearSummary(el, state, buildYearSummarySnapshot());
      return;
    }

    state.awaitingChoice = true;
    state.isAnimating = false;
    AOC.ui.updateUI(el, state);
    showCard(plot, scenarioObj);
  }

  async function animateTokenMovement(steps) {
    var i;
    for (i = 0; i < steps; i += 1) {
      state.position = (state.position + 1) % AOC.data.plots.length;
      AOC.ui.updateUI(el, state);
      await AOC.utils.wait(220);
    }
  }

  function createChoiceHandler(option) {
    return function () {
      handleChoice(option);
    };
  }

  function showCard(plot, scenarioObj) {
    AOC.ui.showCard(el, AOC.rules.buildDecisionCard(plot, scenarioObj), createChoiceHandler);
  }

  function applyEffects(effects) {
    AOC.rules.applyStatEffects(state.stats, effects);
  }

  function buildYearSummarySnapshot() {
    var snapshot = AOC.rules.buildYearSummaryContent(state.stats);
    snapshot.eventNote = state.yearFinancialLog.length ? AOC.rules.buildAnnualFinancialSummary(state.yearFinancialLog) : "";
    snapshot.investments = AOC.rules.summarizeInvestments(state.activeInvestments);
    snapshot.loans = AOC.rules.summarizeLoan(state.activeLoan);
    snapshot.canReviewInvestments = !!(state.availableInvestments.length && !state.investmentPurchasedThisYear && state.turnsTaken < state.selectedRounds);
    return snapshot;
  }

  function processNewYearBudgetCycle() {
    var investmentNotes;
    var i;
    var loanNote;
    var eventNote;

    state.loanOfferedThisYear = false;
    state.investmentPurchasedThisYear = false;
    state.yearFinancialLog = [];
    seedInvestmentOffers(4);
    investmentNotes = AOC.rules.applyAnnualInvestmentEffects(state);
    for (i = 0; i < investmentNotes.length; i += 1) {
      state.yearFinancialLog.push(investmentNotes[i]);
      AOC.ui.showStatFeedback(el, investmentNotes[i]);
    }
    loanNote = AOC.rules.applyAnnualLoanEffects(state);
    if (loanNote) {
      if (loanNote.resolved) {
        loanNote.description += " " + loanNote.resolution;
      }
      state.yearFinancialLog.push(loanNote);
      AOC.ui.showStatFeedback(el, loanNote);
    }

    eventNote = AOC.rules.resolveFinancialEvent(state);
    if (eventNote) {
      applyEffects(eventNote);
      state.yearFinancialLog.push(eventNote);
      AOC.ui.showStatFeedback(el, eventNote);
    }
  }

  function buildInvestmentContext() {
    var choices = [];
    var i;
    var investment;

    for (i = 0; i < state.availableInvestments.length; i += 1) {
      investment = state.availableInvestments[i];
      choices.push({
        id: investment.id,
        name: investment.name,
        category: investment.category,
        cost: investment.cost,
        description: investment.description,
        annualEffects: investment.annualEffects,
        disabled: state.stats.money < investment.cost
      });
    }

    return {
      title: "Choose a long-term investment",
      description: "Investments cost budget now, then apply recurring yearly effects. Strong plans usually help one area while putting pressure on another.",
      choices: choices
    };
  }

  function createInvestmentChoiceHandler(investment) {
    return function () {
      handleInvestmentChoice(investment);
    };
  }

  function reviewInvestments() {
    if (!state.awaitingYearSummary || state.awaitingInvestmentDecision || !state.availableInvestments.length || state.investmentPurchasedThisYear) {
      return;
    }

    state.awaitingInvestmentDecision = true;
    AOC.ui.updateUI(el, state);
    AOC.ui.showInvestmentModal(el, buildInvestmentContext(), createInvestmentChoiceHandler);
  }

  function closeInvestmentModal() {
    state.awaitingInvestmentDecision = false;
    AOC.ui.hideInvestmentModal(el);
    AOC.ui.updateUI(el, state);
  }

  function handleInvestmentChoice(investment) {
    var i;
    var upfrontCost = {
      money: -investment.cost,
      environment: 0,
      trust: 0
    };

    if (state.stats.money < investment.cost) {
      closeInvestmentModal();
      AOC.ui.updateStatus(el, "You do not have enough available budget to fund " + investment.name + " this year.");
      return;
    }

    applyEffects(upfrontCost);
    for (i = 0; i < state.availableInvestments.length; i += 1) {
      if (state.availableInvestments[i].id === investment.id) {
        state.availableInvestments.splice(i, 1);
        break;
      }
    }

    state.activeInvestments.push({
      id: investment.id,
      name: investment.name,
      category: investment.category,
      description: investment.description,
      annualEffects: {
        money: investment.annualEffects.money,
        environment: investment.annualEffects.environment,
        trust: investment.annualEffects.trust
      }
    });
    state.investmentPurchasedThisYear = true;
    state.awaitingInvestmentDecision = false;
    AOC.ui.hideInvestmentModal(el);
    AOC.ui.showStatFeedback(el, upfrontCost);
    AOC.ui.updateStatus(el, investment.name + " funded. The island pays the upfront cost now and will feel recurring effects each year.");
    AOC.ui.setCenterMessage(el, "Investment Added", investment.description);
    AOC.ui.showYearSummary(el, state, buildYearSummarySnapshot());
    AOC.ui.updateUI(el, state);
    if (maybeOfferLoan()) {
      return;
    }
    checkEndConditions();
  }

  function buildLoanContext() {
    return {
      title: "Budget Stress: Financing Decision",
      description: "Available reserves are dangerously low. You can accept outside financing to stabilize operations, but loans will reduce flexibility and trust over time.",
      choices: [
        {
          id: "small-loan",
          kicker: "Bridge Loan",
          label: "Accept Small Loan",
          tone: "positive",
          preview: AOC.data.loanOffers[0].upfront,
          loan: AOC.data.loanOffers[0]
        },
        {
          id: "large-loan",
          kicker: "Emergency Debt",
          label: "Take Large Loan",
          tone: "risky",
          preview: AOC.data.loanOffers[1].upfront,
          loan: AOC.data.loanOffers[1]
        },
        {
          id: "refuse-loan",
          kicker: "Stay Exposed",
          label: "Refuse Loan",
          tone: "risky",
          preview: { money: 0, environment: 0, trust: 0 }
        }
      ]
    };
  }

  function createLoanChoiceHandler(choice) {
    return function () {
      handleLoanDecision(choice);
    };
  }

  function maybeOfferLoan() {
    if (state.stats.money >= 20) {
      state.loanOfferedThisYear = false;
    }
    if (state.stats.money >= 10 || state.activeLoan || state.awaitingLoanDecision || state.loanOfferedThisYear) {
      return false;
    }
    state.awaitingLoanDecision = true;
    state.loanOfferedThisYear = true;
    AOC.ui.updateUI(el, state);
    AOC.ui.showLoanModal(el, buildLoanContext(), createLoanChoiceHandler);
    return true;
  }

  function handleLoanDecision(choice) {
    state.awaitingLoanDecision = false;
    AOC.ui.hideLoanModal(el);

    if (choice.loan) {
      applyEffects(choice.loan.upfront);
      state.activeLoan = {
        id: choice.loan.id,
        name: choice.loan.name,
        annualEffects: {
          money: choice.loan.annual.money,
          environment: choice.loan.annual.environment,
          trust: choice.loan.annual.trust
        },
        remainingYears: choice.loan.years
      };
      AOC.ui.showStatFeedback(el, choice.loan.upfront);
      AOC.ui.updateStatus(el, choice.loan.name + " accepted. You gained immediate operating funds, but annual repayment pressure will follow.");
      AOC.ui.setCenterMessage(el, "Debt Added", "Outside funding can stabilize the present, but debt service can weaken long-term flexibility and trust.");
    } else {
      AOC.ui.updateStatus(el, "You refused outside financing and kept the budget exposed. Low reserves now raise the risk of collapse.");
      AOC.ui.setCenterMessage(el, "Loan Refused", "Avoiding debt preserves independence, but running on very low reserves leaves future repairs and services at risk.");
    }

    AOC.ui.updateUI(el, state);
    checkEndConditions();
  }

  async function handleChoice(option) {
    var resolvedOption = AOC.rules.resolveChoiceOutcome(state, option);
    var educationNote;

    applyEffects(resolvedOption);
    state.history.push({
      turn: state.turnsTaken,
      year: state.year,
      position: state.position,
      choiceId: resolvedOption.choiceId,
      choiceLabel: resolvedOption.label,
      outcomeIndex: resolvedOption.outcomeIndex,
      money: resolvedOption.money,
      environment: resolvedOption.environment,
      trust: resolvedOption.trust
    });
    state.awaitingChoice = false;
    state.isAnimating = true;
    AOC.ui.showStatFeedback(el, resolvedOption);
    AOC.ui.updateStatus(
      el,
      resolvedOption.feedback +
      " Budget " + AOC.utils.formatDelta(resolvedOption.money) +
      ", Environment " + AOC.utils.formatDelta(resolvedOption.environment) +
      ", Community Trust " + AOC.utils.formatDelta(resolvedOption.trust) + "."
    );
    educationNote = AOC.rules.buildEducationNote(state, resolvedOption);
    AOC.ui.setCenterMessage(
      el,
      "Decision Applied",
      AOC.rules.buildChoiceSummary(resolvedOption) + (educationNote ? " " + educationNote : "")
    );
    AOC.ui.updateUI(el, state);
    await AOC.ui.resolveChoiceCard(el, resolvedOption);
    state.isAnimating = false;
    AOC.ui.updateUI(el, state);
    if (maybeOfferLoan()) {
      return;
    }
    checkEndConditions();
  }

  function continueAfterYearSummary() {
    var pending;
    var plot;
    var scenarioObj;

    if (!state.awaitingYearSummary || !state.pendingLanding) {
      return;
    }

    pending = state.pendingLanding;
    hideYearSummary();
    plot = AOC.data.plots[pending.plotIndex];
    scenarioObj = plot.scenarios[pending.scenarioIndex];
    if (maybeOfferLoan()) {
      return;
    }
    state.awaitingChoice = true;
    AOC.ui.updateUI(el, state);
    showCard(plot, scenarioObj);
  }

  function hideYearSummary() {
    AOC.ui.hideYearSummary(el);
    state.awaitingYearSummary = false;
    state.pendingLanding = null;
  }

  function checkEndConditions() {
    var modeFailure;

    modeFailure = AOC.rules.getModeFailureEnding(state);
    if (modeFailure) {
      endGame(modeFailure);
      return;
    }

    if (state.stats.money < 10 && maybeOfferLoan()) {
      return;
    }

    if (state.turnsTaken >= state.selectedRounds) {
      endGame(AOC.rules.getModeFinalEnding(state));
    }
  }

  function endGame(endingType) {
    var summary = AOC.rules.buildEndContent(state, endingType);
    var verdict = AOC.rules.getOutcomeVerdict(state.selectedMode, endingType);
    var ranking = AOC.rules.rankStats(state.stats);
    var performanceSummary = AOC.rules.buildPerformanceSummary(state, endingType);
    state.gameOver = true;
    AOC.ui.hideChoiceModal(el);
    hideYearSummary();
    AOC.ui.hideLoanModal(el);
    AOC.ui.hideInvestmentModal(el);
    AOC.ui.hideBoardTooltip(el);
    AOC.ui.updateUI(el, state);
    el.endingVerdict.textContent = verdict.label;
    el.endingVerdict.className = "ending-verdict verdict-" + verdict.tone;
    el.endingTitle.textContent = endingType;
    el.strategySummary.textContent = summary.strategy;
    el.performanceSummary.textContent = performanceSummary;
    el.educationSummary.textContent = summary.education;
    if (el.endMode) {
      el.endMode.textContent = state.selectedMode ? state.selectedMode.name : "Unknown";
    }
    if (el.endInvestments) {
      el.endInvestments.textContent = AOC.rules.summarizeInvestments(state.activeInvestments).replace("None yet.", "None activated.");
    }
    if (el.endLoans) {
      el.endLoans.textContent = AOC.rules.summarizeLoan(state.activeLoan);
    }
    el.endYears.textContent = state.loopsCompleted;
    el.endTurns.textContent = state.turnsTaken;
    el.endStrongest.textContent = ranking.strongest.label;
    el.endWeakest.textContent = ranking.weakest.label;
    el.endToken.textContent = state.selectedToken ? state.selectedToken.icon + " " + state.selectedToken.name : "None";
    el.endMoney.textContent = state.stats.money;
    el.endEnvironment.textContent = state.stats.environment;
    el.endTrust.textContent = state.stats.trust;
    el.reflectionLine.textContent = summary.reflection;
    goToScreen("gameOver");
  }

  function resetGame() {
    resetStateForNewSession();
    goToScreen("rules");
  }

  function resetStateForNewSession() {
    var currentScreen = state.currentScreen;
    var selectedRounds = state.selectedRounds;
    var selectedMode = state.selectedMode;
    var selectedToken = state.selectedToken;

    state = AOC.createInitialState();
    state.selectedRounds = selectedRounds;
    state.selectedMode = selectedMode;
    state.selectedToken = selectedToken;
    state.currentScreen = currentScreen || "home";
    AOC.ui.hideChoiceModal(el);
    AOC.ui.hideYearSummary(el);
    AOC.ui.hideLoanModal(el);
    AOC.ui.hideInvestmentModal(el);
    AOC.ui.hideHowToModal(el);
    AOC.ui.hideBoardTooltip(el);
    AOC.ui.updateUI(el, state);
  }

  function boot() {
    AOC.ui.initElements(el);
    AOC.ui.bindEvents(el, {
      onGoToModeSelect: goToModeSelect,
      onOpenHowTo: openHowTo,
      onCloseHowTo: closeHowTo,
      onSelectMode: selectMode,
      onSelectRounds: selectRounds,
      onSelectToken: selectToken,
      onContinueFromMode: continueFromMode,
      onContinueFromRounds: continueFromRounds,
      onStartGame: startGame,
      onBackToHome: function () {
        resetSetupSelections();
        goToScreen("home");
      },
      onBackToModeSelect: function () {
        goToScreen("modeSelect");
      },
      onBackToRounds: function () {
        goToScreen("roundSelect");
      },
      onRoll: handleRoll,
      onRestart: resetGame,
      onReturnHome: returnHome,
      onContinueYear: continueAfterYearSummary,
      onReviewInvestments: reviewInvestments,
      onCloseInvestments: closeInvestmentModal
    });
    AOC.ui.renderModePicker(el, state.selectedMode ? state.selectedMode.id : "", function (modeId) {
      return function () {
        selectMode(modeId);
      };
    });
    AOC.ui.renderBoard(el);
    AOC.ui.updateUI(el, state);
    goToScreen("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}());
