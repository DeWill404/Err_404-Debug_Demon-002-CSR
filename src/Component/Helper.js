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

/* function to clean data tree removing boolean values from it */
function cleanData(data) {
  // Make an empty object
  const obj = {};

  // Iterate over object
  // If key is not username
  for (const key in data)
    if (!(key === "username" && typeof data[key] === "string"))
      obj[key] = Array.isArray(data[key]) ? data[key][0] : cleanData(data[key]);

  // return object
  return obj;
}

/* Function & seperator for path generation */
var sep = " ⇒ ";
const getPath = (path, label) => {
  return `${path ? path + sep + label : label}`;
};

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

export { disableReload, enableReload, cleanData, sep, getPath, setLabelHeight };
