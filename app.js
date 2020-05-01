//global variable
const width = window.innerWidth;
const height = window.innerHeight;
const numberSegments = 18;
let wheelSpinning = false;
const secondsSpinning = 5;

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

function eventListener(event){
    if(!wheelSpinning){
        theWheel.resumeAnimation();
        const stopAtSegment = prompt(`Enter the segment number (Between 1-${numberSegments})`);
        if(!(stopAtSegment >= 1 && stopAtSegment <= 18)){
            alert('Try again and enter the correct segment number');
        } else {
            wheelSpinning = true;
            resetWheel();
            //calculates a degree
            const stopAt = Math.floor(Math.random() * (360/numberSegments)) + (((360/numberSegments)*stopAtSegment) - (360/numberSegments));
            theWheel.animation.stopAngle = stopAt;
            theWheel.startAnimation()
            setTimeout(() => { wheelSpinning = false; }, secondsSpinning*1000);
        }
    }
}

//addEventLister click on canvas element
document.querySelector('button').addEventListener('click', eventListener);
