const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');
const fs = require('fs');

fs.readFile('data.json', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const json_data = JSON.parse(data);
  
  const inputDim = 3;  
  const numClasses = 3;  

  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [inputDim],
    units: 16,
    activation: 'relu'
  }));
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax' 
  }));

  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',  
    metrics: ['accuracy']
  });

  const trainIn = json_data.ti
  const trainOut = json_data.to
  const testIn = json_data.tei
  const TestOut = json_data.teo
  const input = tf.tensor2d(trainIn);
  const output = tf.tensor2d(trainOut);

  await model.fit(input, output, {
    batchSize: 32,
    epochs: 15
  });

  const evalInput = tf.tensor2d(testIn);
  const evalOutput = tf.tensor2d(TestOut);
  const evalResult = model.evaluate(evalInput, evalOutput);
  console.log(`Test accuracy: ${evalResult[1]}`);

  const predictions = model.predict(evalInput);
  const predictedClasses = predictions.argMax(-1).dataSync();
  const trueClasses = evalOutput.argMax(-1).dataSync();

  const confusionMatrix = Array.from({ length: numClasses }, () => Array.from({ length: numClasses }, () => 0));
  for (let i = 0; i < trueClasses.length; i++) {
    confusionMatrix[trueClasses[i]][predictedClasses[i]]++;
  }

  console.log('Confusion matrix:');
  console.table(confusionMatrix);

  await model.save('file://./my_model');
  console.log('Model saved!');
});