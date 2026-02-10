//basic_javascript.js

//return current counter
function getCounterValue() {
  const el = document.getElementById("counter");
  const n = parseInt(el?.textContent ?? "0", 10);
  return Number.isFinite(n) ? n : 0;
}

//helper function for incrementing and decrementing
function setCounterValue(value) {
  const el = document.getElementById("counter");
  if (el) el.textContent = String(value);
}

//increment counter
function tickUp() {
  const current = getCounterValue();
  setCounterValue(current + 1);
}

//decrement counter
function tickDown() {
  const current = getCounterValue();
  setCounterValue(current - 1);
}

//for loop counts to counter
function runForLoop() {
  const max = getCounterValue();
  const out = [];

  for (let i = 0; i <= max; i++) out.push(i);

  const target = document.getElementById("forLoopResult");
  if (target) target.textContent = out.join(" ");
}

//for loop counts odd number up to counter
function showOddNumbers() {
  const max = getCounterValue();
  const out = [];

  for (let i = 1; i <= max; i += 2) out.push(i);

  const target = document.getElementById("oddNumberResult");
  if (target) target.textContent = out.join(" ");
}

//Add multiples of 5 of the counter to an array and print to console
function addMultiplesToArray() {
  const max = getCounterValue();
  const multiples = [];

  // descending order
  for (let i = max; i >= 5; i--) {
    if (i % 5 === 0) multiples.push(i);
  }

  // Print array to console
  console.log(multiples);
}

//print the car values to console
function printCarObject() {
  const typeEl = document.getElementById("carType");
  const mpgEl = document.getElementById("carMPG");
  const colorEl = document.getElementById("carColor");

  const car = {
    cType: typeEl ? typeEl.value : "",
    cMPG: mpgEl ? mpgEl.value : "",
    cColor: colorEl ? colorEl.value : ""
  };

  
  console.log(car);
}

//fill form with preset car values
function loadCar(which) {
  let src;

  switch (which) {
    case 1: src = carObject1; break;
    case 2: src = carObject2; break;
    case 3: src = carObject3; break;
    default: src = null;
  }

  if (!src) return;

  const typeEl = document.getElementById("carType");
  const mpgEl = document.getElementById("carMPG");
  const colorEl = document.getElementById("carColor");

  if (typeEl) typeEl.value = src.cType ?? "";
  if (mpgEl) mpgEl.value = src.cMPG ?? "";
  if (colorEl) colorEl.value = src.cColor ?? "";
}

//change style color of text
function changeColor(which) {
  const p = document.getElementById("styleParagraph");
  if (!p) return;

  switch (which) {
    case 1: p.style.color = "red"; break;
    case 2: p.style.color = "green"; break;
    case 3: p.style.color = "blue"; break;
    default: break;
  }
}