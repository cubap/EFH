// One-click character randomizer using the campaign's house rules.
// - 3d6 down the line; reroll any score of 6 or lower; require at least one 15+.
// - Max HP at level 1 (hit die + CON modifier).
// - Rolled talent (2d6) from the class's talent table.
// - Suggested name from SD.randomName().

const refs = {
  randomizeBtn: document.getElementById("randomizeBtn"),
  resultPanel: document.getElementById("resultPanel"),
  resultName: document.getElementById("resultName"),
  resultClass: document.getElementById("resultClass"),
  resultAncestry: document.getElementById("resultAncestry"),
  resultAlignment: document.getElementById("resultAlignment"),
  resultBackground: document.getElementById("resultBackground"),
  resultDeity: document.getElementById("resultDeity"),
  resultHp: document.getElementById("resultHp"),
  resultTalent: document.getElementById("resultTalent"),
  resultStats: document.getElementById("resultStats"),
  rerollBtn: document.getElementById("rerollBtn"),
  saveBtn: document.getElementById("saveBtn"),
  viewerLink: document.getElementById("viewerLink"),
  macrosLink: document.getElementById("macrosLink"),
  saveNote: document.getElementById("saveNote")
}

let current = null

const REVEAL_STAGGER_MS = 900
const ROLL_FLICKER_MS = 600
let revealGeneration = 0

init()

