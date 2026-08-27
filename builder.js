const wizardState = {
  step: 0,
  current: null,
  saved: SD.loadSavedBuilds(),
  rollLog: [],
  selections: {
    classId: CLASS_DATA[0]?.id ?? null,
    ancestry: ANCESTRY_OPTIONS[0]?.name ?? null,
    background: BACKGROUND_OPTIONS[0] ?? null,
    alignment: Object.keys(ALIGNMENT_DEITIES)[0] ?? null,
    deity: null
  }
}

// Seed deity from initial alignment
const _initDeities = ALIGNMENT_DEITIES[wizardState.selections.alignment] ?? []
wizardState.selections.deity = _initDeities[0] ?? null

const refs = {
  nameInput: document.getElementById("nameInput"),
  rollNameBtn: document.getElementById("rollNameBtn"),
  classCardGrid: document.getElementById("classCardGrid"),
  ancestryCardGrid: document.getElementById("ancestryCardGrid"),
  backgroundChips: document.getElementById("backgroundChips"),
  selectionsBar: document.getElementById("selectionsBar"),
  alignmentCardGrid: document.getElementById("alignmentCardGrid"),
  deityCardGrid: document.getElementById("deityCardGrid"),
  maxHpLevel1: document.getElementById("maxHpLevel1"),
  autoTalentRoll: document.getElementById("autoTalentRoll"),
  rollStatsStepBtn: document.getElementById("rollStatsStepBtn"),
  rollHpBtn: document.getElementById("rollHpBtn"),
  rollTalentBtn: document.getElementById("rollTalentBtn"),
  generateBtn: document.getElementById("generateBtn"),
  saveBtn: document.getElementById("saveBtn"),
  openViewerBtn: document.getElementById("openViewerBtn"),
  openSheetBtn: document.getElementById("openSheetBtn"),
  openMacrosBtn: document.getElementById("openMacrosBtn"),
  wizardPrevBtn: document.getElementById("wizardPrevBtn"),
  wizardNextBtn: document.getElementById("wizardNextBtn"),
  wizardProgress: document.getElementById("wizardProgress"),
  rollLog: document.getElementById("rollLog"),
  buildSummary: document.getElementById("buildSummary")
}

// Shared tooltip element appended to body to avoid clipping
const tooltipEl = document.createElement("div")
tooltipEl.className = "card-tooltip-popup"
document.body.appendChild(tooltipEl)

init()

function init() {
  bindEvents()
  setWizardStep(0)

  const classFromQuery = SD.getParam("class")
  if (classFromQuery && SD.getClassById(classFromQuery)) {
    wizardState.selections.classId = classFromQuery
  }

  const loadId = SD.getParam("load")
  if (loadId) {
    const loaded = SD.getCharacterById(wizardState.saved, loadId)
    if (loaded) {
      loadSelectionsFromCharacter(loaded)
      wizardState.current = structuredClone(loaded)
      renderSummary()
      appendLog(`Loaded ${loaded.name} for editing.`)
    }
  }

  renderAllCards()
  renderRollLog()
}

function bindEvents() {
  refs.wizardPrevBtn.addEventListener("click", () => setWizardStep(wizardState.step - 1))
  refs.wizardNextBtn.addEventListener("click", () => setWizardStep(wizardState.step + 1))

  refs.wizardProgress.querySelectorAll("button[data-step]").forEach(button => {
    button.addEventListener("click", () => {
      const step = Number(button.getAttribute("data-step"))
      if (!Number.isNaN(step)) setWizardStep(step)
    })
  })

  refs.generateBtn.addEventListener("click", buildCharacter)
  refs.rollNameBtn.addEventListener("click", rollName)
  refs.rollStatsStepBtn.addEventListener("click", rerollStats)
  refs.rollHpBtn.addEventListener("click", rerollHp)
  refs.rollTalentBtn.addEventListener("click", rollTalent)
  refs.saveBtn.addEventListener("click", saveCurrent)

  refs.openViewerBtn.addEventListener("click", () => navigateWithCurrent("characters.html"))
  refs.openSheetBtn.addEventListener("click", () => navigateWithCurrent("sheet.html"))
  refs.openMacrosBtn.addEventListener("click", () => navigateWithCurrent("macros.html"))
}

