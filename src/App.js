import './App.css';
import {interval, Subject, takeUntil} from 'rxjs';
import {useEffect, useState} from "react";

const seconds$ = new Subject();
const status$ = new Subject();
const reset$ = new Subject();

reset$.subscribe(val => {
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

    return (
        <div>
            <span> {new Date(seconds).toISOString().slice(11, 19)}</span><br/>
            <button id='startBtn' onClick={() => {
                status$.next('start');
                let startBtn = document.getElementById('startBtn');
                let stopBtn = document.getElementById('stopBtn');
                startBtn.style.display = 'none';
                stopBtn.style.display = 'block';
            }}>Start</button><br/>
            <button id='stopBtn' onClick={() => {
                status$.next('stop');
                let startBtn = document.getElementById('startBtn');
                let stopBtn = document.getElementById('stopBtn');
                stopBtn.style.display = 'none';
                startBtn.style.display = 'block';
            }}>Stop</button>
            <button onClick={() => reset$.next('Reset')}>Reset</button>
            <button onClick={() => status$.next('wait')}>Wait</button>
        </div>
    );
}

export default App;

// Реализовать секундомер, который подсчитывает время в формате «HH: MM: SS»
//
// Секундомер должен иметь следующие кнопки:
//
// * «Start / Stop» - запуск / остановка отсчета времени, останавливает и обнуляет значение секундомера.
//
// * «Wait» - работает на двойной клик (время между нажатиями не более 300 мс!) секундомер должен прекратить отсчет времени; если после него нажать старт, то возобновляется отсчет.
//
// * «Reset» - сброс секундомер на 0.  Обнуляет секундомер и снова начинает отсчет.
//
// Требования:
//
//  - используйте Observables в коде
//
//  - RxJS подход
//
//  - функциональный подход
//
//  - нам важнее всего увидеть Ваше умение писать код
//
// - 300 млс – это не DoubleClick