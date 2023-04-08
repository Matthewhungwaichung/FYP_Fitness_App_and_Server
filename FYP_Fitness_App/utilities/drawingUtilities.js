import * as movenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

const color = "aqua";
const errorColor = "red";
const correctColor = "green";
const lineWidth = 2;
const correctLineWidth = 5;
const errorLineWidth = 5;




export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawCorrectPoint(ctx, y, x) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = correctColor;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawCorrectSegment([ay, ax], [by, bx], scale, ctx) {
  ctx.beginPath();
  ctx.setLineDash([10,5]);
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = correctLineWidth;
  ctx.strokeStyle = correctColor;
  ctx.stroke();
  ctx.setLineDash([]);
}
export function drawErrorSegment([ay, ax], [by, bx], scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = errorLineWidth;
  ctx.strokeStyle = errorColor;
  ctx.stroke();
}
/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = movenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      [keypoints[0].y, keypoints[0].x],
      [keypoints[1].y, keypoints[1].x],
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}


export function drawNotReadySkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = movenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      [keypoints[0].y, keypoints[0].x],
      [keypoints[1].y, keypoints[1].x],
      errorColor,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawNotReadyKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, errorColor);
  }
}

export function drawReadyRange(ctx, height, width, startArea){
  
  ctx.beginPath();
  ctx.setLineDash([10,5]);
  ctx.moveTo(width/2+startArea*width, 0);
  ctx.lineTo(width/2+startArea*width, height);
  ctx.lineWidth = correctLineWidth;
  ctx.strokeStyle = "White";
  ctx.stroke();
  ctx.beginPath();
  ctx.setLineDash([10,5]);
  ctx.moveTo(width/2-startArea*width, 0);
  ctx.lineTo(width/2-startArea*width, height);
  ctx.lineWidth = correctLineWidth;
  ctx.strokeStyle = "White";
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(width/2-startArea*width, 0, width*startArea*2, height);
  ctx.setLineDash([]);
}

export function drawHalfReadyRange(ctx, height, width){
  
  ctx.beginPath();
  ctx.setLineDash([10,5]);
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  ctx.lineWidth = correctLineWidth;
  ctx.strokeStyle = "White";
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(width/2, 0, width/2, height);
  ctx.setLineDash([]);
}