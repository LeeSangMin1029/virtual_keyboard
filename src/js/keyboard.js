export class Keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #fnKeyArr;
  #inputEl;
  #language;
  #convertKeyEl;
  #hangul;

  constructor() {
    this.assignElement();
    this.addEvent();
    this.#hangul = require("hangul-js");
    this.#language = "eng";
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
    ];
  }

  // 각 요소들에 document를 할당하는 함수
  assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputEl = this.#containerEl.querySelector(".input");
    this.#convertKeyEl = this.#containerEl.querySelector(".convert-key");
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
    this.#convertKeyEl.addEventListener(
      "click",
      this.#onChangeLanguage.bind(this)
    );

    // 사용자 정의 이벤트 함수
    this.#inputEl.addEventListener("inputkey", this.#onWriteKey.bind(this));
  }
  #onMouseDown(event) {
    event.target.closest("div.key-wrap")?.classList.add("active");
  }
  // 한/영 키를 눌렀을 때 발생하는 이벤트 함수
  #onChangeLanguage() {
    const viewEl = this.#convertKeyEl.querySelector(".view");
    this.#language = viewEl.dataset.languageto;
    const children = this.#convertKeyEl.children;
    children[0].classList.toggle("view");
    children[1].classList.toggle("view");
    const root = document.querySelector(":root");
    // 한글과 영어로 변경됐을 때 위치와 회전율에 해당하는 변수를 수정
    if (this.#language === "kor") {
      root.style.setProperty("--front", 0);
      root.style.setProperty("--back", 1);
      root.style.setProperty("--front-rotate", "180deg");
      root.style.setProperty("--back-rotate", "0deg");
    } else if (this.#language === "eng") {
      root.style.setProperty("--front", 1);
      root.style.setProperty("--back", 0);
      root.style.setProperty("--front-rotate", "360deg");
      root.style.setProperty("--back-rotate", "180deg");
    }
  }
  // key에 active 효과가 있는지 검사해서 inputkey라는 사용자 정의 함수를 호출
  #onMouseUp(event) {
    const keyWrapEl = event.target.closest("div.key-wrap");
    const keyEl = keyWrapEl?.querySelector(
      `.key-${this.#language === "eng" ? "front" : "back"}`
    );
    const isActive = keyWrapEl?.classList.contains("active");
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
      const hangulProsessing = this.#hangul.assemble([
        ...this.#inputEl.value,
        keyValue,
      ]);
      this.#inputEl.value = hangulProsessing;
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
    const tmpEl = this.#keyboardEl.querySelector(`[data-code=${code}]`);
    const keySelect = tmpEl?.closest(".key-wrap");
    // f1~f12 등 키 입력에 대해 오류를 방지하기 위한 조건문
    if (keySelect === null || keySelect === undefined) {
      return { isContain: null, keySelect };
    }
    const isContain = keySelect.classList?.contains("active");
    return { isContain, keySelect };
  }

  // 키보드의 입력을 받아서 active 효과를 주는 함수
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