function setWizardStep(nextStep) {
  const steps = [...document.querySelectorAll(".wizard-step")]
  const max = steps.length - 1
  wizardState.step = Math.max(0, Math.min(nextStep, max))

  steps.forEach(stepEl => {
    const step = Number(stepEl.getAttribute("data-step"))
    stepEl.dataset.active = step === wizardState.step ? "true" : "false"
  })

  refs.wizardProgress.querySelectorAll("button[data-step]").forEach(button => {
    const step = Number(button.getAttribute("data-step"))
    button.dataset.active = step === wizardState.step ? "true" : "false"
  })

  refs.wizardPrevBtn.disabled = wizardState.step === 0
  refs.wizardNextBtn.disabled = wizardState.step === max
}

// Card renderers

function renderAllCards() {
  renderClassCards()
  renderAncestryCards()
  renderBackgroundChips()
  renderAlignmentCards()
  renderDeityCards()
  renderSelectionsBar()
}

function renderClassCards() {
  refs.classCardGrid.innerHTML = ""
  refs.classCardGrid.className = "ancestry-flip-grid"
  CLASS_DATA.forEach(cls => {
    const card = makeFlipCard({
      value: cls.id,
      selected: wizardState.selections.classId === cls.id,
      makeFront(front) {
        const portraitDiv = document.createElement("div")
        portraitDiv.className = "ancestry-flip__portrait"
        const img = document.createElement("img")
        img.src = cls.image
        img.alt = ""
        img.onerror = () => img.replaceWith(makePlaceholder(cls.name[0]))
        portraitDiv.appendChild(img)
        const badge = document.createElement("span")
        badge.className = "flip-card__badge"
        badge.textContent = `d${cls.hitDie}`
        const titleSpan = document.createElement("span")
        titleSpan.className = "ancestry-flip__title"
        titleSpan.textContent = cls.name
        front.append(portraitDiv, badge, titleSpan)
      },
      makeBack(back) {
        back.innerHTML = `
          <div class="ancestry-flip__back-inner">
            <span class="ancestry-flip__back-name">${SD.escapeHtml(cls.name)}</span>
            <span class="ancestry-flip__back-bonus">${SD.escapeHtml(cls.summary)}</span>
            <span class="ancestry-flip__back-lang">d${cls.hitDie} &bull; ${SD.escapeHtml(cls.weapons.split(",")[0].trim())}</span>
          </div>
        `
      }
    })
      card.addEventListener("click", () => classModal.open(cls, card))
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          classModal.open(cls, card)
        }
      })
    refs.classCardGrid.appendChild(card)
  })
}

  // Class modal (created once, reused) with animated link from source card
  const classModal = (() => {
    const overlay = document.createElement("div")
    overlay.className = "ancestry-modal-overlay"
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.innerHTML = `<div class="ancestry-modal"><div class="ancestry-modal__portrait-col" id="cmPortrait"></div><div class="ancestry-modal__header"><span class="ancestry-modal__name" id="cmName"></span><button type="button" class="ancestry-modal__close" id="cmClose">Close</button></div><div class="ancestry-modal__body"><p class="ancestry-modal__summary" id="cmSummary"></p><p class="ancestry-modal__meta" id="cmMeta"></p><div class="ancestry-modal__traits" id="cmFeatures"></div><div class="ancestry-modal__traits" id="cmTalents"></div></div><button type="button" class="btn btn--ink ancestry-modal__select-btn" id="cmSelect">Select this Class</button></div>`
    document.body.appendChild(overlay)

    let _lastSource = null

    const doClose = async () => {
      // run reverse animation to the last source element if possible
      overlay.dataset.open = "false"
      if (_lastSource) {
        try {
          await animateModalToCard(overlay, '#cmPortrait', _lastSource)
        } catch (e) {}
      }
      _lastSource = null
    }

    overlay.querySelector("#cmClose").addEventListener("click", doClose)
    overlay.addEventListener("click", e => { if (e.target === overlay) doClose() })
    document.addEventListener("keydown", e => { if (e.key === "Escape") doClose() })

    return {
      open(entry, sourceEl) {
        // store a lightweight descriptor (value) so we can find the current
        // card element later even if the DOM was re-rendered
        _lastSource = sourceEl ? { value: entry.id } : null

        const populate = () => {
          overlay.querySelector("#cmName").textContent = entry.name
          overlay.querySelector("#cmSummary").textContent = entry.summary ?? ""
          overlay.querySelector("#cmMeta").innerHTML = `<strong>Hit Die:</strong> d${entry.hitDie} &mdash; <strong>Weapons:</strong> ${SD.escapeHtml(entry.weapons)} &mdash; <strong>Armor:</strong> ${SD.escapeHtml(entry.armor)}`

          const portraitCol = overlay.querySelector("#cmPortrait")
          portraitCol.innerHTML = ""
          if (entry.image) {
            const img = document.createElement("img")
            img.src = entry.image
            img.alt = entry.name
            img.onerror = () => { img.replaceWith(makePlaceholder(entry.name[0])) }
            portraitCol.appendChild(img)
          } else {
            portraitCol.appendChild(makePlaceholder(entry.name[0]))
          }

          const featuresEl = overlay.querySelector("#cmFeatures")
          featuresEl.innerHTML = (entry.features ?? []).map(f => {
            const title = SD.escapeHtml(f.title ?? f.name ?? "Feature")
            const text = SD.escapeHtml(f.text ?? f.summary ?? "")
            return `<div><span class="ancestry-modal__trait-title">${title}</span><p class="ancestry-modal__trait-text">${text}</p></div>`
          }).join("")

          const talentsEl = overlay.querySelector("#cmTalents")
          const talents = (entry.talents ?? [])
          const rows = talents.map(t => {
            const rollRaw = (t && t.roll) ? t.roll : ""
            const roll = SD.escapeHtml(String(rollRaw))
            let effectRaw = ""
            if (typeof t === "string") effectRaw = t
            else if (t && typeof t === "object") {
              if (t.effect !== undefined) effectRaw = (typeof t.effect === 'string') ? t.effect : JSON.stringify(t.effect)
              else effectRaw = JSON.stringify(t)
            } else effectRaw = String(t)
            const effect = SD.escapeHtml(effectRaw)
            return `<tr><td class="talent-label">${roll}</td><td class="talent-effect">${effect}</td></tr>`
          }).join("")

          talentsEl.innerHTML = `
            <table class="class-talents-table" aria-label="Talents">
              <thead><tr><th>Talent</th><th>Result</th></tr></thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          `

          const selectBtn = overlay.querySelector("#cmSelect")
          selectBtn.textContent = wizardState.selections.classId === entry.id ? "Selected ✓" : `Select ${entry.name}`
          selectBtn.onclick = () => {
            wizardState.selections.classId = entry.id
            renderClassCards()
            renderSelectionsBar()
            flyToSummary(selectBtn)
            selectBtn.textContent = "Selected ✓"
          }
        }

        populate()

        if (sourceEl) {
          // make overlay present but invisible so we can compute target rect
          overlay.style.visibility = 'hidden'
          overlay.dataset.open = 'true'
          animateCardToModal(sourceEl, overlay, '#cmPortrait').then(() => {
            overlay.style.visibility = ''
            overlay.dataset.open = 'true'
          }).catch(() => {
            overlay.style.visibility = ''
            overlay.dataset.open = 'true'
          })
        } else {
          overlay.dataset.open = 'true'
        }
      }
    }
  })()

  // Ancestry modal (created once, reused) with animated link from source card
