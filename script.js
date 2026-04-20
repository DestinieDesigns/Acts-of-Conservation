window.VOTF_BOOTED = true;

(function () {
  var STARTING_STATS = {
    money: 100,
    environment: 50,
    trust: 50
  };

  function scenario(issueTitle, scenarioText, aLabel, aMoney, aEnv, aTrust, aFeedback, bLabel, bMoney, bEnv, bTrust, bFeedback) {
    return {
      issueTitle: issueTitle,
      scenario: scenarioText,
      optionA: {
        label: aLabel,
        money: aMoney,
        environment: aEnv,
        trust: aTrust,
        feedback: aFeedback
      },
      optionB: {
        label: bLabel,
        money: bMoney,
        environment: bEnv,
        trust: bTrust,
        feedback: bFeedback
      }
    };
  }

  var plots = [
    {
      tileName: "Breezy Bay Bend",
      locationDescription: "A windy coastal stretch known for shore birds, drifting reeds, and changing tides.",
      scenarios: [
        scenario("Stray Animal Management", "Stray and feral animals are increasing in the area.", "Build a free vet clinic", -15, 10, 12, "You improved animal health and community trust.", "Ignore the issue", 8, -8, -10, "The problem grows and impacts the ecosystem."),
        scenario("Coastal Erosion", "Strong tides are wearing away the shoreline.", "Invest in shoreline protection", -12, 14, 8, "You protected the coastline and wildlife habitats.", "Delay action", 10, -13, -6, "Erosion worsens and damages nearby areas.")
      ]
    },
    {
      tileName: "Mangomoss Crossing",
      locationDescription: "A lush mangrove crossing where roots and floodwater meet beneath bright green shade.",
      scenarios: [
        scenario("Mangrove Protection", "Developers want to clear mangroves to expand the area quickly.", "Protect and restore the mangroves", -10, 14, 9, "You protected a valuable ecosystem, improving resilience and public trust.", "Approve development for fast profit", 12, -13, -6, "You gained short-term profit, but weakened shoreline protection and habitat quality."),
        scenario("Wetland Access Road", "A shortcut road would make travel easier but cut through sensitive wet ground.", "Build an elevated low-impact path", -11, 9, 7, "You improved access while reducing wetland damage.", "Pave the direct route", 11, -10, -5, "The road saves money now, but runoff and habitat loss increase.")
      ]
    },
    {
      tileName: "Coral Curl Coast",
      locationDescription: "A bright reefside shoreline where coral pools, surf foam, and visitors share a narrow edge.",
      scenarios: [
        scenario("Waste Overflow", "Trash is building up along the shoreline and harming marine life.", "Fund a cleanup and recycling system", -12, 15, 8, "Cleanup efforts improve environmental quality and show the community you care.", "Delay action and cut costs", 10, -14, -7, "You kept your budget stronger, but pollution worsened and community confidence dropped."),
        scenario("Reef Tour Expansion", "Boat operators want more reef tours, but coral stress is already visible.", "Cap tours and require eco-guides", 6, 7, 5, "You supported steady tourism while protecting a fragile marine habitat.", "Expand tour volume quickly", 15, -12, -5, "Income rises quickly, but reef pressure and public concern grow too.")
      ]
    },
    {
      tileName: "Sunroot Village",
      locationDescription: "A warm hillside village held together by wells, stone paths, and close-knit homes.",
      scenarios: [
        scenario("Community Water Access", "The village needs clean water access and stronger shared infrastructure.", "Invest in water access and repairs", -18, 8, 15, "The project costs more now, but it builds long-term well-being and trust.", "Prioritize business expansion instead", 14, -6, -12, "You protected short-term income, but ignored a critical community need."),
        scenario("Shared Solar Grid", "Residents want a small shared solar system to reduce outages.", "Back the village solar co-op", -13, 9, 11, "You invested in stable infrastructure that supports households over time.", "Delay the project to save cash", 7, -5, -6, "You preserved funds for now, but missed a chance to build resilience and trust.")
      ]
    },
    {
      tileName: "Pebblepalm Point",
      locationDescription: "A scenic point where palm shade, tide pools, and local craft stalls draw slow-moving crowds.",
      scenarios: [
        scenario("Tourism Development", "The area could attract visitors, but the kind of development matters.", "Create eco-tourism with local guides", 8, 8, 10, "You built slower, balanced growth that supports both people and place.", "Build a high-impact tourist strip", 16, -12, -5, "Fast tourism boosts income now, but damages environmental quality and local confidence."),
        scenario("Beach Vendor Rules", "More vendors want permits near the shore, but the beach is already crowded.", "Limit stalls and require cleanup rules", 5, 6, 8, "You kept the area lively without giving up local quality of life.", "Approve every paying vendor", 13, -8, -6, "Revenue rises, but crowding, litter, and frustration increase as well.")
      ]
    },
    {
      tileName: "Glowgrove Path",
      locationDescription: "A glowing forest corridor known for old trees, fireflies, and cool evening air.",
      scenarios: [
        scenario("Forest Use Decision", "The nearby forest can either be restored or sold off for extraction.", "Fund reforestation and habitat recovery", -14, 16, 7, "Restoration strengthens the ecosystem and supports future resilience.", "Sell timber rights for quick cash", 15, -15, -8, "The money comes fast, but the forest and community lose long-term value."),
        scenario("Night Lighting Request", "Shops want stronger evening lighting, but nocturnal animals are avoiding the path.", "Install wildlife-friendly lighting", -6, 5, 6, "You made the route safer without overwhelming the habitat.", "Approve bright commercial lighting", 11, -8, -3, "The path becomes busier at night, but wildlife disruption increases.")
      ]
    },
    {
      tileName: "Driftroot Docks",
      locationDescription: "A tide-worn harbor where working boats, driftwood rails, and seabirds cluster together.",
      scenarios: [
        scenario("Fishing Pressure", "A growing commercial fleet wants more dock space.", "Expand small-scale docks with catch limits", 7, -4, 9, "You supported livelihoods while adding guardrails that protect the fishery over time.", "Open the harbor to large industrial buyers", 17, -11, -9, "You boosted revenue quickly, but local control and ecological stability both took a hit."),
        scenario("Harbor Fuel Runoff", "Small spills and poor storage are causing oily runoff.", "Upgrade storage and spill controls", -9, 10, 7, "You reduced pollution and showed that working harbors can still be responsibly managed.", "Postpone maintenance", 8, -9, -5, "You saved money now, but pollution and frustration keep building.")
      ]
    },
    {
      tileName: "Fernwhistle Fork",
      locationDescription: "A leafy crossroads where trailheads, bird calls, and food carts all meet.",
      scenarios: [
        scenario("Trail Expansion Debate", "Visitors want wider forest trails and new stalls.", "Build a low-impact trail with ranger oversight", 6, 6, 6, "You chose moderate growth with protections that keep the forest usable and respected.", "Approve unrestricted expansion", 14, -10, -6, "You increased visitor income, but habitat quality and local confidence declined."),
        scenario("Compost Toilet Project", "Trail use is rising and the area needs better sanitation.", "Install low-impact compost toilets", -10, 8, 7, "You reduced waste and kept the area cleaner for both visitors and ecosystems.", "Leave facilities as they are", 6, -7, -5, "You avoided the expense, but sanitation problems continue to spread.")
      ]
    },
    {
      tileName: "Ripplereed Row",
      locationDescription: "A wetland neighborhood of reeds, boardwalks, and flood-prone garden plots.",
      scenarios: [
        scenario("Flood Preparedness", "Seasonal flooding is creeping closer to homes and roads.", "Invest in flood buffers and wetland retention", -16, 13, 9, "You paid more upfront, but reduced long-term risk for both people and ecosystems.", "Keep development moving and patch problems later", 13, -10, -8, "You preserved short-term momentum, but left the community more exposed to future damage."),
        scenario("Mosquito Control", "Residents want relief from mosquitoes, but heavy spraying could harm wetland life.", "Use targeted habitat-safe controls", -8, 6, 7, "You addressed comfort and health concerns without undercutting the wetland ecosystem.", "Spray broadly for a quick fix", 7, -8, -4, "The immediate nuisance drops, but ecological damage and public concern rise.")
      ]
    },
    {
      tileName: "Cloudmango Corner",
      locationDescription: "A lively crossroads of youth clubs, shade trees, and small neighborhood workshops.",
      scenarios: [
        scenario("Youth Employment", "Young residents want paid conservation work.", "Launch a youth stewardship jobs program", -11, 8, 13, "You invested in local capacity, building both trust and long-term care for shared spaces.", "Hire cheaper outside crews", 9, -3, -10, "You reduced costs now, but weakened local buy-in and missed a chance to build community capacity."),
        scenario("Community Workshop Space", "A vacant building could become a skills workshop.", "Open a community training space", -10, 3, 12, "You strengthened local cooperation and long-term stability through shared investment.", "Sell the building for immediate revenue", 11, -2, -8, "You improved short-term finances, but reduced a chance to build stronger community ties.")
      ]
    },
    {
      tileName: "Mossy Moon Market",
      locationDescription: "An evening market lane full of lanterns, produce stalls, and moss-soft stone underfoot.",
      scenarios: [
        scenario("Vendor Waste Rules", "The market is bustling, but packaging waste is frustrating nearby households.", "Require reusable packaging and cleanup staffing", -8, 9, 8, "You made the market cleaner and more responsible, even though it cost more to manage.", "Keep rules loose", 10, -8, -6, "You protected commercial ease, but neighborhood frustration and pollution both rose."),
        scenario("Food Safety Upgrades", "Several stalls need safer washing stations and storage.", "Subsidize safety upgrades", -9, 2, 10, "You spent more now, but public confidence in the market grows.", "Delay upgrades to keep costs low", 8, -2, -8, "You preserved income for now, but people lose confidence in how the market is managed.")
      ]
    },
    {
      tileName: "Tideroot Terrace",
      locationDescription: "A cliffside edge where homes, roots, and sea spray sit uncomfortably close.",
      scenarios: [
        scenario("Shoreline Defense Choice", "Erosion is threatening the terrace edge.", "Build a living shoreline with native planting", -13, 12, 6, "You strengthened coastal resilience in a way that supports habitat and long-term adaptation.", "Pour a quick concrete seawall", 7, -9, -4, "The quick fix saved time and preserved funds, but it reduced ecological value and public confidence."),
        scenario("Cliffside Housing Pressure", "More investors want homes on the scenic edge.", "Restrict building and improve setbacks", -6, 8, 7, "You reduced future risk and protected a fragile area.", "Approve high-value cliffside permits", 14, -11, -6, "You gained revenue quickly, but increased long-term vulnerability and ecological loss.")
      ]
    },
    {
      tileName: "Willowwake Way",
      locationDescription: "A shady road at the forest edge where branches arc over dusk-time animal crossings.",
      scenarios: [
        scenario("Wildlife Rescue Support", "Injured birds and small animals are appearing more often near the road.", "Fund a modest rescue center", -13, 11, 8, "You improved direct care and prevention, showing visible commitment to local wildlife health.", "Keep rescue work informal", 7, -8, -7, "You held onto cash, but the lack of support worsened ecological harm and community frustration."),
        scenario("Road Crossing Safety", "Residents want speed calming and wildlife crossings.", "Install crossings and slower traffic measures", -10, 9, 8, "You made the area safer for both people and wildlife.", "Leave traffic flow unchanged", 8, -7, -6, "Traffic stays faster, but collisions and frustration continue.")
      ]
    },
    {
      tileName: "Lagoon Lantern Loop",
      locationDescription: "A lantern-lit path around a calm lagoon where festivals and nesting birds share the shoreline.",
      scenarios: [
        scenario("Festival Expansion", "A larger waterfront festival could boost income, but nesting areas are sensitive this season.", "Scale the festival with eco rules", 5, 6, 6, "You kept some economic benefit while respecting ecological limits.", "Approve the full expansion", 16, -13, -5, "The bigger event brings quick revenue, but the environmental and social costs mount fast."),
        scenario("Lagoon Water Quality", "Runoff after crowded events is clouding the water.", "Install drainage filters and cleanup rules", -9, 10, 7, "You reduced pollution and protected a shared community landmark.", "Keep operations unchanged", 8, -9, -5, "You avoided new costs, but water quality and public confidence keep slipping.")
      ]
    },
    {
      tileName: "Pollenbrook Plaza",
      locationDescription: "A bright central plaza where growers, compost bins, and neighborhood errands all overlap.",
      scenarios: [
        scenario("Local Food Hub", "Farmers want a shared produce and compost hub.", "Build the local food and compost hub", -11, 10, 11, "You backed local resilience and circular systems instead of chasing the quickest payout.", "Lease the plaza to a large retailer", 14, -5, -9, "You improved short-term revenue, but community ownership and environmental benefits were reduced."),
        scenario("Community Garden Debate", "Unused plaza edges could become a garden.", "Create a shared garden and shade beds", -7, 8, 10, "You improved food access, cooling, and community connection in one move.", "Pave for more parking", 9, -7, -6, "The area becomes easier to access by car, but loses community and environmental value.")
      ]
    },
    {
      tileName: "Seagrass Square",
      locationDescription: "A busy harbor square where cargo, walkers, and shallow seagrass beds sit close together.",
      scenarios: [
        scenario("Harbor Factory Proposal", "A processing company offers strong revenue, but neighbors are worried about runoff.", "Approve only with strict safeguards", 8, -3, 5, "You allowed some growth, but kept public oversight and environmental protections.", "Fast-track the contract", 18, -14, -10, "You chased a large financial gain, but weakened environmental protection and social trust."),
        scenario("Boat Mooring Damage", "Loose anchoring is tearing up nearby seagrass beds.", "Install managed moorings and protection zones", -10, 12, 6, "You protected a critical nursery habitat while keeping access organized.", "Let traffic expand freely", 10, -11, -5, "You preserved convenience and revenue, but the underwater habitat keeps degrading.")
      ]
    },
    {
      tileName: "Dewdrop Hollow",
      locationDescription: "A quiet hollow of tanks, gardens, and rooftops that depend heavily on seasonal rain.",
      scenarios: [
        scenario("Rainwater Storage", "Dry months are making water shortages more common.", "Build rainwater catchment and repair old tanks", -14, 9, 12, "You invested in resilience that supports both households and long-term environmental stability.", "Delay upgrades and hope rains recover", 9, -7, -9, "You avoided immediate costs, but the community remains more vulnerable and less confident."),
        scenario("Graywater Reuse Pilot", "Residents propose a graywater reuse pilot.", "Fund the pilot and training", -10, 8, 8, "You helped the community use water more sustainably and plan for future shortages.", "Reject the pilot and stay with old systems", 7, -6, -5, "You saved money for now, but the water system remains less resilient than it could be.")
      ]
    },
    {
      tileName: "Brineberry Bluff",
      locationDescription: "A salt-touched bluff where berry vines cling to stone above the surf.",
      scenarios: [
        scenario("Cliff Runoff Control", "Rainwater is washing loose soil and debris down the bluff face.", "Stabilize the slope with native planting", -9, 10, 7, "You reduced erosion and protected the coast below.", "Delay the work and save funds", 8, -8, -4, "The runoff keeps worsening and damages nearby habitat.")
      ]
    },
    {
      tileName: "Hearthfern Hollow",
      locationDescription: "A cool shaded hollow known for fern beds, stone paths, and tucked-away homes.",
      scenarios: [
        scenario("Canopy Protection", "Residents want more parking, but clearing trees would heat the neighborhood and reduce habitat.", "Protect the canopy and redesign the space", -8, 9, 8, "You kept the hollow cooler and more livable in the long term.", "Clear the trees for quick access", 9, -9, -5, "You gained convenience now, but lost shade, habitat, and public support.")
      ]
    },
    {
      tileName: "Moonshell Mile",
      locationDescription: "A long moonlit shoreline where shell paths curve between dunes and tide pools.",
      scenarios: [
        scenario("Dune Trampling", "Heavy foot traffic is flattening the dunes and disturbing shore vegetation.", "Install guided paths and dune fencing", -10, 11, 6, "You protected a fragile shoreline while keeping access manageable.", "Let traffic spread naturally", 8, -10, -5, "The beach stays open, but erosion and habitat loss increase.")
      ]
    },
    {
      tileName: "Cinderleaf Court",
      locationDescription: "A busy village court where cooking fires, workshops, and market carts mix together.",
      scenarios: [
        scenario("Recycling Depot Plan", "Waste volumes are rising and the court needs a better way to sort reusable materials.", "Open a small recycling depot", -9, 10, 8, "You reduced waste pressure and created a cleaner shared space.", "Keep basic collection only", 7, -7, -5, "You saved money now, but litter and dumping continue to grow.")
      ]
    },
    {
      tileName: "Silvermoss Steps",
      locationDescription: "A tiered hillside stairway lined with mossy stones, spring seepage, and small gardens.",
      scenarios: [
        scenario("Spring Restoration", "The hillside spring is being choked by sediment and neglect.", "Restore the spring and drainage channels", -11, 12, 7, "You protected a valuable water source and improved slope stability.", "Leave it for later", 8, -9, -4, "Sediment builds up and the spring becomes less reliable.")
      ]
    },
    {
      tileName: "Tidepetal Turn",
      locationDescription: "A bright coastal bend where flowering shrubs meet sea wind and soft dunes.",
      scenarios: [
        scenario("Pollinator Planting", "The roadside edge could become pollinator habitat, but some want a simpler mowing plan.", "Plant native flowers and buffers", -8, 9, 7, "You improved biodiversity and the look of the coast.", "Keep the cheapest maintenance plan", 6, -6, -3, "You reduced upkeep, but the area loses habitat value and charm.")
      ]
    },
    {
      tileName: "Banyan Breeze Block",
      locationDescription: "A breezy neighborhood block anchored by old banyan roots and shaded gathering spots.",
      scenarios: [
        scenario("Shade Tree Preservation", "Utility work threatens several mature trees that cool the block and support bird life.", "Reroute the work to preserve the trees", -10, 10, 9, "You protected cooling shade and a stronger neighborhood atmosphere.", "Remove the trees for easier construction", 9, -10, -6, "The job gets simpler, but heat, habitat loss, and frustration all increase.")
      ]
    },
  ];

  var state = {
    stats: { money: 100, environment: 50, trust: 50 },
    position: 0,
    year: 1,
    turnsTaken: 0,
    loopsCompleted: 0,
    selectedRounds: 10,
    lastRoll: null,
    awaitingChoice: false,
    awaitingYearSummary: false,
    gameOver: false,
    lastScenarioByTile: [],
    pendingLanding: null
  };

  var el = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function initElements() {
    el.startScreen = byId("start-screen");
    el.gameScreen = byId("game-screen");
    el.endScreen = byId("end-screen");
    el.startButton = byId("start-button");
    el.rollButton = byId("roll-button");
    el.restartButton = byId("restart-button");
    el.roundOptions = document.querySelectorAll(".round-option");
    el.board = byId("board");
    el.boardPanel = document.querySelector(".board-panel");
    el.boardTooltip = byId("board-tooltip");
    el.tooltipName = byId("tooltip-name");
    el.tooltipDescription = byId("tooltip-description");
    el.moneyStat = byId("money-stat");
    el.environmentStat = byId("environment-stat");
    el.trustStat = byId("trust-stat");
    el.yearCounter = byId("year-counter");
    el.turnCounter = byId("turn-counter");
    el.diceResult = byId("dice-result");
    el.statusText = byId("status-text");
    el.choiceModal = byId("choice-modal");
    el.modalPlace = byId("modal-place");
    el.modalIssue = byId("modal-issue");
    el.modalScenario = byId("modal-scenario");
    el.choiceOptions = byId("choice-options");
    el.yearModal = byId("year-modal");
    el.yearTitle = byId("year-title");
    el.yearMoney = byId("year-money");
    el.yearEnvironment = byId("year-environment");
    el.yearTrust = byId("year-trust");
    el.yearSummary = byId("year-summary");
    el.yearStrongest = byId("year-strongest");
    el.yearWeakest = byId("year-weakest");
    el.yearReflection = byId("year-reflection");
    el.continueYearButton = byId("continue-year-button");
    el.endingTitle = byId("ending-title");
    el.strategySummary = byId("strategy-summary");
    el.educationSummary = byId("education-summary");
    el.endMoney = byId("end-money");
    el.endEnvironment = byId("end-environment");
    el.endTrust = byId("end-trust");
    el.reflectionLine = document.querySelector(".reflection-line");
    el.centerMessageTitle = null;
    el.centerMessageBody = null;
    el.centerMoneyMini = null;
    el.centerEnvironmentMini = null;
    el.centerTrustMini = null;
  }

  function bindEvents() {
    var i;
    for (i = 0; i < el.roundOptions.length; i += 1) {
      el.roundOptions[i].onclick = function () {
        selectRounds(parseInt(this.getAttribute("data-rounds"), 10));
      };
    }
    if (el.startButton) {
      el.startButton.onclick = startGame;
    }
    if (el.rollButton) {
      el.rollButton.onclick = handleRoll;
    }
    if (el.restartButton) {
      el.restartButton.onclick = resetGame;
    }
    if (el.continueYearButton) {
      el.continueYearButton.onclick = continueAfterYearSummary;
    }
    document.onclick = function (event) {
      if (!isTouchLayout()) {
        return;
      }
      if (el.boardPanel && el.boardPanel.contains(event.target)) {
        return;
      }
      hideBoardTooltip();
    };
  }

  function selectRounds(rounds) {
    var i;
    state.selectedRounds = rounds;
    for (i = 0; i < el.roundOptions.length; i += 1) {
      if (parseInt(el.roundOptions[i].getAttribute("data-rounds"), 10) === rounds) {
        el.roundOptions[i].className = "round-option selected";
      } else {
        el.roundOptions[i].className = "round-option";
      }
    }
    updateUI();
  }

  function getBand(index) {
    var bands = [
      "coast", "wetland", "coast", "village", "coast",
      "wetland", "forest", "village", "wetland", "coast",
      "forest", "village", "coast", "forest", "village",
      "wetland", "forest", "village", "coast", "wetland",
      "forest", "village", "coast", "forest"
    ];
    return bands[index % bands.length];
  }

  function getCornerLabel(index) {
    if (index === 0) {
      return "Start";
    }
    if (index === 6) {
      return "Environmental Crisis";
    }
    if (index === 12) {
      return "Community Boost";
    }
    if (index === 18) {
      return "Go To Crisis";
    }
    return "Stop " + (index + 1);
  }

  function getTileLayout(index) {
    var cornerSize = 16.5;
    var gapSize = 0.5;
    var sideTileSize = 12.8;
    var offset;

    if (index === 0) {
      return { side: "top", corner: true, left: "0%", top: "0%", width: "16.5%", height: "16.5%" };
    }
    if (index >= 1 && index <= 5) {
      offset = index - 1;
      return {
        side: "top",
        corner: false,
        left: (cornerSize + gapSize + (offset * (sideTileSize + gapSize))) + "%",
        top: "0%",
        width: sideTileSize + "%",
        height: cornerSize + "%"
      };
    }
    if (index === 6) {
      return { side: "right", corner: true, left: "83.5%", top: "0%", width: "16.5%", height: "16.5%" };
    }
    if (index >= 7 && index <= 11) {
      offset = index - 7;
      return {
        side: "right",
        corner: false,
        left: "83.5%",
        top: (cornerSize + gapSize + (offset * (sideTileSize + gapSize))) + "%",
        width: cornerSize + "%",
        height: sideTileSize + "%"
      };
    }
    if (index === 12) {
      return { side: "bottom", corner: true, left: "83.5%", top: "83.5%", width: "16.5%", height: "16.5%" };
    }
    if (index >= 13 && index <= 17) {
      offset = index - 13;
      return {
        side: "bottom",
        corner: false,
        left: (83.5 - sideTileSize - (offset * (sideTileSize + gapSize))) + "%",
        top: "83.5%",
        width: sideTileSize + "%",
        height: cornerSize + "%"
      };
    }
    if (index === 18) {
      return { side: "left", corner: true, left: "0%", top: "83.5%", width: "16.5%", height: "16.5%" };
    }

    offset = index - 19;
    return {
      side: "left",
      corner: false,
      left: "0%",
      top: (83.5 - sideTileSize - (offset * (sideTileSize + gapSize))) + "%",
      width: cornerSize + "%",
      height: sideTileSize + "%"
    };
  }

  function renderBoard() {
    var i, tile, plot, layout, center;
    el.board.innerHTML = "";
    for (i = 0; i < plots.length; i += 1) {
      plot = plots[i];
      layout = getTileLayout(i);
      tile = document.createElement("article");
      tile.className = "space " + layout.side + (layout.corner ? " corner" : "");
      tile.setAttribute("data-index", String(i));
      tile.setAttribute("data-band", getBand(i));
      tile.setAttribute("tabindex", "0");
      tile.style.left = layout.left;
      tile.style.top = layout.top;
      tile.style.width = layout.width;
      tile.style.height = layout.height;
      tile.innerHTML = "<span class=\"space-index\">" + getCornerLabel(i) + "</span>" +
        "<strong class=\"space-name\">" + plot.tileName + "</strong>" +
        "<span class=\"space-badge\">" + capitalize(getBand(i)) + "</span>";
      attachTileHover(tile, plot);
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
      "<div class=\"mini-stat\"><span>Money</span><strong id=\"center-money-mini\">100</strong></div>" +
      "<div class=\"mini-stat\"><span>Environment</span><strong id=\"center-environment-mini\">50</strong></div>" +
      "<div class=\"mini-stat\"><span>Trust</span><strong id=\"center-trust-mini\">50</strong></div>" +
      "</section>" +
      "</div>" +
      "</div>";
    el.board.appendChild(center);
    el.centerMessageTitle = byId("center-message-title");
    el.centerMessageBody = byId("center-message-body");
    el.centerMoneyMini = byId("center-money-mini");
    el.centerEnvironmentMini = byId("center-environment-mini");
    el.centerTrustMini = byId("center-trust-mini");
  }

  function attachTileHover(tile, plot) {
    tile.onmouseenter = function () {
      if (isTouchLayout()) {
        return;
      }
      showBoardTooltip(tile, plot);
    };
    tile.onmousemove = function () {
      if (isTouchLayout()) {
        return;
      }
      showBoardTooltip(tile, plot);
    };
    tile.onmouseleave = function () {
      if (isTouchLayout()) {
        return;
      }
      hideBoardTooltip();
    };
    tile.onclick = function (event) {
      if (!isTouchLayout()) {
        return;
      }
      event.stopPropagation();
      toggleBoardTooltip(tile, plot);
    };
    tile.onfocus = function () {
      showBoardTooltip(tile, plot);
    };
    tile.onblur = function () {
      if (!isTouchLayout()) {
        hideBoardTooltip();
      }
    };
    tile.onkeydown = function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleBoardTooltip(tile, plot);
      }
    };
  }

  function isTouchLayout() {
    return !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse), (max-width: 760px)").matches);
  }

  function toggleBoardTooltip(tile, plot) {
    if (!el.boardTooltip) {
      return;
    }
    if (el.boardTooltip.getAttribute("data-tile-index") === tile.getAttribute("data-index") && el.boardTooltip.getAttribute("aria-hidden") === "false") {
      hideBoardTooltip();
      return;
    }
    showBoardTooltip(tile, plot);
  }

  function showBoardTooltip(tile, plot) {
    var tileRect, panelRect, left, top, below;
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
  }

  function hideBoardTooltip() {
    if (!el.boardTooltip) {
      return;
    }
    el.boardTooltip.className = "board-tooltip hidden";
    el.boardTooltip.setAttribute("data-tile-index", "");
    el.boardTooltip.setAttribute("aria-hidden", "true");
  }

  function startGame() {
    resetStateForNewSession();
    showScreen("game");
    updateStatus("Roll to move and face new challenges.");
    setCenterMessage("Island Outlook", "Watch your token move across the island and make choices that shape its future.");
  }

  function handleRoll() {
    var roll, rawPosition, plot, scenarioIndex, scenarioObj, completedLoop;
    if (state.awaitingChoice || state.awaitingYearSummary || state.gameOver) {
      return;
    }
    hideBoardTooltip();
    roll = Math.floor(Math.random() * 6) + 1;
    rawPosition = state.position + roll;
    state.turnsTaken += 1;
    state.lastRoll = roll;
    state.position = rawPosition % plots.length;
    animateDiceDisplay();

    plot = plots[state.position];
    scenarioIndex = pickScenarioIndex(state.position);
    scenarioObj = plot.scenarios[scenarioIndex];
    updateStatus("You rolled a " + roll + " and arrived at " + plot.tileName + ".");
    setCenterMessage("Arrived at " + plot.tileName, scenarioObj.scenario);
    updateUI();

    completedLoop = rawPosition >= plots.length || state.position === 0;
    if (completedLoop) {
      state.loopsCompleted += 1;
      if (state.loopsCompleted < state.selectedRounds) {
        state.year += 1;
      }
      state.awaitingYearSummary = true;
      state.pendingLanding = { plotIndex: state.position, scenarioIndex: scenarioIndex };
      showYearSummary();
      return;
    }

    state.awaitingChoice = true;
    showChoiceModal(plot, scenarioObj);
  }

  function pickScenarioIndex(plotIndex) {
    var scenarioCount = plots[plotIndex].scenarios.length;
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
  }

  function showChoiceModal(plot, scenarioObj) {
    var options, i, button, option;
    el.modalPlace.textContent = plot.tileName + " - " + plot.locationDescription;
    el.modalIssue.textContent = scenarioObj.issueTitle;
    el.modalScenario.textContent = scenarioObj.scenario;
    el.choiceOptions.innerHTML = "";
    options = [scenarioObj.optionA, scenarioObj.optionB];

    for (i = 0; i < options.length; i += 1) {
      option = options[i];
      button = document.createElement("button");
      button.className = "choice-card";
      button.type = "button";
      button.innerHTML =
        "<h4>" + (i === 0 ? "Option A" : "Option B") + ": " + option.label + "</h4>" +
        "<div class=\"effect-list\">" +
        renderEffectItem("Money", option.money) +
        renderEffectItem("Environment Health", option.environment) +
        renderEffectItem("Community Trust", option.trust) +
        "</div>";
      button.onclick = createChoiceHandler(option);
      el.choiceOptions.appendChild(button);
    }

    el.choiceModal.className = "modal";
    el.choiceModal.setAttribute("aria-hidden", "false");
    el.rollButton.disabled = true;
  }

  function createChoiceHandler(option) {
    return function () {
      applyChoice(option);
    };
  }

  function renderEffectItem(label, value) {
    var className = value >= 0 ? "positive" : "negative";
    var sign = value >= 0 ? "+" : "";
    return "<div class=\"effect-item\"><span>" + label + "</span><span class=\"effect-value " + className + "\">" + sign + value + "</span></div>";
  }

  function applyChoice(option) {
    state.stats.money = clampStat(state.stats.money + option.money);
    state.stats.environment = clampStat(state.stats.environment + option.environment);
    state.stats.trust = clampStat(state.stats.trust + option.trust);
    state.awaitingChoice = false;
    hideChoiceModal();
    updateStatus(option.feedback + " Money " + formatDelta(option.money) + ", Environment " + formatDelta(option.environment) + ", Community Trust " + formatDelta(option.trust) + ".");
    setCenterMessage("Decision Applied", buildChoiceSummary(option));
    updateUI();
    checkEndConditions();
  }

  function buildChoiceSummary(option) {
    var parts = [];
    parts.push(describeDelta(option.environment, "environmental health"));
    parts.push(describeDelta(option.trust, "community trust"));
    parts.push(describeDelta(option.money, "available funds"));
    return "Your decision " + parts.join(", ") + ".";
  }

  function describeDelta(value, label) {
    if (value > 0) {
      return "improved " + label;
    }
    if (value < 0) {
      return "reduced " + label;
    }
    return "left " + label + " unchanged";
  }

  function showYearSummary() {
    var snapshot = buildYearSummaryContent();
    if (!el.yearModal) {
      state.awaitingYearSummary = false;
      return;
    }
    el.yearTitle.textContent = state.loopsCompleted >= state.selectedRounds ? "Year " + state.year + " Complete" : "Year " + state.year;
    el.yearMoney.textContent = state.stats.money;
    el.yearEnvironment.textContent = state.stats.environment;
    el.yearTrust.textContent = state.stats.trust;
    el.yearSummary.textContent = snapshot.summary;
    el.yearStrongest.textContent = snapshot.strongest;
    el.yearWeakest.textContent = snapshot.weakest;
    el.yearReflection.textContent = snapshot.reflection;
    if (el.continueYearButton) {
      el.continueYearButton.textContent = state.loopsCompleted >= state.selectedRounds ? "See final results" : "Continue to next year";
    }
    el.yearModal.className = "modal";
    el.yearModal.setAttribute("aria-hidden", "false");
    el.rollButton.disabled = true;
  }

  function continueAfterYearSummary() {
    var pending, plot, scenarioObj;
    if (!state.awaitingYearSummary || !state.pendingLanding) {
      return;
    }
    if (state.loopsCompleted >= state.selectedRounds) {
      hideYearSummary();
      endGame(getFinalEnding());
      return;
    }
    pending = state.pendingLanding;
    hideYearSummary();
    plot = plots[pending.plotIndex];
    scenarioObj = plot.scenarios[pending.scenarioIndex];
    state.awaitingChoice = true;
    showChoiceModal(plot, scenarioObj);
  }

  function buildYearSummaryContent() {
    var ranked = [
      { label: "Money", value: state.stats.money },
      { label: "Environment Health", value: state.stats.environment },
      { label: "Community Trust", value: state.stats.trust }
    ];
    var strongest, weakest, summary, reflection;
    ranked.sort(function (a, b) { return b.value - a.value; });

    strongest = ranked[0].label;
    weakest = ranked[2].label;
    summary = "This year stayed fairly balanced, with no single priority completely taking over the board.";
    reflection = "Sustainable progress requires balancing growth with environmental care.";

    if (strongest === "Community Trust" && weakest === "Environment Health") {
      summary = "Your investments this year strengthened the community, but environmental pressure is increasing.";
    } else if (strongest === "Environment Health" && weakest === "Money") {
      summary = "You protected habitats and long-term resilience this year, though your finances took the strain.";
    } else if (strongest === "Money" && weakest === "Community Trust") {
      summary = "Your budget grew this year, but community confidence is becoming harder to hold onto.";
    } else if (strongest === "Money" && weakest === "Environment Health") {
      summary = "Economic momentum improved this year, but environmental stress is becoming more visible.";
    } else if (strongest === "Environment Health" && weakest === "Community Trust") {
      summary = "Nature is recovering under your watch, but people may need more visible support and inclusion.";
    } else if (strongest === "Community Trust" && weakest === "Money") {
      summary = "People feel supported this year, though your finances will need careful attention moving forward.";
    }

    if (weakest === "Environment Health") {
      reflection = "Habitat loss and pollution often create costs later that are harder to reverse than to prevent.";
    } else if (weakest === "Community Trust") {
      reflection = "Public trust and cooperation make long-term plans easier to carry through when tradeoffs get difficult.";
    } else if (weakest === "Money") {
      reflection = "Even good community and environmental plans need stable funding to stay effective over time.";
    }

    return {
      strongest: strongest,
      weakest: weakest,
      summary: summary,
      reflection: reflection
    };
  }

  function hideChoiceModal() {
    if (el.choiceModal) {
      el.choiceModal.className = "modal hidden";
      el.choiceModal.setAttribute("aria-hidden", "true");
    }
  }

  function hideYearSummary() {
    if (el.yearModal) {
      el.yearModal.className = "modal hidden";
      el.yearModal.setAttribute("aria-hidden", "true");
    }
    state.awaitingYearSummary = false;
    state.pendingLanding = null;
  }

  function updateUI() {
    if (el.moneyStat) {
      el.moneyStat.textContent = state.stats.money;
      el.environmentStat.textContent = state.stats.environment;
      el.trustStat.textContent = state.stats.trust;
      if (el.centerMoneyMini) {
        el.centerMoneyMini.textContent = state.stats.money;
      }
      if (el.centerEnvironmentMini) {
        el.centerEnvironmentMini.textContent = state.stats.environment;
      }
      if (el.centerTrustMini) {
        el.centerTrustMini.textContent = state.stats.trust;
      }
      el.yearCounter.textContent = state.year + " / " + state.selectedRounds;
      el.turnCounter.textContent = state.turnsTaken;
      el.diceResult.textContent = state.lastRoll === null ? "-" : state.lastRoll;
      el.diceResult.className = state.lastRoll === null ? "dice-face dice-idle" : "dice-face";
      el.diceResult.setAttribute("data-roll", state.lastRoll === null ? "0" : String(state.lastRoll));
      el.diceResult.setAttribute("aria-label", state.lastRoll === null ? "No roll yet" : "Last roll " + state.lastRoll);
      el.rollButton.disabled = !!(state.awaitingChoice || state.awaitingYearSummary || state.gameOver);
    }
    renderToken();
  }

  function animateDiceDisplay() {
    if (!el.diceResult) {
      return;
    }
    el.diceResult.className = "dice-face dice-pop";
    window.setTimeout(function () {
      if (el.diceResult) {
        el.diceResult.className = "dice-face";
      }
    }, 240);
  }

  function renderToken() {
    var tiles, i, existing, currentTile, token;
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
    currentTile.appendChild(token);
  }

  function updateStatus(message) {
    if (el.statusText) {
      el.statusText.textContent = message;
    }
  }

  function setCenterMessage(title, message) {
    if (el.centerMessageTitle) {
      el.centerMessageTitle.textContent = title;
    }
    if (el.centerMessageBody) {
      el.centerMessageBody.textContent = message;
    }
  }

  function checkEndConditions() {
    if (state.stats.money <= 0) {
      endGame("Financial Collapse");
      return;
    }
    if (state.stats.environment <= 0) {
      endGame("Environmental Decline");
      return;
    }
    if (state.stats.trust <= 0) {
      endGame("Community Breakdown");
      return;
    }
    if (state.loopsCompleted >= state.selectedRounds) {
      endGame(getFinalEnding());
    }
  }

  function getFinalEnding() {
    var money = state.stats.money;
    var environment = state.stats.environment;
    var trust = state.stats.trust;
    var minValue = Math.min(money, environment, trust);
    var maxValue = Math.max(money, environment, trust);
    var spread = maxValue - minValue;
    if (money >= 45 && environment >= 45 && trust >= 45 && spread <= 22) {
      return "Thriving Future";
    }
    if (environment <= 25) {
      return "Environmental Decline";
    }
    if (trust <= 25) {
      return "Community Breakdown";
    }
    if (money <= 25) {
      return "Financial Collapse";
    }
    return "Fragile Progress";
  }

  function endGame(endingType) {
    var summary = buildEndContent(endingType);
    state.gameOver = true;
    hideChoiceModal();
    hideYearSummary();
    hideBoardTooltip();
    updateUI();
    el.endingTitle.textContent = endingType;
    el.strategySummary.textContent = summary.strategy;
    el.educationSummary.textContent = summary.education;
    el.endMoney.textContent = state.stats.money;
    el.endEnvironment.textContent = state.stats.environment;
    el.endTrust.textContent = state.stats.trust;
    el.reflectionLine.textContent = summary.reflection;
    showScreen("end");
  }

  function buildEndContent(endingType) {
    var strategyStyle = describeStrategy();
    var content = {
      "Thriving Future": {
        strategy: "You finished with a healthy balance across money, environment, and trust. " + strategyStyle + " Your decisions suggest a steady strategy built on sustainable development rather than quick wins alone.",
        education: "This kind of outcome reflects how real communities benefit when habitat protection, pollution prevention, animal care, water access, and local cooperation are treated as connected goals. Balanced planning often avoids the long-term costs that come from chasing short-term profit too aggressively.",
        reflection: "Small choices create long-term impact."
      },
      "Fragile Progress": {
        strategy: "You kept the community moving forward, but one area remained noticeably weaker than the others. " + strategyStyle + " The result is progress with a fragile foundation.",
        education: "In real life, even partial success can leave communities exposed. A town may earn revenue, but still struggle if pollution rises, habitat loss worsens, water systems lag behind, or public trust starts to thin.",
        reflection: "Progress lasts longer when balance is part of the plan."
      },
      "Environmental Decline": {
        strategy: "Your final path left environmental health too weak to support long-term stability. " + strategyStyle + " The short-term gains did not offset the ecological strain.",
        education: "This mirrors real environmental decline: habitat loss, shoreline erosion, pollution, and unmanaged extraction often create hidden costs later. Damage to forests, wetlands, reefs, and animal populations can raise cleanup bills and reduce resilience.",
        reflection: "Protecting nature early is often less costly than repairing damage later."
      },
      "Community Breakdown": {
        strategy: "Your choices left community trust too low to hold the system together. " + strategyStyle + " Even useful projects lose strength when people feel unheard or unsupported.",
        education: "Public trust and cooperation are practical resources in real communities. When access to water, animal care, jobs, safety, or fair process is neglected, support fades and coordination becomes harder.",
        reflection: "Communities grow stronger when people feel included in the future being built."
      },
      "Financial Collapse": {
        strategy: "You ran out of financial stability before the community could fully carry your plans. " + strategyStyle + " Strong ideas still need durable funding to last.",
        education: "In real life, budgets shape what communities can maintain. If financial planning breaks down, it becomes harder to support water systems, habitat restoration, animal care, cleanup work, and trusted public services.",
        reflection: "A resilient future needs both resources and restraint."
      }
    };
    return content[endingType];
  }

  function describeStrategy() {
    var money = state.stats.money;
    var environment = state.stats.environment;
    var trust = state.stats.trust;
    if (money > environment && money > trust) {
      return "You often favored financial momentum over the other two pillars.";
    }
    if (environment > money && environment > trust) {
      return "You regularly leaned toward environmental protection, even when it slowed short-term gains.";
    }
    if (trust > money && trust > environment) {
      return "You consistently prioritized public support and community stability.";
    }
    return "You spread attention across all three pillars, even if the balance was not perfect every round.";
  }

  function resetGame() {
    resetStateForNewSession();
    showScreen("start");
  }

  function resetStateForNewSession() {
    state.stats = { money: STARTING_STATS.money, environment: STARTING_STATS.environment, trust: STARTING_STATS.trust };
    state.position = 0;
    state.year = 1;
    state.turnsTaken = 0;
    state.loopsCompleted = 0;
    state.lastRoll = null;
    state.awaitingChoice = false;
    state.awaitingYearSummary = false;
    state.gameOver = false;
    state.lastScenarioByTile = [];
    state.pendingLanding = null;
    hideChoiceModal();
    hideYearSummary();
    hideBoardTooltip();
    updateUI();
  }

  function showScreen(screen) {
    el.startScreen.className = "screen start-screen" + (screen === "start" ? " active" : "");
    el.gameScreen.className = "screen game-screen" + (screen === "game" ? " active" : "");
    el.endScreen.className = "screen end-screen" + (screen === "end" ? " active" : "");
    el.startScreen.setAttribute("aria-hidden", screen === "start" ? "false" : "true");
    el.gameScreen.setAttribute("aria-hidden", screen === "game" ? "false" : "true");
    el.endScreen.setAttribute("aria-hidden", screen === "end" ? "false" : "true");
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function clampStat(value) {
    return Math.max(0, Math.min(100, value));
  }

  function formatDelta(value) {
    return value >= 0 ? "+" + value : String(value);
  }

  function boot() {
    initElements();
    bindEvents();
    renderBoard();
    updateUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}());
