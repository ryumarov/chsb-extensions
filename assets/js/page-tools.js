(() => {
  "use strict";

  const copySource = document.getElementById("copy-source");
  const copyButton = document.getElementById("copy-button");
  const status = document.getElementById("copy-status");

  if (!copySource || !copyButton || !status) return;

  const defaultTitle = "HTML ichidagi matnni nusxalash";
  let resetFeedbackTimer;

  const announce = (message, isError = false) => {
    status.textContent = message;
    copyButton.title = message;
    copyButton.setAttribute("aria-label", message);
    copyButton.dataset.copyState = isError ? "error" : "success";

    window.clearTimeout(resetFeedbackTimer);
    resetFeedbackTimer = window.setTimeout(() => {
      copyButton.title = defaultTitle;
      copyButton.setAttribute("aria-label", "Copy");
      delete copyButton.dataset.copyState;
      status.textContent = "";
    }, 1800);
  };

  const fallbackCopy = (text) => {
    const temporaryField = document.createElement("textarea");
    temporaryField.value = text;
    temporaryField.setAttribute("readonly", "");
    temporaryField.style.position = "fixed";
    temporaryField.style.left = "-9999px";
    temporaryField.style.top = "0";
    temporaryField.style.opacity = "0";
    document.body.appendChild(temporaryField);
    temporaryField.select();
    temporaryField.setSelectionRange(0, temporaryField.value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      temporaryField.remove();
    }
    return copied;
  };

  copyButton.addEventListener("click", async () => {
    const text = copySource.textContent.trim();

    if (!text || text === "COPY_TEXTNI_SHU_YERGA_QOYING") {
      announce("Avval index.html ichidagi copy-source matnini kiriting.", true);
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (clipboardError) {
          if (!fallbackCopy(text)) throw clipboardError;
        }
      } else if (!fallbackCopy(text)) {
        throw new Error("Clipboard API mavjud emas");
      }

      announce("Matn clipboard'ga nusxalandi.");
    } catch (error) {
      announce("Nusxalash amalga oshmadi. Brauzer ruxsatini tekshiring.", true);
    }
  });
})();
