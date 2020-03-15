export namespace util {
  export enum Validationstate {
    VALID,
    INVALID,
    NOT_VALIDATED
  }
  export function validationState2ControllerClass(
    state: Validationstate
  ): string {
    switch (state) {
      case Validationstate.INVALID:
        return " is-invalid";
      case Validationstate.NOT_VALIDATED:
        return "";
      case Validationstate.VALID:
        return " is-valid";
    }
  }
}
