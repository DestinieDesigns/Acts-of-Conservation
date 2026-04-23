window.VOTF_BOOTED = true;

(function () {
  var state = AOC.createInitialState();
  var el = AOC.createElementRegistry();
  var lastNarratedWarning = "";

  function selectRounds(rounds) {
    state.selectedRounds = rounds;
    AOC.ui.renderRoundPicker(el, state.selectedRounds, selectRounds);
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
    AOC.ui.renderModePicker(el, state.selectedMode ? state.selectedMode.id : "", function (nextModeId) {
      return function () {
        selectMode(nextModeId);
      };
    });
    AOC.ui.updateUI(el, state);
    if (state.selectedMode) {
      AOC.ui.narrateWarning(
        state,
        state.selectedMode.name + ". " + state.selectedMode.shortDescription + ". Goal: " + state.selectedMode.goal
      );
    }
  }

  function selectCharacter(characterId) {
    var i;
    var character;

    for (i = 0; i < AOC.data.characters.length; i += 1) {
      if (AOC.data.characters[i].id === characterId) {
        character = AOC.data.characters[i];
        if (!(character.unlocked || state.unlockedCharacters[character.id])) {
          state.selectedCharacter = null;
          state.selectedToken = null;
          AOC.ui.renderCharacterPicker(el, character.id, function (nextCharacterId) {
            return function () {
              selectCharacter(nextCharacterId);
            };
          }, state.unlockedCharacters);
          AOC.ui.updateUI(el, state);
          AOC.ui.updateCharacterDetails(el, character);
          AOC.ui.updateStatus(el, character.name + " is locked. " + character.unlockText);
          return;
        }
        state.selectedCharacter = character;
        state.selectedToken = character;
        break;
      }
    }
    AOC.ui.renderCharacterPicker(el, state.selectedCharacter ? state.selectedCharacter.id : "", function (nextCharacterId) {
      return function () {
        selectCharacter(nextCharacterId);
      };
    }, state.unlockedCharacters);
    AOC.ui.updateUI(el, state);
  }

  function selectIsland(islandId) {
    var i;

    for (i = 0; i < AOC.data.islands.length; i += 1) {
      if (AOC.data.islands[i].id === islandId) {
        state.selectedIsland = AOC.data.islands[i];
        break;
      }
    }
    AOC.ui.renderIslandPicker(el, state.selectedIsland ? state.selectedIsland.id : "", function (nextIslandId) {
      return function () {
        selectIsland(nextIslandId);
      };
    });
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

  function openSettings() {
    AOC.ui.showSettingsModal(el);
  }

  function closeSettings() {
    AOC.ui.hideSettingsModal(el);
  }

  function setTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    AOC.storage.write("aoc.theme", state.theme);
    AOC.ui.updateUI(el, state);
  }

  function updateVoiceSetting(key, value) {
    state.voiceSettings[key] = value;
    AOC.storage.write("aoc.voice." + key, value);
    AOC.ui.updateUI(el, state);
  }

  function syncVoiceOptions() {
    if (!("speechSynthesis" in window)) {
      return;
    }
    AOC.ui.populateVoiceOptions(el, window.speechSynthesis.getVoices(), state.voiceSettings.voiceName);
  }

  function maybeNarrateWarnings() {
    var budgetWarning = AOC.rules.buildBudgetWarning(state.stats.money, state.debtOwed);
    var environmentCondition = AOC.rules.getEnvironmentCondition(state.stats.environment);
    var trustCondition = AOC.rules.getTrustCondition(state.stats.trust);
    var warning = "";

    if (budgetWarning.level === "crash" || budgetWarning.level === "debt" || budgetWarning.level === "critical") {
      warning = budgetWarning.text;
    } else if (environmentCondition.tone === "danger" || environmentCondition.tone === "collapse") {
      warning = state.simpleMode ? "Nature is getting hurt." : environmentCondition.message;
    } else if (trustCondition.tone === "danger" || trustCondition.tone === "collapse") {
      warning = state.simpleMode ? "People are starting to feel upset." : trustCondition.message;
    }

    if (warning && warning !== lastNarratedWarning) {
      lastNarratedWarning = warning;
      AOC.ui.narrateWarning(state, warning);
    }
    if (!warning) {
      lastNarratedWarning = "";
    }
  }

  function goToModeSelect() {
    closeHowTo();
    closeSettings();
    goToScreen("modeSelect");
  }

  function continueFromMode() {
    if (!state.selectedMode) {
      return;
    }
    goToScreen("characterSelect");
  }

  function continueFromCharacter() {
    if (!state.selectedCharacter) {
      return;
    }
    goToScreen("islandSelect");
  }

  function continueFromIsland() {
    if (!state.selectedIsland) {
      return;
    }
    goToScreen("roundSelect");
  }

  function continueFromRounds() {
    if (!state.selectedRounds) {
      return;
    }
    goToScreen("ready");
  }

  function startGame() {
    if (!state.selectedMode || !state.selectedCharacter || !state.selectedIsland || !state.selectedRounds) {
      return;
    }
    resetStateForNewSession();
    applySelectedModeSetup();
    state.hasGameStarted = true;
    seedInvestmentOffers(4);
    closeSettings();
    goToScreen("playing");
    AOC.ui.updateStatus(el, state.selectedMode.name + " is active on " + state.selectedIsland.name + ". Roll to move and face new planning challenges.");
    AOC.ui.setCenterMessage(el, state.selectedIsland.name, state.selectedIsland.description);
    AOC.ui.updateUI(el, state);
  }

  function resetSetupSelections() {
    state.selectedMode = null;
    state.selectedCharacter = null;
    state.selectedToken = null;
    state.selectedIsland = null;
    state.selectedRounds = null;
    AOC.ui.renderModePicker(el, "", function (modeId) {
      return function () {
        selectMode(modeId);
      };
    });
    AOC.ui.renderCharacterPicker(el, "", function (characterId) {
      return function () {
        selectCharacter(characterId);
      };
    }, state.unlockedCharacters);
    AOC.ui.renderIslandPicker(el, "", function (islandId) {
      return function () {
        selectIsland(islandId);
      };
    });
    AOC.ui.renderRoundPicker(el, null, selectRounds);
    AOC.ui.updateUI(el, state);
  }

  function toggleSimpleMode(enabled) {
    state.simpleMode = !!enabled;
    AOC.storage.write("aoc.simpleMode", state.simpleMode);
    AOC.ui.updateUI(el, state);
  }

  function returnHome() {
    closeHowTo();
    closeSettings();
    resetSetupSelections();
    resetStateForNewSession();
    goToScreen("home");
  }

  function applySelectedModeSetup() {
    var startingStats;

    if (!state.selectedIsland || !AOC.islands.hasConfig(state.selectedIsland)) {
      state.selectedIsland = AOC.data.islands[0];
    }
    startingStats = AOC.rules.getStartingStatsPreview(state.selectedMode, state.selectedCharacter, state.selectedIsland);
    state.stats.money = startingStats.money;
    state.stats.environment = startingStats.environment;
    state.stats.trust = startingStats.trust;
    state.activePromises = [];
    state.activeShortcuts = [];
    state.debtOwed = 0;
    state.interestThisYear = 0;
    state.debtAtYearStart = 0;
    state.promiseBudgetPaidThisYear = 0;
    state.promiseTrustPenaltyThisYear = 0;
    state.shortcutDamageThisYear = 0;
    state.yearlyRollCount = 0;
    state.islandGrid = AOC.rules.createIslandGrid(state);
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

  function markSupportOffersHandledThisTurn() {
    state.loanOfferTurn = state.turnsTaken;
    state.promiseOfferTurn = state.turnsTaken;
    state.shortcutOfferTurn = state.turnsTaken;
  }

  async function handleRoll() {
    var roll;
    var rawPosition;
    var plot;
    var scenarioIndex;
    var scenarioObj;
    var completedLoop;
    var startingPosition;

    if (state.awaitingChoice || state.awaitingYearSummary || state.awaitingLoanDecision || state.awaitingPromiseDecision || state.awaitingShortcutDecision || state.awaitingDebtDecision || state.gameOver || state.isAnimating) {
      return;
    }

    state.isAnimating = true;
    if (!state.hasGameStarted) {
      state.hasGameStarted = true;
    }
    AOC.ui.updateUI(el, state);
    AOC.ui.hideBoardTooltip(el);
    roll = Math.floor(Math.random() * 6) + 1;
    startingPosition = state.position;
    state.turnsTaken += 1;
    state.yearlyRollCount += 1;
    state.lastRoll = roll;
    AOC.ui.updateUI(el, state);
    await AOC.ui.animateDiceDisplay(el, roll);

    rawPosition = startingPosition + roll;
    completedLoop = false;
    await animateTokenMovement(roll);
    completedLoop = rawPosition >= AOC.data.plots.length || state.position === 0;
    await handleLandingTileEffects({ isTeleport: false });

    plot = AOC.data.plots[state.position];
    scenarioIndex = AOC.rules.pickScenarioIndex(state, state.position);
    scenarioObj = plot.scenarios[scenarioIndex];
    AOC.ui.updateStatus(el, "You rolled a " + roll + " and arrived at " + plot.tileName + ".");
    AOC.ui.setCenterMessage(el, "Arrived at " + plot.tileName, AOC.rules.buildScenarioSummary(plot, scenarioObj));
    AOC.ui.updateUI(el, state);
    await AOC.utils.wait(200);

    if (completedLoop) {
      state.loopsCompleted += 1;
      state.year = state.loopsCompleted;
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

  async function animateTeleportMovement(destinationIndex) {
    AOC.ui.showTileFeedback(el, state.position, {
      type: "goToCrisis",
      feedbackText: "Go to Crisis",
      message: "Moving to a crisis tile."
    });
    await AOC.utils.wait(160);
    state.position = destinationIndex;
    AOC.ui.updateUI(el, state);
    AOC.ui.showTileFeedback(el, state.position, {
      type: "crisis",
      feedbackText: "Crisis",
      message: "Arrived at a crisis tile."
    });
    await AOC.utils.wait(260);
  }

  async function handleLandingTileEffects(options) {
    var tile = AOC.data.plots[state.position];
    var result = AOC.rules.handleTile(tile, state, AOC.data, options || {});

    if (!result || result.type === "normal") {
      return;
    }

    AOC.ui.showTileFeedback(el, state.position, result);
    if (result.teleportTo !== undefined && result.teleportTo !== state.position && !(options && options.isTeleport)) {
      AOC.ui.updateStatus(el, result.message);
      await animateTeleportMovement(result.teleportTo);
      await handleLandingTileEffects({ isTeleport: true });
      return;
    }

    if (result.effects && ((result.effects.money || 0) !== 0 || (result.effects.environment || 0) !== 0 || (result.effects.trust || 0) !== 0)) {
      applyEffects(result.effects);
      AOC.ui.showStatFeedback(el, result.effects);
      AOC.ui.triggerIslandReaction(el, result.effects);
      AOC.ui.updateStatus(el, result.message);
      AOC.ui.updateUI(el, state);
      await AOC.utils.wait(360);
    }
  }

  function createChoiceHandler(option) {
    return function () {
      handleChoice(option);
    };
  }

  function showCard(plot, scenarioObj) {
    var card = AOC.rules.buildDecisionCard(plot, scenarioObj);
    if (state.simpleMode) {
      card.simpleTone = "Think about what helps money, nature, and people the most.";
      card.description = AOC.rules.getSimpleScenarioText(card.description);
    }
    AOC.ui.showCard(el, card, createChoiceHandler);
    AOC.ui.narrateCard(state, card);
  }

  function applyEffects(effects) {
    AOC.rules.applyModeStatEffects(state, effects);
    AOC.rules.mutateIslandGrid(state, effects || {});
  }

  function buildYearSummarySnapshot() {
    var snapshot = AOC.rules.buildYearSummaryContent(state.stats);
    snapshot.eventNote = state.yearFinancialLog.length ? AOC.rules.buildAnnualFinancialSummary(state.yearFinancialLog) : "";
    snapshot.investments = AOC.rules.summarizeInvestments(state.activeInvestments);
    snapshot.loans = AOC.rules.summarizeLoan(state);
    snapshot.debt = Math.round((state.debtOwed || 0) * 100) / 100;
    snapshot.interest = Math.round((state.interestThisYear || 0) * 100) / 100;
    snapshot.financialState = AOC.rules.getMoneyCondition(state.stats.money).label;
    snapshot.canReviewInvestments = !!(state.availableInvestments.length && !state.investmentPurchasedThisYear &&
      (!AOC.rules.modeSupportsGameLength(state.selectedMode) || state.loopsCompleted < state.selectedRounds));
    return snapshot;
  }

  function processNewYearBudgetCycle() {
    var investmentNotes;
    var promiseNotes;
    var shortcutNotes;
    var i;
    var interest;
    var debtPressureNote;
    var eventNote;

    state.investmentPurchasedThisYear = false;
    state.yearFinancialLog = [];
    seedInvestmentOffers(4);
    investmentNotes = AOC.rules.applyAnnualInvestmentEffects(state);
    for (i = 0; i < investmentNotes.length; i += 1) {
      state.yearFinancialLog.push(investmentNotes[i]);
      AOC.ui.showStatFeedback(el, investmentNotes[i]);
    }
    interest = AOC.rules.applyYearEndInterest(state);
    if (interest > 0) {
      state.yearFinancialLog.push({
        type: "interest",
        title: "Interest This Year",
        description: "Unpaid debt gained interest based on how many turns you took this year.",
        money: 0,
        environment: 0,
        trust: 0
      });
    }
    promiseNotes = AOC.rules.resolveYearEndPromises(state);
    for (i = 0; i < promiseNotes.length; i += 1) {
      state.yearFinancialLog.push(promiseNotes[i]);
      AOC.ui.showStatFeedback(el, promiseNotes[i]);
    }
    shortcutNotes = AOC.rules.resolveYearEndShortcuts(state);
    for (i = 0; i < shortcutNotes.length; i += 1) {
      state.yearFinancialLog.push(shortcutNotes[i]);
      AOC.ui.showStatFeedback(el, shortcutNotes[i]);
    }
    debtPressureNote = AOC.rules.applyDebtPressureEffects(state);
    if (debtPressureNote) {
      state.yearFinancialLog.push(debtPressureNote);
      AOC.ui.showStatFeedback(el, debtPressureNote);
    }

    eventNote = AOC.rules.resolveFinancialEvent(state);
    if (eventNote) {
      applyEffects(eventNote);
      state.yearFinancialLog.push(eventNote);
      AOC.ui.showStatFeedback(el, eventNote);
    }
    state.pendingDebtSummary = AOC.rules.buildDebtSummary(state);
    if (!state.pendingDebtSummary.hasConsequences) {
      state.pendingDebtSummary = null;
    }
    state.yearlyRollCount = 0;
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
    maybeNarrateWarnings();
    if (maybeOfferLoan()) {
      return;
    }
    checkEndConditions();
  }

  function buildLoanContext() {
    return {
      title: "Budget Running Low",
      description: state.simpleMode ?
        "Your budget is getting low. You can borrow money now, but if you do not pay it back, it grows." :
        "Your available budget is running low. You can borrow funds now, but unpaid debt will grow with interest each year.",
      choices: AOC.data.loanOffers.map(function (loan, index) {
        return {
          id: loan.id,
          kicker: index === 0 ? "Small Step" : index === 1 ? "Stronger Support" : "Emergency Boost",
          label: loan.name + " (+" + loan.amount + ")",
          tone: loan.tone,
          description: loan.description,
          preview: { money: loan.amount, debt: loan.amount, trust: 0 },
          loan: loan
        };
      }).concat([{
        id: "decline-loan",
        kicker: "No Borrowing",
        label: "Decline Loan",
        tone: "risky",
        description: "Keep your current budget and avoid new debt for now.",
        preview: { money: 0, debt: 0, trust: 0 }
      }])
    };
  }

  function createLoanChoiceHandler(choice) {
    return function () {
      handleLoanDecision(choice);
    };
  }

  function buildPromiseContext() {
    return {
      title: "Trust Is Slipping",
      description: state.simpleMode ?
        "People are starting to feel upset. You can make a promise now to lift trust, but keeping that promise will cost budget later." :
        "Community trust is getting low. You can make public promises now to raise confidence, but unfulfilled promises will cost budget later or hurt trust even more.",
      choices: AOC.data.promiseOffers.map(function (promise, index) {
        return {
          id: promise.id,
          kicker: index === 0 ? "Small Promise" : index === 1 ? "Bigger Promise" : "Major Promise",
          label: promise.name + " (+" + promise.trustGain + " Trust)",
          tone: promise.tone,
          description: promise.description,
          previewItems: [
            { label: "Trust Now", value: promise.trustGain },
            { label: "Later Budget", value: -promise.fulfillmentCost },
            { label: "Broken Trust", value: promise.penalty }
          ],
          promise: promise
        };
      }).concat([{
        id: "decline-promise",
        kicker: "No Promise",
        label: "Stay Cautious",
        tone: "risky",
        description: "Keep trust where it is now and avoid adding future obligations.",
        previewItems: [
          { label: "Trust Now", value: 0 },
          { label: "Later Budget", value: 0 },
          { label: "Broken Trust", value: 0 }
        ]
      }])
    };
  }

  function createPromiseChoiceHandler(choice) {
    return function () {
      handlePromiseDecision(choice);
    };
  }

  function maybeOfferPromise() {
    if (!AOC.rules.shouldOfferPromise(state.stats.trust) || state.awaitingLoanDecision || state.awaitingPromiseDecision || state.awaitingShortcutDecision || state.awaitingDebtDecision) {
      return false;
    }
    if (state.promiseOfferTurn === state.turnsTaken && !state.awaitingYearSummary) {
      return false;
    }
    state.awaitingPromiseDecision = true;
    markSupportOffersHandledThisTurn();
    AOC.ui.updateUI(el, state);
    AOC.ui.showLoanModal(el, buildPromiseContext(), createPromiseChoiceHandler);
    AOC.ui.narrateWarning(state, "Trust is low. Promise options are available.");
    return true;
  }

  function handlePromiseDecision(choice) {
    state.awaitingPromiseDecision = false;
    AOC.ui.hideLoanModal(el);

    if (choice.promise) {
      AOC.ui.showStatFeedback(el, AOC.rules.takePromise(state, choice.promise));
      AOC.ui.updateStatus(el, choice.promise.name + " made. Trust rises now, but keeping that promise will cost budget later.");
      AOC.ui.setCenterMessage(el, "Promise Made", state.simpleMode ? "You made a promise to help people feel better now. It will cost money later to keep it." : "Promises can calm the present, but delayed commitments still have to be funded if you want trust to last.");
    } else {
      AOC.ui.updateStatus(el, "You chose not to make a new promise. Trust stays low, but no extra obligation was added.");
      AOC.ui.setCenterMessage(el, "No New Promise", "Holding back avoids future pressure, but it does not rebuild trust on its own.");
    }

    AOC.ui.updateUI(el, state);
    maybeNarrateWarnings();
    if (maybeOfferBudgetTradeoff()) {
      return;
    }
    checkEndConditions();
  }

  function buildShortcutContext() {
    return {
      title: "Environmental Shortcut",
      description: state.simpleMode ?
        "You can get more budget now by taking a shortcut that hurts nature later." :
        "You can take an environmental shortcut to gain budget now, but the ecological damage will land at year end.",
      choices: AOC.data.shortcutOffers.map(function (shortcut, index) {
        return {
          id: shortcut.id,
          kicker: index === 0 ? "Minor Shortcut" : index === 1 ? "Bigger Shortcut" : "Heavy Shortcut",
          label: shortcut.name + " (+" + shortcut.moneyGain + " Budget)",
          tone: shortcut.tone,
          description: shortcut.description,
          previewItems: [
            { label: "Budget Now", value: shortcut.moneyGain },
            { label: "Later Environment", value: shortcut.delayedEnvironmentLoss }
          ],
          shortcut: shortcut
        };
      }).concat([{
        id: "decline-shortcut",
        kicker: "Protect Nature",
        label: "Decline Shortcut",
        tone: "positive",
        description: "Keep the island's ecosystems safer, even if budget pressure stays higher now.",
        previewItems: [
          { label: "Budget Now", value: 0 },
          { label: "Later Environment", value: 0 }
        ]
      }])
    };
  }

  function createShortcutChoiceHandler(choice) {
    return function () {
      handleShortcutDecision(choice);
    };
  }

  function maybeOfferShortcut(resolvedOption) {
    if (!AOC.rules.shouldOfferShortcut(state.stats.money, resolvedOption) || state.awaitingLoanDecision || state.awaitingPromiseDecision || state.awaitingShortcutDecision || state.awaitingDebtDecision) {
      return false;
    }
    if (state.shortcutOfferTurn === state.turnsTaken && !state.awaitingYearSummary) {
      return false;
    }
    state.awaitingShortcutDecision = true;
    markSupportOffersHandledThisTurn();
    AOC.ui.updateUI(el, state);
    AOC.ui.showLoanModal(el, buildShortcutContext(), createShortcutChoiceHandler);
    AOC.ui.narrateWarning(state, "Environmental shortcut options are available.");
    return true;
  }

  function maybeOfferBudgetTradeoff(resolvedOption) {
    if (state.debtOwed >= 300 && maybeOfferShortcut(resolvedOption)) {
      return true;
    }
    if (maybeOfferLoan()) {
      return true;
    }
    if (maybeOfferShortcut(resolvedOption)) {
      return true;
    }
    return false;
  }

  function handleShortcutDecision(choice) {
    state.awaitingShortcutDecision = false;
    AOC.ui.hideLoanModal(el);

    if (choice.shortcut) {
      AOC.ui.showStatFeedback(el, AOC.rules.takeShortcut(state, choice.shortcut));
      AOC.ui.updateStatus(el, choice.shortcut.name + " taken. Available Budget rises now, but year-end environmental damage is now locked in.");
      AOC.ui.setCenterMessage(el, "Shortcut Taken", state.simpleMode ? "You got money now, but nature will be hurt later." : "Shortcuts can protect the current budget, but they push environmental costs into the future.");
    } else {
      AOC.ui.updateStatus(el, "You declined the environmental shortcut and kept future ecological damage off the board.");
      AOC.ui.setCenterMessage(el, "Shortcut Declined", "Protecting the island now may leave finances tighter, but it avoids delayed damage later.");
    }

    AOC.ui.updateUI(el, state);
    maybeNarrateWarnings();
    if (maybeOfferPromise()) {
      return;
    }
    checkEndConditions();
  }

  function maybeOfferLoan() {
    if (!AOC.rules.shouldOfferLoan(state.stats.money) || state.awaitingLoanDecision || state.awaitingPromiseDecision || state.awaitingShortcutDecision || state.awaitingDebtDecision) {
      return false;
    }
    if (state.loanOfferTurn === state.turnsTaken && !state.awaitingYearSummary) {
      return false;
    }
    state.awaitingLoanDecision = true;
    markSupportOffersHandledThisTurn();
    AOC.ui.updateUI(el, state);
    AOC.ui.showLoanModal(el, buildLoanContext(), createLoanChoiceHandler);
    AOC.ui.narrateWarning(state, "Budget running low. Loan options are available.");
    return true;
  }

  function handleLoanDecision(choice) {
    state.awaitingLoanDecision = false;
    AOC.ui.hideLoanModal(el);

    if (choice.loan) {
      AOC.ui.showStatFeedback(el, AOC.rules.takeLoan(state, choice.loan.amount));
      AOC.ui.updateStatus(el, choice.loan.name + " accepted. Available Budget increased now, and Debt Owed increased by the same amount.");
      AOC.ui.setCenterMessage(el, "Debt Added", state.simpleMode ? "You borrowed money. If you do not pay it back, it grows." : "Loans can stabilize the present, but interest turns short-term relief into longer-term pressure.");
    } else {
      AOC.ui.updateStatus(el, "You declined new borrowing. Your budget stays low, but you avoided taking on more debt.");
      AOC.ui.setCenterMessage(el, "Loan Declined", "Skipping a loan preserves independence now, but low reserves still make the next year riskier.");
    }

    AOC.ui.updateUI(el, state);
    maybeNarrateWarnings();
    if (maybeOfferPromise()) {
      return;
    }
    if (maybeOfferBudgetTradeoff()) {
      return;
    }
    checkEndConditions();
  }

  function buildDebtRepaymentContext() {
    var summary = state.pendingDebtSummary || AOC.rules.buildDebtSummary(state);
    var partialChoices = [25, 50, 100];
    var choices = [];
    var summaryHtml;
    var i;
    summaryHtml =
      "<p><strong>Debt Owed at Start:</strong> " + summary.debtAtStart + "</p>" +
      "<p><strong>Interest This Year:</strong> " + summary.interest + "</p>" +
      "<p><strong>Promise Cost Paid:</strong> " + summary.promiseBudgetPaid + "</p>" +
      "<p><strong>Promise Trust Penalty:</strong> " + summary.promiseTrustPenalty + "</p>" +
      "<p><strong>Shortcut Damage:</strong> " + summary.shortcutDamage + "</p>" +
      "<p><strong>Total Debt Owed Now:</strong> " + summary.totalDebt + "</p>" +
      "<p><strong>Available Budget:</strong> " + summary.availableBudget + "</p>" +
      "<p><strong>Debt Pressure:</strong> " + summary.pressure.label + "</p>";

    if (state.debtOwed > 0) {
      choices.push({
        id: "pay-full",
        kicker: "Clear It",
        label: "Pay Full",
        tone: state.stats.money >= state.debtOwed ? "positive" : "risky",
        description: "Pay the entire debt now if you can afford it.",
        previewItems: [
          { label: "Budget", value: -Math.min(state.debtOwed, state.stats.money) },
          { label: "Debt", value: -state.debtOwed }
        ],
        paymentType: "full"
      });

      for (i = 0; i < partialChoices.length; i += 1) {
        if (state.stats.money <= 0) {
          break;
        }
        choices.push({
          id: "pay-" + partialChoices[i],
          kicker: "Pay Part",
          label: "Pay " + partialChoices[i],
          tone: "positive",
          description: "Reduce debt now and carry the rest into next year.",
          previewItems: [
            { label: "Budget", value: -Math.min(partialChoices[i], state.stats.money, state.debtOwed) },
            { label: "Debt", value: -Math.min(partialChoices[i], state.stats.money, state.debtOwed) }
          ],
          paymentType: "partial",
          amount: partialChoices[i]
        });
      }

      if (state.stats.money > 0) {
        choices.push({
          id: "pay-max",
          kicker: "Pay Part",
          label: "Pay Max Affordable",
          tone: "positive",
          description: "Put the largest affordable amount toward debt right now.",
          previewItems: [
            { label: "Budget", value: -Math.min(state.stats.money, state.debtOwed) },
            { label: "Debt", value: -Math.min(state.stats.money, state.debtOwed) }
          ],
          paymentType: "max"
        });
      }

      choices.push({
        id: "skip-payment",
        kicker: "Wait",
        label: "Skip Payment",
        tone: "risky",
        description: "Keep your budget for now and carry all debt into the next year.",
        previewItems: [
          { label: "Budget", value: 0 },
          { label: "Debt", value: 0 }
        ],
        paymentType: "skip"
      });
    } else {
      choices.push({
        id: "acknowledge-year-end",
        kicker: "Continue",
        label: "Continue",
        tone: "positive",
        description: "Carry these consequences forward and keep playing.",
        previewItems: [
          { label: "Budget", value: 0 },
          { label: "Debt", value: 0 },
          { label: "Trust", value: 0 }
        ],
        paymentType: "acknowledge"
      });
    }

    return {
      title: "Year-End Consequences",
      description: summary.message,
      summaryHtml: summaryHtml,
      choices: choices
    };
  }

  function createDebtChoiceHandler(choice) {
    return function () {
      handleDebtDecision(choice);
    };
  }

  function maybeShowDebtSummary() {
    if (!state.pendingDebtSummary || state.awaitingDebtDecision) {
      return false;
    }
    state.awaitingDebtDecision = true;
    AOC.ui.updateUI(el, state);
    AOC.ui.showLoanModal(el, buildDebtRepaymentContext(), createDebtChoiceHandler);
    AOC.ui.narrateWarning(state, "Year-end consequences summary. Delayed costs from this year are now being reviewed.");
    return true;
  }

  function handleDebtDecision(choice) {
    var paid = 0;

    state.awaitingDebtDecision = false;
    AOC.ui.hideLoanModal(el);

    if (choice.paymentType === "acknowledge") {
      AOC.ui.updateStatus(el, "You reviewed the delayed effects from this year and moved into the next one.");
    } else if (choice.paymentType === "full") {
      paid = AOC.rules.payDebt(state, state.debtOwed);
      AOC.ui.updateStatus(el, "You paid your full debt if affordable. Paying now lowers future interest pressure.");
    } else if (choice.paymentType === "partial") {
      paid = AOC.rules.payDebt(state, choice.amount);
      AOC.ui.updateStatus(el, "You made a partial debt payment. Some debt remains and will keep growing if ignored.");
    } else if (choice.paymentType === "max") {
      paid = AOC.rules.payDebt(state, Math.min(state.stats.money, state.debtOwed));
      AOC.ui.updateStatus(el, "You paid the maximum you could afford this year.");
    } else {
      AOC.ui.updateStatus(el, "You skipped payment this year. Debt stays and future interest will continue to build.");
    }

    if (paid > 0) {
      AOC.ui.showStatFeedback(el, { money: -paid, environment: 0, trust: 0 });
    }

    state.pendingDebtSummary = null;
    state.interestThisYear = 0;
    state.debtAtYearStart = 0;
    state.promiseBudgetPaidThisYear = 0;
    state.promiseTrustPenaltyThisYear = 0;
    state.shortcutDamageThisYear = 0;
    AOC.ui.updateUI(el, state);
    maybeNarrateWarnings();
    resumePendingLandingAfterYear();
  }

  function resumePendingLandingAfterYear() {
    var pending;
    var plot;
    var scenarioObj;

    if (AOC.rules.modeSupportsGameLength(state.selectedMode) && state.loopsCompleted >= state.selectedRounds) {
      endGame(AOC.rules.getModeFinalEnding(state));
      return;
    }

    if (!state.pendingLanding) {
      return;
    }

    pending = state.pendingLanding;
    state.pendingLanding = null;
    plot = AOC.data.plots[pending.plotIndex];
    scenarioObj = plot.scenarios[pending.scenarioIndex];
    if (maybeOfferPromise()) {
      return;
    }
    if (maybeOfferBudgetTradeoff()) {
      return;
    }
    state.awaitingChoice = true;
    AOC.ui.updateUI(el, state);
    showCard(plot, scenarioObj);
  }

  async function handleChoice(option) {
    var resolvedOption = AOC.rules.resolveChoiceOutcome(state, option);
    var educationNote;

    applyEffects(resolvedOption);
    AOC.ui.triggerIslandReaction(el, resolvedOption);
    state.history.push({
      turn: state.turnsTaken,
      year: state.loopsCompleted,
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
    maybeNarrateWarnings();
    await AOC.ui.resolveChoiceCard(el, resolvedOption);
    state.isAnimating = false;
    AOC.ui.updateUI(el, state);
    if (maybeOfferPromise()) {
      return;
    }
    if (maybeOfferBudgetTradeoff(resolvedOption)) {
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
    if (maybeShowDebtSummary()) {
      AOC.ui.hideYearSummary(el);
      state.awaitingYearSummary = false;
      return;
    }
    if (AOC.rules.modeSupportsGameLength(state.selectedMode) && state.loopsCompleted >= state.selectedRounds) {
      hideYearSummary();
      endGame(AOC.rules.getModeFinalEnding(state));
      return;
    }
    hideYearSummary();
    plot = AOC.data.plots[pending.plotIndex];
    scenarioObj = plot.scenarios[pending.scenarioIndex];
    if (maybeOfferPromise()) {
      return;
    }
    if (maybeOfferBudgetTradeoff()) {
      return;
    }
    state.awaitingChoice = true;
    AOC.ui.updateUI(el, state);
    showCard(plot, scenarioObj);
  }

  function hideYearSummary(preservePendingLanding) {
    AOC.ui.hideYearSummary(el);
    state.awaitingYearSummary = false;
    if (!preservePendingLanding) {
      state.pendingLanding = null;
    }
  }

  function checkEndConditions() {
    var modeFailure;

    modeFailure = AOC.rules.getModeFailureEnding(state);
    if (modeFailure) {
      endGame(modeFailure);
      return;
    }

    if (maybeOfferPromise()) {
      return;
    }

    if (maybeOfferBudgetTradeoff()) {
      return;
    }

    if (AOC.rules.modeSupportsGameLength(state.selectedMode) && state.loopsCompleted >= state.selectedRounds) {
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
      el.endMode.textContent = (state.selectedMode ? state.selectedMode.name : "Unknown") +
        (state.selectedIsland ? " on " + state.selectedIsland.name : "");
    }
    if (el.endInvestments) {
      el.endInvestments.textContent = AOC.rules.summarizeInvestments(state.activeInvestments).replace("None yet.", "None activated.");
    }
    if (el.endLoans) {
      el.endLoans.textContent = AOC.rules.summarizeLoan(state);
    }
    el.endYears.textContent = state.loopsCompleted;
    el.endTurns.textContent = state.turnsTaken;
    el.endStrongest.textContent = ranking.strongest.label;
    el.endWeakest.textContent = ranking.weakest.label;
    if (state.selectedToken) {
      el.endToken.innerHTML = "<span class=\"selected-character-badge\"><span class=\"character-sprite selected-character-sprite character-sprite-" +
        (state.selectedToken.sprite || state.selectedToken.id) + "\" aria-hidden=\"true\"></span><span>" +
        state.selectedToken.name + "</span></span>";
    } else {
      el.endToken.textContent = "None";
    }
    el.endMoney.textContent = state.stats.money;
    el.endEnvironment.textContent = state.stats.environment;
    el.endTrust.textContent = state.stats.trust;
    el.reflectionLine.textContent = summary.reflection;
    AOC.ui.narrateEnding(state, summary.strategy + " " + summary.education);
    updateUnlocksFromRun();
    goToScreen("gameOver");
  }

  function updateUnlocksFromRun() {
    var changed = false;
    if (state.stats.environment >= 50 && !state.unlockedCharacters.tree) {
      state.unlockedCharacters.tree = true;
      changed = true;
    }
    if (state.stats.trust >= 60 && !state.unlockedCharacters.dog) {
      state.unlockedCharacters.dog = true;
      changed = true;
    }
    if (state.stats.money >= 1300 && !state.unlockedCharacters.car) {
      state.unlockedCharacters.car = true;
      changed = true;
    }
    if (state.selectedMode && state.selectedMode.id === "survival" && state.loopsCompleted >= state.selectedRounds && !state.unlockedCharacters.cat) {
      state.unlockedCharacters.cat = true;
      changed = true;
    }
    if (changed) {
      AOC.storage.write("aoc.unlockedCharacters", state.unlockedCharacters);
    }
  }

  function resetGame() {
    resetStateForNewSession();
    goToScreen("ready");
  }

  function resetStateForNewSession() {
    var currentScreen = state.currentScreen;
    var simpleMode = state.simpleMode;
    var theme = state.theme;
    var voiceSettings = {
      enabled: state.voiceSettings.enabled,
      readCards: state.voiceSettings.readCards,
      readWarnings: state.voiceSettings.readWarnings,
      readEndings: state.voiceSettings.readEndings,
      rate: state.voiceSettings.rate,
      pitch: state.voiceSettings.pitch,
      lang: state.voiceSettings.lang,
      voiceName: state.voiceSettings.voiceName
    };
    var selectedRounds = state.selectedRounds;
    var selectedMode = state.selectedMode;
    var selectedCharacter = state.selectedCharacter;
    var selectedToken = state.selectedToken;
    var selectedIsland = state.selectedIsland;
    var unlockedCharacters = state.unlockedCharacters;

    state = AOC.createInitialState();
    state.simpleMode = simpleMode;
    state.theme = theme;
    state.voiceSettings = voiceSettings;
    state.selectedRounds = selectedRounds;
    state.selectedMode = selectedMode;
    state.selectedCharacter = selectedCharacter;
    state.selectedToken = selectedCharacter || selectedToken;
    state.selectedIsland = selectedIsland;
    state.unlockedCharacters = unlockedCharacters;
    state.currentScreen = currentScreen || "home";
    AOC.ui.hideChoiceModal(el);
    AOC.ui.hideYearSummary(el);
    AOC.ui.hideLoanModal(el);
    AOC.ui.hideInvestmentModal(el);
    AOC.ui.hideHowToModal(el);
    AOC.ui.hideSettingsModal(el);
    AOC.ui.hideBoardTooltip(el);
    AOC.ui.updateUI(el, state);
  }

  function boot() {
    AOC.ui.initElements(el);
    AOC.ui.bindEvents(el, {
      onGoToModeSelect: goToModeSelect,
      onOpenHowTo: openHowTo,
      onCloseHowTo: closeHowTo,
      onOpenSettings: openSettings,
      onCloseSettings: closeSettings,
      onSelectMode: selectMode,
      onSelectIsland: selectIsland,
      onSelectRounds: selectRounds,
      onToggleSimpleMode: toggleSimpleMode,
      onSetTheme: setTheme,
      onUpdateVoiceSetting: updateVoiceSetting,
      onSelectToken: selectCharacter,
      onSelectCharacter: selectCharacter,
      onContinueFromMode: continueFromMode,
      onContinueFromCharacter: continueFromCharacter,
      onContinueFromIsland: continueFromIsland,
      onContinueFromRounds: continueFromRounds,
      onStartGame: startGame,
      onBackToHome: function () {
        resetSetupSelections();
        goToScreen("home");
      },
      onBackToModeSelect: function () {
        goToScreen("modeSelect");
      },
      onBackToCharacterSelect: function () {
        goToScreen("characterSelect");
      },
      onBackToIslandSelect: function () {
        goToScreen("islandSelect");
      },
      onBackToRounds: function () {
        goToScreen("roundSelect");
      },
      onRoll: handleRoll,
      onRestart: resetGame,
      onReturnHome: returnHome,
      onContinueYear: function () {
        if (state.awaitingDebtDecision) {
          return;
        }
        continueAfterYearSummary();
      },
      onReviewInvestments: reviewInvestments,
      onCloseInvestments: closeInvestmentModal
    });
    AOC.ui.renderModePicker(el, state.selectedMode ? state.selectedMode.id : "", function (modeId) {
      return function () {
        selectMode(modeId);
      };
    });
    AOC.ui.renderCharacterPicker(el, state.selectedCharacter ? state.selectedCharacter.id : "", function (characterId) {
      return function () {
        selectCharacter(characterId);
      };
    }, state.unlockedCharacters);
    AOC.ui.renderIslandPicker(el, state.selectedIsland ? state.selectedIsland.id : "", function (islandId) {
      return function () {
        selectIsland(islandId);
      };
    });
    AOC.ui.renderRoundPicker(el, state.selectedRounds, selectRounds);
    AOC.ui.renderBoard(el);
    AOC.ui.updateUI(el, state);
    syncVoiceOptions();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = syncVoiceOptions;
    }
    goToScreen("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}());
