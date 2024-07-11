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
});

const queryParameterIndexReplace = () => {
    const idxParamsRegex = /@\{(\d+?)\}/i;
    let query = inputQueryEl.value;
    let value = inputValueEl.value.replace(/\].+$/, ']').replace(/\'/g, `"`);
    
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
        return;
    }

    outputEl.textContent = query;
    hljs.highlightElement(outputEl);
    toggleOutput(true)
    inputQueryEl.value = query;
}

/**
 * 
 * @param {*} msg 
 */
const showStatus = (msg) => {
    const RESET_TIME = 2000;
    if (msg !== lbStatusEl.innerText) {
        lbStatusEl.innerText = msg;
        statusSetTimeoutAttr = setTimeout(() => {
            lbStatusEl.innerText = "";
            statusSetTimeoutAttr = null;
        }, RESET_TIME);
    } else {
        statusSetTimeoutAttr = statusSetTimeoutAttr 
            || (lbStatusEl.innerText = msg) 
            && setTimeout(() => {
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
    } else {
        outputContainerEl.style.display = "none";
        inputQueryEl.style.display = "";
        inputValueEl.style.display = "";
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
    outputEl.textContent = '';
    toggleOutput(false);
});    