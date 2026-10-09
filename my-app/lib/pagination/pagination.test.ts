import { describe, it, expect } from 'vitest';
import { parseCursor } from './pagination';

// parseCursor関数のテスト
// expect(実際の値).toBe(期待する値)で、実際の値が期待する値と一致するかを確認する
describe('parseCursor', () => {
    it('正の整数の文字列は数値になる', () => {
        expect(parseCursor('5')).toBe(5);
    });

    it('undefinedはundefinedになる', () => {
        expect(parseCursor(undefined)).toBeUndefined();
    });

    it('0を入力するとundefinedになる', () => {
        expect(parseCursor('0')).toBeUndefined();
    });

    it('-1を入力するとundefinedになる', () => {
        expect(parseCursor('-1')).toBeUndefined();
    });

    it('入力が整数値でない場合はundefinedになる', () => {
        expect(parseCursor('1.5')).toBeUndefined();
        expect(parseCursor('abc')).toBeUndefined();
    });

    it('入力が大きすぎる場合はundefinedになる', () => {
        expect(parseCursor('2147483648')).toBeUndefined(); // 2^31
    });

    it('入力が最大値のギリギリの時は数値として通る', () => {
        expect(parseCursor('2147483647')).toBe(2147483647); // 2^31 - 1
    });

    it('配列が渡された場合はundefinedになる', () => {
        expect(parseCursor(['1', '2'])).toBeUndefined();
    });
});