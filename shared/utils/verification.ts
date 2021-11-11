export const generateVerificationCode = (): string => {
    return String(Math.random()).substring(2, 11);
}