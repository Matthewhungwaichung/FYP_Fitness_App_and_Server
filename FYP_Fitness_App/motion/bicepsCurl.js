import * as calculation from '../utilities/calculationUtilities'

export function extractDetails(keypoints, width, startArea){
    let result = {"position":"normal", "data":{}, "correct": true, "expectedPoints":[], "errorPoints":[], "progress":0};
    const acceptableAngleError = 8;
    const intermediateAngle = 25;
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

    
    const leftElbowAngle = calculation.angleOfThreePoints(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculation.angleOfThreePoints(rightShoulder, rightElbow, rightWrist);
    const leftShoulderAngle = calculation.angleOfThreePoints(leftElbow, leftShoulder, leftHip);
    const rightShoulderAngle = calculation.angleOfThreePoints(rightElbow, rightShoulder, rightHip);
    const leftBicepLength = calculation.lengthBetweenTwoPoints(leftElbow, leftShoulder);
    const rightBicepLength = calculation.lengthBetweenTwoPoints(rightElbow, rightShoulder);

    const noseInArea = nose.x<width/2+startArea*width&&nose.x>width/2-startArea*width;
    const isReady = noseInArea && leftShoulderAngle<60 && rightShoulderAngle<60;
    if (isReady){
        result.progress = 1-calculation.normalize((leftElbowAngle+rightElbowAngle)/2, intermediateAngle, startAngle);
        result.position = leftElbowAngle<=intermediateAngle && rightElbowAngle<=intermediateAngle? "intermediate": result.position;
        result.position = leftElbowAngle>=startAngle && rightElbowAngle>=startAngle ? "start": result.position;
        const leftShoulderIsCenter = isCenter(leftShoulderAngle, 15, acceptableAngleError);
        const rightShoulderIsCenter = isCenter(rightShoulderAngle, 15, acceptableAngleError);
        if (!leftShoulderIsCenter.correct){
            result.correct = false;
            result.expectedPoints.push([[leftShoulder.y, leftShoulder.x], [leftShoulder.y + leftBicepLength, leftShoulder.x+10]]);
            result.errorPoints.push([[leftElbow.y, leftElbow.x], [leftShoulder.y, leftShoulder.x]]);
        }
        if (!rightShoulderIsCenter.correct){
            result.correct = false;
            result.expectedPoints.push([[rightShoulder.y, rightShoulder.x], [rightShoulder.y + rightBicepLength, rightShoulder.x-10]]);
            result.errorPoints.push([[rightElbow.y, rightElbow.x], [rightShoulder.y, rightShoulder.x]]);
        }
    
        
    }
    else{
        result.correct = false;
        result.position = "rest";
    }
    return result;
}

function isCenter(angle1, angle2, acceptableAngleError){
    result = {"correct":true, "data":""}
    if (angle1-angle2>acceptableAngleError){
        result.correct = false;
        result.data = "out";
        
    }
    else if (angle2-angle1>acceptableAngleError){
        result.correct = false;
        result.data = "in";
    }
    return result;
}