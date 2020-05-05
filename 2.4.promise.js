/**
 * 콜백 패턴의 문제
 */
/* 2-62 기존 */
function requestData1(callback) {
    console.log("requestData1");
    setTimeout(function() {
        callback(requestData3);
      }, 2000);
}

function requestData2(callback) {
    console.log("requestData2");
    callback(onSuccess);
}

function requestData3(callback) {
    console.log("requestData3");
    callback();
}

function onSuccess() {
    console.log("onSuccess");
}

requestData1(requestData2); // TODO test 실행

/* 2-63 Promise */
function requestData11() {
    return new Promise(function(resolve, reject){
        console.log("requestData11");
        setTimeout(function() {
          resolve(1);
        }, 2000);
      })
      .then(function() {
        console.log("requestData22");
      })
      .then(function() {
        console.log("requestData33");
      })
      .then(function() {
        console.log("onSuccess");
      });
}

requestData11(); // TODO test 실행


/**
 * 프로미스 예제
 */
var promiseCount = 0;

function testPromise () {
    var thisPromiseCount = ++promiseCount;

    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount + ') 시작 (<small>동기적 코드 시작</small>)<br/>');

    var pro1 = new Promise((resolve, reject) => {
        log.insertAdjacentHTML('beforeend', thisPromiseCount + ') 프로미스 시작 (<small>비동기적 코드 시작</small>)<br/>');
        
        if(thisPromiseCount%2 !== 0) {
            setTimeout(() => {
                resolve(thisPromiseCount);
            }, Math.random() * 2000 + 1000);
        } else {
            setTimeout(() => {
                reject(thisPromiseCount);
            }, Math.random() * 2000 + 1000);
        }
    })

    pro1.then((str) => {
        log.insertAdjacentHTML('beforeend', str + ') 프로미스 이행 (<small>비동기적 코드 종료</small>)<br/>');
    })
    .catch((str) => {
        log.insertAdjacentHTML('beforeend', str +') 프로미스 거부 (<small>비동기적 코드 종료</small>)<br/>');
    }); // catch 를 주석처리해보자

    log.insertAdjacentHTML('beforeend', thisPromiseCount + ') 프로미스 생성 (<small>동기적 코드 종료</small>)<br/>');
}

if ("Promise" in window) { 
    var btn = document.getElementById("btn"); 
    btn.addEventListener("click", testPromise); 
} else { 
    log = document.getElementById('log');
    log.innerHTML = "Live example not available as your browser doesn't support the <code>Promise<code> interface."; 
}

// TODO 버튼을 눌러 실행


/**
 * 2-64 프로미스를 생성하는 방법
 */
const a1 = new Promise((resolve, reject) => {
    // ...
    resolve("popo");
    // or reject("error message");
});
const a2 = Promise.reject("error message"); // 거부됨 상태의 프로미스
a2.catch(str => console.log(str)); // 주석처리 해보자

const a3 = Promise.resolve("haha"); // 이행됨 상태의 프로미스, 입력값이 프로미스면 프로미스 반환


/**
 * 2-65 Promise.resolve 반환값
 */
const p2 = Promise.resolve(123);
console.log(p2 === 123); // false
const p3 = new Promise(resolve => setTimeout(() => { resolve(10), 2000 }));
console.log(Promise.resolve(p3) === p3); // true

// var k = new Promise.resolve("haha"); 
// var kk = Promise.resolve("haha"); 
// var kkk = new Promise(() => {});
// var kkkk = Promise(() => {});



/**
 * 2-67 연속해서 then 메서드 호출하기
 */
// requestData4().then(onResolve, onReject);  // onResolve 처리와 onReject 거부. then 메서드는 항상 프로미스를 반환
Promise.resolve(123).then(data => console.log(data));
Promise.reject("err").then(null, error => console.log("error"));

function requestData5() {
    return new Promise(resolve => resolve("requestData4"));
}

function requestData6() {
    return new Promise(resolve => resolve("requestData5"));
}

