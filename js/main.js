"use strict";

let x, y,           // x,y position of the mouse at the beginning of a drag
    dragX, dragY,   // x,y position of the draggable at the beginning of a drag
    count = 0,      // the current number of draggable divs
    placeholder;    // the placeholder div for showing where a dragged div will end up

/* Adds a single draggable div to the container. This div contains a number counter in
 * order to differentiate the divs when rearranging them. This is used by the addDiv button
 * and for intialization.
 */
function addDiv() {
    const div = document.createElement('div'),
        p = document.createElement('p');

    // make a draggable div and give it the startDrag function
    div.className = 'draggable';
    div.onmousedown = e => startDrag(e, div);

    // identify the div with a count
    p.innerHTML = count++;
    div.appendChild(p);

    document.getElementById('container').appendChild(div);
}

/*
 * Create 3 initial divs in the container.
 */
function initialize() {
    for (let i = 0; i < 3; i++) {
        addDiv();
    }
}

initialize();

/* Begins the drag operation. Records the initial position of the mouse and
 * the draggable div, adds the placeholder div, and changes the style of the
 * draggable in preparation for moving the draggable.
 * 
 * e - mousedown event
 * target - the div being dragged
 */
function startDrag(e, target) {
    // Add new drag functions to the document
    document.onmousemove = (e) => drag(e, target);
    document.onmouseup = (e) => endDrag(e, target);

    // Record the position of the mouse
    x = e.clientX;
    y = e.clientY;

    // Record the position of the draggable
    dragX = target.offsetLeft;
    dragY = target.offsetTop;

    // Create the placeholder and place it where the draggable is located.
    // Then move the draggable to the end of the container's list of children.
    let container = document.getElementById('container');
    placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    container.insertBefore(placeholder, target);
    document.getElementById('container').appendChild(target);

    // Convert the style of the draggable to have absolute position based on where
    // the div is dragged.
    target.style.position = 'absolute';
    target.style.top = dragY + 'px';
    target.style.left = dragX + 'px';
    target.style.boxShadow = '0px 0px 20px #aaa';
}

/* Causes the movement of the target div during dragging. An invisible placeholder
 * is moved to the location in the list that the div would be if placed at this
 * moment to visibly shown the result of the drag.
 * 
 * e - mousemove event
 * target - the object being dragged
 */
function drag(e, target) {
    // the change in the position of the mouse since the drag began
    const dx = e.clientX - x,
        dy = e.clientY - y;

    // move div to align with the mouse movement
    target.style.left = dragX + dx + 'px';
    target.style.top = dragY + dy + 'px';

    // place the placeholder div in the correct location
    let container = document.getElementById('container'),
        draggables = container.getElementsByClassName('draggable');
    for (let i = 0; i < draggables.length; i++) {
        if (draggables[i].offsetTop >= target.offsetTop) {
            container.insertBefore(placeholder, draggables[i]);
            return;
        }
    }
}

/* Ends the drag effect and places the target in the correct location.
 * 
 * e - the mouseup event
 * target - the object being dragged
 */
function endDrag(e, target) {
    // remove drag methods from the window
    document.onmousemove = null;
    document.onmouseup = null;

    // place the target in the right position and remove the placeholder
    container.insertBefore(target, placeholder);
    container.removeChild(placeholder);

    // reset target's style parameters to normal
    target.style.position = '';
    target.style.top = '';
    target.style.left = '';
    target.style.boxShadow = '';
}
