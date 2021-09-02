function gup( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec(window.location.href);
  if (results == null) {
    return null;
  } else {
    return results[1].replace(/%20/g, ' ');
  }
}

function changeFavicon(src) {
  var faviconElement = document.querySelector("link#dynamic-favicon");
  if (faviconElement) {
    if (faviconElement.href !== src) {
      faviconElement.href = src;
    }
  } else {
    faviconElement = document.createElement("link");
    faviconElement.id = "dynamic-favicon";
    faviconElement.rel = "icon";
    faviconElement.href = src;
    document.head.appendChild(faviconElement);
  }
}

function updateLook() {
  var title = gup("title");
  if (title) {
    document.title = decodeURIComponent(title);
  }
  var faviconurl = gup("faviconurl");
  if (faviconurl) {
    changeFavicon(faviconurl);
  }
}

document.body.onload = updateLook;
