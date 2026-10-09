import {describe, it, expect} from 'vitest';
import { validateUsername, validateEmail, validatePassword } from './validation';

// validateUsername関数のテスト
describe('validateUsername', () => {
    it('空文字の場合はエラーになる', () => {
        expect(validateUsername('')).toBe('Username is required');
    });

    it('有効なユーザー名の場合はundefinedを返す', () => {
        expect(validateUsername('valid_username')).toBeUndefined();
    });

    it('短すぎる場合はエラーになる', () => {
        expect(validateUsername('ab')).toBe('username must be between 4 and 15 characters');
    });
   
    it('4文字は通る', () => {
        expect(validateUsername('abcd')).toBeUndefined();
    });

    it('長すぎる場合はエラーになる', () => {
        expect(validateUsername('a'.repeat(16))).toBe('username must be between 4 and 15 characters');
    });

    it('15文字は通る', () => {
        expect(validateUsername('a'.repeat(15))).toBeUndefined();
    });

    it('不正な文字が含まれる場合はエラーになる', () => {
        expect(validateUsername('user!name')).toBe('username can only contain letters, numbers, and underscores');
    });
});

// validateEmail関数のテスト
describe('validateEmail', () => {
    it('空文字の場合はエラーになる', () => {
        expect(validateEmail('')).toBe('Email is required');
    });

    it('有効なメールアドレスの場合はundefinedを返す', () => {
        expect(validateEmail('user@example.com')).toBeUndefined();
    });

    it('長すぎる場合はエラーになる', () => {
        expect(validateEmail('a'.repeat(244) + '@example.com')).toBe('Email must be no more than 255 characters');
    });
    
    it('不正な形式の場合はエラーになる', () => {
        expect(validateEmail('invalid-email')).toBe('Email must be a valid email address');
    });
});

// validatePassword関数のテスト
describe('validatePassword', () => {
    it('空文字の場合はエラーになる', () => {
        expect(validatePassword('')).toBe('Password is required');
    });

    it('有効なパスワードの場合はundefinedを返す', () => {
        expect(validatePassword('validpassword')).toBeUndefined();
    });

    it('短すぎる場合はエラーになる', () => {
        expect(validatePassword('a'.repeat(7))).toBe('Password must be between 8 and 64 characters');
    });

    it('長すぎる場合はエラーになる', () => {
        expect(validatePassword('a'.repeat(65))).toBe('Password must be between 8 and 64 characters');
    });

    it('8文字は通る', () => {
        expect(validatePassword('a'.repeat(8))).toBeUndefined();
    });

    it('64文字は通る', () => {
        expect(validatePassword('a'.repeat(64))).toBeUndefined();
    });
});
