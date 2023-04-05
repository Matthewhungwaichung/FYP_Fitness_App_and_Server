import * as calculation from '../utilities/calculationUtilities'

export function extractDetails(keypoints, width, startArea){
    let result = {"position":"normal", "data":{}, "correct": true, "expectedPoints":[], "errorPoints":[], "progress":0};
    const acceptableAngleError = 8;
    const acceptableXError = 50;
    const acceptableLengthDifference = 50;
    const intermediateAngle = 80;
    const startAngle = 170;

    const nose = keypoints[0];
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];

    const leftAnkle = keypoints[15];
    const leftKnee =keypoints[13];
    const leftHip = keypoints[11];
    const rightAnkle = keypoints[16];
    const rightKnee =keypoints[14];
    const rightHip = keypoints[12];

    
    const leftKneeAngle = calculation.angleOfThreePoints(leftAnkle, leftKnee, leftHip);
    const rightKneeAngle = calculation.angleOfThreePoints(rightAnkle, rightKnee, rightHip);

    const noseInArea = nose.x>width/2;
    const isReady = noseInArea;
    
    if (isReady){
        result.progress = 1-calculation.normalize((leftKneeAngle+rightKneeAngle)/2, intermediateAngle, startAngle);
        result.position = leftKneeAngle<=intermediateAngle && rightKneeAngle<=intermediateAngle? "intermediate": result.position;
        result.position = leftKneeAngle>=startAngle && rightKneeAngle>=startAngle ? "start": result.position;
        const leftCenter = Math.abs((leftHip.x+leftKnee.x+leftAnkle.x)/3-leftShoulder.x)<acceptableXError;
        const rightCenter = Math.abs((rightHip.x+rightKnee.x+rightAnkle.x)/3-rightShoulder.x)<acceptableXError;

        if(!leftCenter){
            result.correct = false;
            result.errorPoints.push([[leftHip.y, leftHip.x], [leftShoulder.y, leftShoulder.x]]);
            result.expectedPoints.push([[leftHip.y, leftHip.x], [leftShoulder.y, leftHip.x]]);
        }
        if(!rightCenter){
            result.correct = false;
            result.errorPoints.push([[rightHip.y, rightHip.x], [rightShoulder.y, rightShoulder.x]]);
            result.expectedPoints.push([[rightHip.y, rightHip.x], [rightShoulder.y, rightHip.x]]);
        }
    }
    else{
        result.correct = false;
        result.position = "rest";
    }
    return result;
}

