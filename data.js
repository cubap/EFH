const CLASS_DATA = [
  {
    id: "fighter",
    name: "Fighter",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/289bfab524c320fc0e03444d041708e939784/Fighter_thumb.jpg",
    summary:
      "Blood-soaked gladiators in dented armor, acrobatic duelists with darting swords, or far-eyed elven archers who carve their legends with steel and grit.",
    weapons: "All weapons",
    armor: "All armor and shields",
    hitPoints: "1d8 per level",
    hitDie: 8,
    focus: ["str", "dex"],
    features: [
      {
        title: "Hauler",
        text:
          "Add your Constitution modifier, if positive, to your gear slots."
      },
      {
        title: "Weapon Mastery",
        text:
          "Choose one type of weapon, such as longswords. You gain +1 to attack and damage with that weapon type. In addition, add half your level to these rolls (round down)."
      },
      {
        title: "Grit",
        text:
          "Choose Strength or Dexterity. You have advantage on checks of that type to overcome an opposing force, such as kicking open a stuck door (Strength) or slipping free of rusty chains (Dexterity)."
      }
    ],
    options: [],
    talents: [
      {
        roll: "2",
        effect: "Gain Weapon Mastery with one additional weapon"
      },
      { roll: "3-6", effect: "+1 to melee and ranged attacks" },
      { roll: "7-9", effect: "+2 to Strength, Dexterity, or Constitution stat" },
      {
        roll: "10-11",
        effect: "Choose one kind of armor. You get +1 AC from that armor"
      },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "bard",
    name: "Bard",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/0662ae9e246d281795cf5cbf243b67b348896/Bard_thumb.jpg",
    summary:
      "Welcome wanderers and wise advisors; it is their task to remember, know, and learn the lessons of the ages.",
    weapons: "Crossbow, dagger, mace, shortbow, shortsword, spear, staff",
    armor: "Leather armor, chainmail, mithral chainmail, shields",
    hitPoints: "1d6 per level",
    hitDie: 6,
    focus: ["cha"],
    features: [
      {
        title: "Languages",
        text:
          "You know four additional common languages and one rare language."
      },
      {
        title: "Bardic Arts",
        text:
          "You're trained in oration, performing arts, lore, and diplomacy. You have advantage on related checks."
      },
      {
        title: "Magical Dabbler",
        text:
          "You can activate spell scrolls and wands using Charisma as your spellcasting stat. If you critically fail, roll a wizard mishap."
      },
      {
        title: "Presence",
        text:
          "Make a DC 12 CHA check to enact one of the following effects. If you fail (excluding focus), you can't use that effect again until you rest. Inspire: one target in near gains a luck token. Fascinate (Focus): you transfix all chosen targets of level 4 or less within near."
      },
      {
        title: "Prolific",
        text:
          "Add 1d6 to your learning rolls. Groups carousing with 1 or more bards add 1d6 to their rolls."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "You find a random priest or wizard wand (you choose)" },
      {
        roll: "3-6",
        effect: "+1 to melee and ranged attacks or +1 to Magical Dabbler rolls"
      },
      { roll: "7-9", effect: "+2 points to distribute to any stats" },
      {
        roll: "10-11",
        effect: "Your Presence effects become DC 9 to enact (reroll duplicates)"
      },
      { roll: "12", effect: "Choose a talent" }
    ],
    spells: []
  },
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
          "As an action, open your mind to the immediate intentions of those around you. Make a WIS check. On success, you focus for 5 rounds. On failure, the action is wasted. On a natural 1, you cannot use Detect Intent again until you rest. On a natural 20, duration is doubled. You may only use 1 application at a time."
      }
    ],
    options: [
      "Sense minds (DC 11): sense immediate intent; if surprised by active foe, +2 to next attack or check",
      "Clarity (DC 12): +2 AC through foresight",
      "Exploit Insight (DC 13): choose one creature; your attacks against it deal +1d4 damage for the duration",
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
        title: "Divine Favor (1/combat)",
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
          "After a failed spellcasting check, you may succeed instead. Take 1d6 per tier damage. If reduced to 0 HP, roll Mishap."
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
          "Strike: 1d6 to 1 target (Far) | Line: 1d3 to each in line (close, 4x1 grid) | Burst: 1d3 to each in 2x2 grid (near) | Arc: 1d3 chain, hit 1 target (Close) then up to 2 jumps within Close"
      },
      {
        tier: "2 (Lvl 3)",
        shape:
          "Strike: 2d6 to 1 target (Far) | Line: 1d6 to each in line (4x1 grid) | Burst (small): 1d6 in 3x3 (Near) | Arc: 1d6 chain, hit 1 target (Close) then up to 2 jumps within Close"
      },
      {
        tier: "3 (Lvl 5)",
        shape:
          "Strike: 3d6 to 1 target (Far) | Line: 2d6 (extends to near) | Burst (small): 2d6 in Near cube (Far) | Arc: 2d6 chain, hit 1 target (near) then up to 2 jumps within Close"
      },
      {
        tier: "4 (Lvl 7)",
        shape:
          "Strike: 4d6 to 1 target (Far) | Line: 3d6 (extends to near) | Burst (small): 3d6 in Near cube (Far) | Arc: 3d6 chain, hit 1 target (near) then up to 2 jumps within Close"
      },
      {
        tier: "5 (Lvl 9)",
        shape:
          "Strike: 5d6 to 1 target (Far) | Line: 4d6 (extends to near) | Burst (small): 4d6 in Near cube (Far) | Arc: 4d6 chain, hit 1 target (near) then up to 2 jumps within Close"
      }
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
        text:
          "You are proficient in acrobatics and have advantage when making a check. Also when attacking unarmed or with a staff, you may use Dexterity in place of Strength."
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
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/825493e012afd20d4290c6921ec1e87961128/Kinetic_update_thumb.jpg",
    summary:
      "Invisible-force combatants that slam enemies with pressure waves and force control.",
    weapons: "All weapons",
    armor: "Leather armor, chainmail, mithral chainmail, shields",
    hitPoints: "1d8 per level",
    hitDie: 8,
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
          "You have one surge at the start of combat. After you hit with an attack but before rolling damage, you may expend your surge to deal +1 damage and add half your level (round down) to the attack's damage. You regain your surge when you roll a natural 20 in combat or use Defensive Field."
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
  },
  {
    id: "pit-fighter",
    name: "Pit Fighter",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/1cb0bc23fd55ea84a64923284ffbb50640292/Pit_Fighter_thumb.jpg",
    summary:
      "Blood-soaked warriors circling each other in a roaring arena, scarred desert bandits dueling for the right to lead their gang, or brash tavern brawlers who never turn down a challenge.",
    weapons: "All weapons",
    armor: "Leather armor, shields",
    hitPoints: "1d8 per level",
    hitDie: 8,
    focus: ["con"],
    features: [
      {
        title: "Flourish",
        text: "3/day, regain 1d6 hit points when you hit an enemy with a melee attack."
      },
      {
        title: "Implacable",
        text: "You have advantage on Constitution checks to resist injury, poison, or endure extreme environments."
      },
      {
        title: "Last Stand",
        text: "You get up from dying with 1 hit point on a natural d20 roll of 18-20."
      },
      {
        title: "Relentless",
        text: "3/day, when you are reduced to 0 HP, make a DC 18 Constitution check (the Implacable talent applies to this roll). On a success, you instead go to 1 HP."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "1/day, ignore all damage and effects from one attack" },
      { roll: "3-6", effect: "+1 to melee weapon damage" },
      { roll: "7-9", effect: "+2 Strength or Constitution, or +1 to melee attacks" },
      { roll: "10-11", effect: "Increase the HP you gain from Flourish by 1d6" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "priest",
    name: "Priest",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/ef3dd0aeb4243807ed9ee7f54f6d767e53360/Priest_thumb.jpg",
    summary:
      "Crusading templars, prophetic shamans, or mad-eyed zealots who wield the power of their gods to cleanse the unholy.",
    weapons: "Club, crossbow, dagger, mace, longsword, staff, warhammer",
    armor: "All armor and shields",
    hitPoints: "1d6 per level",
    hitDie: 6,
    focus: ["wis"],
    features: [
      {
        title: "Languages",
        text: "You know either Celestial, Diabolic, or Primordial."
      },
      {
        title: "Turn Undead",
        text: "You know the turn undead spell. It doesn't count toward your number of known spells."
      },
      {
        title: "Deity",
        text: "Choose a god to serve who matches your alignment (see Deities, pg. 30). You have a holy symbol for your god (it takes up no gear slots)."
      },
      {
        title: "Spellcasting",
        text: "You can cast priest spells you know. You know two tier 1 spells of your choice from the priest spell list on pg. 51. Each time you gain a level, you choose new priest spells to learn according to the Priest Spells Known table. For casting priest spells, see Spellcasting on pg. 44."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "Gain advantage on casting one spell you know" },
      { roll: "3-6", effect: "+1 to melee or ranged attacks" },
      { roll: "7-9", effect: "+1 to priest spellcasting checks" },
      { roll: "10-11", effect: "+2 to Strength or Wisdom stat" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "ranger",
    name: "Ranger",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/05e32fc02eaae4a00462e7bf0cd339f157892/Ranger_thumb.jpg",
    summary:
      "Skilled trackers, stealthy wanderers, and peerless warriors who call the wilds their home.",
    weapons: "Dagger, longbow, longsword, shortbow, shortsword, spear, staff",
    armor: "Leather armor, chainmail, mithral chainmail",
    hitPoints: "1d8 per level",
    hitDie: 8,
    focus: ["int"],
    features: [
      {
        title: "Wayfinder",
        text: "You have advantage on checks associated with: Navigation, Tracking, Bushcraft, Stealth, and Wild animals."
      },
      {
        title: "Herbalism",
        text: "Make an INT check to prepare an herbal remedy you choose. If you fail, you can't make that remedy again until you successfully rest. Unused remedies expire in 3 rounds. Herbs: DC 11 Salve (heals 1 HP); DC 12 Stimulant (you can't be surprised for 10 rounds); DC 13 Foebane (ADV on attacks and damage against one creature type you choose for 1d6 rounds); DC 14 Restorative (ends one poison or disease); DC 15 Curative (equivalent to a Potion of Healing)."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "You deal d12 damage with one weapon type you choose" },
      { roll: "3-6", effect: "+1 to melee or ranged attacks and damage" },
      { roll: "7-9", effect: "+2 to Strength, Dexterity, or Intelligence" },
      { roll: "10-11", effect: "You gain ADV on Herbalism checks for an herb you choose" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "seer",
    name: "Seer",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/71fee2edff97e8e60b4e042fda923f5c45816/Seer_thumb.jpg",
    summary:
      "Baleful diviners who reek of smoke and blood. They untangle the whispers of the gods by reading the runes, the bones, and the stars. Their knowledge of fate allows them to bend it.",
    weapons: "Dagger, stave, spear",
    armor: "Leather armor",
    hitPoints: "1d6 per level",
    hitDie: 6,
    focus: ["wis"],
    features: [
      {
        title: "Destined",
        text: "Whenever you use a luck token, add 1d6 to the roll."
      },
      {
        title: "Omen",
        text: "3/day, you can make a DC 9 WIS check. On a success, gain a luck token (you can't have more than one luck token at a time)."
      },
      {
        title: "Spellcasting",
        text: "You can cast seer spells you know. You know one tier 1 spell of your choice from the seer spell list. Each time you gain a level, you choose a new seer spell to learn according to the Seer Spells Known table. You use your Wisdom stat to cast seer spells. The DC is 10 + the spell's tier. If you fail a spellcasting check, you can't cast that spell again until you complete a rest. If you roll a natural 1 on a spellcasting check, you can't cast that spell again until you complete Seer Penance."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "Learn an additional seer spell from any tier you can cast" },
      { roll: "3-6", effect: "Gain an additional use of your Omen talent each day" },
      { roll: "7-9", effect: "+2 to WIS or CHA stat, or +1 to spellcasting checks" },
      { roll: "10-11", effect: "Increase the die category of your Destined talent by one" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "thief",
    name: "Thief",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/c139098d00e815caf71ca219cdc5e8e647316/Thief_thumb.jpg",
    summary:
      "Rooftop assassins, grinning con artists, or cloaked cat burglars who can pluck a gem from the claws of a sleeping demon and sell it for twice its worth.",
    weapons: "Club, crossbow, dagger, shortbow, shortsword",
    armor: "Leather armor, mithral chainmail",
    hitPoints: "1d4 per level",
    hitDie: 4,
    focus: ["dex"],
    features: [
      {
        title: "Backstab",
        text:
          "If you hit a creature who is unaware of your attack, you deal an extra weapon die of damage. Add additional weapon dice of damage equal to half your level (round down)."
      },
      {
        title: "Thievery",
        text:
          "You are adept at thieving skills and have the necessary tools of the trade secreted on your person (they take up no gear slots). You are trained in the following tasks and have advantage on any associated checks: Climbing; Sneaking and hiding; Applying disguises; Finding and disabling traps; Delicate tasks such as picking pockets and opening locks."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "Gain advantage on initiative rolls (reroll duplicates)" },
      { roll: "3-5", effect: "Your Backstab deals +1 dice of damage" },
      { roll: "6-9", effect: "+2 to Strength, Dexterity, or Charisma stat" },
      { roll: "10-11", effect: "+1 to melee and ranged attacks" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
  },
  {
    id: "wizard",
    name: "Wizard",
    image:
      "https://storage.googleapis.com/pdf-assets-production/unique_assets/15dfd0db6a8dc71423b903abd4f37bcf46164/Wizard_thumb.jpg",
    summary:
      "Rune-tattooed adepts, bespectacled magi, and flame conjuring witches who dare to manipulate the fell forces of magic.",
    weapons: "Dagger, staff",
    armor: "None",
    hitPoints: "1d4 per level",
    hitDie: 4,
    focus: ["int"],
    features: [
      {
        title: "Languages",
        text: "You know two additional common languages and two rare languages (see pg. 32)."
      },
      {
        title: "Learning Spells",
        text:
          "You can permanently learn a wizard spell from a spell scroll by studying it for a day and succeeding on a DC 15 Intelligence check. Whether you succeed or fail, you expend the spell scroll. Spells you learn in this way don't count toward your known spells."
      },
      {
        title: "Spellcasting",
        text:
          "You can cast wizard spells you know. You know three tier 1 spells of your choice from the wizard spell list (see pg. 52). Each time you gain a level, you choose new wizard spells to learn according to the Wizard Spells Known table. For casting wizard spells, see Spellcasting on pg. 44."
      }
    ],
    options: [],
    talents: [
      { roll: "2", effect: "Make 1 random magic item of a type you choose (pg. 282)" },
      { roll: "3-7", effect: "+2 to Intelligence stat or +1 to wizard spellcasting checks" },
      { roll: "8-9", effect: "Gain advantage on casting one spell you know" },
      { roll: "10-11", effect: "Learn one additional wizard spell of any tier you know" },
      { roll: "12", effect: "Choose a talent or +2 points to distribute to stats" }
    ],
    spells: []
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
