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
    crappedOutWarning: document.getElementById("crappedOutWarning"),
    resultSummary: document.getElementById("resultSummary"),
    resultFeatures: document.getElementById("resultFeatures"),
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

// Cheeky, deliberately inappropriate names used only for the reveal's "wrong
// answer" beats. These are never saved — they exist to make the real name land.
const CHEEKY_NAMES = [
    "Bart Simpson", "Lance-o-bass", "Rubber Ducky",
    "Ronald Drumpf", "The Hamburglar", "GigaChad",
    "Bartholomew the Mild", "Malcolm of the Middle", "Brenda Two-Toes",
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
// Read the final value of a stat. Each stat is stored as an array of every
// roll made (so a reroll's history is visible); the last entry is the score.
const finalStat = value => value.at?.(-1) ?? value

function rollStatsHouseRule() {
    // Roll one stat: 3d6, reroll if the total is 6 or lower. Returns an array
    // of every roll made so the reroll history is visible (last value is final).
    const rollOne = () => {
        const rolls = []
        let value = SD.roll(6) + SD.roll(6) + SD.roll(6)
        rolls.push(value)
        while (value <= 6) {
            value = SD.roll(6) + SD.roll(6) + SD.roll(6)
            rolls.push(value)
        }
        return rolls
    }

    return {
        str: rollOne(),
        dex: rollOne(),
        con: rollOne(),
        int: rollOne(),
        wis: rollOne(),
        cha: rollOne()
    }
}

// Weighted class selection based on rolled stats.
// - If any of a class's focus attributes is below 10 (negative modifier), that class is removed from the pool.
// - If any of a class's focus attributes is 14+ (+2 modifier), that class gets a boosted weight.
// - Classes with no focus attribute (or all focus attributes 10-13) get a neutral weight.
function pickWeightedClass(stats) {
    const weighted = CLASS_DATA.map(cls => {
        const focus = cls.focus ?? []
        if (focus.length === 0) return { cls, weight: 1 }

        const mods = focus.map(attr => SD.statMod(finalStat(stats[attr])))
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
    const hp = Math.max(1, cls.hitDie + SD.statMod(finalStat(stats.con)))

    // 5b. No stat reached 15+ — the roll "crapped out". Keep it, but flag it so
    // the UI can show a warning and offer a free reroll.
    const crappedOut = !Object.values(stats).some(v => finalStat(v) >= 15)

    // 5. Rolled talent from the class's talent table. Humans get an extra roll.
    const talentHistory = []
    const firstTalent = SD.rollTalent(cls.talents)
    if (firstTalent) talentHistory.push({ level: 1, result: firstTalent })
    if (ancestry === "Human") {
        const secondTalent = SD.rollTalent(cls.talents)
        if (secondTalent) talentHistory.push({ level: 1, result: secondTalent })
    }

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
        crappedOut,
        stats,
        notes: [],
        talentHistory
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
            const rolls = character.stats[stat]
            const value = finalStat(rolls)
            const mod = SD.statMod(value)
            const signed = mod >= 0 ? `+${mod}` : `${mod}`
            const historyAttr = Array.isArray(rolls) && rolls.length > 1 ? ` data-history='${JSON.stringify(rolls)}'` : ""
            return `<div class="stat reveal"${historyAttr}><span>${stat.toUpperCase()}</span><strong data-final="${value}">?</strong><span>mod ${signed}</span></div>`
        })
        .join("")

    // Build the features section (class features + ancestry traits).
    const ancestry = ANCESTRY_OPTIONS.find(a => a.name === character.ancestry)
    const classFeatures = (cls?.features ?? [])
        .map(f => `<div class="feature"><strong>${SD.escapeHtml(f.title)}</strong><p>${SD.escapeHtml(f.text)}</p></div>`)
        .join("")
    const ancestryTraits = (ancestry?.traits ?? [])
        .map(t => `<div class="feature"><strong>${SD.escapeHtml(t.title)}</strong><p>${SD.escapeHtml(t.text)}</p></div>`)
        .join("")
    refs.resultFeatures.innerHTML = `
        <h4>Class Features</h4>${classFeatures}
        <h4>Ancestry Traits</h4>${ancestryTraits}
    `
    // Mark each feature for staggered reveal (hidden until popped in).
    refs.resultFeatures.querySelectorAll(".feature").forEach(el => el.classList.add("reveal"))

    // Links only work once saved; point at the current id placeholder.
    refs.viewerLink.href = "characters.html"
    refs.macrosLink.href = "macros.html"

    // Reveal sequence mirrors the roll order: stats first (they drive class
    // selection), then class/ancestry, then background/talent, then HP, with the
    // suggested name as the final flourish.
    const steps = [
        ...[...refs.resultStats.querySelectorAll(".stat")].map(el => ({ el, stat: true })),
        { el: refs.crappedOutWarning, warning: true },
        { el: refs.resultClass, value: cls?.name ?? character.classId },
        { el: refs.resultSummary, value: cls?.summary ?? "" },
        { el: refs.resultAncestry, value: character.ancestry },
        { el: refs.resultAlignment, value: character.alignment },
        { el: refs.resultBackground, value: character.background },
        { el: refs.resultDeity, value: character.deity },
        { el: refs.resultTalent, talent: true, value: character.talentHistory?.map(t => t.result).join("<br>") ?? "None rolled" },
        { el: refs.resultHp, value: `${character.hp} (max ${character.maxHp})` },
        { el: refs.resultName, name: true, sequence: character.nameSequence, onComplete: () => revealFeatures(gen) }
    ]

    // Reset any state from a previous roll: text elements are persistent DOM
    // nodes (only the stat boxes are rebuilt), so clear is-in and their text.
    steps.forEach(step => {
        step.el.classList.remove("is-in", "rolling")
        if (!step.stat && !step.warning) step.el.textContent = "—"
    })
    steps.forEach(step => step.el.classList.add("reveal"))
    refs.resultFeatures.hidden = true
    refs.resultFeatures.querySelectorAll(".feature").forEach(el => el.classList.remove("is-in"))
    refs.crappedOutWarning.hidden = !character.crappedOut
    refs.crappedOutWarning.classList.remove("is-in")
    refs.resultPanel.hidden = false

    steps.forEach((step, index) => {
        const delay = 150 + index * REVEAL_STAGGER_MS
        setTimeout(() => {
            if (gen !== revealGeneration) return
            if (step.stat) {
                flickerStat(step.el, gen)
                return
            }
            if (step.warning) {
                // Only shown when the roll crapped out; pop it in after the stats land.
                if (!character.crappedOut) return
                step.el.classList.add("is-in")
                return
            }
            if (step.name) {
                // Type through a sequence of wrong names, then settle on the real one
                // (last in the sequence so it is typed once and left in place).
                typeOutName(step.el, step.sequence, gen, step.onComplete)
                return
            }
            if (step.talent) {
                step.el.innerHTML = step.value
            } else {
                step.el.textContent = step.value
            }
            step.el.classList.add("is-in")
        }, delay)
    })
}

// Reveal feature cards one at a time after the name has been typed.
function revealFeatures(gen) {
    refs.resultFeatures.hidden = false
    const features = [...refs.resultFeatures.querySelectorAll(".feature")]
    features.forEach((el, i) => {
        setTimeout(() => {
            if (gen !== revealGeneration) return
            el.classList.add("is-in")
        }, 200 + i * 350)
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

function typeOutName(el, sequence, gen, onComplete) {
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
                onComplete?.()
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
// If the stat has a reroll history (stored as data-history), run the reroll animation
// instead: show each low roll, glitch the card, toss the value off-screen, and reroll.
function flickerStat(el, gen) {
    const strong = el.querySelector("strong")
    const final = Number(strong.dataset.final)
    const history = el.dataset.history ? JSON.parse(el.dataset.history) : null

    if (history && history.length > 1) {
        rerollStat(el, strong, history, gen)
        return
    }

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
            strong.textContent = 3 + Math.floor(Math.random() * 15)
            last = now
        }
        requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
}

// Animate a stat with reroll history. The REAL card is the anchor and never
// moves: it shows each low roll in red, then rerolls in place. A CLONED card is
// the one that pops out, rolls to its short edge, tips over, and fades — carrying
// the low value with it. Settle on the final value.
function rerollStat(el, strong, history, gen) {
    let index = 0

    const showRoll = () => {
        if (gen !== revealGeneration) return
        const value = history[index]
        const isFinal = index === history.length - 1

        // Freeze the card's reveal animation and show the low value in red.
        el.classList.add("rolling", "reroll-hold")
        strong.textContent = value

        if (isFinal) {
            // Settle on the final value after a beat.
            setTimeout(() => {
                if (gen !== revealGeneration) return
                el.classList.remove("rolling", "reroll-hold")
                el.classList.add("is-in")
            }, 400)
            return
        }

        // Hold the low value on screen for a beat, then pop a cloned card out to
        // discard it while the real card rerolls in place.
        setTimeout(() => {
            if (gen !== revealGeneration) return
            tossCard(el, value)
            index++
            showRoll()
        }, 550)
    }

    showRoll()
}

// Clone the stat card, overlay it on the real one, and animate the clone popping
// out, rolling to its short edge, tipping over, and fading. The real card is
// untouched and rerolls in place underneath.
function tossCard(statEl, value) {
    const rect = statEl.getBoundingClientRect()

    // Clone the real card first (before degrading it) so the clone is a clean
    // copy that the toss animation can fully control.
    const clone = statEl.cloneNode(true)
    clone.classList.remove("reveal", "is-in", "rolling", "reroll-hold", "reroll-degraded")
    clone.style.removeProperty("--reroll-count")
    clone.classList.add("tossed-card")
    clone.style.position = "fixed"
    clone.style.left = `${rect.left}px`
    clone.style.top = `${rect.top}px`
    clone.style.width = `${rect.width}px`
    clone.style.margin = "0"
    // Make sure the clone shows the low value being discarded.
    clone.querySelector("strong").textContent = value
    document.body.appendChild(clone)

    // Each reroll degrades the real card a little: it gets a touch more uneven
    // and picks up a small shadow. The effect grows noticeably over 3-4 rerolls.
    const rerolls = Number(statEl.dataset.rerollCount ?? 0) + 1
    statEl.dataset.rerollCount = rerolls
    statEl.classList.add("reroll-degraded")
    statEl.style.setProperty("--reroll-count", rerolls)
    statEl.style.setProperty("--reroll-dir",rerolls % 2 ? -1 : 1)

    // Pivot the card on its bottom corner so it swings like a card tipping over
    // on a table (top-down view), rather than turning away from the viewer.
    const dir = Math.random() > 0.5 ? 1 : -1
    clone.style.transformOrigin = dir === 1 ? "100% 100%" : "0% 100%"

    const anim = clone.animate(
        [
            // 0%: sits exactly over the real card.
            { transform: "perspective(600px) rotateZ(0deg) rotateX(0deg)", opacity: 1, offset: 0, easing: "ease-in" },
            // 8%: spike top-right and bottom-left corners way out.
            { transform: `perspective(600px) rotateZ(0deg) rotateX(0deg) scale(2.2, 0.4) skewX(${dir * 35}deg) skewY(${dir * 20}deg)`, opacity: 1, offset: 0.08, easing: "ease-out" },
            // 16%: snap back to normal shape.
            { transform: "perspective(600px) rotateZ(0deg) rotateX(0deg)", opacity: 1, offset: 0.16, easing: "ease-out" },
            // 45%: pivoted on the bottom corner — "up" now points left/right,
            // standing on its short edge.
            { transform: `perspective(600px) rotateZ(${dir * 90}deg) rotateX(0deg)`, opacity: 1, offset: 0.45, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
            // 100%: falls flat on its lower edge, accelerating with gravity —
            // only the short edge is visible.
            { transform: `perspective(600px) rotateZ(${dir * 95}deg) rotateY(${dir * 90}deg)`, opacity: 0, offset: 1 }
        ],
        { duration: 1800, fill: "forwards" }
    )
    anim.onfinish = () => clone.remove()
}

function saveCurrent() {
    if (!current) return
    SD.saveBuild(SD.loadSavedBuilds(), current)
    SD.setCurrentCharacterId(current.id)
    refs.viewerLink.href = `characters.html?id=${encodeURIComponent(current.id)}`
    refs.macrosLink.href = `macros.html?id=${encodeURIComponent(current.id)}`
    refs.saveNote.hidden = false
}
