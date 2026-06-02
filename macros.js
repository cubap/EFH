const macrosRefs = {
  header: document.getElementById("macroHeader"),
  blocks: document.getElementById("macroBlocks"),
  toViewer: document.getElementById("toViewerBtn"),
  toSheet: document.getElementById("toSheetBtn"),
  toBuilder: document.getElementById("toBuilderBtn")
}

init()

function init() {
  const saved = SD.loadSavedBuilds()
  const queryId = SD.getParam("id")
  const character = queryId ? SD.getCharacterById(saved, queryId) : SD.getCurrentCharacter(saved)

  if (!character) {
    macrosRefs.header.textContent = "No character selected"
    macrosRefs.blocks.innerHTML = "<p>Build or select a character first.</p>"
    return
  }

  SD.setCurrentCharacterId(character.id)
  const cls = SD.getClassById(character.classId)
  macrosRefs.header.textContent = `${character.name} - ${cls?.name ?? character.classId}`

  const macroItems = SD.buildMacroItems(character)
  macrosRefs.blocks.innerHTML = macroItems
    .map((item, index) => `
      <article class="macro">
        <h3>${SD.escapeHtml(item.title)}</h3>
        <textarea readonly id="macro-${index}">${SD.escapeHtml(item.text)}</textarea>
        <button class="btn btn--gold" type="button" data-copy="#macro-${index}">Copy Macro</button>
      </article>
    `)
    .join("")

  macrosRefs.blocks.querySelectorAll("button[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const selector = button.getAttribute("data-copy")
      const textarea = document.querySelector(selector)
      if (!textarea) return
      await navigator.clipboard.writeText(textarea.value)
      button.textContent = "Copied"
      setTimeout(() => {
        button.textContent = "Copy Macro"
      }, 1000)
    })
  })

  macrosRefs.toViewer.addEventListener("click", () => {
    window.location.href = `characters.html?id=${encodeURIComponent(character.id)}`
  })

  macrosRefs.toSheet.addEventListener("click", () => {
    window.location.href = `sheet.html?id=${encodeURIComponent(character.id)}`
  })

  macrosRefs.toBuilder.addEventListener("click", () => {
    window.location.href = `index.html?load=${encodeURIComponent(character.id)}`
  })
}
