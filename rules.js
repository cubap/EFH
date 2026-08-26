// Rules reference page — renders scraped content from data.json.
// Sections: House Rules (primer, rules, class overview, backgrounds) and
// the four class categories (Warrior, Adept, Mage, Support) with member classes.

const RULES_SECTIONS = [
  {
    id: "primer",
    label: "Shadowdark Primer",
    page: "house-rules/shadowdark-primer"
  },
  {
    id: "house-rules",
    label: "House Rules",
    page: "house-rules/house-rules"
  },
  {
    id: "class-overview",
    label: "Class Overview",
    page: "house-rules/class-overview"
  },
  {
    id: "backgrounds",
    label: "Backgrounds & Skills",
    page: "house-rules/backgrounds-and-skills"
  },
  {
    id: "warrior",
    label: "Warrior",
    classes: ["pit-fighter", "fighter", "paladin", "kinetic"]
  },
  {
    id: "adept",
    label: "Adept",
    classes: ["ranger", "thief", "monk", "soulknife"]
  },
  {
    id: "mage",
    label: "Mage",
    classes: ["sorcerer", "wizard", "mystic", "psion"]
  },
  {
    id: "support",
    label: "Support",
    classes: ["druid", "bard", "priest", "seer"]
  }
]

const rulesRefs = {
  nav: document.getElementById("rulesNav"),
  content: document.getElementById("rulesContent")
}

let rulesData = null

init()

async function init() {
  try {
    const res = await fetch("data.json")
    rulesData = await res.json()
  } catch {
    rulesRefs.content.innerHTML = "<p>Could not load <code>data.json</code>. Run <code>node scrape-rules.js</code> to regenerate it.</p>"
    return
  }
  renderNav()
  selectSection("house-rules")
}

function renderNav() {
  rulesRefs.nav.innerHTML = ""
  RULES_SECTIONS.forEach(section => {
    const group = document.createElement("div")
    group.className = "rules-nav__group"

    const header = document.createElement("button")
    header.type = "button"
    header.className = "rules-nav__section"
    header.textContent = section.label
    header.addEventListener("click", () => selectSection(section.id))
    group.appendChild(header)

    if (section.classes) {
      const list = document.createElement("div")
      list.className = "rules-nav__classes"
      section.classes.forEach(slug => {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = "rules-nav__class"
        btn.textContent = slug.replace(/-/g, " ")
        btn.addEventListener("click", () => selectClass(section.id, slug))
        list.appendChild(btn)
      })
      group.appendChild(list)
    }
    rulesRefs.nav.appendChild(group)
  })
}

function selectSection(sectionId) {
  const section = RULES_SECTIONS.find(s => s.id === sectionId)
  if (!section) return
  markActive(sectionId, null)

  if (section.classes) {
    // Category landing: show all member classes stacked.
    const parts = section.classes.map(slug => renderClassBlock(`${section.id}/${slug}`))
    rulesRefs.content.innerHTML = `<h2>${section.label}</h2>` + parts.join("")
    return
  }

  const page = rulesData.pages[section.page]
  if (!page) {
    rulesRefs.content.innerHTML = `<h2>${section.label}</h2><p>Content not found.</p>`
    return
  }
  rulesRefs.content.innerHTML = `<h2>${section.label}</h2>` + renderBlocks(page.blocks)
}

function selectClass(categoryId, slug) {
  markActive(categoryId, slug)
  const page = rulesData.pages[`${categoryId}/${slug}`]
  if (!page) {
    rulesRefs.content.innerHTML = `<h2>${slug}</h2><p>Content not found.</p>`
    return
  }
  rulesRefs.content.innerHTML = renderClassBlock(`${categoryId}/${slug}`)
}

function markActive(sectionId, classSlug) {
  rulesRefs.nav.querySelectorAll("button").forEach(btn => {
    btn.dataset.active = "false"
  })
  const sectionBtn = [...rulesRefs.nav.querySelectorAll(".rules-nav__section")]
    .find(btn => btn.textContent === RULES_SECTIONS.find(s => s.id === sectionId)?.label)
  if (sectionBtn) sectionBtn.dataset.active = "true"
  if (classSlug) {
    const classBtn = [...rulesRefs.nav.querySelectorAll(".rules-nav__class")]
      .find(btn => btn.textContent === classSlug.replace(/-/g, " "))
    if (classBtn) classBtn.dataset.active = "true"
  }
}

function renderClassBlock(slug) {
  const page = rulesData.pages[slug]
  if (!page) return `<h3>${slug}</h3><p>Content not found.</p>`
  let html = renderBlocks(page.blocks)
  if (page.image) {
    html += `<figure class="rules-figure"><img src="${page.image}" alt="${title} rule page"><figcaption>Original rule page</figcaption></figure>`
  }
  return html
}

// Deduplicate blocks (Google Sites emits list items and paragraphs with the same text).
function renderBlocks(blocks) {
  const seen = new Set()
  const out = []
  for (const block of blocks ?? []) {
    const key = block.text
    if (seen.has(key)) continue
    seen.add(key)
    const text = SD.escapeHtml(block.text)
    if (block.type === "heading") {
      const level = Math.min(4, Math.max(3, block.level ?? 3))
      out.push(`<h${level}>${text}</h${level}>`)
    } else if (block.type === "listitem") {
      out.push(`<li>${text}</li>`)
    } else {
      out.push(`<p>${text}</p>`)
    }
  }
  // Wrap consecutive <li> in <ul>
  return out
    .reduce((acc, item) => {
      if (item.startsWith("<li>")) {
        if (!acc.openList) {
          acc.openList = true
          acc.html += "<ul>"
        }
      } else if (acc.openList) {
        acc.html += "</ul>"
        acc.openList = false
      }
      acc.html += item
      return acc
    }, { html: "", openList: false })
    .html
}
