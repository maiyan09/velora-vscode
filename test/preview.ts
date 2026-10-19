
interface Developer {
  name: string;
  experience: number;
  isActive: boolean;
}

class VeloraDemo {
  constructor(private developer: Developer) {}

  public greet(): string {
    // Preview the Velora syntax palette
    const message = `Hello, ${this.developer.name}!`;
    const years = this.developer.experience;

    if (years > 2 && this.developer.isActive) {
      return `${message} Experienced developer.`;
    }

    return message;
  }
}

const developer: Developer = {
  name: "Sami",
  experience: 3,
  isActive: true
};

console.log(new VeloraDemo(developer).greet());
