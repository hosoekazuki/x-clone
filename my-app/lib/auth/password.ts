// パスワードハッシュ用の関数をここに記述する 
import 'server-only';
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const SCRYPT_PARAMS = { N: 2 ** 17, r: 8, p: 1 };
const SCRYPT_MAXMEM = 256 * 1024 * 1024; // 256MB
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

// scryptをPromiseでラップする関数
function scryptAsync(
    password: string,
    salt: Buffer,
    keyLength: number,
    options: ScryptOptions,
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, keyLength, options, (err, derivedKey) => {
            if(err){
                reject(err);
            } else {
                resolve(derivedKey);
            }
        });
    })
}

// パスワードをハッシュ化する関数
export async function hashPassword(password: string): Promise<string>{
    const salt = randomBytes(SALT_LENGTH);
    const hash = await scryptAsync(password, salt, KEY_LENGTH, {
        ...SCRYPT_PARAMS,
        maxmem: SCRYPT_MAXMEM,
    });
    return [
        'scrypt',
        SCRYPT_PARAMS.N,
        SCRYPT_PARAMS.r,
        SCRYPT_PARAMS.p,
        salt.toString('base64'),
        hash.toString('base64')
    ].join('$');
}

// パスワードを検証する関数
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean>{
    const [algorithm, N, r, p, saltB64, hashB64] = hashedPassword.split('$');
    if(algorithm !== 'scrypt' || !N || !r || !p || !saltB64 || !hashB64){
        return false;
    }
    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(hashB64, 'base64');
    const actual = await scryptAsync(password, salt, expected.length, {
        N: Number(N),
        r: Number(r),
        p: Number(p),
        maxmem: SCRYPT_MAXMEM,
    });

    return timingSafeEqual(expected, actual);

}
