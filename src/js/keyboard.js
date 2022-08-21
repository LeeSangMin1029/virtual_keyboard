import "../public/img/reset.png";
export class Keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #resetBtnEl;
  #keyboardEl;
  #fnKeyArr;
  #keyActionState;

  constructor() {
    this.assignElement();
    this.addEvent();
    this.#fnKeyArr = ["Tab", "AltLeft", "CapsLock"];
    this.#keyActionState = [];
  }

  // 각 요소들에 document를 할당하는 함수
  assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#resetBtnEl = this.#containerEl.querySelector(".btn-reset");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
  }

  // 이벤트 연결 함수
  addEvent() {
    document.addEventListener("contextmenu", this.#onLeftClickPrevent);
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    this.#containerEl.addEventListener("keydown", this.#onKeyDown.bind(this));
    this.#containerEl.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#resetBtnEl.addEventListener(
      "click",
      this.#resetKeyboardAction.bind(this)
    );
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
  // 키보드의 눌림 현상을 제거하는 함수
  #resetKeyboardAction(event) {
    event.preventDefault();
    this.#keyActionState.forEach((keyEl) => {
      keyEl.classList.remove("active");
    });
    this.#keyActionState.splice(0, this.#keyActionState.length);
  }
  #getKeyActionState(code) {
    const keySelect = this.#keyboardEl.querySelector(`[data-code=${code}]`);
    const result = keySelect.classList?.contains("active");
    return [result, keySelect];
  }

  // 키보드의 입력을 받는 함수
  #onKeyDown(event) {
    this.#onPreventFuncKey(event);
    const [result, keyEl] = this.#getKeyActionState(event.code);
    // active라는 클래스가 없다면 추가
    if (!result) {
      keyEl.classList?.add("active");
      this.#keyActionState.push(keyEl);
    }
  }

  #onKeyUp(event) {
    const [result, keyEl] = this.#getKeyActionState(event.code);
    if (result) {
      keyEl.classList?.remove("active");
      this.#keyActionState.pop();
    }
  }
}
