export default class AstValidation {
  private _errors: never[];
  ast: any;
  constructor(ast: any) {
    this._errors = [];
    this.ast = ast;
  }

  get errors() {
    return this._errors;
  }
}
