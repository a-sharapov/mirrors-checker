"use strict";

const contentWrapper = document.querySelector("#content-wrapper");
const target = "favicon.ico";
const mirrors = [
  "https://www.example.com/",
  "https://www.example.net/",
  "https://www.example.biz/",
];

const checkMirrors = (mirrors) => {
  return Promise.all(mirrors.map((mirror) => checkIsAvailableDomain(mirror)));
};

const checkIsAvailableDomain = (domain) => {
  const base = new URL(domain).origin;

  return new Promise((resolve, _) => {
    const img = new Image();
    img.onload = () => resolve({ result: true, base });
    img.onerror = () => resolve({ result: false, base });
    img.src = `${base}/${target}`;
  });
};

const getFirstAvaibleFromMirrors = (mirrors) => {
  return checkMirrors(mirrors).then((results) => {
    return (
      results.filter(
        (result) => result.result === true && result.base !== undefined
      )[0]?.base || null
    );
  });
};

const redirectToAvaibleMirror = (mirror) => {
  const { location } = window;

  window.location.href = `${mirror}${location.pathname}${location.search}${location.hash}`;
};

getFirstAvaibleFromMirrors(mirrors).then((available) => {
  if (available) {
    redirectToAvaibleMirror(available);
  } else {
    contentWrapper.innerHTML =
      "<h1>⚠️</h1><p>Unfortunately, none of the mirrors are available at the moment.</p><hr /><p>Maybe the service is blocked by your ISP.</p>";
  }
});
