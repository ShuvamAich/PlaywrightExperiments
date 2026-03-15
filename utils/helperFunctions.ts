export function generateRandomEmail(): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user_${randomString}@example.com`;
}

export function generateRandomPassword(length: number = 12): string {
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*_-';
const allChars = lowercase + uppercase + numbers + symbols;

if (length < 8) {
throw new Error('Password length must be at least 8');
}

const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

// Ensure at least one from each required group
const passwordChars = [
pick(lowercase),
pick(uppercase),
pick(numbers),
pick(symbols),
];

for (let i = passwordChars.length; i < length; i++) {
passwordChars.push(pick(allChars));
}

// Shuffle to avoid fixed positions for required chars
for (let i = passwordChars.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
}

return passwordChars.join('');
}