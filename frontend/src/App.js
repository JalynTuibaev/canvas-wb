import React, {useState, useRef, useEffect} from 'react';
import './App.css';

const App = () => {
    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const [color, setColor] = useState('black');

    const ws = useRef(null);
    const canvas = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/canvas');

        ws.current.onmessage = event => {
            const decodedArr = JSON.parse(event.data);

            setState(prevState => {
                return {
                    ...prevState,
                    pixelsArray: decodedArr
                };
            });

            decodedArr.map(event => {
                const context = canvas.current.getContext('2d');

                context.beginPath();
                context.arc(event.x,  event.y, 10, 0, 2*Math.PI, false);
                context.fillStyle = event.color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = event.color;
                context.stroke();
            });
        };
    }, []);

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;
            setState(prevState => {
                return {
                    ...prevState,
                    pixelsArray: [...prevState.pixelsArray, {
                        x: clientX,
                        y: clientY,
                        color,
                    }]
                };
            });

            const context = canvas.current.getContext('2d');

            context.beginPath();
            context.arc(event.clientX,  event.clientY, 10, 0, 2*Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.stroke();
        }
    };

    const mouseDownHandler = () => {
        setState({...state, mouseDown: true});
    };

    const mouseUpHandler = () => {
        ws.current.send(JSON.stringify(state.pixelsArray));

        setState({...state, mouseDown: false, pixelsArray: []});
    };

    return (
        <div>
            <canvas
                ref={canvas}
                style={{border: '1px solid black'}}
                width={800}
                height={600}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            />

            <div className='color'>
                <p>Choose color: </p>
                <button onClick={() => setColor('black')} className='btn black'/>
                <button onClick={() => setColor('yellow')} className='btn yellow'/>
                <button onClick={() => setColor('green')} className='btn green'/>
                <button onClick={() => setColor('red')} className='btn red'/>
            </div>
        </div>

    );
};

export default App;