const ancestryModal = (() => {
  const overlay = document.createElement("div")
  overlay.className = "ancestry-modal-overlay"
  overlay.setAttribute("role", "dialog")
  overlay.setAttribute("aria-modal", "true")
  overlay.innerHTML = `<div class="ancestry-modal"><div class="ancestry-modal__portrait-col" id="amPortrait"></div><div class="ancestry-modal__header"><span class="ancestry-modal__name" id="amName"></span><button type="button" class="ancestry-modal__close" id="amClose">Close</button></div><div class="ancestry-modal__body"><p class="ancestry-modal__summary" id="amSummary"></p><p class="ancestry-modal__meta" id="amMeta"></p><div class="ancestry-modal__traits" id="amTraits"></div></div><button type="button" class="btn btn--ink ancestry-modal__select-btn" id="amSelect">Select this Ancestry</button></div>`
  document.body.appendChild(overlay)

  let _lastSource = null

  const doClose = async () => {
    overlay.dataset.open = 'false'
    if (_lastSource) {
      try { await animateModalToCard(overlay, '#amPortrait', _lastSource) } catch (e) {}
    }
    _lastSource = null
  }

  overlay.querySelector('#amClose').addEventListener('click', doClose)
  overlay.addEventListener('click', e => { if (e.target === overlay) doClose() })
  document.addEventListener('keydown', e => { if (e.key === 'Escape') doClose() })

  return {
    open(entry, sourceEl) {
      _lastSource = sourceEl ? { value: entry.name } : null
      overlay.querySelector('#amName').textContent = entry.name
      overlay.querySelector('#amSummary').textContent = entry.summary ?? ''
      overlay.querySelector('#amMeta').innerHTML = `<strong>Language:</strong> ${SD.escapeHtml(entry.extraLanguage)} &mdash; <strong>Bonus:</strong> ${SD.escapeHtml(entry.bonus)}`

      const portraitCol = overlay.querySelector('#amPortrait')
      portraitCol.innerHTML = ''
      if (entry.image) {
        const img = document.createElement('img')
        img.src = entry.image
        img.alt = entry.name
        img.onerror = () => { img.replaceWith(makePlaceholder(entry.name[0])) }
        portraitCol.appendChild(img)
      } else {
        portraitCol.appendChild(makePlaceholder(entry.name[0]))
      }

      const traitsEl = overlay.querySelector('#amTraits')
      traitsEl.innerHTML = (entry.traits ?? []).map(t => `
        <div>
          <span class="ancestry-modal__trait-title">${SD.escapeHtml(t.title)}</span>
          <p class="ancestry-modal__trait-text">${SD.escapeHtml(t.text)}</p>
        </div>
      `).join('')

      const selectBtn = overlay.querySelector('#amSelect')
      selectBtn.textContent = wizardState.selections.ancestry === entry.name ? 'Selected ✓' : `Select ${entry.name}`
      selectBtn.onclick = () => {
        wizardState.selections.ancestry = entry.name
        renderAncestryCards()
        renderSelectionsBar()
        flyToSummary(selectBtn)
        selectBtn.textContent = 'Selected ✓'
      }

      if (sourceEl) {
        overlay.style.visibility = 'hidden'
        overlay.dataset.open = 'true'
        animateCardToModal(sourceEl, overlay, '#amPortrait').then(() => {
          overlay.style.visibility = ''
          overlay.dataset.open = 'true'
        }).catch(() => {
          overlay.style.visibility = ''
          overlay.dataset.open = 'true'
        })
      } else {
        overlay.dataset.open = 'true'
      }
    }
  }
})()

