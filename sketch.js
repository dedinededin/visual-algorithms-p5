let values = [];
let w = 3;
let states = [];
let osc;
let sliderW;
let sliderTime;
let sleepTime;
let div;

function setup() {

  div = createDiv("Test");

  let button = createButton("Reset");
  button.mousePressed(function() {
    resetSketch();
  });

  // osc set
  osc = new p5.TriOsc();
  osc.start();
  osc.amp(0);

  sliderW = createSlider(3, 50, 10);
  sliderW.input(resetSketch);

  sliderTime = createSlider(1, 500, 10);

  createCanvas(windowWidth - 20, windowHeight - 200);
  resetSketch();
}

function resetSketch() {
  w = sliderW.value();
  values = new Array(floor(width / w));

  h = floor(height / values.length);
  for (let i = 0; i < values.length; i++) {
    values[i] = h*i;
    //values[i] = random(height);
    states[i] = -1;
  }
  shuffle(values, true);
  quickSort(values, 0, values.length - 1);
}

async function quickSort(arr, start, end) {
  if (start >= end) {
    return;
  }
  let index = await partition(arr, start, end);
  states[index] = -1;

  await Promise.all([
    quickSort(arr, start, index - 1),
    quickSort(arr, index + 1, end)
  ]);
}

async function partition(arr, start, end) {
  for (let i = start; i < end; i++) {
    states[i] = 1;
  }

  let pivotValue = arr[end];
  let pivotIndex = start;
  states[pivotIndex] = 0;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      await swap(arr, i, pivotIndex);
      states[pivotIndex] = -1;
      pivotIndex++;
      states[pivotIndex] = 0;
    }
  }
  await swap(arr, pivotIndex, end);

  for (let i = start; i < end; i++) {
    if (i != pivotIndex) {
      states[i] = -1;
    }
  }

  return pivotIndex;
}

function draw() {
  div.html(values.length + " items to sort, wait time is "+sliderTime.value() + " ms.");
  sleepTime = sliderTime.value();
  background(0);

  for (let i = 0; i < values.length; i++) {
    noStroke();
    if (states[i] == 0) {
      fill('#5d54e0');
    } else if (states[i] == 1) {
      fill('#e1cdff');
    } else {
      fill(255);
    }
    rect(i * w, height - values[i], w, values[i]);
  }
}

async function swap(arr, a, b) {
  await sleep(sleepTime);
  playNote(a);
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playNote(note) {
  // osc.freq(midiToFreq(note));
  osc.freq(note * 2);
  //
  // Fade it in
  osc.amp(1, 0.2);
  osc.amp(0, 0.5);

}
