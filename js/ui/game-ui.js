(function () {
  var AOC = window.AOC = window.AOC || {};

  function getEffectTone(label) {
    var normalized = (label || "").toLowerCase();
    if (normalized.indexOf("budget") !== -1 || normalized.indexOf("money") !== -1) {
      return "money";
    }
    if (normalized.indexOf("debt") !== -1) {
      return "money";
    }
    if (normalized.indexOf("environment") !== -1) {
      return "environment";
    }
    return "trust";
  }

  function getEffectIcon(tone) {
    if (tone === "money") {
      return "\uD83D\uDCB0";
    }
    if (tone === "environment") {
      return "\uD83C\uDF3F";
    }
    return "\uD83D\uDC65";
  }

  function renderEffectItem(label, value) {
    var className = value >= 0 ? "positive" : "negative";
    var sign = value >= 0 ? "+" : "";
    var tone = getEffectTone(label);
    return "<div class=\"effect-item " + tone + "\"><span class=\"effect-item-label\">" + getEffectIcon(tone) + " " + label + "</span><span class=\"effect-value " + className + " " + tone + "\">" + sign + value + "</span></div>";
  }

  function renderPreviewItems(items) {
    var html = "";
    var i;

    for (i = 0; i < items.length; i += 1) {
      html += renderEffectItem(items[i].label, items[i].value);
    }

    return html;
  }

  function getCharacterSpriteClass(character) {
    return "character-sprite-" + ((character && (character.sprite || character.id)) || "boy");
  }

  function renderSelectedCharacterBadge(character) {
    if (!character) {
      return "-";
    }
    return "<span class=\"selected-character-badge\"><span class=\"character-sprite selected-character-sprite " +
      getCharacterSpriteClass(character) + "\" aria-hidden=\"true\"></span><span>" + character.name + "</span></span>";
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
      el.homeSettingsButton = AOC.utils.byId("home-settings-button");
      el.simpleModeToggle = AOC.utils.byId("simple-mode-toggle");
      el.howToModal = AOC.utils.byId("how-to-modal");
      el.howToCloseButton = AOC.utils.byId("how-to-close-button");
      el.settingsModal = AOC.utils.byId("settings-modal");
      el.settingsCloseButton = AOC.utils.byId("settings-close-button");
      el.settingsThemeLight = AOC.utils.byId("theme-light-button");
      el.settingsThemeDark = AOC.utils.byId("theme-dark-button");
      el.voiceEnabledToggle = AOC.utils.byId("voice-enabled-toggle");
      el.voiceCardsToggle = AOC.utils.byId("voice-cards-toggle");
      el.voiceWarningsToggle = AOC.utils.byId("voice-warnings-toggle");
      el.voiceEndingsToggle = AOC.utils.byId("voice-endings-toggle");
      el.voiceRateSlider = AOC.utils.byId("voice-rate-slider");
      el.voiceRateValue = AOC.utils.byId("voice-rate-value");
      el.voiceVoiceSelect = AOC.utils.byId("voice-voice-select");
      el.settingsSimpleModeToggle = AOC.utils.byId("settings-simple-mode-toggle");
      el.startButton = AOC.utils.byId("start-button");
      el.backButton = AOC.utils.byId("back-button");
      el.characterScreen = AOC.utils.byId("character-screen");
      el.characterNextButton = AOC.utils.byId("character-next-button");
      el.characterBackButton = AOC.utils.byId("character-back-button");
      el.islandScreen = AOC.utils.byId("island-screen");
      el.islandPicker = AOC.utils.byId("island-picker");
      el.islandName = AOC.utils.byId("island-name");
      el.islandDescription = AOC.utils.byId("island-description");
      el.islandStats = AOC.utils.byId("island-stats");
      el.islandWin = AOC.utils.byId("island-win");
      el.islandLose = AOC.utils.byId("island-lose");
      el.islandNextButton = AOC.utils.byId("island-next-button");
      el.islandBackButton = AOC.utils.byId("island-back-button");
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
      el.characterPicker = AOC.utils.byId("character-picker");
      el.characterName = AOC.utils.byId("character-name");
      el.characterDescription = AOC.utils.byId("character-description");
      el.characterBonus = AOC.utils.byId("character-bonus");
      el.rulesModeName = AOC.utils.byId("rules-mode-name");
      el.rulesCharacterName = AOC.utils.byId("rules-character-name");
      el.rulesIslandName = AOC.utils.byId("rules-island-name");
      el.rulesLengthName = AOC.utils.byId("rules-length-name");
      el.rulesModeGoal = AOC.utils.byId("rules-mode-goal");
      el.rulesModeWin = AOC.utils.byId("rules-mode-win");
      el.rulesModeLose = AOC.utils.byId("rules-mode-lose");
      el.readyMoney = AOC.utils.byId("ready-money");
      el.readyEnvironment = AOC.utils.byId("ready-environment");
      el.readyTrust = AOC.utils.byId("ready-trust");
      el.simpleModeBadge = AOC.utils.byId("simple-mode-badge");
      el.tokenPicker = AOC.utils.byId("token-picker");
      el.selectedTokenName = AOC.utils.byId("selected-token-name");
      el.board = AOC.utils.byId("board");
      el.boardPanel = document.querySelector(".board-panel");
      el.boardTooltip = AOC.utils.byId("board-tooltip");
      el.tooltipName = AOC.utils.byId("tooltip-name");
      el.tooltipDescription = AOC.utils.byId("tooltip-description");
      el.moneyStat = AOC.utils.byId("money-stat");
      el.debtStat = AOC.utils.byId("debt-stat");
      el.environmentStat = AOC.utils.byId("environment-stat");
      el.trustStat = AOC.utils.byId("trust-stat");
      el.moneyCondition = AOC.utils.byId("money-condition");
      el.debtCondition = AOC.utils.byId("debt-condition");
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
      el.yearDebt = AOC.utils.byId("year-debt");
      el.yearInterest = AOC.utils.byId("year-interest");
      el.yearFinancialState = AOC.utils.byId("year-financial-state");
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
      el.loanSummary = AOC.utils.byId("loan-summary");
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
      if (el.homeSettingsButton) {
        el.homeSettingsButton.onclick = callbacks.onOpenSettings;
      }
      if (el.simpleModeToggle) {
        el.simpleModeToggle.onchange = function () {
          callbacks.onToggleSimpleMode(this.checked);
        };
      }
      if (el.howToCloseButton) {
        el.howToCloseButton.onclick = callbacks.onCloseHowTo;
      }
      if (el.settingsCloseButton) {
        el.settingsCloseButton.onclick = callbacks.onCloseSettings;
      }
      if (el.settingsThemeLight) {
        el.settingsThemeLight.onclick = function () {
          callbacks.onSetTheme("light");
        };
      }
      if (el.settingsThemeDark) {
        el.settingsThemeDark.onclick = function () {
          callbacks.onSetTheme("dark");
        };
      }
      if (el.voiceEnabledToggle) {
        el.voiceEnabledToggle.onchange = function () {
          callbacks.onUpdateVoiceSetting("enabled", this.checked);
        };
      }
      if (el.voiceCardsToggle) {
        el.voiceCardsToggle.onchange = function () {
          callbacks.onUpdateVoiceSetting("readCards", this.checked);
        };
      }
      if (el.voiceWarningsToggle) {
        el.voiceWarningsToggle.onchange = function () {
          callbacks.onUpdateVoiceSetting("readWarnings", this.checked);
        };
      }
      if (el.voiceEndingsToggle) {
        el.voiceEndingsToggle.onchange = function () {
          callbacks.onUpdateVoiceSetting("readEndings", this.checked);
        };
      }
      if (el.voiceRateSlider) {
        el.voiceRateSlider.oninput = function () {
          callbacks.onUpdateVoiceSetting("rate", parseFloat(this.value));
        };
      }
      if (el.voiceVoiceSelect) {
        el.voiceVoiceSelect.onchange = function () {
          callbacks.onUpdateVoiceSetting("voiceName", this.value || null);
        };
      }
      if (el.settingsSimpleModeToggle) {
        el.settingsSimpleModeToggle.onchange = function () {
          callbacks.onToggleSimpleMode(this.checked);
        };
      }
      if (el.startButton) {
        el.startButton.onclick = callbacks.onContinueFromMode;
      }
      if (el.backButton) {
        el.backButton.onclick = callbacks.onBackToHome;
      }
      if (el.characterNextButton) {
        el.characterNextButton.onclick = callbacks.onContinueFromCharacter;
      }
      if (el.characterBackButton) {
        el.characterBackButton.onclick = callbacks.onBackToModeSelect;
      }
      if (el.roundsNextButton) {
        el.roundsNextButton.onclick = callbacks.onContinueFromRounds;
      }
      if (el.roundsBackButton) {
        el.roundsBackButton.onclick = callbacks.onBackToIslandSelect;
      }
      if (el.islandNextButton) {
        el.islandNextButton.onclick = callbacks.onContinueFromIsland;
      }
      if (el.islandBackButton) {
        el.islandBackButton.onclick = callbacks.onBackToCharacterSelect;
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
        if (el.settingsModal && el.settingsModal.className.indexOf("hidden") === -1 && el.settingsModal.contains(event.target)) {
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
        "<span class=\"token-icon character-sprite " + getCharacterSpriteClass(token) + "\" aria-hidden=\"true\"></span>" +
        "<span class=\"token-name\">" + token.name + "</span>";
        button.onclick = onSelectToken(token.id);
        el.tokenPicker.appendChild(button);
      }

      el.tokenOptions = el.tokenPicker.querySelectorAll(".token-option");
    },

    renderCarouselDots: function (count, activeIndex) {
      var html = "";
      var i;
      for (i = 0; i < count; i += 1) {
        html += "<span class=\"carousel-dot" + (i === activeIndex ? " active" : "") + "\"></span>";
      }
      return html;
    },

    renderCharacterPicker: function (el, selectedCharacterId, onSelectCharacter, unlockedCharacters) {
      var i;
      var character;
      var button;
      var selectedIndex = 0;
      var unlocked;
      var current;

      if (!el.characterPicker) {
        return;
      }

      el.characterPicker.innerHTML = "";
      for (i = 0; i < AOC.data.characters.length; i += 1) {
        if (AOC.data.characters[i].id === selectedCharacterId) {
          selectedIndex = i;
        }
      }
      current = AOC.data.characters[selectedIndex];
      unlocked = !!(current.unlocked || (unlockedCharacters && unlockedCharacters[current.id]));
      button = document.createElement("button");
      button.type = "button";
      button.className = "character-option carousel-card selected" + (unlocked ? "" : " locked");
      button.setAttribute("data-character-id", current.id);
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", selectedCharacterId === current.id ? "true" : "false");
      button.disabled = !unlocked;
      button.innerHTML =
        "<span class=\"character-icon character-sprite " + getCharacterSpriteClass(current) + "\" aria-hidden=\"true\"></span>" +
        "<strong class=\"character-title\">" + current.name + "</strong>" +
        "<span class=\"character-copy\">" + current.shortDescription + "</span>" +
        "<span class=\"character-bonus-chip\">" + current.bonusText + "</span>" +
        (unlocked ? "" : "<span class=\"locked-badge\">Locked: " + current.unlockText + "</span>");
      if (unlocked) {
        button.onclick = onSelectCharacter(current.id);
      }
      el.characterPicker.appendChild(this.buildCarouselShell(AOC.data.characters.length, selectedIndex, function (direction) {
        return function () {
          var nextIndex = (selectedIndex + direction + AOC.data.characters.length) % AOC.data.characters.length;
          var nextCharacter = AOC.data.characters[nextIndex];
          if (nextCharacter.unlocked || (unlockedCharacters && unlockedCharacters[nextCharacter.id])) {
            onSelectCharacter(nextCharacter.id)();
            return;
          }
          onSelectCharacter(nextCharacter.id)();
        };
      }, button));

      el.characterOptions = el.characterPicker.querySelectorAll(".character-option");
    },

    renderModePicker: function (el, selectedModeId, onSelectMode) {
      var i;
      var mode;
      var button;
      var selectedIndex = 0;

      if (!el.modePicker) {
        return;
      }

      el.modePicker.innerHTML = "";
      for (i = 0; i < AOC.data.modes.length; i += 1) {
        if (AOC.data.modes[i].id === selectedModeId) {
          selectedIndex = i;
        }
      }
      mode = AOC.data.modes[selectedIndex];
      button = document.createElement("button");
      button.type = "button";
      button.className = "mode-option carousel-card selected";
      button.setAttribute("data-mode-id", mode.id);
      button.setAttribute("data-mode-tone", mode.id);
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", selectedModeId === mode.id ? "true" : "false");
      button.innerHTML =
        "<strong>" + mode.name + "</strong>" +
        "<span>" + mode.shortDescription + "</span>";
      button.onclick = onSelectMode(mode.id);
      el.modePicker.appendChild(this.buildCarouselShell(AOC.data.modes.length, selectedIndex, function (direction) {
        return function () {
          var nextIndex = (selectedIndex + direction + AOC.data.modes.length) % AOC.data.modes.length;
          onSelectMode(AOC.data.modes[nextIndex].id)();
        };
      }, button));

      el.modeOptions = el.modePicker.querySelectorAll(".mode-option");
    },

    buildCarouselShell: function (count, selectedIndex, onMove, cardNode) {
      var shell = document.createElement("div");
      var previous = document.createElement("button");
      var next = document.createElement("button");
      var dots = document.createElement("div");

      shell.className = "carousel-shell";
      previous.type = "button";
      next.type = "button";
      previous.className = "carousel-arrow";
      next.className = "carousel-arrow";
      previous.setAttribute("aria-label", "Previous option");
      next.setAttribute("aria-label", "Next option");
      previous.textContent = "<";
      next.textContent = ">";
      previous.onclick = onMove(-1);
      next.onclick = onMove(1);
      dots.className = "carousel-dots";
      dots.innerHTML = this.renderCarouselDots(count, selectedIndex);

      shell.appendChild(previous);
      shell.appendChild(cardNode);
      shell.appendChild(next);
      shell.appendChild(dots);
      return shell;
    },

    renderIslandPicker: function (el, selectedIslandId, onSelectIsland) {
      var i;
      var island;
      var selectedIndex = 0;
      var button;
      var stats;
      var difficulty;

      if (!el.islandPicker) {
        return;
      }

      el.islandPicker.innerHTML = "";
      for (i = 0; i < AOC.data.islands.length; i += 1) {
        if (AOC.data.islands[i].id === selectedIslandId) {
          selectedIndex = i;
        }
      }
      island = AOC.data.islands[selectedIndex];
      stats = island.baseStats || island.startingStats || { money: 0, environment: 0, trust: 0 };
      difficulty = island.difficulty || "Beginner";
      button = document.createElement("button");
      button.type = "button";
      button.className = "island-option carousel-card island-world-card selected island-world-" + island.theme;
      button.setAttribute("data-island-id", island.id);
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", selectedIslandId === island.id ? "true" : "false");
      button.innerHTML =
        "<div class=\"island-preview island-preview-" + island.theme + "\" aria-hidden=\"true\">" +
        "<span></span><span></span><span></span><span></span>" +
        "<span></span><span></span><span></span><span></span>" +
        "<span></span><span></span><span></span><span></span>" +
        "<span></span><span></span><span></span><span></span>" +
        "</div>" +
        "<div class=\"island-card-header\">" +
        "<span class=\"difficulty-badge difficulty-" + difficulty.toLowerCase() + "\">" + difficulty + "</span>" +
        "<strong>" + island.name + "</strong>" +
        "<em>" + island.shortDescription + "</em>" +
        "</div>" +
        "<p class=\"island-card-description\">" + island.description + "</p>" +
        "<div class=\"island-stat-preview\">" +
        "<span class=\"money-chip\">💰 " + AOC.utils.formatDelta(stats.money || 0) + "</span>" +
        "<span class=\"environment-chip\">🌿 " + AOC.utils.formatDelta(stats.environment || 0) + "</span>" +
        "<span class=\"trust-chip\">👥 " + AOC.utils.formatDelta(stats.trust || 0) + "</span>" +
        "</div>" +
        "<div class=\"island-card-info-grid\">" +
        "<section><span>Starting Stats</span><strong>Money " + (stats.money || 0) + ", Environment " + (stats.environment || 0) + ", Trust " + (stats.trust || 0) + "</strong></section>" +
        "<section><span>World Goal</span><strong>" + (island.goal || island.winConditionText) + "</strong></section>" +
        "<section><span>World Risk</span><strong>" + island.loseConditionText + "</strong></section>" +
        "</div>";
      button.onclick = onSelectIsland(island.id);
      el.islandPicker.appendChild(this.buildCarouselShell(AOC.data.islands.length, selectedIndex, function (direction) {
        return function () {
          var nextIndex = (selectedIndex + direction + AOC.data.islands.length) % AOC.data.islands.length;
          onSelectIsland(AOC.data.islands[nextIndex].id)();
        };
      }, button));

      el.islandOptions = el.islandPicker.querySelectorAll(".island-option");
    },

    renderRoundPicker: function (el, selectedYears, onSelectRounds) {
      var container;
      var selectedIndex = 0;
      var i;
      var length;
      var button;

      container = document.querySelector(".round-options");
      if (!container || !AOC.data.gameLengths) {
        return;
      }

      for (i = 0; i < AOC.data.gameLengths.length; i += 1) {
        if (AOC.data.gameLengths[i].years === selectedYears) {
          selectedIndex = i;
        }
      }
      length = AOC.data.gameLengths[selectedIndex];
      container.innerHTML = "";
      button = document.createElement("button");
      button.className = "round-option carousel-card selected";
      button.type = "button";
      button.setAttribute("data-rounds", String(length.years));
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", selectedYears === length.years ? "true" : "false");
      button.innerHTML = "<strong>" + length.name + "</strong><span>" + length.years + " Years</span><small>" + length.description + "</small>";
      button.onclick = function () {
        onSelectRounds(length.years);
      };
      container.appendChild(this.buildCarouselShell(AOC.data.gameLengths.length, selectedIndex, function (direction) {
        return function () {
          var nextIndex = (selectedIndex + direction + AOC.data.gameLengths.length) % AOC.data.gameLengths.length;
          onSelectRounds(AOC.data.gameLengths[nextIndex].years);
        };
      }, button));
      el.roundOptions = container.querySelectorAll(".round-option");
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

    updateCharacterDetails: function (el, character) {
      if (!character) {
        if (el.characterName) {
          el.characterName.textContent = "Select a character";
        }
        if (el.characterDescription) {
          el.characterDescription.textContent = "Choose a guide to preview their style and bonus.";
        }
        if (el.characterBonus) {
          el.characterBonus.textContent = "Bonuses will appear here after selection.";
        }
        return;
      }

      if (el.characterName) {
        el.characterName.innerHTML = renderSelectedCharacterBadge(character);
      }
      if (el.characterDescription) {
        el.characterDescription.textContent = character.shortDescription;
      }
      if (el.characterBonus) {
        el.characterBonus.textContent = character.bonusText;
      }
    },

    updateIslandDetails: function (el, island) {
      if (!island) {
        if (el.islandName) el.islandName.textContent = "Select an island";
        if (el.islandDescription) el.islandDescription.textContent = "Choose a world to preview its goal and starting pressure.";
        if (el.islandStats) el.islandStats.textContent = "Starting changes will appear here.";
        if (el.islandWin) el.islandWin.textContent = "Win guidance will appear here.";
        if (el.islandLose) el.islandLose.textContent = "Risk guidance will appear here.";
        return;
      }
      if (el.islandName) el.islandName.textContent = island.name;
      if (el.islandDescription) el.islandDescription.textContent = island.description;
      if (el.islandStats) {
        el.islandStats.textContent = "Budget " + AOC.utils.formatDelta(island.startingStats.money || 0) +
          ", Environment " + AOC.utils.formatDelta(island.startingStats.environment || 0) +
          ", Trust " + AOC.utils.formatDelta(island.startingStats.trust || 0);
      }
      if (el.islandWin) el.islandWin.textContent = island.winConditionText;
      if (el.islandLose) el.islandLose.textContent = island.loseConditionText;
    },

    updateRulesSummary: function (el, state) {
      var lengthLabel = "-";
      var previewStats;

      if (state.selectedRounds === 5) {
        lengthLabel = "Super Short - 5 Years";
      } else if (state.selectedRounds === 10) {
        lengthLabel = "Short - 10 Years";
      } else if (state.selectedRounds === 20) {
        lengthLabel = "Medium - 20 Years";
      } else if (state.selectedRounds === 30) {
        lengthLabel = "Long - 30 Years";
      }

      if (AOC.rules.isFreePlayMode(state.selectedMode)) {
        lengthLabel = "Free Play - years become checkpoints";
      }

      if (el.rulesModeName) {
        el.rulesModeName.textContent = state.selectedMode ? state.selectedMode.name : "-";
      }
      if (el.rulesCharacterName) {
        el.rulesCharacterName.innerHTML = renderSelectedCharacterBadge(state.selectedCharacter);
      }
      if (el.rulesLengthName) {
        el.rulesLengthName.textContent = lengthLabel;
      }
      if (el.rulesModeGoal) {
        el.rulesModeGoal.textContent = state.selectedMode ? state.selectedMode.goal : "Select a mode to preview its goal.";
      }
      if (el.rulesModeWin) {
        el.rulesModeWin.textContent = AOC.rules.isFreePlayMode(state.selectedMode) ? "No win condition. Keep playing and experimenting." :
          (state.selectedMode ? state.selectedMode.winConditionText : "Complete the run with a stable island.");
      }
      if (el.rulesModeLose) {
        el.rulesModeLose.textContent = AOC.rules.isFreePlayMode(state.selectedMode) ? "No lose condition. Negative values are allowed for testing." :
          (state.selectedMode ? state.selectedMode.loseConditionText : "Avoid a system collapse before the end.");
      }
      if (el.simpleModeBadge) {
        el.simpleModeBadge.textContent = state.simpleMode ? "On" : "Off";
      }
      if (el.rulesIslandName) {
        el.rulesIslandName.textContent = state.selectedIsland ? state.selectedIsland.name : "-";
      }
      previewStats = AOC.rules.getStartingStatsPreview(state.selectedMode, state.selectedCharacter, state.selectedIsland);
      if (el.readyMoney) {
        el.readyMoney.textContent = previewStats.money;
      }
      if (el.readyEnvironment) {
        el.readyEnvironment.textContent = previewStats.environment;
      }
      if (el.readyTrust) {
        el.readyTrust.textContent = previewStats.trust;
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
        tile.setAttribute("data-tile-type", plot.type || "normal");
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
        "<div id=\"center-intro\" class=\"center-intro center-branding\">" +
        "<p class=\"center-kicker\">Island Stewardship Board</p>" +
        "<h3>Acts of Conservation</h3>" +
        "<p class=\"center-purpose\">Every stop asks you to weigh economy, ecology, and community well-being together.</p>" +
        "<p class=\"center-roll-hint\">Roll to begin.</p>" +
        "</div>" +
        "<div id=\"island-visual\" class=\"island-visual island-grid-visual stage-growing\">" +
        "<div id=\"island-grid\" class=\"island-grid\" aria-label=\"Evolving island grid\"></div>" +
        "<div class=\"island-feedback-overlay\"></div>" +
        "<strong id=\"island-stage-label\" class=\"island-stage-label\">Stable Nature</strong>" +
        "<span id=\"island-stage-message\" class=\"island-stage-message\">The island is holding steady.</span>" +
        "</div>" +
        "</div>";
      el.board.appendChild(center);

      el.centerMessageTitle = AOC.utils.byId("center-message-title");
      el.centerMessageBody = AOC.utils.byId("center-message-body");
      el.centerMoneyMini = AOC.utils.byId("center-money-mini");
      el.centerEnvironmentMini = AOC.utils.byId("center-environment-mini");
      el.centerTrustMini = AOC.utils.byId("center-trust-mini");
      el.centerIntro = AOC.utils.byId("center-intro");
      el.islandVisual = AOC.utils.byId("island-visual");
      el.islandGrid = AOC.utils.byId("island-grid");
      el.islandStageLabel = AOC.utils.byId("island-stage-label");
      el.islandStageMessage = AOC.utils.byId("island-stage-message");
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

        function bindChoice(button, choice, preview, className, optionLabel, helperText) {
          button.className = className;
          button.disabled = false;
          button.innerHTML =
            "<span class=\"decision-option-label\">" + optionLabel + "</span>" +
            "<strong class=\"decision-option-title\">" + choice.label + "</strong>" +
            "<p class=\"decision-option-copy\">" + helperText + "</p>" +
            "<div class=\"effect-list compact-effects\">" +
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
        el.cardTone.textContent = card.simpleTone || buildScenarioTone(card);
      }
      if (el.cardFeedback) {
        el.cardFeedback.className = "card-feedback hidden";
        el.cardFeedback.innerHTML = "";
      }
      bindChoice(el.choiceA, choiceA, previewA, "decision-button decision-button-positive", "Option A", "A safer path with trade-offs to watch.");
      bindChoice(el.choiceB, choiceB, previewB, "decision-button decision-button-risky", "Option B", "A riskier path that may bring pressure later.");

      el.choiceModal.className = "modal card-modal";
      el.choiceModal.setAttribute("aria-hidden", "false");
      if (el.cardBox) {
        el.cardBox.className = "modal-card decision-card";
        window.setTimeout(function () {
            if (el.cardBox && !/hidden/.test(el.choiceModal.className)) {
              el.cardBox.className = "modal-card decision-card ready";
            }
          }, 40);
        }
      window.setTimeout(function () {
        if (el.choiceA && !el.choiceA.disabled) {
          el.choiceA.focus();
        }
      }, 140);
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
      await AOC.utils.wait(1600);
      el.cardBox.className = "modal-card decision-card closing";
      await AOC.utils.wait(220);
      this.hideChoiceModal(el);
    },

    showYearSummary: function (el, state, snapshot) {
      if (!el.yearModal) {
        state.awaitingYearSummary = false;
        return;
      }
      el.yearTitle.textContent = AOC.rules.modeSupportsGameLength(state.selectedMode) && state.loopsCompleted >= state.selectedRounds ?
        "Year " + state.loopsCompleted + " Final Summary" :
        "Year " + state.loopsCompleted + " Summary";
      el.yearMoney.textContent = state.stats.money;
      if (el.yearDebt) {
        el.yearDebt.textContent = snapshot.debt || 0;
      }
      if (el.yearInterest) {
        el.yearInterest.textContent = snapshot.interest || 0;
      }
      if (el.yearFinancialState) {
        el.yearFinancialState.textContent = snapshot.financialState || snapshot.moneyCondition.label;
      }
      el.yearEnvironment.textContent = state.stats.environment;
      el.yearTrust.textContent = state.stats.trust;
      el.yearSummary.textContent = snapshot.summary;
      el.yearStrongest.textContent = snapshot.strongest;
      el.yearWeakest.textContent = snapshot.weakest;
      if (el.yearInvestments) {
        el.yearInvestments.textContent = snapshot.investments || "None yet.";
      }
      if (el.yearLoans) {
        el.yearLoans.textContent = snapshot.loans || "No debt owed.";
      }
      el.yearEventNote.textContent = snapshot.eventNote || "";
      el.yearReflection.textContent = snapshot.reflection;
      if (el.continueYearButton) {
      el.continueYearButton.textContent = AOC.rules.modeSupportsGameLength(state.selectedMode) && state.loopsCompleted >= state.selectedRounds ?
        "See final results" :
        "Continue to next year";
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
      if (el.loanSummary) {
        if (loanContext.summaryHtml) {
          el.loanSummary.innerHTML = loanContext.summaryHtml;
          el.loanSummary.className = "year-insights";
        } else {
          el.loanSummary.innerHTML = "";
          el.loanSummary.className = "year-insights hidden";
        }
      }
      el.loanOptions.innerHTML = "";

      for (i = 0; i < loanContext.choices.length; i += 1) {
        option = loanContext.choices[i];
        button = document.createElement("button");
        button.type = "button";
        button.className = "decision-button " + (option.tone === "positive" ? "decision-button-positive" : "decision-button-risky");
        button.innerHTML =
          "<span class=\"decision-option-label\">" + option.kicker + "</span>" +
          "<strong class=\"decision-option-title\">" + option.label + "</strong>" +
          (option.description ? "<p class=\"decision-option-copy\">" + option.description + "</p>" : "") +
          "<div class=\"effect-list\">" +
          renderPreviewItems(option.previewItems || [
            { label: "Budget", value: option.preview.money || 0 },
            { label: "Debt", value: option.preview.debt || 0 },
            { label: "Trust", value: option.preview.trust || 0 }
          ]) +
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
      if (el.loanSummary) {
        el.loanSummary.innerHTML = "";
        el.loanSummary.className = "year-insights hidden";
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
        if (!item.value) {
          continue;
        }
        sign = item.value > 0 ? "+" : "";
        bubble = document.createElement("div");
        bubble.className = "stat-feedback-bubble " + item.tone + (item.value >= 0 ? " positive" : " negative");
        bubble.textContent = getEffectIcon(item.tone) + " " + item.label + " " + sign + item.value;
        el.statFeedback.appendChild(bubble);

        (function (node) {
          window.setTimeout(function () {
            node.className += " leaving";
          }, 220);
          window.setTimeout(function () {
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          }, 1200);
        }(bubble));
      }
    },

    showTileFeedback: function (el, tileIndex, result) {
      var tile;
      var badge;
      var type;
      var text;

      if (!el.board || tileIndex === undefined || tileIndex === null || !result) {
        return;
      }

      tile = el.board.querySelector('.space[data-index="' + tileIndex + '"]');
      if (!tile) {
        return;
      }

      type = result.type || "normal";
      text = result.feedbackText || result.title || "";
      tile.className = tile.className.replace(/\stile-flash-(start|community|environment|crisis|goToCrisis|teleport)/g, "");
      void tile.offsetWidth;
      tile.className += " tile-flash-" + type;

      badge = tile.querySelector(".tile-effect-float");
      if (badge && badge.parentNode) {
        badge.parentNode.removeChild(badge);
      }
      if (text) {
        badge = document.createElement("span");
        badge.className = "tile-effect-float tile-effect-" + type;
        badge.textContent = text;
        tile.appendChild(badge);
        window.setTimeout(function () {
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        }, 1100);
      }

      window.setTimeout(function () {
        tile.className = tile.className.replace(/\stile-flash-(start|community|environment|crisis|goToCrisis|teleport)/g, "");
      }, 950);
    },

    updateUI: function (el, state) {
      if (!el.moneyStat) {
        return;
      }

      document.body.setAttribute("data-theme", state.theme || "light");
      el.moneyStat.textContent = state.stats.money;
      if (el.debtStat) {
        el.debtStat.textContent = Math.round((state.debtOwed || 0) * 100) / 100;
      }
      el.environmentStat.textContent = state.stats.environment;
      el.trustStat.textContent = state.stats.trust;
      var moneyCondition = AOC.rules.getMoneyCondition(state.stats.money);
      var debtCondition = AOC.rules.getDebtPressure(state.debtOwed || 0);
      var environmentCondition = AOC.rules.getEnvironmentCondition(state.stats.environment);
      var trustCondition = AOC.rules.getTrustCondition(state.stats.trust);
      if (el.moneyCondition) {
        el.moneyCondition.textContent = moneyCondition.label;
        el.moneyCondition.title = moneyCondition.message;
      }
      if (el.debtCondition) {
        el.debtCondition.textContent = debtCondition.label;
        el.debtCondition.title = debtCondition.message;
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
      this.updateIslandVisual(el, state);
      el.yearCounter.textContent = AOC.rules.modeSupportsGameLength(state.selectedMode) ?
        (state.loopsCompleted || 0) + " / " + (state.selectedRounds || 0) :
        (state.loopsCompleted || 0) + " Free";
      el.turnCounter.textContent = state.yearlyRollCount + " this year";
      el.diceResult.textContent = state.lastRoll === null ? "-" : state.lastRoll;
      el.diceResult.className = state.lastRoll === null ? "dice-face dice-idle" : "dice-face";
      el.diceResult.setAttribute("data-roll", state.lastRoll === null ? "0" : String(state.lastRoll));
      el.diceResult.setAttribute("aria-label", state.lastRoll === null ? "No roll yet" : "Last roll " + state.lastRoll);
      if (el.selectedTokenName) {
        el.selectedTokenName.textContent = state.selectedCharacter ? state.selectedCharacter.name : "None yet";
      }
      if (el.simpleModeToggle) {
        el.simpleModeToggle.checked = !!state.simpleMode;
      }
      if (el.settingsSimpleModeToggle) {
        el.settingsSimpleModeToggle.checked = !!state.simpleMode;
      }
      if (el.settingsThemeLight) {
        el.settingsThemeLight.className = "settings-choice" + ((state.theme || "light") === "light" ? " selected" : "");
      }
      if (el.settingsThemeDark) {
        el.settingsThemeDark.className = "settings-choice" + ((state.theme || "light") === "dark" ? " selected" : "");
      }
      if (el.voiceEnabledToggle) {
        el.voiceEnabledToggle.checked = !!state.voiceSettings.enabled;
      }
      if (el.voiceCardsToggle) {
        el.voiceCardsToggle.checked = !!state.voiceSettings.readCards;
      }
      if (el.voiceWarningsToggle) {
        el.voiceWarningsToggle.checked = !!state.voiceSettings.readWarnings;
      }
      if (el.voiceEndingsToggle) {
        el.voiceEndingsToggle.checked = !!state.voiceSettings.readEndings;
      }
      if (el.voiceRateSlider) {
        el.voiceRateSlider.value = state.voiceSettings.rate;
      }
      if (el.voiceRateValue) {
        el.voiceRateValue.textContent = state.voiceSettings.rate.toFixed(2).replace(/0$/, "") + "x";
      }
      if (el.voiceVoiceSelect) {
        el.voiceVoiceSelect.disabled = !state.voiceSettings.enabled;
      }
      if (el.startButton) {
        el.startButton.disabled = !state.selectedMode;
      }
      if (el.characterNextButton) {
        el.characterNextButton.disabled = !state.selectedCharacter;
      }
      if (el.islandNextButton) {
        el.islandNextButton.disabled = !state.selectedIsland;
      }
      if (el.roundsNextButton) {
        el.roundsNextButton.disabled = !state.selectedRounds;
      }
      if (el.rulesStartButton) {
        el.rulesStartButton.disabled = !(state.selectedMode && state.selectedCharacter && state.selectedIsland && state.selectedRounds);
      }
      this.updateRulesSummary(el, state);
      if (el.roundOptions && el.roundOptions.length) {
        for (var roundIndex = 0; roundIndex < el.roundOptions.length; roundIndex += 1) {
          var selectedLength = parseInt(el.roundOptions[roundIndex].getAttribute("data-rounds"), 10) === state.selectedRounds;
          el.roundOptions[roundIndex].className = "round-option carousel-card" + (selectedLength ? " selected" : "");
          el.roundOptions[roundIndex].setAttribute("aria-checked", selectedLength ? "true" : "false");
        }
      }
      if (el.modeOptions && el.modeOptions.length) {
        for (var modeIndex = 0; modeIndex < el.modeOptions.length; modeIndex += 1) {
          var isModeSelected = el.modeOptions[modeIndex].getAttribute("data-mode-id") === (state.selectedMode ? state.selectedMode.id : "");
          el.modeOptions[modeIndex].className = "mode-option carousel-card" + (isModeSelected ? " selected" : "");
          el.modeOptions[modeIndex].setAttribute("aria-checked", isModeSelected ? "true" : "false");
        }
      }
      this.updateModeDetails(el, state.selectedMode);
      this.updateCharacterDetails(el, state.selectedCharacter);
      this.updateIslandDetails(el, state.selectedIsland);
      if (el.tokenOptions && el.tokenOptions.length) {
        for (var i = 0; i < el.tokenOptions.length; i += 1) {
          var isSelected = el.tokenOptions[i].getAttribute("data-token-id") === (state.selectedToken ? state.selectedToken.id : "");
          el.tokenOptions[i].className = "token-option" + (isSelected ? " selected" : "");
          el.tokenOptions[i].setAttribute("aria-checked", isSelected ? "true" : "false");
        }
      }
      if (el.characterOptions && el.characterOptions.length) {
        for (var characterIndex = 0; characterIndex < el.characterOptions.length; characterIndex += 1) {
          var isCharacterSelected = el.characterOptions[characterIndex].getAttribute("data-character-id") === (state.selectedCharacter ? state.selectedCharacter.id : "");
          var characterId = el.characterOptions[characterIndex].getAttribute("data-character-id");
          var isCharacterUnlocked = !!(state.unlockedCharacters[characterId]);
          for (var unlockIndex = 0; unlockIndex < AOC.data.characters.length; unlockIndex += 1) {
            if (AOC.data.characters[unlockIndex].id === characterId && AOC.data.characters[unlockIndex].unlocked) {
              isCharacterUnlocked = true;
              break;
            }
          }
          el.characterOptions[characterIndex].className = "character-option carousel-card" + (isCharacterSelected ? " selected" : "") + (isCharacterUnlocked ? "" : " locked");
          el.characterOptions[characterIndex].setAttribute("aria-checked", isCharacterSelected ? "true" : "false");
        }
      }
      if (el.financeAlert) {
        var budgetWarning = AOC.rules.buildBudgetWarning(state.stats.money, state.debtOwed);
        el.financeAlert.textContent = budgetWarning.text;
        el.financeAlert.className = "finance-alert finance-" + budgetWarning.level;
      }
      el.rollButton.disabled = !!(state.awaitingChoice || state.awaitingYearSummary || state.awaitingLoanDecision || state.awaitingPromiseDecision || state.awaitingShortcutDecision || state.awaitingDebtDecision || state.awaitingInvestmentDecision || state.gameOver || state.isAnimating);
      this.renderToken(el, state);
    },

    renderIslandGrid: function (el, state) {
      var grid;
      var i;
      var cell;
      var node;
      var signature;

      if (!el.islandGrid) {
        return;
      }

      grid = AOC.rules.ensureIslandGrid(state);
      el.islandGrid.style.setProperty("--grid-size", grid.size);

      while (el.islandGrid.children.length < grid.cells.length) {
        node = document.createElement("span");
        node.className = "island-cell";
        el.islandGrid.appendChild(node);
      }

      for (i = 0; i < grid.cells.length; i += 1) {
        cell = grid.cells[i];
        node = el.islandGrid.children[i];
        signature = [cell.terrain, cell.object || "empty", cell.objectRoot == null ? "root" : cell.objectRoot, cell.objectStage, cell.overlay || ""].join("|");
        if (node.getAttribute("data-signature") !== signature || cell.changed) {
          node.className = "island-cell";
          void node.offsetWidth;
          node.className = "island-cell terrain-" + cell.terrain +
            (cell.object ? " object-" + cell.object + " object-stage-" + cell.objectStage : "") +
            (cell.objectRoot != null && cell.objectRoot !== cell.id ? " object-part" : "") +
            (cell.object && cell.objectStage >= 2 && (cell.objectRoot == null || cell.objectRoot === cell.id) ? " object-large" : "") +
            (cell.overlay ? " overlay-" + cell.overlay : "") +
            (cell.changed ? " cell-changed" : "");
          node.setAttribute("data-signature", signature);
          node.setAttribute("data-terrain", cell.terrain);
          node.setAttribute("data-object", cell.object || "");
          node.textContent = "";
          cell.changed = false;
        }
      }
    },

    updateIslandVisual: function (el, state) {
      var stage;
      var env = state.stats.environment;
      var trust = state.stats.trust;
      var money = state.stats.money;
      var envLevel;
      var trustLevel;
      var budgetLevel;
      var comboLevel = "";
      var reactionClass = "";
      var islandTheme = state.selectedIsland && state.selectedIsland.theme ? state.selectedIsland.theme : "grassland";
      if (!el.islandVisual) {
        return;
      }
      stage = AOC.rules.getEnvironmentStage(state);
      this.renderIslandGrid(el, state);
      if (el.islandVisual.className.indexOf("reaction-positive") !== -1) {
        reactionClass = " reaction-positive";
      } else if (el.islandVisual.className.indexOf("reaction-negative") !== -1) {
        reactionClass = " reaction-negative";
      } else if (el.islandVisual.className.indexOf("reaction-neutral") !== -1) {
        reactionClass = " reaction-neutral";
      }

      envLevel = env >= 75 ? "env-high" : env >= 25 ? "env-mid" : env >= 0 ? "env-low" : env >= -50 ? "env-damaged" : "env-critical";
      trustLevel = trust >= 60 ? "trust-high" : trust >= 25 ? "trust-mid" : trust >= 0 ? "trust-low" : "trust-broken";
      budgetLevel = money >= 800 ? "budget-high" : money >= 250 ? "budget-mid" : money >= 0 ? "budget-low" : "budget-debt";
      if (env >= 60 && trust >= 60 && money >= 800) {
        comboLevel = " combo-thriving";
      } else if (env < -50 && trust < 0 && money < 0) {
        comboLevel = " combo-depleted";
      }

      el.islandVisual.className = "island-visual island-grid-visual island-theme-" + islandTheme + " stage-" + stage.id + " " + envLevel + " " + trustLevel + " " + budgetLevel + comboLevel + (state.hasGameStarted ? " active" : " intro") + reactionClass;
      if (el.centerIntro) {
        el.centerIntro.className = "center-intro center-branding" + (state.hasGameStarted ? " fading-out" : "");
      }
      if (el.islandStageLabel) {
        el.islandStageLabel.textContent = stage.label;
      }
      if (el.islandStageMessage) {
        el.islandStageMessage.textContent = stage.message;
      }
    },

    triggerIslandReaction: function (el, changes) {
      var tone = "neutral";
      var score;

      if (!el.islandVisual || !changes) {
        return;
      }

      score = (changes.environment || 0) + (changes.trust || 0) + Math.round((changes.money || 0) / 100);
      if (score > 0) {
        tone = "positive";
      } else if (score < 0) {
        tone = "negative";
      }

      el.islandVisual.className = el.islandVisual.className.replace(/\sreaction-(positive|negative|neutral)/g, "");
      void el.islandVisual.offsetWidth;
      el.islandVisual.className += " reaction-" + tone;
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

    showSettingsModal: function (el) {
      if (!el.settingsModal) {
        return;
      }
      el.settingsModal.className = "modal";
      el.settingsModal.setAttribute("aria-hidden", "false");
    },

    hideSettingsModal: function (el) {
      if (!el.settingsModal) {
        return;
      }
      el.settingsModal.className = "modal hidden";
      el.settingsModal.setAttribute("aria-hidden", "true");
    },

    populateVoiceOptions: function (el, voices, selectedVoiceName) {
      var i;
      var option;

      if (!el.voiceVoiceSelect) {
        return;
      }

      el.voiceVoiceSelect.innerHTML = "<option value=\"\">Default voice</option>";
      for (i = 0; i < voices.length; i += 1) {
        option = document.createElement("option");
        option.value = voices[i].name;
        option.textContent = voices[i].name;
        if (selectedVoiceName && selectedVoiceName === voices[i].name) {
          option.selected = true;
        }
        el.voiceVoiceSelect.appendChild(option);
      }
    },

    speakText: function (state, text) {
      var utterance;
      var voices;
      var i;

      if (!state.voiceSettings.enabled || !text || !("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = state.voiceSettings.lang;
      utterance.rate = state.voiceSettings.rate;
      utterance.pitch = state.voiceSettings.pitch;
      voices = window.speechSynthesis.getVoices();

      if (state.voiceSettings.voiceName) {
        for (i = 0; i < voices.length; i += 1) {
          if (voices[i].name === state.voiceSettings.voiceName) {
            utterance.voice = voices[i];
            break;
          }
        }
      }

      window.speechSynthesis.speak(utterance);
    },

    narrateCard: function (state, card) {
      if (!state.voiceSettings.readCards) {
        return;
      }
      this.speakText(state, card.title + ". " + card.description);
    },

    narrateWarning: function (state, text) {
      if (!state.voiceSettings.readWarnings) {
        return;
      }
      this.speakText(state, text);
    },

    narrateEnding: function (state, text) {
      if (!state.voiceSettings.readEndings) {
        return;
      }
      this.speakText(state, text);
    },

    animateDiceDisplay: async function (el, finalValue) {
      var duration = 800;
      var interval = 80;
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
      var tokenSource;

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
      tokenSource = state.selectedCharacter || state.selectedToken;
      token = document.createElement("span");
      token.className = "player-token" +
        (tokenSource ? " token-sprite token-sprite-" + (tokenSource.sprite || tokenSource.id) : "") +
        (state.isAnimating ? " token-moving" : "");
      token.textContent = tokenSource ? "" : "\u25CF";
      token.setAttribute("aria-label", tokenSource ? tokenSource.name + " token" : "Player token");
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
      if (el.characterScreen) {
        el.characterScreen.className = "screen character-screen" + (screen === "characterSelect" ? " active" : "");
        el.characterScreen.setAttribute("aria-hidden", screen === "characterSelect" ? "false" : "true");
      }
      if (el.islandScreen) {
        el.islandScreen.className = "screen island-screen" + (screen === "islandSelect" ? " active" : "");
        el.islandScreen.setAttribute("aria-hidden", screen === "islandSelect" ? "false" : "true");
      }
      if (el.roundsScreen) {
        el.roundsScreen.className = "screen rounds-screen" + (screen === "roundSelect" ? " active" : "");
        el.roundsScreen.setAttribute("aria-hidden", screen === "roundSelect" ? "false" : "true");
      }
      if (el.rulesScreen) {
        el.rulesScreen.className = "screen rules-screen" + (screen === "ready" ? " active" : "");
        el.rulesScreen.setAttribute("aria-hidden", screen === "ready" ? "false" : "true");
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
