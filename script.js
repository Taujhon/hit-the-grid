const IMAGE_GRID = document.getElementById('image-grid');
const IMAGE = document.getElementById('image');
const GRID = document.getElementById('grid');

const ROWS = document.getElementById('rows');
const COLUMNS = document.getElementById('columns');
const GRID_SIZE = document.getElementById('grid-size');
const THICKNESS = document.getElementById('thickness');

const IN_IMG = document.getElementById('image-load');
const IN_ROW = document.getElementById('row-range');
const IN_COL = document.getElementById('column-range');
const IN_GSZ = document.getElementById('grid-size-range');
const IN_THK = document.getElementById('thickness-range');
const IN_CLR = document.getElementById('color');

const BTN_UPLOAD = document.getElementById('upload');
const BTN_EXPAND = document.getElementById('expand');
const BTN_CENTER = document.getElementById('center');
const BTN_SOURCE = document.getElementById('source');

const UPDATE_ONTYPE = [
  ROWS,
  COLUMNS,
  GRID_SIZE,
  THICKNESS
];

const UPDATE_ONINPUT = [
  IN_ROW,
  IN_COL,
  IN_GSZ,
  IN_THK,
  IN_CLR
];

let rows = 8;
let columns = 6;
let gridSize = 64;
let thickness = 2;
let color = '#003555';
let titleHidden = false;

window.onload = () => {
  ROWS.value = rows;
  COLUMNS.value = columns;
  GRID_SIZE.value = gridSize;
  THICKNESS.value = thickness;

  IN_ROW.value = rows;
  IN_COL.value = columns;
  IN_GSZ.value = gridSize;
  IN_THK.value = thickness;
  IN_CLR.value = color;

  UPDATE_ONTYPE.forEach(el => el.blur());

  drawGrid();
  centerGrid();
}

// input element handlers

ROWS.onkeyup = () => {
  rows = ROWS.value;
  IN_ROW.value = rows;
}

COLUMNS.onkeyup = () => {
  columns = COLUMNS.value;
  IN_COL.value = columns;
}

GRID_SIZE.onkeyup = () => {
  gridSize = GRID_SIZE.value;
  IN_GSZ.value = gridSize;
}

THICKNESS.onkeyup = () => {
  thickness = THICKNESS.value;
  IN_THK.value = thickness;
}

IN_ROW.oninput = () => {
  rows = IN_ROW.value;
  ROWS.value = rows;
}

IN_COL.oninput = () => {
  columns = IN_COL.value;
  COLUMNS.value = columns;
}

IN_GSZ.oninput = () => {
  gridSize = IN_GSZ.value;
  GRID_SIZE.value = gridSize;
}

IN_THK.oninput = () => {
  thickness = IN_THK.value;
  THICKNESS.value = thickness;
}

IN_CLR.oninput = () => {
  color = IN_CLR.value;
}

UPDATE_ONTYPE.forEach(input =>
    input.addEventListener('keyup', drawGrid));

UPDATE_ONINPUT.forEach(input =>
    input.addEventListener('input', drawGrid));

// button handlers

BTN_UPLOAD.onclick = () => IN_IMG.click();

IN_IMG.oninput = () => {
  if (FileReader && IN_IMG.files && IN_IMG.files.length) {
    const fr = new FileReader();
    fr.onload = () => IMAGE.src = fr.result;
    fr.readAsDataURL(IN_IMG.files[0]);
  }
}

BTN_EXPAND.onclick = () => {
  const TITLE = document.getElementById('title');

  if (!titleHidden) {
    TITLE.style.display = 'none';
    IMAGE_GRID.style.height = '100vh';
    IMAGE_GRID.style.width = '100vw';
    BTN_EXPAND.textContent = 'show title';

    gridSize *=
        (window.innerWidth > window.innerHeight)
        ? 100 / 80 : 100 / 90;

    titleHidden = true;
  } else {
    TITLE.style.display = 'block';
    IMAGE_GRID.style.height = '80vh';
    IMAGE_GRID.style.width = '90vw';
    BTN_EXPAND.textContent = 'maximize';

    gridSize *=
        (window.innerWidth > window.innerHeight)
        ? 80 / 100 : 90 / 100;

    GRID_SIZE.value = gridSize;
    IN_GSZ.value = gridSize;

    titleHidden = false;
  }

  drawGrid();
}

BTN_CENTER.onclick = center;

BTN_SOURCE.onclick = () =>
    window.open('https://github.com/taujhon/hit-the-grid', '_blank');

// draw grid

function drawGrid() {
  const C = GRID.getContext('2d');

  GRID.height = rows * gridSize;
  GRID.width = columns * gridSize;

  C.clearRect(0, 0, GRID.width, GRID.height);
  C.lineWidth = thickness;
  C.strokeStyle = color;

  for (let i = 0; i <= columns; i++) {
    C.moveTo(i * gridSize, 0);
    C.lineTo(i * gridSize, GRID.height);
    C.stroke();
  }

  for (let i = 0; i <= rows; i++) {
    C.moveTo(0, i * gridSize);
    C.lineTo(GRID.width, i * gridSize);
    C.stroke();
  }
}

function centerGrid() {
  const imageGridBound = IMAGE_GRID.getBoundingClientRect();
  GRID.style.left = '50%';
  GRID.style.top = '50%';
}

// handle grid dragging

const mouse = { xi: 0, yi: 0, xf: 0, yf: 0 }
const touch = { xi: 0, yi: 0, xf: 0, yf: 0 }
const grid = { offsetX: 0, offsetY: 0 };

IMAGE_GRID.onmousedown = getInitialPos;
IMAGE_GRID.onmousemove = getPos;
IMAGE_GRID.onmouseup = getPos;

function getInitialPos(e) {
  mouse.xi = e.offsetX;
  mouse.yi = e.offsetY;
 
  grid.offsetX = GRID.offsetLeft;
  grid.offsetY = GRID.offsetTop;
}

function getPos(e) {
  if (e.buttons != 1) return;

  mouse.xf = e.offsetX;
  mouse.yf = e.offsetY;

  GRID.style.left = `${ grid.offsetX + mouse.xf - mouse.xi }px`;
  GRID.style.top = `${ grid.offsetY + mouse.yf - mouse.yi }px`;
}

IMAGE_GRID.ontouchstart = getInitialPosTouch;
IMAGE_GRID.ontouchmove = getPosTouch;
// IMAGE_GRID.ontouchend = getPosTouch;

function getInitialPosTouch(e) {
  const touchObj = e.touches[e.touches.length - 1];

  touch.xi = touchObj.pageX - e.target.offsetLeft;
  touch.yi = touchObj.pageY - e.target.offsetTop;

  grid.offsetX = GRID.offsetLeft;
  grid.offsetY = GRID.offsetTop;
}

function getPosTouch(e) {
  const touchObj = e.touches[e.touches.length - 1];

  touch.xf = touchObj.pageX - e.target.offsetLeft;
  touch.yf = touchObj.pageY - e.target.offsetTop;

  GRID.style.left = `${ grid.offsetX + touch.xf - touch.xi }px`;
  GRID.style.top = `${ grid.offsetY + touch.yf - touch.yi }px`;
}