requestData5()
.then(data => {
    console.log(data);
    return requestData6(); // 프로미스를 반환하면 그 값을 그대로 반환 (프로미스를 반환할 수 있다는 말)
})
.then(data => {
    console.log(data);
    return data + "_1";  // 프로미스가 아닌 값을 반환하면 이행된 상태의 프로미스를 반환. Promise.resolve (그냥 값이면 원래 프로미스 이행상태를 반환)
})
.then(data => {
    console.log(data);
    throw new Error("some error"); // onResolve 또는 onReject 함수 내부에서 예외가 발생하면 거부됨 상태인 프로미스를 반환.
})
.then(null, error => {
    console.log(error); // 프로미스가 거부됨 상태일 때는 onReject 함수가 있는 then 을 만날 때까지 이동한다.
})


/**
 * 2-68 거부됨 상태가 되면 onReject 함수를 호출한다.
 */
Promise.reject("err")
.then(() => console.log("then 1"))
.then(() => console.log("then 2"))
.then(() => console.log("then 3"), () => console.log("then 4"))
.then(() => console.log("then 5"), () => console.log("then 6"))



/**
 * 2-69 같은 기능을 하는 then 메서드와 catch 메서드
 */
Promise.reject(1).then(null, error => {
    console.log(error);
});
Promise.reject(1).catch(error => {
    console.log(error);
});


/**
 * 2-70 then 메서드와 onReject를 사용했을 때 문제점
 */
Promise.resolve().then(
    () => {
        throw new Error("some error"); // 여기서 발생한 예외는... 
    },
    error => {
        console.log(error); // 여기서 처리 되지 않고 Uncaught (in promise) Error 가 발생한다.
    }
)


/**
 * 2-71 onReject 함수를 사용하지 않고 catch를 사용한 예
 */
Promise.resolve()
.then(
    () => {
        throw new Error("some error");
    }
)
.catch(error => { // 좀더 직관적인 catch 를 사용. catch 도 프로미스를 반환하기 때문에 계속해서 than 사용 가능.
    console.log(error);
});


/**
 * 2-72 catch 메서드 이후에도 then 메서드 사용하기
 */
Promise.reject(10)
.then(data => {
    console.log("then1:", data);
    return 20;
})
.catch(error => {
    console.log("catch:", error);  // 여기
    return 30;
})
.then(data => {
    console.log("then2:", data);  // 여기
});



/**
 * 2-74 Promise finally 메서드는 새로운 프로미스를 생성하지 않는다. requestData6 반환값은 finally 존재여부를 신경쓰지 않아도 된다.
 */
function requestData6() {
    return new Promise((resolve, reject) => {
        resolve("gaga");
        // reject("err");
    })
    .then(str => console.log(str))
    .catch(error => {})
    .finally(() => {
        console.log("haha")
    });
}

// requestData6() // TODO 실행



/**
 * 2-81 Promise 는 불편 객체
 */
function requestData7() {
    const p = Promise.resolve(10);
    p.then(() => {
        return 20;
    });
    return p;
}
requestData7().then(v => console.log(v));

function requestData8() {
    return Promise.resolve(10).then(v => {
        return 20;
    });
}
requestData8().then(v => console.log(v));



/**
 * 2-77, 2-85 Promise.all
 */
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]


Promise.resolve(10).then(v => {
    return Promise.all([v, requestData9(v)]);
})
.then(([result1, result2]) => {
    console.log(result1, result2);
})

function requestData9(v) {
    return v + 5;
}



/**
 * 2-88, 2-89. 2-90 async await 함수는 프로미스를 반환한다. 그래서 프로미스 처럼 사용 가능
 * (p91. 하지만 프로미스 취급을 하는것이지 프로미스는 아니다. 이렇게 than 메서드를 가진 객체를 Thenable 이라고 한다.
 * await 키워드와 함께 Thenable 객체를 생성할 수 있다)
 * async 는 함수에 사용
 */
async function getData() {
    return 123;
    // return Promise.resolve(456);
    // throw new Error("789");
}
getData()
.then(v => console.log(v))
.catch(error => console.log(error));


/**
 * 2-91 await 키워드의 사용 예
 * await는 async await 함수 내부에서만 사용
 */
function requestData10(v) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("requestData10:" + v);
            resolve(v);
        }, v);
    });
}

