//global variable
const width = window.innerWidth;
const height = window.innerHeight;
const numberSegments = 18;
let wheelSpinning = false;
const secondsSpinning = 5;
let stopAtSegment1;
let stopAtSegment2;
let arrSegments = [];
let arrNumSegments = [];
let counter = [];

//draw container, pointer and canvas element
function drawCanvas(){
    //create div container for canvas element
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvasContainer';
    const canvasSize = getCanvasSize();
    canvasContainer.innerHTML = `    
    <canvas id="myCanvas" width="${canvasSize}" height="${canvasSize}">
    Your browser does not support the HTML5 canvas tag.
    </canvas>
    <img id="prizePointer" src="basic_pointer.png" alt="V" />`;
    document.body.prepend(canvasContainer);
    
    //Center pointer
    document.querySelector('#prizePointer').style.left = `${canvasContainer.offsetWidth/2-25}px`;
}

//calculate canvas size
function getCanvasSize(){ 
    return width > height ? height*0.85 : width*0.85;
}

//generate array for segments
function generateSegments(){
    let arr = [];
    for(let i=1; i<=numberSegments; i++){    
        arr.push({'fillStyle' : randomBGColor(), 'text' : `Segment ${i}`});
    }
    return arr;
}

//get randomBgColor for segments
function randomBGColor(){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
}

//start app
drawCanvas();


//create wheel
let theWheel = new Winwheel({
    'canvasId'    : 'myCanvas',
    'numSegments' : numberSegments,
    'textFontSize' : width >= 768 ? 20 : 15,
    'innerRadius' : getCanvasSize()*0.1,
    'segments'    : generateSegments(),
    'pointerAngle': 0,
    'textAlignment': 'outer',
    'lineWidth'   : 1,
    'animation' :                   
    {
        'type'     : 'spinToStop',
        'direction': 'clockwise',  
        'duration' : secondsSpinning,             
        'spins'    : 8           
    }
});


function resetWheel()
{
    theWheel.stopAnimation(false);  
    theWheel.rotationAngle = 0;     
    theWheel.draw();
}

//generate random angle in this segment
function randomAngle(segment){
    return Math.floor(Math.random() * (360/numberSegments)) + (((360/numberSegments)*segment) - (360/numberSegments));
}


function generateRandomSegment(i){
    const num = Math.floor(Math.random() * numberSegments) + 1;
    return (num === stopAtSegment1 || num === stopAtSegment2 || num === arrNumSegments[i-1] || num === arrNumSegments[i+1] === true ) ? generateRandomSegment(i) : num;
}

//generate positions for unique sectors
function generateStopAtSegment(num, segment){
    const random = Math.floor(Math.random() * 10);
    if(arrNumSegments[random] !== undefined || arrNumSegments[random-1] === segment || arrNumSegments[random+1] === segment){
        generateStopAtSegment(num, segment);
    } else {
        arrNumSegments[random] = segment;
        const numSegment = arrNumSegments.filter(x =>{ return x === segment }).length;
        if(num > numSegment){
            generateStopAtSegment(num, segment);
        }
    }
}

function generateAllSegment(){
    //generate positions for the stopAtSegment1
    generateStopAtSegment(3, parseInt(stopAtSegment1));
    //generate positions for the stopAtSegment2
    generateStopAtSegment(2, parseInt(stopAtSegment2));
    //generete other positions
    for(let i=0; i<10; i++){
        if(arrNumSegments[i] === undefined){
            arrNumSegments[i] = generateRandomSegment(i);
        }
    }
}

//calculate where to stop
function stopAt(){
    const angle = randomAngle(arrNumSegments[counter]);
    counter++;
    return angle;
}

function AlertResultsAtTheMoment(){
    let text = '';
    arrSegments.forEach( (el,i) => {
        text += `
        Run${i+1} - ${el.text}
        `;
    });
    alert(text);
}

//start Wheell
function runWheel(stop){
    wheelSpinning = true;
    resetWheel();
    theWheel.animation.stopAngle = stop;
    theWheel.startAnimation()
    setTimeout(() => { 
        wheelSpinning = false; 
        arrSegments.push(theWheel.getIndicatedSegment());
        AlertResultsAtTheMoment();
    }, secondsSpinning*1000);
}

function eventListener(event){
    if(!wheelSpinning){
        if(arrSegments.length < 10 && arrSegments.length > 0){
            runWheel(stopAt());
        } else if(arrSegments.length === 0 || arrSegments.length >=10){
            //get segement1 and segment2 values
            stopAtSegment1 = prompt(`Enter the segment1 number (Between 1-${numberSegments})`);
            stopAtSegment2 = prompt(`Enter the segment2 number (Between 1-${numberSegments})`);

            //check for corect prompt value
            if(!(stopAtSegment1 >= 1 && stopAtSegment1 <= 18 && stopAtSegment2 >= 1 && stopAtSegment2 <= 18 && stopAtSegment1 !== stopAtSegment2)){
                alert('Try again and enter the correct segment number');
            } else {
                /* --- RESET Global Variables---- */
                arrSegments = [];
                arrNumSegments = [];
                counter = 0;
                /* --- END RESET Global Variables---- */

                generateAllSegment();
                console.log(arrNumSegments);
                runWheel(stopAt());
            }
        }
    }
}

//addEventLister click on canvas element
document.querySelector('button').addEventListener('click', eventListener);
