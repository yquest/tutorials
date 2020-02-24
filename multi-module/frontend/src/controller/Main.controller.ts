import Axios from "axios";
import * as React from "react";
import { util } from "../util";

export interface Controller {
  events: {
    clickUpdate1(e: React.MouseEvent): void;
    clickUpdate2(e: React.MouseEvent): void;
    clickUpdateFrontendList(e: React.MouseEvent): void;
    clickUpdateBackendList(e: React.MouseEvent): void;
    clickUpdateMessage(e: React.MouseEvent): void;
    onChangeInput(e: React.ChangeEvent<HTMLInputElement>): void;
    removeFromFrontend: (value: string) => (e: React.MouseEvent) => void;
    removeFromBackend: (value: string) => (e: React.MouseEvent) => void;
  };
  readonly value1: number;
  readonly value2: number,
  readonly frontEndList: string[];
  readonly backEndList: string[];
  readonly message: string;
  readonly validationState: util.Validationstate;
  readonly validationMessage: string;
}

declare const __state: [];

export function useController(): Controller {
  const [value1, setValue1] = React.useState<number>(0);
  const [value2, setValue2] = React.useState<number>(0);
  const [frontEndList, setFrontEndList] = React.useState<string[]>([]);
  const [backEndList, setBackendList] = React.useState<string[]>(__state);
  const [message, setMessage] = React.useState<string>("");
  const [validated, setValidated] = React.useState(false);
  const [maxList, setMaxList] = React.useState<number>(frontEndList.length);

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }

  function removeFromFrontend(value: string): (e: React.MouseEvent) => void {
    return e => {
      setFrontEndList(frontEndList.filter(c => c !== value))
      e.preventDefault();
    };
  }
  function removeFromBackend(value: string): (e: React.MouseEvent) => void {
    return e => {
      setBackendList(backEndList.filter(c => c !== value))
      e.preventDefault();
    };
  }

  const clickUpdate1 = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue1(value1 + 1);
  }
  const clickUpdate2 = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue2(value1);
  }

  const clickUpdateFrontendList = (e: React.MouseEvent) => {
    e.preventDefault();
    setMaxList(maxList + 1);
    setFrontEndList([...frontEndList, `item id:${maxList}`])
  }
  const clickUpdateBackendList = (e: React.MouseEvent) => {
    e.preventDefault()
    Axios.get("/api/data").then(res => {
      setBackendList(res.data);
    });
  }
  const clickUpdateMessage = (e: React.MouseEvent) => {
    setValidated(true);
    if (createValidationState() === util.Validationstate.VALID){
      Axios.post("/api/send", { message: message });
    }
    e.preventDefault()
  }

  function createValidationState(): util.Validationstate {
    if (!validated) return util.Validationstate.NOT_VALIDATED;
    else if (message.length > 0) return util.Validationstate.VALID;
    else return util.Validationstate.INVALID;
  }

  return {
    get validationState() { return createValidationState() },
    value1, value2, frontEndList, backEndList, message, events: {
      clickUpdate1, clickUpdate2, clickUpdateFrontendList, clickUpdateBackendList, clickUpdateMessage, removeFromBackend, removeFromFrontend, onChangeInput
    },
    get validationMessage(): string {
      switch (createValidationState()) {
        case util.Validationstate.INVALID: return "message is a required field";
        case util.Validationstate.VALID: return "";
        case util.Validationstate.NOT_VALIDATED: return "";
      }
    }
  };
}
