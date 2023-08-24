export interface IFormTypes {
    username: string;
    password: string;
}

export interface IFormValidateErrors extends Partial<IFormTypes> {}
