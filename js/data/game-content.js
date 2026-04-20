(function () {
  var AOC = window.AOC = window.AOC || {};
  var data = AOC.data = AOC.data || {};

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

  function createOutcome(money, environment, trust, feedback) {
    return {
      money: money,
      environment: environment,
      trust: trust,
      feedback: feedback
    };
  }

  function normalizeChoice(choiceId, choice) {
    return {
      id: choiceId,
      label: choice.label,
      outcomes: [
        createOutcome(choice.money, choice.environment, choice.trust, choice.feedback)
      ]
    };
  }

  function normalizeScenario(plotId, scenarioIndex, scenarioConfig) {
    return {
      id: plotId + "-scenario-" + scenarioIndex,
      issueTitle: scenarioConfig.issueTitle,
      scenario: scenarioConfig.scenario,
      optionA: normalizeChoice(plotId + "-scenario-" + scenarioIndex + "-option-a", scenarioConfig.optionA),
      optionB: normalizeChoice(plotId + "-scenario-" + scenarioIndex + "-option-b", scenarioConfig.optionB)
    };
  }

  function normalizeInvestment(investment) {
    return {
      id: investment.id,
      name: investment.name,
      category: investment.category,
      description: investment.description,
      option: {
        id: investment.id + "-invest",
        label: "Fund " + investment.name,
        outcomes: [
          createOutcome(
            investment.effects.money,
            investment.effects.environment,
            investment.effects.trust,
            investment.description
          )
        ]
      }
    };
  }

  function mapLegacyEffect(effect) {
    var mapped = {
      money: effect.money || 0,
      environment: effect.environment || 0,
      trust: effect.trust || 0
    };

    if (effect.happiness) {
      mapped.trust += effect.happiness;
    }
    if (effect.reputation) {
      mapped.trust += effect.reputation;
    }
    if (effect.health) {
      mapped.environment += effect.health;
    }
    if (effect.energy) {
      mapped.trust += Math.round(effect.energy * 0.6);
    }

    return mapped;
  }

  function buildMappedFeedback(mappedEffect) {
    var parts = [];

    if (mappedEffect.money !== 0) {
      parts.push(mappedEffect.money > 0 ? "economic capacity rises" : "economic reserves tighten");
    }
    if (mappedEffect.environment !== 0) {
      parts.push(mappedEffect.environment > 0 ? "environmental resilience improves" : "environmental strain grows");
    }
    if (mappedEffect.trust !== 0) {
      parts.push(mappedEffect.trust > 0 ? "community confidence strengthens" : "community confidence weakens");
    }

    if (!parts.length) {
      return "The choice keeps the island steady for now.";
    }

    return "This choice means " + parts.join(", ") + ".";
  }

  function convertLegacyCard(card, index) {
    function convertChoice(choice, choiceIndex) {
      var mappedEffect = mapLegacyEffect(choice.effect);
      return {
        id: "legacy-card-" + index + "-choice-" + choiceIndex,
        label: choice.text,
        outcomes: [
          createOutcome(
            mappedEffect.money,
            mappedEffect.environment,
            mappedEffect.trust,
            buildMappedFeedback(mappedEffect)
          )
        ]
      };
    }

    return {
      id: "legacy-card-" + index,
      title: card.title,
      description: card.description,
      choices: [
        convertChoice(card.choices[0], 0),
        convertChoice(card.choices[1], 1)
      ]
    };
  }

  data.plots = [
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
    }
  ];

  data.investments = [
    {
      id: "community-green-bank",
      name: "Community Green Bank",
      category: "finance",
      cost: 24,
      effects: { money: -24, environment: 7, trust: 9 },
      description: "A reusable financing pool for local resilience and restoration projects."
    },
    {
      id: "reef-restoration-fund",
      name: "Reef Restoration Fund",
      category: "environment",
      cost: 20,
      effects: { money: -20, environment: 14, trust: 5 },
      description: "Long-term coral and shoreline recovery support for coastal resilience."
    },
    {
      id: "youth-stewardship-fellowship",
      name: "Youth Stewardship Fellowship",
      category: "community",
      cost: 18,
      effects: { money: -18, environment: 6, trust: 13 },
      description: "A future-facing local jobs program that builds trust and stewardship capacity."
    }
  ];

  data.tokens = [
    { id: "tree", name: "Tree", icon: "🌳" },
    { id: "cat", name: "Cat", icon: "🐱" },
    { id: "dog", name: "Dog", icon: "🐶" },
    { id: "car", name: "Car", icon: "🚗" },
    { id: "turtle", name: "Turtle", icon: "🐢" },
    { id: "boat", name: "Boat", icon: "⛵" }
  ];

  data.modes = [
    {
      id: "balanced-future",
      name: "Balanced Future",
      description: "Balance reserves, nature, and public trust across the full planning horizon.",
      startingStats: { money: 100, environment: 50, trust: 50 },
      winText: "Survive all years with budget above 0 and both environment and trust above 40.",
      loseText: "Lose if budget collapses or if environment/trust fall too low to sustain the island.",
      modifiers: { difficulty: "steady", education: false, financialEventWeight: 1 }
    },
    {
      id: "economic-growth",
      name: "Economic Growth",
      description: "Prioritize reserves and growth while preventing environmental or social collapse.",
      startingStats: { money: 130, environment: 45, trust: 42 },
      winText: "Finish with the strongest budget while keeping environment and trust above collapse levels.",
      loseText: "Lose if budget reaches 0 or another pillar collapses completely.",
      modifiers: { difficulty: "growth", education: false, financialEventWeight: 1.15 }
    },
    {
      id: "conservation-first",
      name: "Conservation First",
      description: "Protect ecosystems aggressively while surviving on tighter operating funds.",
      startingStats: { money: 85, environment: 65, trust: 48 },
      winText: "Finish with very strong environment health while keeping the island financially alive.",
      loseText: "Lose if budget collapses or trust falls too low to support conservation work.",
      modifiers: { difficulty: "eco", education: false, financialEventWeight: 1 }
    },
    {
      id: "community-care",
      name: "Community Care",
      description: "Focus on trust, access, and stability while keeping enough budget and habitat resilience.",
      startingStats: { money: 95, environment: 48, trust: 65 },
      winText: "Finish with very strong community trust while maintaining viable budget and environment.",
      loseText: "Lose if budget collapses or environmental decline undermines the island.",
      modifiers: { difficulty: "social", education: false, financialEventWeight: 1 }
    },
    {
      id: "crisis-mode",
      name: "Crisis Mode",
      description: "Start with strained reserves and weaker systems, then survive without collapse.",
      startingStats: { money: 55, environment: 35, trust: 35 },
      winText: "Survive the full timeline without triggering any collapse ending.",
      loseText: "Any collapse ends the run immediately.",
      modifiers: { difficulty: "hard", education: false, financialEventWeight: 1.2 }
    },
    {
      id: "sandbox-mode",
      name: "Sandbox Mode",
      description: "Experiment freely with island planning in an open-ended, low-pressure mode.",
      startingStats: { money: 140, environment: 60, trust: 60 },
      winText: "No fixed win condition. Explore strategies and systems at your own pace.",
      loseText: "No fixed lose condition. The island still reacts to your planning choices.",
      modifiers: { difficulty: "open", education: false, sandbox: true, financialEventWeight: 0.85 }
    },
    {
      id: "education-mode",
      name: "Education Mode",
      description: "Play a balanced run with extra explanation about long-term trade-offs and consequences.",
      startingStats: { money: 100, environment: 50, trust: 50 },
      winText: "Survive all years while keeping the island balanced and learning from each decision.",
      loseText: "Lose if budget, environment, or trust collapse beyond recovery.",
      modifiers: { difficulty: "steady", education: true, financialEventWeight: 1 }
    }
  ];

  data.rawDecisionCards = [
    {
      title: "Build a Factory?",
      description: "Boost your economy, but increase pollution.",
      choices: [
        { text: "Build Factory", effect: { money: 50, environment: -25 } },
        { text: "Protect Land", effect: { environment: 20, money: -15 } }
      ]
    },
    {
      title: "Invest in Renewable Energy?",
      description: "Clean energy helps long-term, but costs a lot upfront.",
      choices: [
        { text: "Invest", effect: { environment: 30, money: -40 } },
        { text: "Skip", effect: { money: 10, environment: -10 } }
      ]
    },
    {
      title: "Expand Public Transport?",
      description: "Reduces pollution but expensive to build.",
      choices: [
        { text: "Expand", effect: { environment: 20, money: -30 } },
        { text: "Ignore", effect: { money: 15, environment: -15 } }
      ]
    },
    {
      title: "Cut Worker Wages?",
      description: "Increases profits but hurts morale.",
      choices: [
        { text: "Cut Wages", effect: { money: 40, happiness: -25 } },
        { text: "Keep Fair Pay", effect: { happiness: 20, money: -20 } }
      ]
    },
    {
      title: "Host Community Event?",
      description: "Builds happiness but costs money.",
      choices: [
        { text: "Host Event", effect: { happiness: 30, money: -20 } },
        { text: "Skip", effect: { money: 10, happiness: -10 } }
      ]
    },
    {
      title: "Allow Logging in Forest?",
      description: "Quick profit, long-term damage.",
      choices: [
        { text: "Allow Logging", effect: { money: 60, environment: -35 } },
        { text: "Protect Forest", effect: { environment: 25, money: -20 } }
      ]
    },
    {
      title: "Upgrade Healthcare?",
      description: "Improves well-being but costly.",
      choices: [
        { text: "Upgrade", effect: { health: 30, money: -30 } },
        { text: "Delay", effect: { money: 15, health: -15 } }
      ]
    },
    {
      title: "Launch Advertising Campaign?",
      description: "May grow reputation but not guaranteed.",
      choices: [
        { text: "Launch", effect: { reputation: 25, money: -20 } },
        { text: "Save Money", effect: { money: 15 } }
      ]
    },
    {
      title: "Overwork Employees?",
      description: "Boosts productivity short-term.",
      choices: [
        { text: "Overwork", effect: { money: 30, happiness: -30, health: -10 } },
        { text: "Balanced Work", effect: { happiness: 20, money: -15 } }
      ]
    },
    {
      title: "Clean the Beach?",
      description: "Helps environment but no profit.",
      choices: [
        { text: "Clean Beach", effect: { environment: 30, money: -10 } },
        { text: "Ignore", effect: { money: 10, environment: -15 } }
      ]
    },
    {
      title: "Start a Side Business?",
      description: "More income but drains energy.",
      choices: [
        { text: "Start Business", effect: { money: 40, energy: -25 } },
        { text: "Stay Focused", effect: { energy: 15 } }
      ]
    },
    {
      title: "Take a Break?",
      description: "Improves mental health but slows progress.",
      choices: [
        { text: "Rest", effect: { happiness: 25, energy: 20, money: -10 } },
        { text: "Keep Grinding", effect: { money: 20, energy: -20 } }
      ]
    },
    {
      title: "Raise Taxes?",
      description: "Increases funds but lowers happiness.",
      choices: [
        { text: "Raise Taxes", effect: { money: 40, happiness: -20 } },
        { text: "Keep Low", effect: { happiness: 10, money: -15 } }
      ]
    },
    {
      title: "Subsidize Local Farms?",
      description: "Supports sustainability but costs money.",
      choices: [
        { text: "Support Farms", effect: { environment: 20, money: -25 } },
        { text: "Ignore", effect: { money: 15, environment: -10 } }
      ]
    },
    {
      title: "Upgrade Roads?",
      description: "Improves economy but harms environment.",
      choices: [
        { text: "Upgrade", effect: { money: 30, environment: -20 } },
        { text: "Eco Roads", effect: { environment: 15, money: -25 } }
      ]
    },
    {
      title: "Invest in Education?",
      description: "Long-term benefit, short-term cost.",
      choices: [
        { text: "Invest", effect: { reputation: 20, money: -30 } },
        { text: "Skip", effect: { money: 15, reputation: -10 } }
      ]
    },
    {
      title: "Build Luxury Housing?",
      description: "Attracts wealth but increases inequality.",
      choices: [
        { text: "Build", effect: { money: 50, happiness: -15 } },
        { text: "Affordable Housing", effect: { happiness: 25, money: -30 } }
      ]
    },
    {
      title: "Allow Mining?",
      description: "Huge profits, environmental damage.",
      choices: [
        { text: "Allow", effect: { money: 70, environment: -40 } },
        { text: "Ban", effect: { environment: 20, money: -20 } }
      ]
    },
    {
      title: "Sponsor Arts Program?",
      description: "Boosts culture but costs money.",
      choices: [
        { text: "Sponsor", effect: { happiness: 20, reputation: 10, money: -20 } },
        { text: "Skip", effect: { money: 10 } }
      ]
    },
    {
      title: "Increase Police Funding?",
      description: "Improves safety but reduces funds elsewhere.",
      choices: [
        { text: "Increase", effect: { reputation: 15, money: -25 } },
        { text: "Maintain", effect: { money: 10 } }
      ]
    },
    {
      title: "Promote Tourism?",
      description: "Boost economy but stress environment.",
      choices: [
        { text: "Promote", effect: { money: 40, environment: -20 } },
        { text: "Limit Tourism", effect: { environment: 15, money: -15 } }
      ]
    },
    {
      title: "Ban Plastic?",
      description: "Helps environment but costs businesses.",
      choices: [
        { text: "Ban", effect: { environment: 25, money: -20 } },
        { text: "Allow", effect: { money: 20, environment: -20 } }
      ]
    },
    {
      title: "Hire More Workers?",
      description: "Improves output but increases expenses.",
      choices: [
        { text: "Hire", effect: { money: -20, happiness: 15 } },
        { text: "Stay Lean", effect: { money: 15, happiness: -10 } }
      ]
    },
    {
      title: "Upgrade Technology?",
      description: "Efficiency boost but high cost.",
      choices: [
        { text: "Upgrade", effect: { money: -30, energy: 10 } },
        { text: "Keep Old", effect: { money: 10 } }
      ]
    },
    {
      title: "Offer Free Healthcare?",
      description: "Improves health but drains funds.",
      choices: [
        { text: "Offer", effect: { health: 30, happiness: 15, money: -40 } },
        { text: "Paid Only", effect: { money: 20, health: -15 } }
      ]
    },
    {
      title: "Build a Park?",
      description: "Improves happiness and environment.",
      choices: [
        { text: "Build Park", effect: { happiness: 25, environment: 15, money: -25 } },
        { text: "Use Land for Business", effect: { money: 40, environment: -15 } }
      ]
    },
    {
      title: "Encourage Remote Work?",
      description: "Reduces pollution but affects local economy.",
      choices: [
        { text: "Encourage", effect: { environment: 15, money: -10 } },
        { text: "Keep Offices", effect: { money: 20, environment: -10 } }
      ]
    },
    {
      title: "Import Cheap Goods?",
      description: "Boost profits but hurts local businesses.",
      choices: [
        { text: "Import", effect: { money: 30, reputation: -15 } },
        { text: "Support Local", effect: { reputation: 20, money: -20 } }
      ]
    },
    {
      title: "Emergency Relief Fund?",
      description: "Helps people but reduces savings.",
      choices: [
        { text: "Fund", effect: { happiness: 20, reputation: 15, money: -30 } },
        { text: "Save Funds", effect: { money: 15, happiness: -10 } }
      ]
    },
    {
      title: "Expand Industry?",
      description: "Rapid growth with environmental cost.",
      choices: [
        { text: "Expand", effect: { money: 60, environment: -30 } },
        { text: "Sustainable Growth", effect: { environment: 20, money: -25 } }
      ]
    }
  ];

  data.decisionCards = data.rawDecisionCards.map(convertLegacyCard);

  data.plots = data.plots.map(function (plot, index) {
    var plotId = "plot-" + index;
    return {
      id: plotId,
      tileName: plot.tileName,
      locationDescription: plot.locationDescription,
      scenarios: plot.scenarios.map(function (scenarioConfig, scenarioIndex) {
        return normalizeScenario(plotId, scenarioIndex, scenarioConfig);
      })
    };
  });

  data.investmentEvents = data.investments.map(normalizeInvestment);

  data.financialEvents = [
    {
      id: "grant-awarded",
      title: "Grant Awarded",
      description: "A conservation partner awarded your island a restoration grant.",
      effects: { money: 60, environment: 5, trust: 0 }
    },
    {
      id: "storm-damage",
      title: "Storm Damage",
      description: "Severe weather damaged roads and drainage systems.",
      effects: { money: -35, environment: -5, trust: -3 }
    },
    {
      id: "tourism-season-boom",
      title: "Tourism Season Boom",
      description: "Visitor activity exceeded expectations this year.",
      effects: { money: 45, environment: -6, trust: 0 }
    },
    {
      id: "community-fundraiser",
      title: "Community Fundraiser",
      description: "Residents organized a fundraiser for local improvements.",
      effects: { money: 20, environment: 0, trust: 8 }
    },
    {
      id: "fuel-cost-surge",
      title: "Fuel Cost Surge",
      description: "Transportation and delivery expenses increased sharply.",
      effects: { money: -25, environment: 0, trust: 0 }
    },
    {
      id: "donor-partnership",
      title: "Donor Partnership",
      description: "A nonprofit partner offered support for environmental education.",
      effects: { money: 25, environment: 3, trust: 5 }
    }
  ];

  data.loanOffers = [
    {
      id: "small-loan",
      name: "Small Loan",
      description: "Accept a modest bridge loan to steady operations while keeping debt pressure manageable.",
      upfront: { money: 40, environment: 0, trust: 0 },
      annual: { money: -12, environment: 0, trust: -3 },
      years: 3
    },
    {
      id: "large-loan",
      name: "Large Loan",
      description: "Take a larger emergency loan for immediate relief, but expect heavier annual repayment pressure.",
      upfront: { money: 80, environment: 0, trust: -4 },
      annual: { money: -22, environment: -2, trust: -6 },
      years: 4
    }
  ];

  data.boardBands = [
    "coast", "wetland", "coast", "village", "coast",
    "wetland", "forest", "village", "wetland", "coast",
    "forest", "village", "coast", "forest", "village",
    "wetland", "forest", "village", "coast", "wetland",
    "forest", "village", "coast", "forest"
  ];

  AOC.board = AOC.board || {};

  AOC.board.getBand = function (index) {
    return data.boardBands[index % data.boardBands.length];
  };

  AOC.board.getCornerLabel = function (index) {
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
  };

  AOC.board.getTileLayout = function (index) {
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
  };
}());
