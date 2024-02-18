class passwordGenerator {
    async  generateRandomPassword(): Promise<string> {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
    
        let password = '';
    
        // Add one lowercase character
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    
        // Add one uppercase character
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    
        // Add one number
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    
        // Add remaining characters randomly
        const allChars = lowercaseChars + uppercaseChars + numbers;
        for (let i = 0; i < 5; i++) { // Total characters in password will be 8
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
    
        // Shuffle the characters to ensure randomness
        password = password.split('').sort(() => Math.random() - 0.5).join('');
    
        return password;
    }
    
    
    
}