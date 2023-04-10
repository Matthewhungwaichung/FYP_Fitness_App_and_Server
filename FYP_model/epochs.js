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

  const epochValues = Array.from({ length: 20 }, (_, i) => i + 1);
  for (const epochValue of epochValues) {
    await trainModelForEpochs(epochValue);
  }
});

