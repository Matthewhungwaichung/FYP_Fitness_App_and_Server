export function angleOfThreePoints(p1, center, p3){
    const angle = Math.abs(Math.atan2(p1.y - center.y, p1.x - center.x)- Math.atan2(p3.y - center.y, p3.x - center.x))/Math.PI*180;
    const angleAdjust = angle>180? 360-angle : angle;
    return angleAdjust;
}

export function lengthBetweenTwoPoints(p1, p2){
    const distance = Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
    return distance;
}

export function angeOfTwoPoints(p1, p2){
    const angle = Math.abs(Math.atan2(p1.y - p2.y, p1.x - p2.x))/Math.PI*180;
    return angle;
}

export function normalize(value, min, max){
    value = value < min?min:value;
    value = value > max?max:value;
    return (value-min)/(max-min)
}