const SD = (() => {
  const STORAGE_KEY = "sd-homebrew-builds-v1"
  const CURRENT_ID_KEY = "sd-homebrew-current-id-v1"

  const loadSavedBuilds = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const persistSavedBuilds = saved => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }

  const setCurrentCharacterId = id => {
    if (!id) return
    localStorage.setItem(CURRENT_ID_KEY, id)
  }

  const getCurrentCharacterId = () => localStorage.getItem(CURRENT_ID_KEY)

  const getCharacterById = (saved, id) => saved.find(item => item.id === id) ?? null

  const getCurrentCharacter = saved => {
    const currentId = getCurrentCharacterId()
    return getCharacterById(saved, currentId) ?? saved[0] ?? null
  }

  const saveBuild = (saved, build) => {
    const clone = structuredClone(build)
    const idx = saved.findIndex(item => item.id === clone.id)
    if (idx === -1) {
      saved.unshift(clone)
    } else {
      saved[idx] = clone
    }
    persistSavedBuilds(saved)
    setCurrentCharacterId(clone.id)
    return saved
  }

  const deleteBuild = (saved, id) => {
    const next = saved.filter(item => item.id !== id)
    persistSavedBuilds(next)
    const current = getCurrentCharacterId()
    if (current === id) {
      if (next[0]?.id) {
        setCurrentCharacterId(next[0].id)
      } else {
        localStorage.removeItem(CURRENT_ID_KEY)
      }
    }
    return next
  }

  const getClassById = id => CLASS_DATA.find(cls => cls.id === id) ?? null

  const roll = sides => Math.floor(Math.random() * sides) + 1

  // A stat may be a plain number (builder) or an array of every roll made
  // (randomizer, where the last entry is the final score). Read the final value.
  const finalStat = value => value.at?.(-1) ?? value

  const statMod = score => Math.floor((finalStat(score) - 10) / 2)

  const signed = num => (num >= 0 ? `+${num}` : `${num}`)

  const rollStats = () => ({
    str: roll(6) + roll(6) + roll(6),
    dex: roll(6) + roll(6) + roll(6),
    con: roll(6) + roll(6) + roll(6),
    int: roll(6) + roll(6) + roll(6),
    wis: roll(6) + roll(6) + roll(6),
    cha: roll(6) + roll(6) + roll(6)
  })

  const matchesRoll = (value, rangeText) => {
    if (!rangeText.includes("-")) {
      return value === Number(rangeText)
    }
    const [start, end] = rangeText.split("-").map(Number)
    return value >= start && value <= end
  }

  const rollTalent = talents => {
    const total = roll(6) + roll(6)
    const found = talents.find(item => matchesRoll(total, item.roll))
    return found ? `${total}: ${found.effect}` : `${total}: no matching talent`
  }

  const randomName = () => {
    const starts = ["Ael", "Bryn", "Cor", "Dra", "Eri", "Fen", "Gor", "Hel", "Ira", "Jor"]
    const ends = ["ric", "wyn", "mar", "eth", "dren", "voss", "lune", "kesh", "thar", "nox"]
    return `${starts[roll(starts.length) - 1]}${ends[roll(ends.length) - 1]}`
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)]

  // Each ancestry rolls a prefix + suffix (and Halflings may add a nickname), so
  // the pool is the product of the two lists rather than a fixed set of names.
  const FIRST_NAME_PATTERNS = {
    "Half-Orc": () => `${pick(["Gor", "Ulf", "Brek", "Torv", "Drek", "Mug", "Rur", "Krag", "Hro", "Varg", "Skar", "Durg", "Bolg", "Thur", "Grim", "Rag"])}${pick(["gar", "rik", "mund", "grim", "nulf", "drek", "ur", "mong", "rak", "kar", "strom", "ox", "spit", "ulf", "tsar", "rong"])}`,
    Elf: () => `${pick(["Ael", "Syl", "Fae", "Lir", "Nym", "Thal", "Vael", "Ily", "Elu", "Sera", "Lune", "Fael", "Nael", "Thir", "Vael", "Ily"])}${pick(["wen", "ara", "ion", "ith", "ael", "ora", "wen", "aria", "io'un", "e'eth", "æl", "ira", "wan", "iora", "aun", "iah"])}`,
    Human: () => `${pick(["Al", "Bran", "Cor", "Dar", "El", "Gar", "Hal", "Jo", "Mar", "Tha", "Ren", "Sol", "Var", "Kel", "Tor", "Lis"])}${pick(["win", "ard", "ett", "ina", "ert", "eth", "wen", "ard", "as", "una", "art", "ath", "wan", "ard", "ald", "iah"])}`,
    Dwarf: () => `${pick(["Bor", "Dun", "Gim", "Thor", "Bal", "Dur", "Kaz", "Brum", "Gor", "Thrak", "Bel", "Dorg", "Krum", "Fund", "Grim", "Thol"])}${pick(["in", "um", "ak", "or", "an", "lin", "lum", "lak", "lor", "ran", "rin", "rum", "rock", "brow"])}`,
    Goblin: () => `${pick(["Zik", "Nib", "Grik", "Snek", "Plik", "Zog", "Zuk", "Nab", "Grak", "Snak", "Plok", "Zeg", "Zit", "Knob", "Trik", "Birk"])}${pick(["o", "ik", "ur", "ek", "ob", "", "ky", "s", "le", "kin", "t", "at", "ar"])}`,
    Halfling: () => `${pick(["Pip", "Tob", "Ros", "Wil", "Fen", "Dot", "Bil", "Nim", "Cor", "Sam", "Len", "Hob", "Ril", "Top", "Mos", "Wen"])}${pick(["kin", "by", "ina", "let", "wick", "berry", "ton", "bin", "well", "ford", "burr", "hill", "mere", "low", "brook", "field"])}${Math.random() < 0.5 ? " " + pick(["Two-Boots", "Long-Bean", "Quick-Pick", "Moss-Back", "Sunny-Field", "Three-Toes", "Mud-Feet", "Bramble-Back", "Clover-Leaf", "Thistle-Top", "Pebble-Toe", "Fern-Whisker"]) : ""}`
  }

  const CLASS_SURNAMES = {
    soulknife: ["Mindblade", "Whisper", "Veil", "Hollow", "Grimm", "Shadow", "Silence", "Dream", "Phantom", "Echo", "Wraith", "Mirage", "Specter", "Umbral", "Nocturne", "Gloom"],
    paladin: ["Oathkeeper", "Brightblade", "Vow", "Sunheart", "Ironclad", "Dawnbringer", "Hallow", "Shield", "Aegis", "Luminous", "Virtue", "Sanctum", "Radiant", "Zealot", "Champion", "Warden"],
    sorcerer: ["Stormcaller", "Ashborn", "Flame", "Thunder", "Void", "Arcanum", "Pyre", "Gale", "Rune", "Hex", "Ward", "Sigil", "Rift", "Aether", "Mana", "Chant"],
    monk: ["Stonefist", "Quiet", "Stillwater", "Iron", "Barefoot", "Zen", "Lotus", "Willow", "Cinder", "Bamboo", "River", "Mountain", "Cloud", "Wind", "Pebble", "Reed"],
    kinetic: ["Forceborn", "Pressure", "Wave", "Slam", "Burst", "Impact", "Shock", "Surge", "Pulse", "Quake", "Rumble", "Crash", "Boom", "Thud", "Clash", "Riot"],
    fighter: ["Redmaul", "Grimsteel", "Brawlmark", "Ironmaw", "Cutthorn", "Warbrand", "Helmsunder", "Gritforge", "Bladelean", "Rendbar", "Steelgrim", "Hackfell", "Maulridge", "Grudgeborn", "Breakspire", "Fellmarch"],
    bard: ["Loreweft", "Songbarrow", "Talehart", "Versewind", "Chordwell", "Mythrun", "Sagehollow", "Rhymeford", "Wisptale", "Quieturn", "Musefen", "Storymere", "Balladthorn", "Echofern", "Harproot", "Lumenreach"],
    "pit-fighter": ["Scarbrand", "Goreline", "Fistgrave", "Ragemaul", "Bruiseborn", "Chainscar", "Pitmark", "Brawlscar", "Grudgepit", "Maulscar", "Rendcage", "Bloodturn", "Crackjaw", "Slamforge", "Ragebend", "Grimcinder"],
    priest: ["Purgeborn", "Faithrend", "Lightgrave", "Chantfell", "Ritesunder", "Devoturn", "Psalmbreak", "Holybrand", "Purethorn", "Cleanspire", "Vowreach", "Blessmaw", "Scriptforge", "Hymnward", "Gracebend", "Sanctfell"],
    ranger: ["Trailthorn", "Wanderfen", "Trackmaw", "Huntwell", "Pathgrim", "Farsunder", "Wildmarch", "Stalkridge", "Roamthorn", "Brushfell", "Fernmark", "Grovelean", "Mossreach", "Thornstride", "Pinegrave", "Hazelrun"],
    seer: ["Boneweft", "Runegrave", "Starfell", "Fatemark", "Smokeweir", "Bloodrun", "Omenreach", "Gloomspire", "Sightthorn", "Weirdbend", "Prophetmaw", "Ashweft", "Foretell", "Hexmarch", "Visionbrand", "Darkweir"],
    thief: ["Gutterhand", "Quickpick", "Shadelean", "Slipthorn", "Nightrun", "Cutpalm", "Blinkridge", "Slinkwell", "Fingershard", "Maskbend", "Grinmark", "Prythorn", "Latchfen", "Sneakforge", "Twistmaw", "Clutchgrim"],
    wizard: ["Spellweft", "Glyphthorn", "Charmridge", "Fellscroll", "Inkbrand", "Starforge", "Mystmarch", "Arcweir", "Wardrun", "Lorebend", "Spellhart", "Fatecinder", "Runelean", "Hexspire", "Manafen", "Astralmark"]
  }

  const CHEEKY_NAMES = [
    "Bart Simpson", "Lance-o-bass", "Rubber Ducky",
    "Ronald Drumpf", "The Hamburglar", "GigaChad",
    "Bartholomew the Mild", "Malcom of the Middle", "Brenda Two-Toes",
    "Kevin the Adequate", "Harriet the Spy", "Gary the Fine",
    "Steve the Cat", "Bob the Builder", "Tim the Tool",
    "Dave the Default", "Chad the Generic", "Kool Kyle",
    "Brenda the Bland", "Gerald of SOHO", "Great Scott"
  ]

  const ABSURD_NAMES = [
    "Piss-ant the Puny", "Unfuckable von Limp", "Cunt Smallprick",
    "Sir Cumference the Soft", "Brenda the Unfuckable", "Gerald of the Impure Taint",
    "Bartholomew the Mildew", "Osric the Damp", "Mildred Saddlebags",
    "Clovis Gutterslut", "Gerald the Uncircumsized", "Bramble the Moist",
    "Tilde Topleft", "Dr. Cosby", "Guzzler Superior",
    "Daphne Mapletwat", "Gimli the Unlegged", "Jargon Fountain",
    "Unrandomized Selection", "Drop Tables", "😴👯‍♀️👯‍♀️ 💀🔥"
  ]

  // Build the real name from the rolled ancestry + class.
  const generateName = (ancestry, classId) => {
    const first = (FIRST_NAME_PATTERNS[ancestry] ?? FIRST_NAME_PATTERNS.Human)()
    const surnames = CLASS_SURNAMES[classId] ?? ["Adventurer"]
    return `${first} ${pick(surnames)}`
  }

  // Build the reveal sequence: a wrong-build name, a cheeky one, an absurd
  // fabrication, then the real name last so it feels earned.
  const buildNameSequence = (ancestry, classId, realName) => {
    const otherAncestries = Object.keys(FIRST_NAME_PATTERNS).filter(a => a !== ancestry)
    const otherClasses = Object.keys(CLASS_SURNAMES).filter(c => c !== classId)
    const wrongName = generateName(pick(otherAncestries), pick(otherClasses))
    return [wrongName, pick(CHEEKY_NAMES), pick(ABSURD_NAMES), realName]
  }

  const escapeHtml = value =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")

  const getParam = key => new URLSearchParams(window.location.search).get(key)

  const classActionMacro = (cls, character) => {
    if (cls.id === "paladin") {
      return `/desc ${character.name} uses Divine Challenge. Target has disadvantage attacking allies until mark ends.`
    }
    if (cls.id === "soulknife") {
      return `/roll 1d20 + ${statMod(character.stats.wis)}\n/desc Psychic Dagger + Detect Intent application`
    }
    if (cls.id === "sorcerer") {
      return `/roll 1d20 + ${statMod(character.stats.cha)} + ?{Tier|1}\n/desc Choose shape: Strike, Arc, Burst, Line`
    }
    if (cls.id === "monk") {
      return `/desc Deflect Blows active until next turn; attacks against you are at disadvantage.`
    }
    if (cls.id === "kinetic") {
      return `/roll 1d20 + ${statMod(character.stats.con)}\n/desc Kinetic Burst or Push. Add surge bonus if available.`
    }
    return `/desc ${character.name} uses a class feature`
  }

  const buildMacroItems = character => {
    const cls = getClassById(character.classId)
    if (!cls) return []

    const mods = {
      str: statMod(character.stats.str),
      dex: statMod(character.stats.dex),
      con: statMod(character.stats.con),
      int: statMod(character.stats.int),
      wis: statMod(character.stats.wis),
      cha: statMod(character.stats.cha)
    }

    const attackStat =
      cls.id === "soulknife"
        ? "wis"
        : cls.id === "kinetic"
          ? "con"
          : cls.id === "paladin"
            ? "str"
            : cls.id === "monk"
              ? "dex"
              : "cha"

    const spellStat =
      cls.id === "paladin"
        ? "cha"
        : cls.id === "sorcerer"
          ? "cha"
          : cls.id === "monk"
            ? "wis"
            : cls.id === "kinetic"
              ? "con"
              : "wis"

    return [
      {
        title: "Attack",
        text: `&{template:default} {{name=${character.name} Attack}} {{Roll=[[1d20+${mods[attackStat]}+?{Situational bonus|0}]]}} {{Damage=[[1d${cls.hitDie <= 4 ? 4 : 6}+?{Damage bonus|0}]]}}`
      },
      {
        title: "Spellcasting Check",
        text: `/roll 1d20 + ${mods[spellStat]} + ?{Tier|1} + ?{Extra bonus|0}`
      },
      {
        title: "Talent Roll (2d6)",
        text: `/roll 2d6\n/desc ${cls.name} talents: ${cls.talents.map(t => `${t.roll}=${t.effect}`).join(" | ")}`
      },
      {
        title: "Class Action",
        text: classActionMacro(cls, character)
      },
      {
        title: "Quick Checks",
        text: `/roll 1d20 + ${mods.str} STR\n/roll 1d20 + ${mods.dex} DEX\n/roll 1d20 + ${mods.con} CON\n/roll 1d20 + ${mods.int} INT\n/roll 1d20 + ${mods.wis} WIS\n/roll 1d20 + ${mods.cha} CHA`
      }
    ]
  }

  const renderCharacterSummary = character => {
    const cls = getClassById(character.classId)
    if (!cls) return "<p>Class not found.</p>"

    const talentText = character.talentHistory?.map(item => `Lvl ${item.level}: ${item.result}`).join("<br>") ?? "None yet"

    return `
      <h3>${escapeHtml(character.name)} - ${escapeHtml(cls.name)} (Level ${character.level})</h3>
      <div class="sheet-grid">
        <div class="stat"><span>STR</span><strong>${finalStat(character.stats.str)}</strong><span>mod ${signed(statMod(character.stats.str))}</span></div>
        <div class="stat"><span>DEX</span><strong>${finalStat(character.stats.dex)}</strong><span>mod ${signed(statMod(character.stats.dex))}</span></div>
        <div class="stat"><span>CON</span><strong>${finalStat(character.stats.con)}</strong><span>mod ${signed(statMod(character.stats.con))}</span></div>
        <div class="stat"><span>INT</span><strong>${finalStat(character.stats.int)}</strong><span>mod ${signed(statMod(character.stats.int))}</span></div>
        <div class="stat"><span>WIS</span><strong>${finalStat(character.stats.wis)}</strong><span>mod ${signed(statMod(character.stats.wis))}</span></div>
        <div class="stat"><span>CHA</span><strong>${finalStat(character.stats.cha)}</strong><span>mod ${signed(statMod(character.stats.cha))}</span></div>
        <div class="stat"><span>HP</span><strong>${character.hp}/${character.maxHp}</strong></div>
        <div class="stat"><span>XP</span><strong>${character.xp}</strong></div>
      </div>
      <p class="class-summary">${escapeHtml(cls.summary)}</p>
      <div class="sheet-columns">
        <div>
          <p><strong>Ancestry:</strong> ${escapeHtml(character.ancestry)}</p>
          <p><strong>Background:</strong> ${escapeHtml(character.background)}</p>
          <p><strong>Alignment:</strong> ${escapeHtml(character.alignment)}</p>
          <p><strong>Deity:</strong> ${escapeHtml(character.deity ?? "-")}</p>
          <p><strong>Weapons:</strong> ${escapeHtml(cls.weapons)}</p>
          <p><strong>Armor:</strong> ${escapeHtml(cls.armor)}</p>
        </div>
        <div>
          <p><strong>Talent History:</strong><br>${talentText || "None yet"}</p>
        </div>
      </div>
    `
  }

  return {
    STORAGE_KEY,
    loadSavedBuilds,
    persistSavedBuilds,
    setCurrentCharacterId,
    getCurrentCharacterId,
    getCharacterById,
    getCurrentCharacter,
    saveBuild,
    deleteBuild,
    getClassById,
    roll,
    finalStat,
    statMod,
    signed,
    rollStats,
    rollTalent,
    randomName,
    generateName,
    buildNameSequence,
    escapeHtml,
    getParam,
    buildMacroItems,
    renderCharacterSummary
  }
})()

window.SD = SD
