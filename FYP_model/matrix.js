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

  // Train the model on the training data
  await model.fit(input, output, {
    batchSize: 32,
    epochs: 15
  });

  // Evaluate the model on the test set
  const evalInput = tf.tensor2d(testIn);
  const evalOutput = tf.tensor2d(TestOut);
  const evalResult = model.evaluate(evalInput, evalOutput);
  console.log(`Test accuracy: ${evalResult[1]}`);

  // Predict the classes for the test set
  const predictions = model.predict(evalInput);
  const predictedClasses = predictions.argMax(-1).dataSync();
  const trueClasses = evalOutput.argMax(-1).dataSync();

  // Compute the confusion matrix
  const confusionMatrix = Array.from({ length: numClasses }, () => Array.from({ length: numClasses }, () => 0));
  for (let i = 0; i < trueClasses.length; i++) {
    confusionMatrix[trueClasses[i]][predictedClasses[i]]++;
  }

  // Print the confusion matrix
  console.log('Confusion matrix:');
  console.table(confusionMatrix);

  // Save the model
  await model.save('file://./my_model');
  console.log('Model saved!');
});