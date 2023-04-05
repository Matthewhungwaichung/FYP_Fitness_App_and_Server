import * as calculation from '../utilities/calculationUtilities'

export function extractDetails(keypoints, width, startArea){
    let result = {"position":"normal", "data":{}, "correct": true, "expectedPoints":[], "errorPoints":[], "progress":0};
    const acceptableAngleError = 15;
    const acceptableYError = 10;
    const intermediateAngle = 140;
    const startAngle = 70;

    const nose = keypoints[0];
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];

    
    const leftElbowAngle = calculation.angleOfThreePoints(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculation.angleOfThreePoints(rightShoulder, rightElbow, rightWrist);
    const leftArmLength = calculation.lengthBetweenTwoPoints(leftElbow, leftWrist);
    const rightArmLength = calculation.lengthBetweenTwoPoints(rightElbow, rightWrist);
    const leftArmAngle = calculation.angeOfTwoPoints(leftElbow, leftWrist);
    const rightArmAngle = calculation.angeOfTwoPoints(rightWrist, rightElbow);
    const letArm = isVertical(leftArmAngle, acceptableAngleError)
    const rightArm = isVertical(rightArmAngle, acceptableAngleError)

    const noseInArea = nose.x<width/2+startArea*width&&nose.x>width/2-startArea*width;
    const isRest = (leftWrist.y>leftShoulder.y+acceptableYError || rightWrist.y>rightShoulder.y+acceptableYError)||!noseInArea;
    
    if (isRest){
        result.correct = false;
        result.position = "rest";
    }
    else{
        result.progress = calculation.normalize((leftElbowAngle+rightElbowAngle)/2, startAngle, intermediateAngle)
        result.position = leftElbowAngle<=startAngle && rightElbowAngle<=startAngle? "start": result.position;
        result.position = leftElbowAngle>=intermediateAngle && rightElbowAngle>=intermediateAngle ? "intermediate": result.position;
        if (!letArm.correct){
            result.correct = false;
            result.expectedPoints.push([[leftElbow.y, leftElbow.x], [leftElbow.y - leftArmLength, leftElbow.x]]);
            result.errorPoints.push([[leftElbow.y, leftElbow.x], [leftWrist.y, leftWrist.x]]);
        }
        if (!rightArm.correct){
            result.correct = false;
            result.expectedPoints.push([[rightElbow.y, rightElbow.x], [rightElbow.y - rightArmLength, rightElbow.x]]);
            result.errorPoints.push([[rightElbow.y, rightElbow.x], [rightWrist.y, rightWrist.x]]);
        }
    }
    
    return result;
}

function isVertical(angle, acceptableAngleError){
    result = {"correct":true, "data":""}
    if (angle>90 && Math.abs(angle-90)>acceptableAngleError){
        result.correct = false;
        result.data = "out";
        
    }
    else if (angle<90 && Math.abs(angle-90)>acceptableAngleError){
        result.correct = false;
        result.data = "in";
    }
    return result;
}