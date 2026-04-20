(function () {
  var AOC = window.AOC = window.AOC || {};

  function renderEffectItem(label, value) {
    var className = value >= 0 ? "positive" : "negative";
    var sign = value >= 0 ? "+" : "";
    return "<div class=\"effect-item\"><span class=\"effect-item-label\">" + label + "</span><span class=\"effect-value " + className + "\">" + sign + value + "</span></div>";
  }

  function getChoicePreview(choice) {
    if (choice.outcomes && choice.outcomes.length > 0) {
      return choice.outcomes[0];
    }
    return choice;
  }

  function isTouchLayout() {
    return !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse), (max-width: 760px)").matches);
  }

  function buildScenarioTone(card) {
    var title = (card.title || "").toLowerCase();
    var description = (card.description || "").toLowerCase();

    if (title.indexOf("storm") !== -1 || description.indexOf("damaged") !== -1 || description.indexOf("urgent") !== -1) {
      return "Pressure is rising quickly, and delaying the choice could deepen the island's losses.";
    }
    if (title.indexOf("factory") !== -1 || title.indexOf("development") !== -1 || description.indexOf("developer") !== -1) {
      return "The promise of growth is real, but so are the costs that people and ecosystems may carry later.";
    }
    if (title.indexOf("health") !== -1 || title.indexOf("clinic") !== -1 || description.indexOf("residents") !== -1) {
      return "This decision shapes how supported people feel when the island's needs become personal and immediate.";
    }
    if (title.indexOf("grant") !== -1 || title.indexOf("loan") !== -1 || description.indexOf("budget") !== -1) {
      return "Funding can stabilize the present, but the terms of support often shape tomorrow's trade-offs too.";
    }
    if (title.indexOf("tourism") !== -1 || description.indexOf("coastal") !== -1 || description.indexOf("ecosystem") !== -1) {
      return "A short-term boost may feel attractive, but fragile places often absorb the strain first.";
    }

    return "People, ecosystems, and long-term stability are all affected by what happens next.";
  }

  AOC.ui = {
    initElements: function (el) {
      el.homeScreen = AOC.utils.byId("home-screen");
      el.startScreen = AOC.utils.byId("start-screen");
      el.roundsScreen = AOC.utils.byId("rounds-screen");
      el.rulesScreen = AOC.utils.byId("rules-screen");
      el.gameScreen = AOC.utils.byId("game-screen");
      el.endScreen = AOC.utils.byId("end-screen");
      el.homeStartButton = AOC.utils.byId("home-start-button");
      el.homeHowButton = AOC.utils.byId("home-how-button");
      el.howToModal = AOC.utils.byId("how-to-modal");
      el.howToCloseButton = AOC.utils.byId("how-to-close-button");
      el.startButton = AOC.utils.byId("start-button");
      el.backButton = AOC.utils.byId("back-button");
      el.roundsNextButton = AOC.utils.byId("rounds-next-button");
      el.roundsBackButton = AOC.utils.byId("rounds-back-button");
      el.rulesStartButton = AOC.utils.byId("rules-start-button");
      el.rulesBackButton = AOC.utils.byId("rules-back-button");
      el.rollButton = AOC.utils.byId("roll-button");
      el.restartButton = AOC.utils.byId("restart-button");
      el.returnHomeButton = AOC.utils.byId("return-home-button");
      el.roundOptions = document.querySelectorAll(".round-option");
      el.modePicker = AOC.utils.byId("mode-picker");
      el.modeName = AOC.utils.byId("mode-name");
      el.modeDescription = AOC.utils.byId("mode-description");
      el.modeWin = AOC.utils.byId("mode-win");
      el.modeLose = AOC.utils.byId("mode-lose");
      el.modeGoal = AOC.utils.byId("mode-goal");
      el.modeRisk = AOC.utils.byId("mode-risk");
      el.rulesModeName = AOC.utils.byId("rules-mode-name");
      el.rulesLengthName = AOC.utils.byId("rules-length-name");
      el.rulesModeGoal = AOC.utils.byId("rules-mode-goal");
      el.rulesModeWin = AOC.utils.byId("rules-mode-win");
      el.rulesModeLose = AOC.utils.byId("rules-mode-lose");
      el.tokenPicker = AOC.utils.byId("token-picker");
      el.selectedTokenName = AOC.utils.byId("selected-token-name");
      el.board = AOC.utils.byId("board");
      el.boardPanel = document.querySelector(".board-panel");
      el.boardTooltip = AOC.utils.byId("board-tooltip");
      el.tooltipName = AOC.utils.byId("tooltip-name");
      el.tooltipDescription = AOC.utils.byId("tooltip-description");
      el.moneyStat = AOC.utils.byId("money-stat");
      el.environmentStat = AOC.utils.byId("environment-stat");
      el.trustStat = AOC.utils.byId("trust-stat");
      el.moneyCondition = AOC.utils.byId("money-condition");
      el.environmentCondition = AOC.utils.byId("environment-condition");
      el.trustCondition = AOC.utils.byId("trust-condition");
      el.yearCounter = AOC.utils.byId("year-counter");
      el.turnCounter = AOC.utils.byId("turn-counter");
      el.diceResult = AOC.utils.byId("dice-result");
      el.statusText = AOC.utils.byId("status-text");
      el.financeAlert = AOC.utils.byId("finance-alert");
      el.choiceModal = AOC.utils.byId("choice-modal");
      el.modalPlace = AOC.utils.byId("modal-place");
      el.cardBox = AOC.utils.byId("card-box");
      el.cardTitle = AOC.utils.byId("card-title");
      el.cardDescription = AOC.utils.byId("card-description");
      el.cardTone = AOC.utils.byId("card-tone");
      el.cardFeedback = AOC.utils.byId("card-feedback");
      el.choiceA = AOC.utils.byId("choice-a");
      el.choiceB = AOC.utils.byId("choice-b");
      el.yearModal = AOC.utils.byId("year-modal");
      el.yearTitle = AOC.utils.byId("year-title");
      el.yearMoney = AOC.utils.byId("year-money");
      el.yearEnvironment = AOC.utils.byId("year-environment");
      el.yearTrust = AOC.utils.byId("year-trust");
      el.yearSummary = AOC.utils.byId("year-summary");
      el.yearStrongest = AOC.utils.byId("year-strongest");
      el.yearWeakest = AOC.utils.byId("year-weakest");
      el.yearInvestments = AOC.utils.byId("year-investments");
      el.yearLoans = AOC.utils.byId("year-loans");
      el.yearEventNote = AOC.utils.byId("year-event-note");
      el.yearReflection = AOC.utils.byId("year-reflection");
      el.continueYearButton = AOC.utils.byId("continue-year-button");
      el.reviewInvestmentsButton = AOC.utils.byId("review-investments-button");
      el.loanModal = AOC.utils.byId("loan-modal");
      el.loanTitle = AOC.utils.byId("loan-title");
      el.loanDescription = AOC.utils.byId("loan-description");
      el.loanOptions = AOC.utils.byId("loan-options");
      el.investmentModal = AOC.utils.byId("investment-modal");
      el.investmentTitle = AOC.utils.byId("investment-title");
      el.investmentDescription = AOC.utils.byId("investment-description");
      el.investmentOptions = AOC.utils.byId("investment-options");
      el.closeInvestmentModal = AOC.utils.byId("close-investment-modal");
      el.endingTitle = AOC.utils.byId("ending-title");
      el.endingVerdict = AOC.utils.byId("ending-verdict");
      el.strategySummary = AOC.utils.byId("strategy-summary");
      el.performanceSummary = AOC.utils.byId("performance-summary");
      el.endMode = AOC.utils.byId("end-mode");
      el.educationSummary = AOC.utils.byId("education-summary");
      el.endYears = AOC.utils.byId("end-years");
      el.endTurns = AOC.utils.byId("end-turns");
      el.endStrongest = AOC.utils.byId("end-strongest");
      el.endWeakest = AOC.utils.byId("end-weakest");
      el.endToken = AOC.utils.byId("end-token");
      el.endInvestments = AOC.utils.byId("end-investments");
      el.endLoans = AOC.utils.byId("end-loans");
      el.endMoney = AOC.utils.byId("end-money");
      el.endEnvironment = AOC.utils.byId("end-environment");
      el.endTrust = AOC.utils.byId("end-trust");
      el.reflectionLine = document.querySelector(".reflection-line");
      el.statFeedback = AOC.utils.byId("stat-feedback");
    },

    bindEvents: function (el, callbacks) {
      var i;
      for (i = 0; i < el.roundOptions.length; i += 1) {
        el.roundOptions[i].onclick = function () {
          callbacks.onSelectRounds(parseInt(this.getAttribute("data-rounds"), 10));
        };
      }
      if (el.homeStartButton) {
        el.homeStartButton.onclick = callbacks.onGoToModeSelect;
      }
      if (el.homeHowButton) {
        el.homeHowButton.onclick = callbacks.onOpenHowTo;
      }
      if (el.howToCloseButton) {
        el.howToCloseButton.onclick = callbacks.onCloseHowTo;
      }
      if (el.startButton) {
        el.startButton.onclick = callbacks.onContinueFromMode;
      }
      if (el.backButton) {
        el.backButton.onclick = callbacks.onBackToHome;
      }
      if (el.roundsNextButton) {
        el.roundsNextButton.onclick = callbacks.onContinueFromRounds;
      }
      if (el.roundsBackButton) {
        el.roundsBackButton.onclick = callbacks.onBackToModeSelect;
      }
      if (el.rulesStartButton) {
        el.rulesStartButton.onclick = callbacks.onStartGame;
      }
      if (el.rulesBackButton) {
        el.rulesBackButton.onclick = callbacks.onBackToRounds;
      }
      if (el.rollButton) {
        el.rollButton.onclick = callbacks.onRoll;
      }
      if (el.restartButton) {
        el.restartButton.onclick = callbacks.onRestart;
      }
      if (el.returnHomeButton) {
        el.returnHomeButton.onclick = callbacks.onReturnHome;
      }
      if (el.continueYearButton) {
        el.continueYearButton.onclick = callbacks.onContinueYear;
      }
      if (el.reviewInvestmentsButton) {
        el.reviewInvestmentsButton.onclick = callbacks.onReviewInvestments;
      }
      if (el.closeInvestmentModal) {
        el.closeInvestmentModal.onclick = callbacks.onCloseInvestments;
      }
      document.onclick = function (event) {
        if (!isTouchLayout()) {
          return;
        }
        if (el.boardPanel && el.boardPanel.contains(event.target)) {
          return;
        }
        AOC.ui.hideBoardTooltip(el);
      };
    },

    renderTokenPicker: function (el, selectedTokenId, onSelectToken) {
      var i;
      var token;
      var button;

      if (!el.tokenPicker) {
        return;
      }

      el.tokenPicker.innerHTML = "";
      for (i = 0; i < AOC.data.tokens.length; i += 1) {
        token = AOC.data.tokens[i];
        button = document.createElement("button");
        button.type = "button";
        button.className = "token-option" + (selectedTokenId === token.id ? " selected" : "");
        button.setAttribute("data-token-id", token.id);
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", selectedTokenId === token.id ? "true" : "false");
        button.innerHTML =
          "<span class=\"token-icon\" aria-hidden=\"true\">" + token.icon + "</span>" +
          "<span class=\"token-name\">" + token.name + "</span>";
        button.onclick = onSelectToken(token.id);
        el.tokenPicker.appendChild(button);
      }

      el.tokenOptions = el.tokenPicker.querySelectorAll(".token-option");
    },

    renderModePicker: function (el, selectedModeId, onSelectMode) {
      var i;
      var mode;
      var button;

      if (!el.modePicker) {
        return;
      }

      el.modePicker.innerHTML = "";
      for (i = 0; i < AOC.data.modes.length; i += 1) {
        mode = AOC.data.modes[i];
        button = document.createElement("button");
        button.type = "button";
        button.className = "mode-option" + (selectedModeId === mode.id ? " selected" : "");
        button.setAttribute("data-mode-id", mode.id);
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", selectedModeId === mode.id ? "true" : "false");
        button.innerHTML =
          "<strong>" + mode.name + "</strong>" +
          "<span>" + mode.shortDescription + "</span>";
        button.onclick = onSelectMode(mode.id);
        el.modePicker.appendChild(button);
      }

      el.modeOptions = el.modePicker.querySelectorAll(".mode-option");
    },

    updateModeDetails: function (el, mode) {
      if (!mode) {
        if (el.modeName) {
          el.modeName.textContent = "Select a mode";
        }
        if (el.modeDescription) {
          el.modeDescription.textContent = "Choose a play style to preview its focus and difficulty.";
        }
        if (el.modeGoal) {
          el.modeGoal.textContent = "Your chosen mode will set the main objective for this run.";
        }
        if (el.modeWin) {
          el.modeWin.textContent = "Finish conditions will appear here once you select a mode.";
        }
        if (el.modeLose) {
          el.modeLose.textContent = "Failure conditions will update with the selected mode.";
        }
        if (el.modeRisk) {
          el.modeRisk.textContent = "Each mode creates a different emotional and strategic rhythm.";
        }
        return;
      }
      if (el.modeName) {
        el.modeName.textContent = mode.name;
      }
      if (el.modeDescription) {
        el.modeDescription.textContent = mode.description;
      }
      if (el.modeGoal) {
        el.modeGoal.textContent = mode.goal;
      }
      if (el.modeWin) {
        el.modeWin.textContent = mode.winConditionText;
      }
      if (el.modeLose) {
        el.modeLose.textContent = mode.loseConditionText;
      }
      if (el.modeRisk) {
        el.modeRisk.textContent = mode.philosophy + " " + mode.riskText;
      }
    },

    updateRulesSummary: function (el, state) {
      var lengthLabel = "-";

      if (state.selectedRounds === 10) {
        lengthLabel = "Short - 10 turns";
      } else if (state.selectedRounds === 20) {
        lengthLabel = "Medium - 20 turns";
      } else if (state.selectedRounds === 30) {
        lengthLabel = "Long - 30 turns";
      }

      if (el.rulesModeName) {
        el.rulesModeName.textContent = state.selectedMode ? state.selectedMode.name : "-";
      }
      if (el.rulesLengthName) {
        el.rulesLengthName.textContent = lengthLabel;
      }
      if (el.rulesModeGoal) {
        el.rulesModeGoal.textContent = state.selectedMode ? state.selectedMode.goal : "Select a mode to preview its goal.";
      }
      if (el.rulesModeWin) {
        el.rulesModeWin.textContent = state.selectedMode ? state.selectedMode.winConditionText : "Complete the run with a stable island.";
      }
      if (el.rulesModeLose) {
        el.rulesModeLose.textContent = state.selectedMode ? state.selectedMode.loseConditionText : "Avoid a system collapse before the end.";
      }
    },

    renderBoard: function (el) {
      var i;
      var tile;
      var plot;
      var layout;
      var center;

      el.board.innerHTML = "";
      for (i = 0; i < AOC.data.plots.length; i += 1) {
        plot = AOC.data.plots[i];
        layout = AOC.board.getTileLayout(i);
        tile = document.createElement("article");
        tile.className = "space " + layout.side + (layout.corner ? " corner" : "");
        tile.setAttribute("data-index", String(i));
        tile.setAttribute("data-band", AOC.board.getBand(i));
        tile.setAttribute("tabindex", "0");
        tile.style.left = layout.left;
        tile.style.top = layout.top;
        tile.style.width = layout.width;
        tile.style.height = layout.height;
        tile.innerHTML = "<span class=\"space-index\">" + AOC.board.getCornerLabel(i) + "</span>" +
          "<strong class=\"space-name\">" + plot.tileName + "</strong>" +
          "<span class=\"space-badge\">" + AOC.utils.capitalize(AOC.board.getBand(i)) + "</span>";
        this.attachTileHover(el, tile, plot);
        el.board.appendChild(tile);
      }

      center = document.createElement("section");
      center.className = "board-center";
      center.innerHTML =
        "<div class=\"center-insert\">" +
        "<div class=\"center-branding\">" +
        "<p class=\"center-kicker\">Island Stewardship Board</p>" +
        "<h3>Acts of Conservation</h3>" +
        "<p class=\"center-purpose\">Every stop asks you to weigh economy, ecology, and community well-being together.</p>" +
        "</div>" +
        "<div class=\"center-sections compact status-layout\">" +
        "<section class=\"insert-card status-card\">" +
        "<p class=\"status-kicker\">Game Status</p>" +
        "<h4 id=\"center-message-title\">Island Outlook</h4>" +
        "<p id=\"center-message-body\">Watch your token move across the island and make choices that shape its future.</p>" +
        "</section>" +
        "<section class=\"insert-card compact-card mini-stats-card\">" +
        "<div class=\"mini-stat\"><span>Budget</span><strong id=\"center-money-mini\">100</strong></div>" +
        "<div class=\"mini-stat\"><span>Environment</span><strong id=\"center-environment-mini\">50</strong></div>" +
        "<div class=\"mini-stat\"><span>Trust</span><strong id=\"center-trust-mini\">50</strong></div>" +
        "</section>" +
        "</div>" +
        "</div>";
      el.board.appendChild(center);

      el.centerMessageTitle = AOC.utils.byId("center-message-title");
      el.centerMessageBody = AOC.utils.byId("center-message-body");
      el.centerMoneyMini = AOC.utils.byId("center-money-mini");
      el.centerEnvironmentMini = AOC.utils.byId("center-environment-mini");
      el.centerTrustMini = AOC.utils.byId("center-trust-mini");
    },

    attachTileHover: function (el, tile, plot) {
      tile.onmouseenter = function () {
        if (isTouchLayout()) {
          return;
        }
        AOC.ui.showBoardTooltip(el, tile, plot);
      };
      tile.onmousemove = function () {
        if (isTouchLayout()) {
          return;
        }
        AOC.ui.showBoardTooltip(el, tile, plot);
      };
      tile.onmouseleave = function () {
        if (!isTouchLayout()) {
          AOC.ui.hideBoardTooltip(el);
        }
      };
      tile.onclick = function (event) {
        if (!isTouchLayout()) {
          return;
        }
        event.stopPropagation();
        AOC.ui.toggleBoardTooltip(el, tile, plot);
      };
      tile.onfocus = function () {
        AOC.ui.showBoardTooltip(el, tile, plot);
      };
      tile.onblur = function () {
        if (!isTouchLayout()) {
          AOC.ui.hideBoardTooltip(el);
        }
      };
      tile.onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          AOC.ui.toggleBoardTooltip(el, tile, plot);
        }
      };
    },

    toggleBoardTooltip: function (el, tile, plot) {
      if (!el.boardTooltip) {
        return;
      }
      if (el.boardTooltip.getAttribute("data-tile-index") === tile.getAttribute("data-index") &&
        el.boardTooltip.getAttribute("aria-hidden") === "false") {
        this.hideBoardTooltip(el);
        return;
      }
      this.showBoardTooltip(el, tile, plot);
    },

    showBoardTooltip: function (el, tile, plot) {
      var tileRect;
      var panelRect;
      var left;
      var top;
      var below;
      if (!el.boardTooltip || !el.boardPanel) {
        return;
      }
      el.tooltipName.textContent = plot.tileName;
      el.tooltipDescription.textContent = plot.locationDescription;
      tileRect = tile.getBoundingClientRect();
      panelRect = el.boardPanel.getBoundingClientRect();
      left = tileRect.left - panelRect.left + (tileRect.width / 2);
      top = tileRect.top - panelRect.top - 8;
      below = tileRect.top - panelRect.top < 110;

      if (left < 130) {
        left = 130;
      }
      if (left > panelRect.width - 130) {
        left = panelRect.width - 130;
      }

      el.boardTooltip.style.left = left + "px";
      el.boardTooltip.style.top = top + "px";
      el.boardTooltip.className = below ? "board-tooltip below" : "board-tooltip";
      if (isTouchLayout()) {
        el.boardTooltip.className += " touch-visible";
      }
      el.boardTooltip.setAttribute("data-tile-index", tile.getAttribute("data-index"));
      el.boardTooltip.setAttribute("aria-hidden", "false");
    },

    hideBoardTooltip: function (el) {
      if (!el.boardTooltip) {
        return;
      }
      el.boardTooltip.className = "board-tooltip hidden";
      el.boardTooltip.setAttribute("data-tile-index", "");
      el.boardTooltip.setAttribute("aria-hidden", "true");
    },

    showCard: function (el, card, onChoose) {
      var choiceA = card.choices[0];
      var choiceB = card.choices[1];
      var previewA = getChoicePreview(choiceA);
      var previewB = getChoicePreview(choiceB);

        function bindChoice(button, choice, preview, className, optionLabel) {
          button.className = className;
          button.disabled = false;
          button.innerHTML =
            "<span class=\"decision-option-label\">" + optionLabel + "</span>" +
            "<strong class=\"decision-option-title\">" + choice.label + "</strong>" +
            "<p class=\"decision-option-copy\">A real trade-off with benefits and pressure points.</p>" +
            "<div class=\"effect-list\">" +
            renderEffectItem("Budget", preview.money) +
            renderEffectItem("Environment", preview.environment) +
            renderEffectItem("Trust", preview.trust) +
            "</div>";
          button.onclick = function () {
            el.choiceA.disabled = true;
            el.choiceB.disabled = true;
          onChoose(choice)();
        };
      }

      el.modalPlace.textContent = card.placeLabel;
      el.cardTitle.textContent = card.title;
      el.cardDescription.textContent = card.description;
      if (el.cardTone) {
        el.cardTone.textContent = buildScenarioTone(card);
      }
      if (el.cardFeedback) {
        el.cardFeedback.className = "card-feedback hidden";
        el.cardFeedback.innerHTML = "";
      }
      bindChoice(el.choiceA, choiceA, previewA, "decision-button decision-button-positive", "Option A");
      bindChoice(el.choiceB, choiceB, previewB, "decision-button decision-button-risky", "Option B");

      el.choiceModal.className = "modal card-modal";
      el.choiceModal.setAttribute("aria-hidden", "false");
      if (el.cardBox) {
        el.cardBox.className = "modal-card decision-card";
        window.setTimeout(function () {
            if (el.cardBox && !/hidden/.test(el.choiceModal.className)) {
              el.cardBox.className = "modal-card decision-card ready";
            }
          }, 20);
        }
      window.setTimeout(function () {
        if (el.choiceA && !el.choiceA.disabled) {
          el.choiceA.focus();
        }
      }, 90);
      el.rollButton.disabled = true;
    },

    showChoiceModal: function (el, plot, scenarioObj, onChoose) {
      this.showCard(el, AOC.rules.buildDecisionCard(plot, scenarioObj), onChoose);
    },

    hideChoiceModal: function (el) {
      if (el.choiceModal) {
        el.choiceModal.className = "modal hidden";
        el.choiceModal.setAttribute("aria-hidden", "true");
      }
      if (el.cardBox) {
        el.cardBox.className = "modal-card decision-card";
      }
      if (el.cardFeedback) {
        el.cardFeedback.className = "card-feedback hidden";
        el.cardFeedback.innerHTML = "";
      }
      if (el.cardTone) {
        el.cardTone.textContent = "People, ecosystems, and long-term stability are all affected by what happens next.";
      }
      if (el.choiceA) {
        el.choiceA.onclick = null;
      }
      if (el.choiceB) {
        el.choiceB.onclick = null;
      }
    },

    resolveChoiceCard: async function (el, resolvedOption) {
      var summary;

      if (!el.cardBox || !el.cardFeedback) {
        this.hideChoiceModal(el);
        return;
      }

        summary =
          "<p class=\"card-feedback-title\">Impact this turn</p>" +
          "<p class=\"card-feedback-copy\">" + resolvedOption.feedback + "</p>" +
          "<div class=\"card-feedback-deltas\">" +
          "<span class=\"delta-chip " + (resolvedOption.money >= 0 ? "positive" : "negative") + "\">Budget " + AOC.utils.formatDelta(resolvedOption.money) + "</span>" +
          "<span class=\"delta-chip " + (resolvedOption.environment >= 0 ? "positive" : "negative") + "\">Environment " + AOC.utils.formatDelta(resolvedOption.environment) + "</span>" +
          "<span class=\"delta-chip " + (resolvedOption.trust >= 0 ? "positive" : "negative") + "\">Community Trust " + AOC.utils.formatDelta(resolvedOption.trust) + "</span>" +
          "</div>";

      el.cardFeedback.innerHTML = summary;
      el.cardFeedback.className = "card-feedback";
      el.cardBox.className = "modal-card decision-card resolved";
      await AOC.utils.wait(460);
      el.cardBox.className = "modal-card decision-card closing";
      await AOC.utils.wait(180);
      this.hideChoiceModal(el);
    },

    showYearSummary: function (el, state, snapshot) {
      if (!el.yearModal) {
        state.awaitingYearSummary = false;
        return;
      }
      el.yearTitle.textContent = state.turnsTaken >= state.selectedRounds ? "Year " + state.year + " Checkpoint" : "Year " + state.year;
      el.yearMoney.textContent = state.stats.money;
      el.yearEnvironment.textContent = state.stats.environment;
      el.yearTrust.textContent = state.stats.trust;
      el.yearSummary.textContent = snapshot.summary;
      el.yearStrongest.textContent = snapshot.strongest;
      el.yearWeakest.textContent = snapshot.weakest;
      if (el.yearInvestments) {
        el.yearInvestments.textContent = snapshot.investments || "None yet.";
      }
      if (el.yearLoans) {
        el.yearLoans.textContent = snapshot.loans || "No active loans.";
      }
      el.yearEventNote.textContent = snapshot.eventNote || "";
      el.yearReflection.textContent = snapshot.reflection;
      if (el.continueYearButton) {
        el.continueYearButton.textContent = state.turnsTaken >= state.selectedRounds ? "Continue to final decision" : "Continue to next year";
      }
      if (el.reviewInvestmentsButton) {
        el.reviewInvestmentsButton.style.display = snapshot.canReviewInvestments ? "inline-flex" : "none";
      }
      el.yearModal.className = "modal";
      el.yearModal.setAttribute("aria-hidden", "false");
      el.rollButton.disabled = true;
    },

    hideYearSummary: function (el) {
      if (el.yearModal) {
        el.yearModal.className = "modal hidden";
        el.yearModal.setAttribute("aria-hidden", "true");
      }
    },

    showLoanModal: function (el, loanContext, onChoose) {
      var i;
      var button;
      var option;

      el.loanTitle.textContent = loanContext.title;
      el.loanDescription.textContent = loanContext.description;
      el.loanOptions.innerHTML = "";

      for (i = 0; i < loanContext.choices.length; i += 1) {
        option = loanContext.choices[i];
        button = document.createElement("button");
        button.type = "button";
        button.className = "decision-button " + (option.tone === "positive" ? "decision-button-positive" : "decision-button-risky");
        button.innerHTML =
          "<span class=\"decision-option-label\">" + option.kicker + "</span>" +
          "<strong class=\"decision-option-title\">" + option.label + "</strong>" +
          "<div class=\"effect-list\">" +
          renderEffectItem("Budget", option.preview.money) +
          renderEffectItem("Environment Health", option.preview.environment) +
          renderEffectItem("Community Trust", option.preview.trust) +
          "</div>";
        button.onclick = function (selectedOption) {
          return function () {
            var buttons;
            var j;
            if (el.loanOptions) {
              buttons = el.loanOptions.querySelectorAll("button");
              for (j = 0; j < buttons.length; j += 1) {
                buttons[j].disabled = true;
              }
            }
            onChoose(selectedOption)();
          };
        }(option);
        el.loanOptions.appendChild(button);
      }

      el.loanModal.className = "modal card-modal";
      el.loanModal.setAttribute("aria-hidden", "false");
      el.rollButton.disabled = true;
    },

    hideLoanModal: function (el) {
      if (el.loanModal) {
        el.loanModal.className = "modal hidden";
        el.loanModal.setAttribute("aria-hidden", "true");
      }
      if (el.loanOptions) {
        el.loanOptions.innerHTML = "";
      }
    },

    showInvestmentModal: function (el, investmentContext, onChoose) {
      var i;
      var button;
      var investment;

      if (!el.investmentModal) {
        return;
      }

      el.investmentTitle.textContent = investmentContext.title;
      el.investmentDescription.textContent = investmentContext.description;
      el.investmentOptions.innerHTML = "";

      for (i = 0; i < investmentContext.choices.length; i += 1) {
        investment = investmentContext.choices[i];
        button = document.createElement("button");
        button.type = "button";
        button.className = "decision-button " + (investment.annualEffects.money >= 0 ? "decision-button-positive" : "decision-button-risky");
        button.disabled = !!investment.disabled;
        button.innerHTML =
          "<span class=\"decision-option-label\">" + investment.category + "</span>" +
          "<strong class=\"decision-option-title\">" + AOC.rules.buildInvestmentChoiceLabel(investment) + "</strong>" +
          "<p class=\"decision-option-copy\">Cost: " + investment.cost + ". " + investment.description + "</p>" +
          "<div class=\"effect-list\">" +
          renderEffectItem("Yearly Budget", investment.annualEffects.money) +
          renderEffectItem("Yearly Environment", investment.annualEffects.environment) +
          renderEffectItem("Yearly Trust", investment.annualEffects.trust) +
          "</div>";
        button.onclick = function (selectedInvestment) {
          return function () {
            var buttons;
            var j;
            buttons = el.investmentOptions.querySelectorAll("button");
            for (j = 0; j < buttons.length; j += 1) {
              buttons[j].disabled = true;
            }
            onChoose(selectedInvestment)();
          };
        }(investment);
        el.investmentOptions.appendChild(button);
      }

      el.investmentModal.className = "modal card-modal";
      el.investmentModal.setAttribute("aria-hidden", "false");
      el.rollButton.disabled = true;
    },

    hideInvestmentModal: function (el) {
      if (!el.investmentModal) {
        return;
      }
      el.investmentModal.className = "modal hidden";
      el.investmentModal.setAttribute("aria-hidden", "true");
      if (el.investmentOptions) {
        el.investmentOptions.innerHTML = "";
      }
    },

    showStatFeedback: function (el, changes) {
      var stats = [
        { label: "Budget", value: changes.money, tone: "money" },
        { label: "Environment", value: changes.environment, tone: "environment" },
        { label: "Trust", value: changes.trust, tone: "trust" }
      ];
      var i;
      var item;
      var bubble;
      var sign;

      if (!el.statFeedback) {
        return;
      }

      for (i = 0; i < stats.length; i += 1) {
        item = stats[i];
        sign = item.value > 0 ? "+" : "";
        bubble = document.createElement("div");
        bubble.className = "stat-feedback-bubble " + item.tone + (item.value >= 0 ? " positive" : " negative");
        bubble.textContent = item.label + " " + sign + item.value;
        el.statFeedback.appendChild(bubble);

        (function (node) {
          window.setTimeout(function () {
            node.className += " leaving";
          }, 30);
          window.setTimeout(function () {
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          }, 1700);
        }(bubble));
      }
    },

    updateUI: function (el, state) {
      if (!el.moneyStat) {
        return;
      }

      el.moneyStat.textContent = state.stats.money;
      el.environmentStat.textContent = state.stats.environment;
      el.trustStat.textContent = state.stats.trust;
      var moneyCondition = AOC.rules.getMoneyCondition(state.stats.money);
      var environmentCondition = AOC.rules.getEnvironmentCondition(state.stats.environment);
      var trustCondition = AOC.rules.getTrustCondition(state.stats.trust);
      if (el.moneyCondition) {
        el.moneyCondition.textContent = moneyCondition.label;
        el.moneyCondition.title = moneyCondition.message;
      }
      if (el.environmentCondition) {
        el.environmentCondition.textContent = environmentCondition.label;
        el.environmentCondition.title = environmentCondition.message;
      }
      if (el.trustCondition) {
        el.trustCondition.textContent = trustCondition.label;
        el.trustCondition.title = trustCondition.message;
      }
      if (el.centerMoneyMini) {
        el.centerMoneyMini.textContent = state.stats.money;
      }
      if (el.centerEnvironmentMini) {
        el.centerEnvironmentMini.textContent = state.stats.environment;
      }
      if (el.centerTrustMini) {
        el.centerTrustMini.textContent = state.stats.trust;
      }
      el.yearCounter.textContent = state.year;
      el.turnCounter.textContent = state.turnsTaken + " / " + (state.selectedRounds || "-");
      el.diceResult.textContent = state.lastRoll === null ? "-" : state.lastRoll;
      el.diceResult.className = state.lastRoll === null ? "dice-face dice-idle" : "dice-face";
      el.diceResult.setAttribute("data-roll", state.lastRoll === null ? "0" : String(state.lastRoll));
      el.diceResult.setAttribute("aria-label", state.lastRoll === null ? "No roll yet" : "Last roll " + state.lastRoll);
      if (el.selectedTokenName) {
        el.selectedTokenName.textContent = state.selectedToken ? state.selectedToken.name : "None yet";
      }
      if (el.startButton) {
        el.startButton.disabled = !state.selectedMode;
      }
      if (el.roundsNextButton) {
        el.roundsNextButton.disabled = !state.selectedRounds;
      }
      if (el.rulesStartButton) {
        el.rulesStartButton.disabled = !(state.selectedMode && state.selectedRounds);
      }
      this.updateRulesSummary(el, state);
      if (el.roundOptions && el.roundOptions.length) {
        for (var roundIndex = 0; roundIndex < el.roundOptions.length; roundIndex += 1) {
          var selectedLength = parseInt(el.roundOptions[roundIndex].getAttribute("data-rounds"), 10) === state.selectedRounds;
          el.roundOptions[roundIndex].className = "round-option" + (selectedLength ? " selected" : "");
          el.roundOptions[roundIndex].setAttribute("aria-checked", selectedLength ? "true" : "false");
        }
      }
      if (el.modeOptions && el.modeOptions.length) {
        for (var modeIndex = 0; modeIndex < el.modeOptions.length; modeIndex += 1) {
          var isModeSelected = el.modeOptions[modeIndex].getAttribute("data-mode-id") === (state.selectedMode ? state.selectedMode.id : "");
          el.modeOptions[modeIndex].className = "mode-option" + (isModeSelected ? " selected" : "");
          el.modeOptions[modeIndex].setAttribute("aria-checked", isModeSelected ? "true" : "false");
        }
      }
      this.updateModeDetails(el, state.selectedMode);
      if (el.tokenOptions && el.tokenOptions.length) {
        for (var i = 0; i < el.tokenOptions.length; i += 1) {
          var isSelected = el.tokenOptions[i].getAttribute("data-token-id") === (state.selectedToken ? state.selectedToken.id : "");
          el.tokenOptions[i].className = "token-option" + (isSelected ? " selected" : "");
          el.tokenOptions[i].setAttribute("aria-checked", isSelected ? "true" : "false");
        }
      }
      if (el.financeAlert) {
        var budgetWarning = AOC.rules.buildBudgetWarning(state.stats.money, state.activeLoan);
        el.financeAlert.textContent = budgetWarning.text;
        el.financeAlert.className = "finance-alert finance-" + budgetWarning.level;
      }
      el.rollButton.disabled = !!(state.awaitingChoice || state.awaitingYearSummary || state.awaitingLoanDecision || state.awaitingInvestmentDecision || state.gameOver || state.isAnimating);
      this.renderToken(el, state);
    },

    showHowToModal: function (el) {
      if (!el.howToModal) {
        return;
      }
      el.howToModal.className = "modal";
      el.howToModal.setAttribute("aria-hidden", "false");
    },

    hideHowToModal: function (el) {
      if (!el.howToModal) {
        return;
      }
      el.howToModal.className = "modal hidden";
      el.howToModal.setAttribute("aria-hidden", "true");
    },

    animateDiceDisplay: async function (el, finalValue) {
      var duration = 820;
      var interval = 90;
      var elapsed = 0;
      var rollingValue;

      if (!el.diceResult) {
        return;
      }

      el.diceResult.className = "dice-face";
      while (elapsed < duration) {
        rollingValue = Math.floor(Math.random() * 6) + 1;
        el.diceResult.textContent = rollingValue;
        el.diceResult.setAttribute("data-roll", String(rollingValue));
        el.diceResult.setAttribute("aria-label", "Rolling " + rollingValue);
        await AOC.utils.wait(interval);
        elapsed += interval;
      }

      el.diceResult.textContent = finalValue;
      el.diceResult.setAttribute("data-roll", String(finalValue));
      el.diceResult.setAttribute("aria-label", "Last roll " + finalValue);
      el.diceResult.className = "dice-face dice-pop";
      await AOC.utils.wait(260);
      if (el.diceResult) {
        el.diceResult.className = "dice-face";
      }
    },

    renderToken: function (el, state) {
      var tiles;
      var i;
      var existing;
      var currentTile;
      var token;

      if (!el.board) {
        return;
      }

      tiles = el.board.querySelectorAll(".space");
      for (i = 0; i < tiles.length; i += 1) {
        tiles[i].className = tiles[i].className.replace(" current", "");
        existing = tiles[i].querySelector(".player-token");
        if (existing) {
          existing.parentNode.removeChild(existing);
        }
      }
      currentTile = el.board.querySelector('.space[data-index="' + state.position + '"]');
      if (!currentTile) {
        return;
      }
      currentTile.className += " current";
      token = document.createElement("span");
      token.className = "player-token";
      token.textContent = state.selectedToken ? state.selectedToken.icon : "\u25CF";
      token.setAttribute("aria-label", state.selectedToken ? state.selectedToken.name + " token" : "Player token");
      currentTile.appendChild(token);
    },

    updateStatus: function (el, message) {
      if (el.statusText) {
        el.statusText.textContent = message;
      }
    },

    setCenterMessage: function (el, title, message) {
      if (el.centerMessageTitle) {
        el.centerMessageTitle.textContent = title;
      }
      if (el.centerMessageBody) {
        el.centerMessageBody.textContent = message;
      }
    },

    showScreen: function (el, screen) {
      if (el.homeScreen) {
        el.homeScreen.className = "screen home-screen" + (screen === "home" ? " active" : "");
        el.homeScreen.setAttribute("aria-hidden", screen === "home" ? "false" : "true");
      }
      if (el.startScreen) {
        el.startScreen.className = "screen start-screen" + (screen === "modeSelect" ? " active" : "");
        el.startScreen.setAttribute("aria-hidden", screen === "modeSelect" ? "false" : "true");
      }
      if (el.roundsScreen) {
        el.roundsScreen.className = "screen rounds-screen" + (screen === "roundSelect" ? " active" : "");
        el.roundsScreen.setAttribute("aria-hidden", screen === "roundSelect" ? "false" : "true");
      }
      if (el.rulesScreen) {
        el.rulesScreen.className = "screen rules-screen" + (screen === "rules" ? " active" : "");
        el.rulesScreen.setAttribute("aria-hidden", screen === "rules" ? "false" : "true");
      }
      if (el.gameScreen) {
        el.gameScreen.className = "screen game-screen" + (screen === "playing" ? " active" : "");
        el.gameScreen.setAttribute("aria-hidden", screen === "playing" ? "false" : "true");
      }
      if (el.endScreen) {
        el.endScreen.className = "screen end-screen" + (screen === "gameOver" ? " active" : "");
        el.endScreen.setAttribute("aria-hidden", screen === "gameOver" ? "false" : "true");
      }
    }
  };
}());
