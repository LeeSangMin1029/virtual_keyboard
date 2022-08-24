export class Keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #fnKeyArr;
  #inputEl;

  constructor() {
    this.assignElement();
    this.addEvent();
    this.#fnKeyArr = [
      "Tab",
      "AltLeft",
      "CapsLock",
      "F1",
      "F2",
      "F3",
      "F4",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
    ];
  }

  // 각 요소들에 document를 할당하는 함수
  assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputEl = this.#containerEl.querySelector(".input");
  }

  // 이벤트 연결 함수
  addEvent() {
    // 내장 이벤트 연결
    document.addEventListener("contextmenu", this.#onLeftClickPrevent);
    document.addEventListener("keydown", this.#onPreventFuncKey.bind(this));
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    this.#containerEl.addEventListener("keydown", this.#onKeyDown.bind(this));
    this.#containerEl.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));

    // 사용자 정의 이벤트 함수
    this.#inputEl.addEventListener("inputkey", this.#onWriteKey.bind(this));
  }
  #onMouseDown(event) {
    event.target.closest("div.key")?.classList.add("active");
  }
  // key에 active 효과가 있는지 검사해서 inputkey라는 사용자 정의 함수를 호출
  #onMouseUp(event) {
    const keyEl = event.target.closest("div.key");
    const isActive = keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;
    if (isActive && !!val) {
      this.#inputEl.dispatchEvent(
        new CustomEvent("inputkey", {
          detail: { keyValue: val },
        })
      );
    }
    this.#resetKeyState();
  }
  #onWriteKey(event) {
    const { keyValue } = event.detail;
    if (keyValue === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    } else if (keyValue === "Space") {
      this.#inputEl.value = this.#inputEl.value + " ";
    } else {
      this.#inputEl.value += keyValue;
    }
  }
  #resetKeyState() {
    const keyList = this.#keyboardEl.querySelectorAll(".active");
    keyList.forEach((keyEl) => keyEl.classList.remove("active"));
  }

  // 테마를 변경하는 버튼에 대한 이벤트
  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
  }
  // 글씨체를 변경하는 함수
  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
  }
  #onLeftClickPrevent(event) {
    event.preventDefault();
  }
  // 키보드에 있는 키들 중 특수 키들의 기능을 무시하는 함수
  #onPreventFuncKey(event) {
    this.#fnKeyArr.forEach((keyCode) => {
      if (keyCode == event.code) {
        event.preventDefault();
        return;
      }
    });
  }
  #getKeyActionState(code) {
    const keySelect = this.#keyboardEl.querySelector(`[data-code=${code}]`);
    // f1~f12까지의 키 입력에 대해 오류를 방지하기 위한 조건문
    if (keySelect === null) {
      return { isContain: null, keySelect };
    }
    const isContain = keySelect.classList?.contains("active");
    return { isContain, keySelect };
  }

  // 키보드의 입력을 받는 함수
  #onKeyDown(event) {
    const { isContain, keySelect } = this.#getKeyActionState(event.code);
    if (isContain === null) return;
    // active라는 클래스가 없다면 추가
    if (!isContain) {
      keySelect.classList?.add("active");
    }
  }

  #onKeyUp(event) {
    const { isContain, keySelect } = this.#getKeyActionState(event.code);
    if (isContain === null) return;
    if (isContain) {
      keySelect.classList?.remove("active");
    }
  }
}
