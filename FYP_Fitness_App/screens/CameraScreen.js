import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, LogBox, Platform, requireNativeComponent, StyleSheet, Text, View, Alert, SafeAreaView  } from 'react-native';
import * as poseDetection  from '@tensorflow-models/pose-detection'; //second try movenet
import * as poseNet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs' 
import Canvas from 'react-native-canvas';
import * as drawing from '../utilities/drawingUtilities'
import * as shoulderPress from '../motion/shoulderPress'
import * as squat from '../motion/squat'
import * as bicepsCurl from '../motion/bicepsCurl'
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TensorCamera = cameraWithTensors(Camera);
const {width, height} = Dimensions.get('window');
const startArea = 0.08;
let textureDims;
if (Platform.OS === 'ios') {
textureDims = {
  height: 1920,
  width: 1080,
};
} else {
textureDims = {
  height: 1200,
  width: 1600,
};
}
const ratio = textureDims.height/textureDims.width
const verticalPadding = (height - ratio * width) / 2

LogBox.ignoreAllLogs(true);

export default function CameraScreen({ route, navigation }) {
  const[numberOfSet, setNumberOfSet] = useState(0);
  const[numberOfRepetition, setNumberOfRepetition] = useState(0);
  const[duration, setDuration] = useState(0);
  const[progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const {workoutName} = route.params;

  async function moveNetCameraHandle(images) {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const { sound } = await Audio.Sound.createAsync( require('../assets/warningSound.mp3'));
    
    let countingElement = {numberOfSetInFunction:0, numberOfRepetitionInFunction:0, lastPositionInFunction: "rest", lastStart: true, startTimeInFunction:  Date.now(), totalCount:0, correctCount:0}
    let escapeElement = {lastShownTime: Date.now()};
    let soundPlayElement = {isPlaying:false};

    let resultOutput = {numberOfSet:0, data:[]};
    let eachData = {numberOfRep:0, duration:0, data:[], correctPersentage:0};

    const loop = async () => {
      tf.engine().startScope()
      const nextImageTensor = images.next().value;
      try{
        const poses = await detector.estimatePoses(nextImageTensor);
        if(poses[0]){
          const keypoints = poses[0].keypoints;
          let result;
          switch(workoutName){
            case "shoulderPress":
              result = shoulderPress.extractDetails(keypoints, width, startArea);
              countingLogic(keypoints, result, countingElement, resultOutput, eachData, sound, soundPlayElement);
              break;
            case "squat":
              result = squat.extractDetails(keypoints, width, startArea);
              countingLogic(keypoints, result, countingElement, resultOutput, eachData, sound, soundPlayElement, true);
              break;
            case "bicepsCurl":
              result = bicepsCurl.extractDetails(keypoints, width, startArea);
              countingLogic(keypoints, result, countingElement, resultOutput, eachData, sound, soundPlayElement);
              break;
          }
          escapeElement = {lastShownTime: Date.now()}
        }
        
        else{
          if(Date.now()-escapeElement.lastShownTime>1500){
            sendResult(resultOutput)
            return
          }
        }
        tf.dispose(nextImageTensor);
        tf.engine().endScope()
        requestAnimationFrame(loop);
      }
      catch(error){
        console.log(error)
      }
    }
    loop();
  }

  function drawCanvas(keypoints,expectedPoints=[], errorPoints=[], ready=true, isSquat = false){
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = width;
    canvasRef.current.height = width*ratio;
    if(ready){
      drawing.drawKeypoints(keypoints, 0.1, ctx);
      drawing.drawSkeleton(keypoints, 0.1, ctx);
  
      expectedPoints.forEach((pairOfPoints) => {
        drawing.drawCorrectSegment(pairOfPoints[0], pairOfPoints[1], 1, ctx);
        drawing.drawCorrectPoint(ctx, pairOfPoints[0][0], pairOfPoints[0][1]);
        drawing.drawCorrectPoint(ctx, pairOfPoints[1][0], pairOfPoints[1][1]);
      });
      errorPoints.forEach((pairOfPoints) => {
        drawing.drawErrorSegment(pairOfPoints[0], pairOfPoints[1], 1, ctx);
      });
    }
    else if(!ready){
      drawing.drawNotReadyKeypoints(keypoints, 0.1, ctx);
      drawing.drawNotReadySkeleton(keypoints, 0.1, ctx);
      if (isSquat){
        drawing.drawHalfReadyRange(ctx, height, width);
      }
      else{
        drawing.drawReadyRange(ctx, height, width, startArea);
      }
    }
  }

  function countingLogic(keypoints, result, countingElement, resultOutput, eachData, sound, soundPlayElement, isSquat = false){
    
    if(result.position ==="rest"){
      sound.pauseAsync();
      soundPlayElement.isPlaying = false;
      drawCanvas(keypoints, [], [], false, isSquat)
      if (countingElement.lastPositionInFunction !== "rest" && countingElement.numberOfRepetitionInFunction>0){
        countingElement.numberOfSetInFunction++;
        countingElement.numberOfRepetitionInFunction = 0;
        
        setNumberOfSet(countingElement.numberOfSetInFunction);
        setNumberOfRepetition(countingElement.numberOfRepetitionInFunction);
        eachData.correctPersentage = countingElement.correctCount/countingElement.totalCount;
        eachData.duration = (Date.now()-countingElement.startTimeInFunction)/1000;
        let deepCopyEachData = JSON.parse(JSON.stringify(eachData));
        resultOutput.data.push(deepCopyEachData);
        resultOutput.numberOfSet = countingElement.numberOfSetInFunction;
      }
      eachData.data = []
      countingElement.startTimeInFunction = Date.now();
      countingElement.totalCount = 0;
      countingElement.correctCount = 0;
    }
    else{
      eachData.data.push(result.progress);
      drawCanvas(keypoints, result.expectedPoints, result.errorPoints);
      countingElement.totalCount ++;
      if (result.correct){
        countingElement.correctCount ++;
        sound.pauseAsync();
        soundPlayElement.isPlaying = false;
      }
      else if(!soundPlayElement.isPlaying){
        sound.replayAsync();
        soundPlayElement.isPlaying = true;
      }
      if(result.position ==="start"){
        if (result.correct){
          countingElement.lastStart = true;
        }
      }
      else if(result.position ==="intermediate"){
        if(countingElement.lastStart && result.correct){
          countingElement.numberOfRepetitionInFunction++;
          setNumberOfRepetition(countingElement.numberOfRepetitionInFunction);
          eachData.numberOfRep = countingElement.numberOfRepetitionInFunction;
          countingElement.lastStart = false;
        }
      }
    }
    
    countingElement.lastPositionInFunction = result.position;
    setDuration(Date.now()-countingElement.startTimeInFunction)
    setProgress(result.progress)
  }
  async function sendResult(resultOutput){
    if (resultOutput.numberOfSet!==0){
      var username = await AsyncStorage.getItem("username");
      fetch('http://13.239.35.133/api/workout', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  username: username,
                  data: resultOutput,
                  workoutName:workoutName
              })
          })
          .then(response => response.json())
    }
    
  }
  
  /*
  Using useEffet to call request camera permission once.
  */
  useEffect(() =>{
    (async ()=>{
      const {status} = await Camera.requestCameraPermissionsAsync();
      await tf.ready();
    })();
  }, []);

    
  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d');
      
  //   }
  // }, [canvasRef]);
  function formatTextInProgress(){
    const time = (duration/1000).toFixed(1);
    return `S:${numberOfSet}, R:${numberOfRepetition}\n${time}s`
  }
  return (
    <SafeAreaView style={styles.screen} >
      <View style={styles.container}>
        <View style={[styles.counterCotainer]}>
          <Progress.Circle style={[styles.progress]}
            size={150}
            showsText={true}
            thickness={10}
            progress={progress}
            color={"rgba(0, 255, 102, 0.8)"}
            formatText={formatTextInProgress}
            textStyle={styles.text}
          />
        </View>
        <TensorCamera style={styles.camera}
          type = {Camera.Constants.Type.front}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          onReady={moveNetCameraHandle}
          autorender={true}
          resizeHeight={width*ratio}
          resizeWidth={width}
          resizeDepth={3}
        />
        <Canvas style={[styles.canvas]} ref={canvasRef}> </Canvas>
        
      </View>
      <Text>Set: {numberOfSet} Rep: {numberOfRepetition} Duration: {duration/1000} progress: {progress}</Text>
    </SafeAreaView >
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:'black'
  },
  container:{
    height: width * ratio,
    width: width,
  },
  camera:{
    position: 'relative',
    height: width * ratio,
    width: '100%',
  },
  canvas:{
    position: 'absolute',
    height: width * ratio,
    width: '100%',
    zIndex: 10,
  },
  progress:{
    position: 'absolute',
    zIndex: 0,
    justifyContent: 'center'
    
  },
  counterCotainer:{
    position: 'absolute',
    zIndex: 20,
    marginLeft: "10%",
    marginTop: "10%"
  },
  text:{
    fontSize:32,
    color: "black",
    fontWeight:'bold'
  }
});

  // async function poseNetCameraStream(images) {
  //   const newPose = await poseNet.load();
  //   const loop = async () => {
  //       const nextImageTensor = images.next().value;
  //       try{
  //         const pose = await newPose.estimateSinglePose(nextImageTensor);
  //         //drawCanvas(pose);
  //       }
  //       catch(error){
  //       }
  //       requestAnimationFrame(loop);
  //   }
  //   loop();
  // }