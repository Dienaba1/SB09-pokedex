/* 
 * For each element with the attribute "to-highlight", we create a code block that contains the content of the element
 * and add it next to the element. We also add a button to copy the content of the code block to the clipboard.
 */
document.querySelectorAll("[to-highlight]").forEach((el) => {

  // Create the code block
  const code = document.createElement("div");
  code.style.position = "relative";
  code.classList.add("column", "is-full", "container");
  const pre = document.createElement("pre");
  const codeEl = document.createElement("code");
  codeEl.classList.add("language-html");
  el.removeAttribute("to-highlight");
  el.classList.add("my-6");

  // Get the content of the element and replace the < and > with their HTML entities
  const content =  el.outerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Set the content of the code block
  codeEl.innerHTML = content;

  // Add everything to the DOM
  pre.appendChild(codeEl);
  code.appendChild(pre);
  el.insertAdjacentElement("afterend", code);

  // Create the copy button
  const copyBtn = document.createElement("button");
  copyBtn.classList.add("button", "is-small", "is-light", "is-outlined", "is-rounded", "is-pulled-right");
  copyBtn.style.position = "absolute";
  copyBtn.style.top = "20px";
  copyBtn.style.right = "20px";
  copyBtn.innerHTML = "Copy";

  code.append(copyBtn);

  // When the button is clicked, copy the content of the code block to the clipboard
  // Briefly change the text of the button to "Copied!" to indicate that the content has been copied
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(el.outerHTML);

    copyBtn.innerHTML = "Copied!";

    setTimeout(() => {
      copyBtn.innerHTML = "Copy";
    }, 1000);
  });
});

// After adding the code blocks, highlight the code with the library "highlight.js"
hljs.highlightAll();
