import { setData } from "./Firebase";


/* function to clean data tree removing boolean values from it */
function cleanData(data) {
  // Make an empty object
  const obj = {};

  // Iterate over object
  // If key is not username
  for (const key in data)
    if (!(typeof data[key] === "string"))
      obj[key] = Array.isArray(data[key]) ? data[key][0] : cleanData(data[key]);

  // return object
  return obj;
}


/* Disable web reload */
function disableReload(func) {
  window.onbeforeunload = () => {
    return "Reloading or Leaving page will close the session";
  };
  window.onunload = () => {
    // Execute arrow function
    func();
    // Enable reload
    window.onbeforeunload = null;
    window.onunload = null;
  };
}


/* Enable web reload */
function enableReload(func) {
  // Execute arrow function
  func();
  // Enable reload
  window.onbeforeunload = null;
  window.onunload = null;
}


/* Function to generate key of random length */
function generateKey() {
  const length = Math.round(Math.random()*16)+10;

  var key = "";
  for(let j=0; j<length; j++)
    key += String.fromCharCode(Math.round(Math.random()*93+33));

  return key;
}


/* Check if session already is going, if not then start new one */
function isSessionActive(status, path, value) {
  if (status === "offline" || status === undefined)
    setData(`${path}`, value);
  else if (status !== Object.values(value)[0])
    return true;

  return false;
}


/* Function to set height of inputs */
function setLabelHeight(name) {
  // Arrow function to change height
  const changeHeight = (ele) => {
    ele.style.height = ele.nextSibling.offsetHeight + 14 + "px";
    ele.style.marginTop = ele.nextSibling.offsetHeight + 6 + "px";
  };

  // Get input list
  const elements = name
    ? [document.querySelector(`input[name=${name}]`)]
    : document.getElementsByClassName("input-model");
  for (let i = 0; i < elements.length; i++) changeHeight(elements[i]);
}


/* Function & seperator for path generation */
var sep = " ⇒ ";
const getPath = (path, label, SEP=sep) => {
  return `${path ? path + SEP + label : label}`
};


export {
  generateKey,
  disableReload,
  enableReload,
  cleanData,
  sep,
  getPath,
  setLabelHeight,
  isSessionActive
};
