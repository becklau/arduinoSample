# arduinoSample

ArduinoSample is code that connects an arduino to a p5.js vscode environment.

The sampleArd.ide file must be pushed to the board just once! It will set up the analog and digital pins to recieve inputs from the board, and will send that data to p5.js in a "csv" style format, where the first 6 values are pins A0-A5, and the next 12 pins will be D2-D13.

In the sketch.js file, just add the pins you are using to the pinsUsed array in the format of apin0, apin1, exc. and dpin2, dpin3, exc.

This will set only those values to an int/float, and the pins not in use will be set to null. This accounts for charge leakage for other pins.