function makePlaceholder(initial) {
  const div = document.createElement("div")
  div.className = "ancestry-flip__portrait-placeholder"
  div.textContent = initial ?? "?"
  return div
}

function renderAncestryCards() {
  refs.ancestryCardGrid.innerHTML = ""
  refs.ancestryCardGrid.className = "ancestry-flip-grid"

  ANCESTRY_OPTIONS.forEach(entry => {
    const isSelected = wizardState.selections.ancestry === entry.name
    const flipWrap = document.createElement("div")
    flipWrap.className = "ancestry-flip"
    flipWrap.setAttribute("data-value", entry.name)
    flipWrap.dataset.selected = isSelected ? "true" : "false"
    flipWrap.setAttribute("role", "button")
    flipWrap.setAttribute("aria-label", entry.name)
    flipWrap.setAttribute("tabindex", "0")

    // Front
    const front = document.createElement("div")
    front.className = "ancestry-flip__front"
    const portraitDiv = document.createElement("div")
    portraitDiv.className = "ancestry-flip__portrait"
    if (entry.image) {
      const img = document.createElement("img")
      img.src = entry.image
      img.alt = ""
      img.onerror = () => img.replaceWith(makePlaceholder(entry.name[0]))
      portraitDiv.appendChild(img)
    } else {
      portraitDiv.appendChild(makePlaceholder(entry.name[0]))
    }
    const titleSpan = document.createElement("span")
    titleSpan.className = "ancestry-flip__title"
    titleSpan.textContent = entry.name
    front.append(portraitDiv, titleSpan)

    // Back
    const back = document.createElement("div")
    back.className = "ancestry-flip__back"
    back.innerHTML = `
      <div class="ancestry-flip__back-inner">
        <span class="ancestry-flip__back-name">${SD.escapeHtml(entry.name)}</span>
        <span class="ancestry-flip__back-bonus">${SD.escapeHtml(entry.bonus)}</span>
        <span class="ancestry-flip__back-lang">${SD.escapeHtml(entry.extraLanguage)}</span>
      </div>
    `

    const inner = document.createElement("div")
    inner.className = "ancestry-flip__inner"

    inner.append(front, back)
    flipWrap.appendChild(inner)

    // Click: open modal detail view (pass source element for animation)
    flipWrap.addEventListener("click", () => ancestryModal.open(entry, flipWrap))
    flipWrap.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        ancestryModal.open(entry, flipWrap)
      }
    })

    refs.ancestryCardGrid.appendChild(flipWrap)
  })
}

