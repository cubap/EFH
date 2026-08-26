const CLASS_DATA = [
  {
    id: "soulknife",
    name: "Soulknife",
    image: "images/soulknife_full.png",
    summary:
      "Streetwise killers and instinct-driven duelists that can manifest a psychic dagger.",
    weapons: "Psychic dagger",
    armor: "Leather armor, mithral chainmail",
    hitPoints: "1d4 per level",
    hitDie: 4,
    focus: ["dex", "wis"],
    features: [
      {
        title: "Psychic Dagger",
        text:
          "You can instantly form a dagger out of pure psychic energy in a free hand. It has the properties of a dagger (1d4, close/near range). You can create and use the dagger as part of the same action. The dagger vanishes immediately after the attack, hit, or miss."
      },
      {
        title: "Insightful Strikes",
        text: "You can choose to use Wisdom as your attack stat instead of Dexterity."
      },
      {
        title: "Psychic Awareness",
        text:
          "You are trained in Perception and Insight and have advantage on associated checks."
      },
      {
        title: "Detect Intent",
        text:
          "Open your mind to nearby intentions. Make a WIS check. On success the focus lasts 5 rounds. On failure the action is wasted and you cannot use it again until rest. On natural 20, duration is doubled."
      }
    ],
    options: [
      "Sense minds (DC 11): sense immediate intent; if surprised by active foe, +2 to next attack or check",
      "Clarity (DC 12): +2 AC through foresight",
      "Perfect strike (DC 13): add +1 damage while active",
      "Mind shield (DC 14): one condition affecting your mind is ignored while active; advantage on saves against mental effects",
      "Flow state (DC 15): change psychic focus each round without a check"
    ],
    talents: [
      { roll: "2", effect: "Deal +1d6 damage with psychic blades" },
      { roll: "3-6", effect: "+1 attacks and damage with psychic dagger" },
      { roll: "7-9", effect: "+2 Dexterity or Wisdom" },
      { roll: "10-11", effect: "Gain one advantage on one Detect Intent application" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "paladin",
    name: "Paladin",
    image: "images/paladin_full.png",
    summary:
      "Armored enforcers of sacred conviction with divine challenge and martial focus.",
    weapons: "All melee weapons, no ranged weapons",
    armor: "All armor and shields",
    hitPoints: "1d8 per level",
    hitDie: 8,
    focus: ["str", "cha"],
    alignment: "Lawful only",
    features: [
      {
        title: "Divine Challenge",
        text:
          "Once per combat, issue a sacred duel to a visible enemy. The first time each round the target attacks someone other than you, it does so with disadvantage. The mark ends if you do not attack the target on your turn."
      },
      {
        title: "Divine Favor (1/day)",
        text:
          "When you attack your challenged target, you may reroll the attack and keep the better result."
      },
      {
        title: "Spellcasting",
        text:
          "You know Holy Weapon (DC 11) and can cast it with advantage. Charisma is your casting stat. Spellcasting DC is 10 + spell tier. If you fail a spellcasting check, you cannot cast that spell again until rest."
      }
    ],
    options: [
      "Holy Weapon (self, DC 11)",
      "Divine challenge tracking",
      "Tank/protection play pattern"
    ],
    talents: [
      { roll: "2", effect: "Choose armor type and gain +1 AC from that armor" },
      { roll: "3-6", effect: "+1 to melee attacks and damage" },
      { roll: "7-9", effect: "+2 Strength, Charisma, or +1 spellcasting checks" },
      {
        roll: "10-11",
        effect: "Learn a priest spell with range self if tier allows; cast with Charisma"
      },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: ["Holy Weapon (self)"]
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    image: "images/sorcerer_full.png",
    summary:
      "Living conduits of elemental power that shape raw magic in the moment.",
    weapons: "Dagger, staff",
    armor: "Leather armor",
    hitPoints: "1d4 per level",
    hitDie: 4,
    focus: ["cha"],
    features: [
      {
        title: "Elemental Manipulation",
        text:
          "Minor non-damaging elemental effects at close range (DC 11 if failure has consequences). Sustained effects require focus."
      },
      {
        title: "Elemental Spell",
        text:
          "Choose Fire, Cold, or Lightning permanently. When casting, choose shape and tier."
      },
      {
        title: "Spellcasting",
        text:
          "Charisma casting. Spellcasting DC is 10 + spell tier. Failure means that shape cannot be used again until rest. Natural 1 triggers Mishap for that tier."
      },
      {
        title: "Overchannel (1/day)",
        text:
          "After a failed spellcasting check, you may succeed instead. Take 1d6 + tier damage. If reduced to 0 HP, suffer Mishap."
      }
    ],
    options: [
      "Choose element: Fire, Cold, or Lightning",
      "Choose shape by tier",
      "Overchannel risk/reward control"
    ],
    shapeTable: [
      {
        tier: "1 (Lvl 1)",
        shape:
          "Strike: 1d4 to 1 target (Far, advantage) | Arc: 1d4 chain, hit 1 target close then up to 2 jumps within close"
      },
      {
        tier: "2 (Lvl 3)",
        shape:
          "Strike: 2d4 | Arc: 2d4 chain | Burst (small): 2d4 in 3x3 (Near)"
      },
      {
        tier: "3 (Lvl 5)",
        shape:
          "Strike: 3d4 | Arc: 3d4 chain | Burst (large): 3d4 in near cube (Far) | Line: 3d4 (Far)"
      },
      { tier: "4 (Lvl 7)", shape: "All shapes are tier 3, damage becomes 4d4" },
      { tier: "5 (Lvl 9)", shape: "All shapes are tier 3, damage becomes 5d4" }
    ],
    talents: [
      { roll: "2", effect: "+1 damage to spells" },
      { roll: "3-7", effect: "+2 Charisma or +1 spellcasting checks" },
      { roll: "8-9", effect: "Advantage on one shape at a tier" },
      { roll: "10-11", effect: "Learn one wizard spell of any tier you know" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "monk",
    name: "Monk",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Monk%2C_Khapa_Chaitya%2C_Patan%2C_Nepal.jpg/640px-Monk%2C_Khapa_Chaitya%2C_Patan%2C_Nepal.jpg",
    summary:
      "Disciplined martial artists who deflect force and control battle flow through mastery.",
    weapons: "Staff",
    armor: "None",
    hitPoints: "1d6 per level",
    hitDie: 6,
    focus: ["dex", "wis"],
    features: [
      {
        title: "Martial Arts",
        text: "Trained in Insight, Perception, and Acrobatics."
      },
      {
        title: "Unarmored Defense",
        text: "AC is 12 + Dexterity modifier or Wisdom modifier (choose one)."
      },
      {
        title: "Unarmed Combat",
        text:
          "Unarmed strikes deal 1 damage (as normal), but you have advantage on all unarmed attacks and grapple checks using Dexterity."
      },
      {
        title: "Fluid Defense",
        text: "While wielding a staff with two hands, gain +1 bonus to AC."
      },
      {
        title: "Sweeping Strike",
        text:
          "When you hit a medium or smaller creature with your staff, deal no damage and instead knock it prone or push it 10 feet away."
      },
      {
        title: "Deflect Blows",
        text:
          "Take a defensive stance: until start of your next turn, attacks against you have disadvantage, but you cannot attack."
      }
    ],
    options: ["Cure Wounds", "Holy Weapon (self)", "Protection From Evil (self)", "Shield of Faith"],
    talents: [
      { roll: "2", effect: "Learn one spell from Ki Mastery list and cast with Wisdom (DC 11)" },
      { roll: "3-7", effect: "+1 attack roll and damage" },
      { roll: "8-11", effect: "+2 Dexterity or Wisdom, or +1 AC" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: ["Cure Wounds", "Holy Weapon (self)", "Protection From Evil (self)", "Shield of Faith"]
  },
  {
    id: "kinetic",
    name: "Kinetic",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Anachoret_of_Mount_Athos.jpg/640px-Anachoret_of_Mount_Athos.jpg",
    summary:
      "Invisible-force combatants that slam enemies with pressure waves and force control.",
    weapons: "All weapons",
    armor: "Leather armor, chainmail, mithral chainmail, shields",
    hitPoints: "1d6 per level",
    hitDie: 6,
    focus: ["con"],
    features: [
      {
        title: "Kinetic Force",
        text: "Your psionic energy manifests as raw force."
      },
      {
        title: "Kinetic Burst (close/near)",
        text: "Make a CON attack against one creature. On hit, deal 1d4 damage."
      },
      {
        title: "Kinetic Push (closer/near)",
        text: "Target one creature or object of Large size or smaller. It is pushed 10 feet directly away from you."
      },
      {
        title: "Defensive Field (self)",
        text: "Until start of your next turn, attack rolls against you are made with disadvantage."
      },
      {
        title: "Kinetic Surge",
        text:
          "You have one surge at the start of combat. Declare the surge before your attack roll. If your surge does +1 damage and half your level to those rolls (round down). Regain your surge when you roll a natural 20 in combat or use your defensive field."
      }
    ],
    options: [
      "Feather Fall",
      "Floating Disk",
      "Hold Portal",
      "Mage Armor",
      "Magic Missile"
    ],
    talents: [
      { roll: "2", effect: "Kinetic Burst deals 1d6 damage" },
      { roll: "3-6", effect: "Your attacks deal +1 damage" },
      { roll: "7-9", effect: "+2 Strength or Constitution, or +1 to attacks" },
      { roll: "10-11", effect: "Learn one spell from Kinetic spell list and cast with Constitution (DC 11)" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: ["Feather Fall", "Floating Disk", "Hold Portal", "Mage Armor", "Magic Missile"]
  }
]

const BASE_SKILLS = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
  "Initiative",
  "Perception",
  "Insight"
]

const ANCESTRY_OPTIONS = [
  {
    name: "Half-Orc",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Warrior_png_Illustration_by_Ben_Wootten.png/480px-Warrior_png_Illustration_by_Ben_Wootten.png",
    summary: "Blood of two worlds, tempered into something fiercer than either. Half-orcs survive through raw aggression and battlefield cunning.",
    extraLanguage: "Orcish",
    bonus: "+1 to melee attack and melee damage rolls",
    traits: [
      {
        title: "Savage Blood",
        text: "+1 to melee attack rolls and melee damage rolls. This bonus stacks with any bonus from weapons or class features."
      },
      {
        title: "Orcish Tongue",
        text: "You speak Orcish in addition to Common and any language granted by your class."
      },
      {
        title: "Relentless",
        text: "Once per day when reduced to 0 HP, you may make a DC 15 Constitution check. On success, you drop to 1 HP instead."
      }
    ]
  },
  {
    name: "Elf",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/John_Bauer_1915.jpg/480px-John_Bauer_1915.jpg",
    summary: "Ancient and graceful, elves see the world through the long lens of memory. Their movements are precise, their senses uncanny.",
    extraLanguage: "Elvish, Sylvan",
    bonus: "+1 to ranged attack rolls or spellcasting checks",
    traits: [
      {
        title: "Elven Grace",
        text: "+1 to ranged attack rolls or spellcasting checks (choose at character creation, cannot be changed)."
      },
      {
        title: "Low-Light Vision",
        text: "You see clearly in dim light and can make out shapes in near-darkness, though not in complete darkness."
      },
      {
        title: "Ancient Tongue",
        text: "You speak Elvish and Sylvan. You may attempt to read archaic inscriptions in either language."
      }
    ]
  },
  {
    name: "Human",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/480px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
    summary: "Adaptable, ambitious, and everywhere. Humans rise through talent and tenacity where others rely on ancestral gifts.",
    extraLanguage: "Choose one common language",
    bonus: "Extra talent at level 1",
    traits: [
      {
        title: "Ambitious",
        text: "You gain an additional talent roll at level 1, in addition to any granted by your class."
      },
      {
        title: "Adaptable",
        text: "Choose one common language beyond those your class grants. You speak it fluently."
      },
      {
        title: "Driven",
        text: "Once per day you may reroll a failed ability check and take the better result."
      }
    ]
  },
  {
    name: "Dwarf",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Doré_Gustave_-_Le_Nain_de_la_montagne.jpg/480px-Doré_Gustave_-_Le_Nain_de_la_montagne.jpg",
    summary: "Stone-blooded and stubborn. Dwarves outlast their enemies through endurance, iron resolve, and an unerring sense of depth.",
    extraLanguage: "Dwarvish",
    bonus: "+2 HP at level 1 and advantage on HP roll per level",
    traits: [
      {
        title: "Hardy Constitution",
        text: "+2 maximum HP at level 1. On each subsequent level-up, you roll your hit die with advantage and take the higher result."
      },
      {
        title: "Stonecunning",
        text: "Advantage on checks to detect unusual stonework, hidden doors in stone walls, or underground navigation."
      },
      {
        title: "Dwarvish Tongue",
        text: "You speak Dwarvish. You may communicate basic ideas with any creature of the earth-related creature type."
      }
    ]
  },
  {
    name: "Goblin",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carl_Larsson_-_Midvinterblot.jpg/480px-Carl_Larsson_-_Midvinterblot.jpg",
    summary: "Small, quick, and never where you expect them. Goblins thrive in chaos and have an unsettling talent for not being noticed until it's too late.",
    extraLanguage: "Goblin",
    bonus: "Cannot be surprised",
    traits: [
      {
        title: "Wiry Instincts",
        text: "You cannot be surprised. If an effect would cause you to be surprised, it has no effect on you."
      },
      {
        title: "Goblin Tongue",
        text: "You speak Goblin. Goblinoid creatures and beasts of similar cunning may respond to you with curiosity rather than immediate hostility."
      },
      {
        title: "Scuttle",
        text: "Once per round, when an enemy moves adjacent to you, you may move 5 feet in any direction as a free action."
      }
    ]
  },
  {
    name: "Halfling",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Blanche_Halfling_Rogue.jpg/480px-Blanche_Halfling_Rogue.jpg",
    summary: "Cheerful survivors with a knack for vanishing into plain sight. Halflings carry luck in their pockets and are harder to pin down than they look.",
    extraLanguage: "None",
    bonus: "Become invisible for 3 rounds once per day",
    traits: [
      {
        title: "Vanish",
        text: "Once per day, you can become invisible for 3 rounds. The effect ends early if you attack or cast a spell."
      },
      {
        title: "Sure-Footed",
        text: "You are never impeded by difficult terrain created by crowds, undergrowth, or uneven ground."
      },
      {
        title: "Lucky",
        text: "Once per day, when you roll a 1 on any die, you may reroll it. You must take the second result."
      }
    ]
  }
]

const BACKGROUND_OPTIONS = [
  "1 Urchin",
  "2 Wanted",
  "3 Cult Initiate",
  "4 Thieves' Guild",
  "5 Banished",
  "6 Orphaned",
  "7 Wizard's Apprentice",
  "8 Jeweler",
  "9 Herbalist",
  "10 Barbarian",
  "11 Mercenary",
  "12 Sailor",
  "13 Acolyte",
  "14 Soldier",
  "15 Ranger",
  "16 Scout",
  "17 Minstrel",
  "18 Scholar",
  "19 Noble",
  "20 Chirurgeon"
]

const ALIGNMENT_DEITIES = {
  Lawful: ["Madeera (creation & order)", "Terragnis (honor & justice)"],
  Neutral: ["Gede (revelry & nature)", "Ord (knowledge & wisdom)"],
  Chaotic: ["Memnon (destruction & chaos)", "Ramlaat (strength & war)", "Shune (sorcery & ambition)"]
}
