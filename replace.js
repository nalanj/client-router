/**
 * replace is a valid handler for routing, and bundles up the functionality of
 * replacing the headers and content of a page
 *
 * @param {string} url - the url to replace the current url with
 */
export async function replace(url) {
  return loadDocument(url);
}

async function loadDocument(href) {
  const resp = await fetch(href);

  await replaceDocument(resp);

  return resp.url;
}

/**
 * Replace a document with a response's content
 *
 * @param {Response} resp - fetch response
 */
export async function replaceDocument(resp) {
  const html = await resp.text();
  const parser = new DOMParser();
  const newDoc = parser.parseFromString(html, "text/html");

  mergeBody(newDoc);
  mergeHeaders(newDoc);
}

function mergeBody(newDoc) {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  for (const element of Array.from(newDoc.body.childNodes)) {
    document.body.appendChild(element);
  }
}

function mergeHeaders(newDoc) {
  const newChildren = Array.from(newDoc.head.children);

  for (const element of Array.from(document.head.children)) {
    if (element.tagName === "TITLE") {
      continue;
    }

    const sticky = element.hasAttribute("data-client-router-sticky");

    const matches = newChildren.filter((newChild) =>
      newChild.isEqualNode(element)
    );

    // if it's not in the new head, remove it from head
    if (matches.length === 0 && !sticky) {
      document.head.removeChild(element);
    } else {
      matches.forEach((match) => {
        try {
          newDoc.head.removeChild(match);
        } catch {
          // if no match, ignore
        }
      });
    }
  }

  for (const element of newDoc.head.children) {
    if (element.tagName === "TITLE") {
      document.title = newDoc.title;
    } else {
      document.head.appendChild(element);
    }
  }
}