function renderBackgroundChips() {
  const container = refs.backgroundChips
  container.innerHTML = ""
  container.className = "bg-chips"
  BACKGROUND_OPTIONS.forEach(bgValue => {
    const name = bgValue.slice(bgValue.indexOf(" ") + 1)
    const chip = document.createElement("button")
    chip.type = "button"
    chip.className = "bg-chip"
    chip.setAttribute("data-value", bgValue)
    chip.dataset.selected = wizardState.selections.background === bgValue ? "true" : "false"
    chip.setAttribute("aria-label", bgValue)
    chip.textContent = name
    chip.addEventListener("click", () => {
      wizardState.selections.background = bgValue
      renderBackgroundChips()
      renderSelectionsBar()
      flyToSummary(chip)
    })
    container.appendChild(chip)
  })
}

function renderAlignmentCards() {
  refs.alignmentCardGrid.innerHTML = ""
  refs.alignmentCardGrid.className = "ancestry-flip-grid"
  const symbols = { Lawful: "⚖", Neutral: "◈", Chaotic: "⚡" }
  const desc = { Lawful: "Order & Justice", Neutral: "Balance & Nature", Chaotic: "Chaos & Ambition" }
  Object.entries(ALIGNMENT_DEITIES).forEach(([alignment, deities]) => {
    const card = makeFlipCard({
      value: alignment,
      selected: wizardState.selections.alignment === alignment,
      makeFront(front) {
        const symbolDiv = document.createElement("div")
        symbolDiv.className = "ancestry-flip__portrait ancestry-flip__portrait--symbol"
        symbolDiv.textContent = symbols[alignment] ?? alignment[0]
        const titleSpan = document.createElement("span")
        titleSpan.className = "ancestry-flip__title"
        titleSpan.textContent = alignment
        front.append(symbolDiv, titleSpan)
      },
      makeBack(back) {
        back.innerHTML = `
          <div class="ancestry-flip__back-inner">
            <span class="ancestry-flip__back-name">${SD.escapeHtml(alignment)}</span>
            <span class="ancestry-flip__back-bonus">${SD.escapeHtml(desc[alignment] ?? "")}</span>
            <span class="ancestry-flip__back-lang">${deities.map(d => SD.escapeHtml(d.replace(/\s*\(.+\)/, ""))).join(", ")}</span>
          </div>
        `
      }
    })
    card.addEventListener("click", () => {
      wizardState.selections.alignment = alignment
      wizardState.selections.deity = deities[0] ?? null
      renderAlignmentCards()
      renderDeityCards()
      renderSelectionsBar()
      flyToSummary(card)
    })
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        wizardState.selections.alignment = alignment
        wizardState.selections.deity = deities[0] ?? null
        renderAlignmentCards()
        renderDeityCards()
        renderSelectionsBar()
      }
    })
    refs.alignmentCardGrid.appendChild(card)
  })
}

function renderDeityCards() {
  refs.deityCardGrid.innerHTML = ""
  refs.deityCardGrid.className = "ancestry-flip-grid"
  const deities = ALIGNMENT_DEITIES[wizardState.selections.alignment] ?? []
  if (!deities.includes(wizardState.selections.deity)) {
    wizardState.selections.deity = deities[0] ?? null
  }
  deities.forEach(deity => {
    const match = deity.match(/^(.+?)\s*\((.+)\)$/)
    const name = match ? match[1].trim() : deity
    const domain = match ? match[2] : ""
    const card = makeFlipCard({
      value: deity,
      selected: wizardState.selections.deity === deity,
      makeFront(front) {
        const symbolDiv = document.createElement("div")
        symbolDiv.className = "ancestry-flip__portrait ancestry-flip__portrait--symbol"
        symbolDiv.textContent = name[0]
        const titleSpan = document.createElement("span")
        titleSpan.className = "ancestry-flip__title"
        titleSpan.textContent = name
        front.append(symbolDiv, titleSpan)
      },
      makeBack(back) {
        back.innerHTML = `
          <div class="ancestry-flip__back-inner">
            <span class="ancestry-flip__back-name">${SD.escapeHtml(name)}</span>
            <span class="ancestry-flip__back-bonus">${SD.escapeHtml(domain)}</span>
            <span class="ancestry-flip__back-lang">${SD.escapeHtml(wizardState.selections.alignment ?? "")}</span>
          </div>
        `
      }
    })
    card.addEventListener("click", () => {
      wizardState.selections.deity = deity
      renderDeityCards()
      renderSelectionsBar()
      flyToSummary(card)
    })
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        wizardState.selections.deity = deity
        renderDeityCards()
        renderSelectionsBar()
      }
    })
    refs.deityCardGrid.appendChild(card)
  })
}

// Tooltip helpers

