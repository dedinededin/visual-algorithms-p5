let values = [];
let w = 3;
let states = [];
let osc = new p5.TriOsc();


function setup() {
  // Start silent
  osc.start();
  osc.amp(0);

  createCanvas(windowWidth-20, windowHeight-200);
  values = new Array(floor(width / w));
  h =  floor(height / values.length);
  for (let i = 0; i < values.length; i++) {
    // values[i] = h*i;
    values[i] = random(height);
    states[i] = -1;
  }
  // shuffle(values, true);
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
  await sleep(0.25);
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
  osc.freq(note*2.5);
  //
  // Fade it in
  osc.amp(1,0.01);
  osc.amp(0,2);

}
