// TODO: Update with serialNumbers from your own NFC tags: https://googlechrome.github.io/samples/web-nfc/
const tagsColors = {
  "04:a3:bd:69:73:00:00": "crimson",
  "04:d5:14:69:73:00:00": "forestgreen",
  "04:e4:5f:69:73:00:00": "dodgerblue",
  "04:19:50:69:73:00:00": "slategray",
  "04:e7:8a:69:73:00:00": "gold",
  "04:cd:2f:6a:73:00:00": "mediumorchid"
};

let numberOfTimesUserWon = 0;

let serialNumbers = [];

const cards = Array.from(document.getElementById("cards").children);

const LOST_IMAGE_URL =
  "https://cdn.glitch.global/baf30add-d5f2-4269-98d7-2ebe359f2a3e/a26fc0a9-d6cf-4b67-9100-2227eedddb62_loudly-crying-face.png?v=1677901427666";
const WIN_IMAGE_URL =
  "https://cdn.glitch.global/baf30add-d5f2-4269-98d7-2ebe359f2a3e/sd.png?v=1677901841048";

let ndef;

function onreading({ serialNumber }) {
  // User tapped wrong tag.
  if (
    serialNumbers.includes(serialNumber) &&
    serialNumber !== serialNumbers.shift()
  ) {
    lost();
    return;
  }

  // User tapped all tags in the right order.
  if (serialNumbers.length === 0) {
    win();
    return;
  }

  // Show tag color user tapped.
  setColor(serialNumber);
}

button.onclick = async () => {
  // Start NFC scanning and prompt user if needed.
  ndef = new NDEFReader();
  await ndef.scan();

  reset();

  // Create random sequence of tag serial numbers.
  const allSerialNumbers = Object.keys(tagsColors);
  serialNumbers = [];
  while (allSerialNumbers.length) {
    const randomIndex = Math.floor(Math.random() * allSerialNumbers.length);
    serialNumbers = serialNumbers.concat(
      allSerialNumbers.splice(randomIndex, 1)
    );
  }

  // Show colors to memorize.
  for (const serialNumber of serialNumbers) {
    await setColor(serialNumber, true /* transient */);
  }

  // Start listening to tags.
  ndef.onreading = onreading;
};

function reset() {
  ndef.onreading = null;
  cards.forEach(card => {
    card.style.backgroundColor = "";
    card.style.backgroundImage = "";
  });
  button.classList.toggle("hidden", true);
}

function lost() {
  reset();
  cards.forEach(card => {
    card.style.backgroundImage = `url(${LOST_IMAGE_URL})`;
  });
  button.classList.toggle("hidden", false);
  numberOfTimesUserWon = 0;
}

function win() {
  reset();
  cards.forEach(card => {
    card.style.backgroundImage = `url(${WIN_IMAGE_URL})`;
  });
  button.classList.toggle("hidden", false);
  numberOfTimesUserWon++;
}

async function setColor(serialNumber, transient = false) {
  const color = tagsColors[serialNumber];
  const card = cards[Object.values(tagsColors).indexOf(color)];
  card.style.backgroundColor = color;
  if (transient) {
    await new Promise(resolve => {
      setTimeout(_ => {
        resolve();
        card.style.backgroundColor = "";
      }, Math.max(100, 500 - 200 * numberOfTimesUserWon));
    });
  }
}