function attachTooltip(el, html) {
  el.addEventListener("mouseenter", () => {
    tooltipEl.innerHTML = html.trim()
    tooltipEl.style.display = "block"
    tooltipEl.style.visibility = "hidden"
    positionTooltip(el)
    tooltipEl.style.visibility = "visible"
  })
  el.addEventListener("mouseleave", () => {
    tooltipEl.style.display = "none"
  })
}

function positionTooltip(el) {
  const rect = el.getBoundingClientRect()
  const tipH = tooltipEl.offsetHeight
  const tipW = 240
  let top = rect.top - tipH - 8
  if (top < 8) top = rect.bottom + 8
  let left = rect.left + rect.width / 2 - tipW / 2
  left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8))
  tooltipEl.style.top = `${top}px`
  tooltipEl.style.left = `${left}px`
  tooltipEl.style.width = `${tipW}px`
}

// Card factory

function makeCardButton(value, selected) {
  const btn = document.createElement("button")
  btn.type = "button"
  btn.className = "card-option"
  btn.setAttribute("data-value", value)
  btn.dataset.selected = selected ? "true" : "false"
  return btn
}

function makeFlipCard({ value, selected, makeFront, makeBack }) {
  const wrap = document.createElement("div")
  wrap.className = "ancestry-flip"
  wrap.setAttribute("data-value", value)
  wrap.dataset.selected = selected ? "true" : "false"
  wrap.setAttribute("role", "button")
  wrap.setAttribute("aria-label", value)
  wrap.setAttribute("tabindex", "0")
  const inner = document.createElement("div")
  inner.className = "ancestry-flip__inner"
  const front = document.createElement("div")
  front.className = "ancestry-flip__front"
  makeFront(front)
  const back = document.createElement("div")
  back.className = "ancestry-flip__back"
  makeBack(back)
  inner.append(front, back)
  wrap.appendChild(inner)
  return wrap
}

// Animates a clicked card element scaling into the modal portrait area.
function animateCardToModal(sourceEl, overlay, portraitSelector) {
  // Assumes overlay content is already populated but hidden (overlay.dataset.open may be true while overlay.style.visibility='hidden')
  const srcRect = sourceEl.getBoundingClientRect()
  const targetEl = overlay.querySelector(portraitSelector) || overlay.querySelector('.ancestry-modal')
  const targetRect = targetEl.getBoundingClientRect()

  // Create a ghost clone of the source element
  const ghost = sourceEl.cloneNode(true)
  ghost.classList.add('card-ghost')
  Object.assign(ghost.style, {
    left: `${srcRect.left}px`,
    top: `${srcRect.top}px`,
    width: `${srcRect.width}px`,
    height: `${srcRect.height}px`
  })
  document.body.appendChild(ghost)

  // Compute translation / scale to center of target
  const tx = (targetRect.left + targetRect.width / 2) - (srcRect.left + srcRect.width / 2)
  const ty = (targetRect.top + targetRect.height / 2) - (srcRect.top + srcRect.height / 2)
  const sx = targetRect.width / srcRect.width
  const sy = targetRect.height / srcRect.height
  const s = Math.min(sx, sy)

  // Force layout then animate
  ghost.getBoundingClientRect()
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
    ghost.style.opacity = '0.22'
  })

  return new Promise(resolve => {
    ghost.addEventListener('transitionend', () => {
      ghost.remove()
      resolve()
    }, { once: true })
  })
}