async function getData1() {
    const data1 = await requestData10(200); // await를 입력하면 프로미스가 처리됨 상태가 될때까지 기다린다.
    const data2 = await requestData10(100);
    console.log(data1, data2);
    return [data1, data2];
}

getData1(); // TODO 실행


/**
 * 2-101, 2-103 템플릿 리터럴을 사용한 코드
 */
const name = "김삼순";
console.log(`내 이름은 ${name} 이다.
알겠냐? 내 이름은 ${name} 이라고.`);


/**
 * 2-104, 2-105 템플릿 리터럴 함수
 * 사용처: 태그 만들 때 강조하고 싶은 문구가 있다면... p94 2-106"
 */
const v1 = "ff";
const v2 = "ee";
function taggedfunc(s, ...arr) {
    console.log("s:" + s.join(","));
    console.log("arr:" + arr.join(","));
}

taggedfunc`aa-${v1}-bb-${v2}-cc`;
taggedfunc`aa-${v1}-bb-${v2}`;
taggedfunc`${v1}-bb-${v2}`;



/**
 * 2-107, 2-108 제너레이터 객체
 * 실행을 멈추는 제너레이터는 멈출 때 마다 값을 리턴해줄 수 있다.
 * 용도: 1. 값을 전달, 2. 다른 함수와 협업 멀티태스킹
 */
function* f1() {
    console.log("f1-1");
    yield 10;
    console.log("f1-2");
    yield 20;
    console.log("f1-3");
    return "finished";
}

const gen = f1(); // 객체만 반환. 내부코드는 실행되지 않음
console.log(gen.next()); // 반환되는 객체에 done 키값이 들어있다
console.log(gen.next());
console.log(gen.next());



/**
 * 2-109 제너레이터 객체의 return 메서드 호출
 */
const gen1 = f1();
console.log(gen1.return("abc"));
console.log(gen1.next());
console.log(gen1.next());


/**
 * 2-110 제너레이터 객체의 throw 메서드 호출
 */
function* f2() {
    try {
        console.log("f2-1");
        yield 10;
        console.log("f2-2");
        yield 20;
        console.log("f2-3");
        return "finished";
    } catch (e) {
        console.log("f2-catch", e);
    }
}

const gen2 = f2();
console.log(gen2.next());
console.log(gen2.throw("some error"));
console.log(gen2.next());

/* 주의: next 실행 후 throw 하는거랑 처음부터 throw 실행하는거랑 콘솔 로그값이 다름. */
// const gen3 = f2();
// console.log(gen3.throw("some error")); // 에러 발생시키면 아래 스크립트가 실행이 안되니 필요할 때만 주석풀어서 실행해보자. (프로미스 에러는 괜찮음)
// console.log(gen3.next());
// console.log(gen3.next());



/**
 * 2-111 배열은 반복 가능한 객체다.
 * 제너레이터 객체는 반복 가능하면서 반복자 이다.
 * next 메서드가 있고 next가 value, done 속성을 리턴하고 작업이 끝났을 때 done 속성이 참이면 반복자 이다.
 * Symbol.iterator 속상값으로 함수가 있고 반복자(자기 자신)를 반환하면 반복 가능한 객체(반복자) 이다.
 */
const arr = ["aa", "bb", "cc"];
const iter = arr[Symbol.iterator]();
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());


/**
 * 2-113 반복 가능한 객체를 이용한 코드
 * 반복 가능 객체는 반복문에 사용될 수 있다.
 */
function* f3() {
    yield 10;
    yield 20;
    yield 30;
}
for (const v of f3()) {
    console.log(v);
}
const arr2 = [...f3()]; // 전개 연산자도 done 속성값이 참이 될 때까지 값을 펼친다
console.log(arr2);


/**
 * 2-114 제너레이터로 구현한 map, filter, take 함수
 * 제너레이터로 할 수 있는일: 제너레이터, 반복자, 반복 가능한 객체를 이용하면 함수형 프로그래밍의 대표적인 함수를 쉽게 구현 가능
 * 세 함수가 필요한 순간에만 실행되는 반복 가능한 객체를 내부에서 이용하고 있다.
 */
function* filter(iter, test) {
    for (const v of iter) {
        if(test(v)) {
            yield v;
        }
    }
}

