let port, reader, writer;
let pinsUsed = ["apin0", "dpin2", "dpin8"]; 
let sensorData = {}; // Object to store sensor readings
let connectButton;
let isConnected = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  connectButton = createButton("Connect to Arduino");
  connectButton.position(20, 20);
  connectButton.mousePressed(connectToArduino);
}

// Connect to Arduino and set up serial communication
async function connectToArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const textDecoder = new TextDecoderStream();
    const textEncoder = new TextEncoderStream();
    port.readable.pipeTo(textDecoder.writable);
    textEncoder.readable.pipeTo(port.writable);

    reader = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();
    writer = textEncoder.writable.getWriter();

    console.log("Connected to Arduino!");
    connectButton.remove();
    isConnected = true; // Set flag to true when connected
    runSerial();
  } catch (error) {
    console.error("Failed to open serial port:", error);
  }
}

// Read serial data and process sensor values
async function runSerial() {
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      processSerialData(value);
    }
  } catch (error) {
    console.error("Error reading serial data:", error);
  }
}

// Parse and store sensor values
function processSerialData(data) {
  let values = data.split(",").map(parseFloat);

  if (values.length >= 18) {
    sensorData = {}; // Reset object

    // set analog pins to either the value or empty string
    for (let i = 0; i <= 5; i++) {
      let pinName = `apin${i}`;
      if (pinsUsed.includes(pinName)) {
        sensorData[`analog${i}`] = values[i];
      } else {
        sensorData[`analog${i}`] = null;
      }
    }
    // set digital pins to either the value or empty string
    for (let i = 2; i <= 13; i++) {
      let pinName = `dpin${i}`;
      let index = i + 4; //start from index 6 in values array
      if (pinsUsed.includes(pinName)) {
        sensorData[`digital${i}`] = values[index];
      } else {
        sensorData[`digital${i}`] = null;
      }
    }
  }
  console.log(sensorData[`analog0`], sensorData[`digital2`], sensorData[`digital8`]);
}


// Retrieve sensor data
function getSensorData(type) {
  return sensorData[type] ?? 0; // Return 0 if not available
}

// Draw sensor data on the canvas
function draw() {
  if (!isConnected) {
    return; // Only draw if connected to Arduino
  }
  
  background(220);
  textSize(14);

  let yOffset = 100;
  for (let i = 0; i <= 5; i++) {
    text(`A${i}: ${getSensorData(`analog${i}`)}`, 20, yOffset);
    yOffset += 30;
  }

  for (let i = 2; i <= 13; i++) {
    text(`D${i}: ${getSensorData(`digital${i}`)}`, 20, yOffset);
    yOffset += 30;
  }
}

// Class to handle line breaks in serial data
class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}