function animateModalToCard(overlay, portraitSelector, destElOrDescriptor) {
  const targetEl = overlay.querySelector(portraitSelector) || overlay.querySelector('.ancestry-modal')
  const targetRect = targetEl.getBoundingClientRect()

  // Create ghost from targetEl
  const ghost = targetEl.cloneNode(true)
  ghost.classList.add('card-ghost')
  Object.assign(ghost.style, {
    left: `${targetRect.left}px`,
    top: `${targetRect.top}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
    transform: 'none',
    opacity: '1'
  })
  document.body.appendChild(ghost)

  // Resolve destination element if descriptor provided (handles replaced DOM nodes)
  let dstEl = null
  if (destElOrDescriptor) {
    if (destElOrDescriptor instanceof Element) dstEl = destElOrDescriptor
    else if (typeof destElOrDescriptor === 'object' && destElOrDescriptor.value) {
      try {
        const selector = `[data-value="${CSS.escape(String(destElOrDescriptor.value))}"]`
        dstEl = document.querySelector(selector)
      } catch (e) {
        dstEl = document.querySelector(`[data-value="${destElOrDescriptor.value}"]`)
      }
    } else if (typeof destElOrDescriptor === 'string') {
      dstEl = document.querySelector(`[data-value="${destElOrDescriptor}"]`)
    }
  }

  // If no destination, fade out the ghost quickly
  if (!dstEl) {
    requestAnimationFrame(() => { ghost.style.opacity = '0' })
    return new Promise(resolve => ghost.addEventListener('transitionend', () => { ghost.remove(); resolve() }, { once: true }))
  }

  const dstRect = dstEl.getBoundingClientRect()
  const tx = (dstRect.left + dstRect.width / 2) - (targetRect.left + targetRect.width / 2)
  const ty = (dstRect.top + dstRect.height / 2) - (targetRect.top + targetRect.height / 2)
  const sx = dstRect.width / targetRect.width
  const sy = dstRect.height / targetRect.height
  const s = Math.min(sx, sy)

  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
    // keep a faint ghost visible while shrinking to the card
    ghost.style.opacity = '0.28'
  })

  return new Promise(resolve => ghost.addEventListener('transitionend', () => { ghost.remove(); resolve() }, { once: true }))
}

function flyToSummary(sourceEl) {
  const dstEl = refs.selectionsBar ?? refs.buildSummary
  const srcRect = sourceEl.getBoundingClientRect()
  const dstRect = dstEl.getBoundingClientRect()
  const ghost = document.createElement("div")
  ghost.setAttribute("aria-hidden", "true")
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${srcRect.left}px`,
    top: `${srcRect.top}px`,
    width: `${srcRect.width}px`,
    height: `${srcRect.height}px`,
    background: "var(--ink)",
    borderRadius: "5px",
    opacity: "0.9",
    pointerEvents: "none",
    zIndex: "9999",
    transition: "none"
  })
  document.body.appendChild(ghost)
  ghost.getBoundingClientRect() // force reflow
  const tx = (dstRect.left + dstRect.width / 2) - (srcRect.left + srcRect.width / 2)
  const ty = dstRect.top - srcRect.top
  Object.assign(ghost.style, {
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
    transform: `translate(${tx}px, ${ty}px) scale(0.12)`,
    opacity: "0"
  })
  ghost.addEventListener("transitionend", () => ghost.remove(), { once: true })
}

