// scouter query binder

const btnCopyEl = document.getElementById("btnCopy");
const btnBindEl = document.getElementById("btnBind");
const btnResetEl = document.getElementById("btnReset");
const inputQueryEl = document.getElementById("inputQuery");
const inputValueEl = document.getElementById("inputValue");
const outputContainerEl = document.getElementById("outputContainer");
const outputEl = document.getElementById("output");
const lbStatusEl = document.getElementById("lbStatus");
let statusSetTimeoutAttr;

document.addEventListener("DOMContentLoaded", () => {
    inputQueryEl.focus();
    btnResetEl.style.display = "none";
});

const queryParameterIndexReplace = () => {
    if (!inputQueryEl.value) {
        showStatus("쿼리를 입력하세요.");
        return;
    }
    if (!inputValueEl.value) {
        showStatus("값를 입력하세요.");
        return;
    }

    const idxParamsRegex = /@\{(\d+?)\}/i;
    let query = inputQueryEl.value;
    let value = inputValueEl.value
        .replace(/\].+$/, ']') // ~~~ ms 제거
        .replace(/"/g, '\\\"') // 파라미터가 json인것 고려
        .replace(/\'/g, `"`) // 파라미터를 파싱 할 수 있도록 수정
    
    try { 
        value = JSON.parse(value);

        for (const v of value) {
            if (idxParamsRegex.test(query)) {
                query = query.replace(idxParamsRegex, v);
            } else {
                query = query.replace(/\?/, `'${v}'`);
            }
        }
    } catch(e) {
        console.error(e);
        showStatus("바인드 할 수 없습니다.");
        return;
    }

    // 성공
    query = query.replace(/(\n)\s{4,}/g, '$1  ');
    outputEl.textContent = query;
    hljs.highlightElement(outputEl);
    toggleOutput(true)
    inputQueryEl.value = query;
}

/**
 * 상태 메시지를 보여주는 함수
 * @param {*} msg 
 */
const showStatus = (msg) => {
    const RESET_TIME = 2000;
    if (msg !== lbStatusEl.innerText || !statusSetTimeoutAttr) {
        clearTimeout(statusSetTimeoutAttr);
        lbStatusEl.innerText = msg;
        statusSetTimeoutAttr = setTimeout(() => {
            lbStatusEl.innerText = "";
            statusSetTimeoutAttr = null;
        }, RESET_TIME);
    }
}

/**
 * 아웃풋 토글
 * @param {*} isResult 
 */
const toggleOutput = (isResult) => {
    if (isResult) {
        outputContainerEl.style.display = "";
        inputQueryEl.style.display = "none";
        inputValueEl.style.display = "none";
        btnBindEl.style.display = "none";
        btnResetEl.style.display = "";
    } else {
        outputContainerEl.style.display = "none";
        inputQueryEl.style.display = "";
        inputValueEl.style.display = "";
        btnBindEl.style.display = "";
        btnResetEl.style.display = "none";
    }
};

// 바인드 버튼 클릭 이벤트
btnBindEl.addEventListener('click', queryParameterIndexReplace);

// 클립보드 복사 버튼 이벤트
btnCopyEl.addEventListener('click', () => {
    if (inputQueryEl.value.trim() === "") return;
    navigator.clipboard.writeText(inputQueryEl.value);
    showStatus('클립보드에 복사되었습니다.')
});

// 리셋 버튼 이벤트
btnResetEl.addEventListener('click', () => {
    inputQueryEl.value = '';
    inputValueEl.value = '';
    outputEl.textContent = '';
    toggleOutput(false);
});    