// 入力をここでバリデーションを行う。
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = {
    username: string;
    email: string;
    password: string;
};

export type SignupErrors = Partial<Record<keyof SignupInput, string>>;

export type SignupValidationResult = 
    | { success: true; data: SignupInput }
    | { success: false; errors: SignupErrors };

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
}

function validateUsername(username: string): string | undefined {
    if(username === ''){
        return 'Username is required';
    }
    if(username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH){
        return `username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`;
    }
    if(!USERNAME_PATTERN.test(username)){
        return 'username can only contain letters, numbers, and underscores';
    }
    return undefined;
}

function validateEmail(email: string): string | undefined{
    if(email === ''){
        return 'Email is required';
    }
    if(email.length > EMAIL_MAX_LENGTH){
        return `Email must be no more than ${EMAIL_MAX_LENGTH} characters`;
    }
    if(!EMAIL_PATTERN.test(email)){
        return 'Email must be a valid email address';
    }
    return undefined;
}

function validatePassword(password: string): string | undefined {
    if(password === ''){
        return 'Password is required';
    }
    if(password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH){
        return `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`;
    }
    return undefined;
}

export function validateSignup(formData: FormData): SignupValidationResult {
    const input: SignupInput = {
        username: getString(formData, 'username').trim(),
        email: getString(formData, 'email').trim().toLowerCase(),
        password: getString(formData, 'password'),
    };

    const errors: SignupErrors = {
        username: validateUsername(input.username),
        email: validateEmail(input.email),
        password: validatePassword(input.password),
    };

    if(Object.values(errors).some(Boolean)){
        return {success: false, errors};
    }
    return {success: true, data: input};
}