function renderSelectionsBar() {
  if (!refs.selectionsBar) return
  const { classId, ancestry, background, alignment, deity } = wizardState.selections
  const cls = SD.getClassById(classId)
  const deityName = deity?.match(/^(.+?)\s*\(/)?.[1]?.trim() ?? deity ?? "—"
  const bgName = background ? background.slice(background.indexOf(" ") + 1) : "—"
  const items = [
    { label: "Class", value: cls?.name ?? "—" },
    { label: "Ancestry", value: ancestry ?? "—" },
    { label: "Background", value: bgName },
    { label: "Alignment", value: alignment ?? "—" },
    { label: "Deity", value: deityName }
  ]
  refs.selectionsBar.innerHTML = items.map(({ label, value }) => `
    <div class="selections-chip">
      <span class="selections-chip__label">${SD.escapeHtml(label)}</span>
      <span class="selections-chip__value">${SD.escapeHtml(value)}</span>
    </div>
  `).join("")
}

// Character build

function buildCharacter() {
  const { classId, ancestry, background, alignment, deity } = wizardState.selections
  const cls = SD.getClassById(classId)
  if (!cls) return

  const stats = SD.rollStats()
  const hp = refs.maxHpLevel1.checked ? cls.hitDie : SD.roll(cls.hitDie)

  wizardState.current = {
    id: crypto.randomUUID(),
    name: refs.nameInput.value.trim() || "Unnamed Adventurer",
    classId,
    ancestry: ancestry ?? "Human",
    background: background ?? "1 Urchin",
    alignment: alignment ?? "Neutral",
    deity: deity ?? "-",
    level: 1,
    xp: 0,
    hp,
    maxHp: hp,
    stats,
    notes: [],
    talentHistory: refs.autoTalentRoll.checked
      ? [{ level: 1, result: "Starting feature package" }]
      : []
  }

  appendLog(`Built ${wizardState.current.name} (${cls.name}).`)
  renderSummary()
}

// Type a sequence of names into the name input, ending on the real one.
let nameGen = 0
function rollName() {
  const gen = ++nameGen
  const realName = SD.generateName(wizardState.selections.ancestry, wizardState.selections.classId)
  const sequence = SD.buildNameSequence(wizardState.selections.ancestry, wizardState.selections.classId, realName)

  const input = refs.nameInput
  input.value = ""
  input.focus()

  const TYPE_SPEED_MS = 55
  const DELETE_SPEED_MS = 28
  const WRONG_HOLD_MS = 1400

  const typeInto = (text, speed, done) => {
    let i = 0
    const tick = () => {
      if (gen !== nameGen) return
      input.value = text.slice(0, ++i)
      if (i < text.length) setTimeout(tick, speed)
      else done()
    }
    tick()
  }

  const deleteFrom = (text, done) => {
    let i = text.length
    const tick = () => {
      if (gen !== nameGen) return
      input.value = text.slice(0, --i)
      if (i > 0) setTimeout(tick, DELETE_SPEED_MS)
      else done()
    }
    tick()
  }

  const runName = (idx) => {
    if (gen !== nameGen) return
    if (idx >= sequence.length) return
    const isLast = idx === sequence.length - 1
    typeInto(sequence[idx], TYPE_SPEED_MS, () => {
      if (gen !== nameGen) return
      if (isLast) return
      setTimeout(() => {
        if (gen !== nameGen) return
        deleteFrom(sequence[idx], () => runName(idx + 1))
      }, WRONG_HOLD_MS)
    })
  }

  runName(0)
  appendLog(`Rolled name: ${realName}`)
}

function rerollStats() {
  if (!wizardState.current) {
    appendLog("Build first, then reroll stats.")
    return
  }
  wizardState.current.stats = SD.rollStats()
  appendLog("Stats rerolled.")
  renderSummary()
}

function rerollHp() {
  if (!wizardState.current) {
    appendLog("Build first, then roll HP.")
    return
  }
  const cls = SD.getClassById(wizardState.current.classId)
  if (!cls) return

  const hp = refs.maxHpLevel1.checked && wizardState.current.level === 1
    ? cls.hitDie
    : Math.max(1, SD.roll(cls.hitDie) + SD.statMod(wizardState.current.stats.con))

  wizardState.current.hp = hp
  wizardState.current.maxHp = hp
  appendLog(`HP set to ${hp}.`)
  renderSummary()
}

function rollTalent() {
  if (!wizardState.current) {
    appendLog("Build first, then roll talent.")
    return
  }
  const cls = SD.getClassById(wizardState.current.classId)
  if (!cls) return
  const talent = SD.rollTalent(cls.talents)
  wizardState.current.talentHistory.push({ level: wizardState.current.level, result: talent })
  appendLog(`Talent rolled: ${talent}`)
  renderSummary()
}

function saveCurrent() {
  if (!wizardState.current) {
    appendLog("No character to save yet.")
    return
  }
  wizardState.saved = SD.saveBuild(wizardState.saved, wizardState.current)
  appendLog(`Saved ${wizardState.current.name}.`)
}

function navigateWithCurrent(path) {
  if (!wizardState.current) {
    window.location.href = path
    return
  }
  wizardState.saved = SD.saveBuild(wizardState.saved, wizardState.current)
  window.location.href = `${path}?id=${encodeURIComponent(wizardState.current.id)}`
}

function appendLog(message) {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  wizardState.rollLog.unshift(`${stamp} — ${message}`)
  wizardState.rollLog = wizardState.rollLog.slice(0, 14)
  renderRollLog()
}

function renderRollLog() {
  if (!wizardState.rollLog.length) {
    refs.rollLog.innerHTML = "<p>Roll log is empty.</p>"
    return
  }
  refs.rollLog.innerHTML = wizardState.rollLog.map(item => `<p>${SD.escapeHtml(item)}</p>`).join("")
}

function renderSummary() {
  if (!wizardState.current) {
    refs.buildSummary.innerHTML = "<p>No character built yet.</p>"
    return
  }
  refs.buildSummary.innerHTML = SD.renderCharacterSummary(wizardState.current)
}

function loadSelectionsFromCharacter(character) {
  refs.nameInput.value = character.name ?? ""
  wizardState.selections.classId = character.classId ?? CLASS_DATA[0]?.id ?? null
  wizardState.selections.ancestry = character.ancestry ?? ANCESTRY_OPTIONS[0]?.name ?? null
  wizardState.selections.background = character.background ?? BACKGROUND_OPTIONS[0] ?? null
  wizardState.selections.alignment = character.alignment ?? Object.keys(ALIGNMENT_DEITIES)[0] ?? null
  const deities = ALIGNMENT_DEITIES[wizardState.selections.alignment] ?? []
  wizardState.selections.deity = deities.includes(character.deity) ? character.deity : (deities[0] ?? null)
}
