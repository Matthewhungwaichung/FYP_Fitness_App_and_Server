const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');
const fs = require('fs');

fs.readFile('data.json', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  // Parse the JSON data
  const json_data = JSON.parse(data);
  
  // Use the JSON data
  const inputDim = 3;  // Number of input features
  const numClasses = 3;  // Number of output classes (multi-class classification)

  // Define the architecture of the model
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [inputDim],
    units: 16,
    activation: 'relu'
  }));
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax'  // Use softmax activation for multi-class classification
  }));

  // Compile the model with an optimizer and loss function
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',  // Use categorical cross-entropy loss for multi-class classification
    metrics: ['accuracy']
  });

  // Define your own input and output data
  const trainIn = json_data.ti
  const trainOut = json_data.to
  const testIn = json_data.tei
  const TestOut = json_data.teo
  const input = tf.tensor2d(trainIn);
  const output = tf.tensor2d(trainOut);

  // Define an async function to train the model for a given number of epochs
  async function trainModelForEpochs(epochs) {
    await model.fit(input, output, {
      batchSize: 32,
      epochs: 1
    });
    console.log(`Training complete for ${epochs} epochs!`);
    const evalInput = tf.tensor2d(testIn);
    const evalOutput = tf.tensor2d(TestOut);
    const evalResult = model.evaluate(evalInput, evalOutput);
    console.log(`Accuracy for ${epochs} epochs: ${evalResult[1]}`);
    await model.save(`file://./my_model_${epochs}`);
    console.log(`Model for ${epochs} epochs saved!`);
  }

  // Loop over the epoch values and train the model for each value
  const epochValues = Array.from({ length: 20 }, (_, i) => i + 1);
  for (const epochValue of epochValues) {
    await trainModelForEpochs(epochValue);
  }
});

