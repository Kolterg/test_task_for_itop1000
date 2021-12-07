import './App.css';
import {interval, Subject, takeUntil} from 'rxjs';
import {useEffect, useState} from "react";

const seconds$ = new Subject();
const status$ = new Subject();
const reset$ = new Subject();

reset$.subscribe(val => {
    status$.next('start');
    seconds$.next(0);
});

status$.subscribe(value => {
    if (value === 'stop') {
        seconds$.next(0)
    }
});

function App() {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState("stop");

    useEffect(() => {
            seconds$.subscribe(setSeconds);
            status$.subscribe(setStatus);

        const unsubscribe$ = new Subject();
        interval(1000)
            .pipe(takeUntil(unsubscribe$))
            .subscribe(() => {
                if (status === 'start') {
                    setSeconds(val => val + 1000);
                }
            });
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };
    }, [status]);

    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    let click = 0;

    const wait = () => {
        click += 1;
        setTimeout(() => {
            click = 0;
        }, 300)
        if (click === 2) {
            status$.next('wait');
            stopBtn.style.visibility = 'hidden';
            startBtn.style.visibility = 'visible';
        }
    }

    return (
        <div>
            <span> {new Date(seconds).toISOString().slice(11, 19)}</span><br/>
            <button id='startBtn' onClick={() => {
                status$.next('start');
                let startBtn = document.getElementById('startBtn');
                let stopBtn = document.getElementById('stopBtn');
                startBtn.style.visibility = 'hidden';
                stopBtn.style.visibility = 'visible';
            }}>Start</button><br/>
            <button id='stopBtn' onClick={() => {
                status$.next('stop');
                let startBtn = document.getElementById('startBtn');
                let stopBtn = document.getElementById('stopBtn');
                stopBtn.style.visibility = 'hidden';
                startBtn.style.visibility = 'visible';
            }}>Stop</button>
            <button onClick={() => {
                reset$.next('Reset');
                let startBtn = document.getElementById('startBtn');
                let stopBtn = document.getElementById('stopBtn');
                startBtn.style.visibility = 'hidden';
                stopBtn.style.visibility = 'visible';
            }}>Reset</button>
            <button onClick={() => wait()}>Wait</button>
        </div>
    );
}

export default App;
