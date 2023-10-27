export interface ILoginFormTypes {
    username: string;
    password: string;
}

export type IPinCodeFormTypes = string[];

export interface IPassFormTypes {
    password: string;
    confirmPassword: string;
}

export interface IFormValidateErrors extends Partial<ILoginFormTypes> {}
