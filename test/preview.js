"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VeloraDemo {
    developer;
    constructor(developer) {
        this.developer = developer;
    }
    greet() {
        // Preview the Velora syntax palette
        const message = `Hello, ${this.developer.name}!`;
        const years = this.developer.experience;
        if (years > 2 && this.developer.isActive) {
            return `${message} Experienced developer.`;
        }
        return message;
    }
}
const developer = {
    name: "Sami",
    experience: 3,
    isActive: true
};
console.log(new VeloraDemo(developer).greet());
//# sourceMappingURL=preview.js.map