function init() {
  refs.randomizeBtn.addEventListener("click", () => {
    current = rollCharacter()
    render(current)
  })
  refs.rerollBtn.addEventListener("click", () => {
    current = rollCharacter()
    render(current)
  })
  refs.saveBtn.addEventListener("click", saveCurrent)
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Cheeky, flavor-driven name generation. These are not canonical Shadowdark
// names — they exist to make the reveal feel personal to the rolled build.
// Each ancestry rolls a prefix + suffix (and Halflings may add a nickname), so
// the pool is the product of the two lists rather than a fixed set of names.
const FIRST_NAME_PATTERNS = {
  "Half-Orc": () => `${pick(["Gor", "Ulf", "Brek", "Torv", "Drek", "Mug", "Rur", "Krag", "Hro", "Varg", "Skar", "Durg", "Bolg", "Thur", "Grim", "Rag"])}${pick(["gar", "rik", "mund", "grim", "nulf", "drek", "ulf", "gar", "rik", "mund", "grim", "nulf", "drek", "ulf", "gar", "mund"])}`,
  Elf: () => `${pick(["Ael", "Syl", "Fae", "Lir", "Nym", "Thal", "Vael", "Ily", "Elu", "Sera", "Lune", "Fael", "Nael", "Thir", "Vael", "Ily"])}${pick(["wen", "ara", "ion", "ith", "ael", "ora", "wen", "ara", "ion", "ith", "ael", "ora", "wen", "ara", "ion", "ith"])}`,
  Human: () => `${pick(["Cor", "Edm", "Wil", "Mar", "Hen", "Jos", "Alb", "Ber", "Wil", "Mar", "Hen", "Jos", "Alb", "Ber", "Cor", "Edm"])}${pick(["win", "ard", "ett", "ina", "ert", "eth", "win", "ard", "ett", "ina", "ert", "eth", "win", "ard", "ett", "ina"])}`,
  Dwarf: () => `${pick(["Bor", "Dun", "Gim", "Thor", "Bal", "Dur", "Bor", "Dun", "Gim", "Thor", "Bal", "Dur", "Bor", "Dun", "Gim", "Thor"])}${pick(["in", "um", "ak", "or", "an", "in", "um", "ak", "or", "an", "in", "um", "ak", "or"])}`,
  Goblin: () => `${pick(["Zik", "Nib", "Grik", "Snek", "Plik", "Zog", "Zik", "Nib", "Grik", "Snek", "Plik", "Zog", "Zik", "Nib", "Grik", "Snek"])}${pick(["o", "ik", "ur", "ek", "ob", "o", "ik", "ur", "ek", "ob", "o", "ik", "ur", "ek"])}`,
  Halfling: () => `${pick(["Pip", "Tob", "Ros", "Wil", "Fen", "Dot", "Pip", "Tob", "Ros", "Wil", "Fen", "Dot", "Pip", "Tob", "Ros", "Wil"])}${pick(["kin", "by", "ina", "let", "wick", "berry", "kin", "by", "ina", "let", "wick", "berry", "kin", "by", "ina", "let"])}${Math.random() < 0.5 ? " " + pick(["Two-Boots", "Long-Bean", "Quick-Pick", "Moss-Back", "Sunny-Field", "Three-Toes", "Mud-Feet", "Bramble-Back", "Clover-Leaf", "Thistle-Top", "Pebble-Toe", "Fern-Whisker"]) : ""}`
}

const CLASS_SURNAMES = {
  soulknife: ["Mindblade", "Whisper", "Veil", "Hollow", "Grimm", "Shadow", "Silence", "Dream", "Phantom", "Echo", "Wraith", "Mirage", "Specter", "Umbral", "Nocturne", "Gloom"],
  paladin: ["Oathkeeper", "Brightblade", "Vow", "Sunheart", "Ironclad", "Dawnbringer", "Hallow", "Shield", "Aegis", "Luminous", "Virtue", "Sanctum", "Radiant", "Zealot", "Champion", "Warden"],
  sorcerer: ["Stormcaller", "Ashborn", "Flame", "Thunder", "Void", "Arcanum", "Pyre", "Gale", "Rune", "Hex", "Ward", "Sigil", "Rift", "Aether", "Mana", "Chant"],
  monk: ["Stonefist", "Quiet", "Stillwater", "Iron", "Barefoot", "Zen", "Lotus", "Willow", "Cinder", "Bamboo", "River", "Mountain", "Cloud", "Wind", "Pebble", "Reed"],
  kinetic: ["Forceborn", "Pressure", "Wave", "Slam", "Burst", "Impact", "Shock", "Surge", "Pulse", "Quake", "Rumble", "Crash", "Boom", "Thud", "Clash", "Riot"]
}

// Cheeky, deliberately inappropriate names used only for the reveal's "wrong
// answer" beats. These are never saved — they exist to make the real name land.
const CHEEKY_NAMES = [
  "Bart Simpson", "Lance-o-bass", "Rubber Ducky",
  "Ronald Drumpf", "The Hamburglar", "GigaChad",
  "Bartholomew the Mild", "Gerald of the Middle", "Brenda Two-Toes",
  "Kevin the Adequate", "Mildred the Unremarkable", "Gary the Fine",
  "Steve the Average", "Bob the Builder", "Tim the Tool",
  "Dave the Default", "Chad the Generic", "Kyle the Kool",
  "Brenda the Bland", "Gerald the Generic", "Mildred the Mediocre"
]

const ABSURD_NAMES = [
  "Piss-ant the Puny", "Unfuckable von Limp", "Cunt Smallprick",
  "Sir Cumference the Soft", "Brenda the Unfuckable", "Gerald of the Impure Taint",
  "Bartholomew the Mildew", "Kevin the Unremarkable", "Mildred Saddlebags",
  "Bartholomew the Mildew", "Gerald the Unwashed", "Brenda the Unbearable",
  "Kevin the Unremarkable", "Mildred the Unbearable", "Bartholomew the Mildew",
  "Gerald the Unwashed", "Brenda the Unbearable", "Kevin the Unremarkable",
  "Mildred the Unbearable", "Bartholomew the Mildew", "Gerald the Unwashed"
]

// Build the real name from the rolled ancestry + class.
function generateName(ancestry, classId) {
  const first = (FIRST_NAME_PATTERNS[ancestry] ?? FIRST_NAME_PATTERNS.Human)()
  const surnames = CLASS_SURNAMES[classId] ?? ["Adventurer"]
  return `${first} ${pick(surnames)}`
}

// Build the reveal sequence: a wrong-build name, a cheeky one, an absurd
// fabrication, then the real name last so it feels earned.
function buildNameSequence(ancestry, classId, realName) {
  const otherAncestries = Object.keys(FIRST_NAME_PATTERNS).filter(a => a !== ancestry)
  const otherClasses = Object.keys(CLASS_SURNAMES).filter(c => c !== classId)
  const wrongAncestry = pick(otherAncestries)
  const wrongClass = pick(otherClasses)
  const wrongName = generateName(wrongAncestry, wrongClass)

  return [
    wrongName,
    pick(CHEEKY_NAMES),
    pick(ABSURD_NAMES),
    realName
  ]
}

// House rule: 3d6 down the line, reroll any 6 or lower, require at least one 15+.
function rollStatsHouseRule() {
  const rollOne = () => {
    let value = SD.roll(6) + SD.roll(6) + SD.roll(6)
    while (value <= 6) {
      value = SD.roll(6) + SD.roll(6) + SD.roll(6)
    }
    return value
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    const stats = {
      str: rollOne(),
      dex: rollOne(),
      con: rollOne(),
      int: rollOne(),
      wis: rollOne(),
      cha: rollOne()
    }
    const hasHigh = Object.values(stats).some(v => v >= 15)
    if (hasHigh) return stats
  }
  // Fallback: force a 15+ on the lowest score so the array is usable.
  const stats = {
    str: rollOne(),
    dex: rollOne(),
    con: rollOne(),
    int: rollOne(),
    wis: rollOne(),
    cha: rollOne()
  }
  const keys = Object.keys(stats)
  const lowest = keys.reduce((a, b) => (stats[a] <= stats[b] ? a : b))
  stats[lowest] = Math.max(stats[lowest], 15)
  return stats
}

// Weighted class selection based on rolled stats.
// - If any of a class's focus attributes is below 10 (negative modifier), that class is removed from the pool.
// - If any of a class's focus attributes is 14+ (+2 modifier), that class gets a boosted weight.
// - Classes with no focus attribute (or all focus attributes 10-13) get a neutral weight.
function pickWeightedClass(stats) {
  const weighted = CLASS_DATA.map(cls => {
    const focus = cls.focus ?? []
    if (focus.length === 0) return { cls, weight: 1 }

    const mods = focus.map(attr => SD.statMod(stats[attr]))
    // Remove classes whose focus attribute is below 10 (negative modifier).
    if (mods.some(mod => mod < 0)) return { cls, weight: 0 }
    // Boost classes whose focus attribute is +2 or higher.
    if (mods.some(mod => mod >= 2)) return { cls, weight: 3 }
    return { cls, weight: 1 }
  })

  const eligible = weighted.filter(item => item.weight > 0)
  const pool = eligible.length ? eligible : weighted
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * totalWeight
  for (const item of pool) {
    roll -= item.weight
    if (roll <= 0) return item.cls
  }
  return pool[pool.length - 1].cls
}

function rollCharacter() {
  // 1. Roll stats first — they drive class selection.
  const stats = rollStatsHouseRule()

  // 2. Pick a class weighted by the rolled stats.
  const cls = pickWeightedClass(stats)

  // 3. Ancestry, background, alignment, deity.
  const ancestry = pick(ANCESTRY_OPTIONS).name
  const background = pick(BACKGROUND_OPTIONS)
  const alignment = pick(Object.keys(ALIGNMENT_DEITIES))
  const deities = ALIGNMENT_DEITIES[alignment] ?? []
  const deity = deities.length ? pick(deities) : "-"

  // 4. HP is deterministic: max at level 1 = hit die + CON modifier.
  const hp = Math.max(1, cls.hitDie + SD.statMod(stats.con))

  // 5. Rolled talent from the class's talent table.
  const talent = SD.rollTalent(cls.talents)

  // 6. Flavor name: ancestry shapes the first name, class shapes the surname.
  const name = generateName(ancestry, cls.id)
  const nameSequence = buildNameSequence(ancestry, cls.id, name)

  return {
    id: crypto.randomUUID(),
    name,
    nameSequence,
    classId: cls.id,
    ancestry,
    background,
    alignment,
    deity,
    level: 1,
    xp: 0,
    hp,
    maxHp: hp,
    stats,
    notes: [],
    talentHistory: talent ? [{ level: 1, result: talent }] : []
  }
}

function render(character) {
  const gen = ++revealGeneration
  const cls = SD.getClassById(character.classId)
  refs.saveNote.hidden = true

  // Build the stat boxes up front (hidden until their turn in the sequence).
  const order = ["str", "dex", "con", "int", "wis", "cha"]
  refs.resultStats.innerHTML = order
    .map(stat => {
      const value = character.stats[stat]
      const mod = SD.statMod(value)
      const signed = mod >= 0 ? `+${mod}` : `${mod}`
      return `<div class="stat reveal"><span>${stat.toUpperCase()}</span><strong data-final="${value}">?</strong><span>mod ${signed}</span></div>`
    })
    .join("")

  // Links only work once saved; point at the current id placeholder.
  refs.viewerLink.href = "characters.html"
  refs.macrosLink.href = "macros.html"

  // Reveal sequence mirrors the roll order: stats first (they drive class
  // selection), then class/ancestry, then background/talent, then HP, with the
  // suggested name as the final flourish.
  const steps = [
    ...[...refs.resultStats.querySelectorAll(".stat")].map(el => ({ el, stat: true })),
    { el: refs.resultClass, value: cls?.name ?? character.classId },
    { el: refs.resultAncestry, value: character.ancestry },
    { el: refs.resultAlignment, value: character.alignment },
    { el: refs.resultBackground, value: character.background },
    { el: refs.resultDeity, value: character.deity },
    { el: refs.resultTalent, value: character.talentHistory[0]?.result ?? "None rolled" },
    { el: refs.resultHp, value: `${character.hp} (max ${character.maxHp})` },
    { el: refs.resultName, name: true, sequence: character.nameSequence }
  ]

  // Reset any state from a previous roll: text elements are persistent DOM
  // nodes (only the stat boxes are rebuilt), so clear is-in and their text.
  steps.forEach(step => {
    step.el.classList.remove("is-in", "rolling")
    if (!step.stat) step.el.textContent = "—"
  })
  steps.forEach(step => step.el.classList.add("reveal"))
  refs.resultPanel.hidden = false

  steps.forEach((step, index) => {
    const delay = 150 + index * REVEAL_STAGGER_MS
    setTimeout(() => {
      if (gen !== revealGeneration) return
      if (step.stat) {
        flickerStat(step.el, gen)
        return
      }
      if (step.name) {
        // Type through a sequence of wrong names, then settle on the real one
        // (last in the sequence so it is typed once and left in place).
        typeOutName(step.el, step.sequence, gen)
        return
      }
      step.el.textContent = step.value
      step.el.classList.add("is-in")
    }, delay)
  })
}

// Type out a name with a blinking cursor, hold on it, delete it, and move to
// the next name in the sequence. The last name is the real one and is left in
// place once typed. Wrong names are held longer with a blinking cursor so the
// reader knows the reveal is still working.
const TYPE_SPEED_MS = 55
const DELETE_SPEED_MS = 28
const WRONG_HOLD_MS = 1400
const CURSOR_BLINK_MS = 380

function typeOutName(el, sequence, gen) {
  el.classList.add("is-in", "typing")
  const names = sequence && sequence.length ? sequence : ["—"]
  let attempt = 0

  const typeOne = () => {
    if (gen !== revealGeneration) return
    const target = names[attempt]
    const isFinal = attempt === names.length - 1
    let i = 0
    el.textContent = ""

    const typeTick = () => {
      if (gen !== revealGeneration) return
      if (i <= target.length) {
        el.textContent = target.slice(0, i) + "▌"
        i++
        setTimeout(typeTick, TYPE_SPEED_MS)
        return
      }
      // Finished typing this name.
      if (isFinal) {
        el.textContent = target
        el.classList.remove("typing")
        return
      }
      // Hold on the wrong name with a blinking cursor, then delete and move on.
      holdThenDelete(target)
    }

    const holdThenDelete = (target) => {
      if (gen !== revealGeneration) return
      let blinkOn = true
      el.textContent = target + "▌"
      const blinkInterval = setInterval(() => {
        if (gen !== revealGeneration) {
          clearInterval(blinkInterval)
          return
        }
        blinkOn = !blinkOn
        el.textContent = target + (blinkOn ? "▌" : "")
      }, CURSOR_BLINK_MS)

      setTimeout(() => {
        if (gen !== revealGeneration) {
          clearInterval(blinkInterval)
          return
        }
        clearInterval(blinkInterval)
        let j = target.length
        const deleteTick = () => {
          if (gen !== revealGeneration) return
          if (j >= 0) {
            el.textContent = target.slice(0, j) + "▌"
            j--
            setTimeout(deleteTick, DELETE_SPEED_MS)
            return
          }
          attempt++
          typeOne()
        }
        deleteTick()
      }, WRONG_HOLD_MS)
    }

    typeTick()
  }

  typeOne()
}

// Rapidly flicker a stat's value through random rolls, then settle on the final score.
function flickerStat(el, gen) {
  const strong = el.querySelector("strong")
  const final = Number(strong.dataset.final)
  el.classList.add("rolling")
  const start = performance.now()
  let last = 0
  const tick = now => {
    if (gen !== revealGeneration) return
    if (now - start >= ROLL_FLICKER_MS) {
      strong.textContent = final
      el.classList.remove("rolling")
      el.classList.add("is-in")
      return
    }
    if (now - last >= 50) {
      strong.textContent = 3 + Math.floor(Math.random() * 18)
      last = now
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function saveCurrent() {
  if (!current) return
  SD.saveBuild(SD.loadSavedBuilds(), current)
  SD.setCurrentCharacterId(current.id)
  refs.viewerLink.href = `characters.html?id=${encodeURIComponent(current.id)}`
  refs.macrosLink.href = `macros.html?id=${encodeURIComponent(current.id)}`
  refs.saveNote.hidden = false
}