function* map(iter, mapper) {
    for (const v of iter) {
        yield mapper(v);
    }
}

function* take(n, iter) {
    for (const v of iter) {
        if(n <= 0) return;
        yield v;
        n--;
    }
}

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = take(3, map(filter(values, n => n % 2 === 0), n => n * 10)); // 제너레이터 객체만 생성되고 실제 연산은 수행되지 않는다. 짝수일 때만 10곱해서 3회까지 리턴.
console.log([...result]); // 값이 필요한 순간에 연산하게 된다. (이런 방식을 지연평가(lazy evaluation)라고 부른다). values 의 모든 배열이 연산되지 않는다(1부터 6까지만 연산에 사용)


/**
 * 2-115 제너레이터 함수로 자연수의 잡합 표현
 */
function* naturalNumber() {
    let v = 1;
    while (true) {
        yield v++;
    }
}
const values1 = naturalNumber(); // 제너레이터를 사용하지 않았다면 무한루프에 빠졌을 것
const result1 = take(3, map(filter(values1, n => n % 2 === 0), n => n * 10));
console.log([...result1]);


/**
 * 2-116, 2-117 제너레이터 함수가 다른 제너레이터 함수 호출하기. 반복 가능한 객체를 처리하는 yield* 키워드
 */
function* g1() {
    yield 2;
    yield 3;
}

function* g2() {
    yield 1;
    yield* g1(); // 제너레이터 함수에서 다른 제너레이터 함수를 호출할 때 * 를 붙인다.
    yield 4;
}

function* g3() {
    yield 1;
    for (const v of g1()) { // yield* 코드는 이 처럼 해석될 수 있다.
        yield v;
    }
    yield 4;
}

function* g4() {
    yield 1;
    yield* [2, 3]; // 제너레이터 뿐만 아니라 반복가능한 모든 객체가 가능
    yield 4;
}
console.log(...g2());
console.log(...g3());
console.log(...g4());



/**
 * 2-118 next 메서드를 이용해서 제너레이터 함수로 데이터를 전달
 * next 통해서 전달받은 인수는 yield 키워드의 결과값으로 받을 수 있다.
 */
function* f4() {
    console.log("웃어봐");
    const data1 = yield;
    console.log(data1);
    const data2 = yield;
    console.log(data2);
}
const gen4 = f4();
gen4.next(); // 주의할 점: 첫 번째 next 호출은 제너레이터 함수의 실행이 시작되도록 하는 역할만 수행한다. 아래 두줄을 주석해서 실행도 해보자.
gen4.next("음하하");
gen4.next("우히히");


/**
 * 2-119 제너레이터 함수를 이용한 협업 멀티태스킹
 * 협업 멀티태스킹: 멈추는 시점을 자발적으로 선택
 * 선점형 멀티태스킹: 멈추는 시점을 자발적으로 선택하지 못함
 */
function* minsu() {
    const myMsgList = [
        "나는 민수",
        "반갑다",
        "내일 영화 볼래?",
        "미안",
        "ㅜㅜ"
    ];
    for (const msg of myMsgList) {
        console.log("수지: ", yield msg);
    }
}

function suji() {
    const myMsgList = [
        "", // 첫 번째 next 호출의 역할은 제너레이터 함수 실행이 시작되도록 하는 것이기 때문에 next로 넘기는 파라미터가 minsu 함수 로그에 찍히는건 다음 부터다.
        "...",
        "...그래",
        "꺼져",
        "퉤"
    ];
    const gen = minsu();
    for (const msg of myMsgList) {
        console.log("민수: ", gen.next(msg).value);
    }
}

suji();



/**
 * 2-121 제너레이터 함수에서 예외가 발생한 경우
 */
function* genFunc() {
    throw new Error("gen some error");
}

function func() {
    const gen = genFunc(); // 제너레이터 객체가 만들어지는 시점에는 내부 코드가 실행되는게 아니기 때문에 예외는 발생하지 않음.
    try {
        gen.next(); // next 가 호출되면 제너레이터 함수의 예외가 발생하고 이것은 일반 함수 예외에 영향을 준다.
    } catch (error) {
        console.log("in catch: " + error);
    }
}

func();









