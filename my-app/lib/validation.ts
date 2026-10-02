// 入力をここでバリデーションを行う。
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const POST_MAX_LENGTH = 280;

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

// サインアップ時のバリデーションを行う関数
export function validateSignup(formData: FormData): SignupValidationResult {
    const input: SignupInput = {
        username: getString(formData, 'username').trim(),
        email: getString(formData, 'email').trim().toLowerCase(),
        password: getString(formData, 'password').trim(),
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

/* ログイン時のバリデーション処理 */
export type LoginInput = {
    email: string;
    password: string;
};

export type LoginErrors = Partial<Record<keyof LoginInput, string>>;

export type LoginValidationResult = 
    | { success: true; data: LoginInput }
    | { success: false; errors: LoginErrors };

// ログイン時のバリデーションを行う関数
export function validateLogin(formData: FormData): LoginValidationResult{
    const input: LoginInput = {
        email: getString(formData, 'email').trim().toLowerCase(),
        password: getString(formData, 'password').trim(),
    };

    const errors: LoginErrors = {};
    if(input.email === ''){
        errors.email = 'メールアドレスを入力してください';
    }else if(input.email.length > EMAIL_MAX_LENGTH){
        errors.email = `メールアドレスは${EMAIL_MAX_LENGTH}文字以内で入力してください`;
    }
    if(input.password === ''){
        errors.password = 'パスワードを入力してください';
    }else if(input.password.length > PASSWORD_MAX_LENGTH){
        errors.password = `パスワードは${PASSWORD_MAX_LENGTH}文字以内で入力してください`;
    }

    if(Object.keys(errors).length > 0){
        return { success: false, errors }; 
    }
    return { success: true, data: input };
}

// 投稿時のバリデーション処理
export type PostInput = {
    content: string;
};

export type PostErrors = Partial<Record<keyof PostInput, string>>;

export type PostValidationResult = 
    | { success: true; data: PostInput }
    | { success: false; errors: PostErrors };

// 投稿時のバリデーションを行う関数
export function validatePost(formData: FormData): PostValidationResult{
    const content = getString(formData, 'content').replace(/\r\n/g, '\n').trim();

    if(content === ''){
        return { success: false, errors: { content: '投稿内容を入力してください' } };
    }
    if([...content].length > POST_MAX_LENGTH){
        return { success: false, errors: { content: `投稿内容は${POST_MAX_LENGTH}文字以内で入力してください` } };
    }
    return { success: true, data: { content } };
}