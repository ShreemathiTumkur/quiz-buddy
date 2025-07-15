export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: 'coral' | 'sky-blue' | 'mint-green';
  questions: Question[];
}

export const quizTopics: QuizTopic[] = [
  {
    id: 'animals',
    title: 'Animals',
    description: 'Learn about amazing animals!',
    emoji: '🦁',
    color: 'coral',
    questions: [
      {
        id: 1,
        question: "Which animal is known as the 'King of the Jungle'?",
        options: ["Tiger", "Lion", "Elephant", "Bear"],
        correctAnswer: 1,
        explanation: "Lions are called the 'King of the Jungle' even though they actually live in grasslands!"
      },
      {
        id: 2,
        question: "How many legs does a spider have?",
        options: ["6", "8", "10", "12"],
        correctAnswer: 1,
        explanation: "All spiders have 8 legs, which makes them arachnids, not insects!"
      },
      {
        id: 3,
        question: "What do pandas love to eat?",
        options: ["Fish", "Meat", "Bamboo", "Berries"],
        correctAnswer: 2,
        explanation: "Pandas eat bamboo almost exclusively - up to 40 pounds per day!"
      },
      {
        id: 4,
        question: "Which animal can change its color?",
        options: ["Chameleon", "Dog", "Cat", "Horse"],
        correctAnswer: 0,
        explanation: "Chameleons change color to communicate, regulate temperature, and camouflage!"
      },
      {
        id: 5,
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"],
        correctAnswer: 1,
        explanation: "Blue whales can grow up to 100 feet long and weigh as much as 30 elephants!"
      },
      {
        id: 6,
        question: "How many hearts does an octopus have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "Octopuses have 3 hearts! Two pump blood to the gills, and one pumps blood to the body."
      },
      {
        id: 7,
        question: "Which bird cannot fly?",
        options: ["Eagle", "Penguin", "Parrot", "Owl"],
        correctAnswer: 1,
        explanation: "Penguins can't fly in the air, but they're amazing 'fliers' underwater!"
      },
      {
        id: 8,
        question: "What do koalas mainly eat?",
        options: ["Grass", "Eucalyptus leaves", "Fruits", "Insects"],
        correctAnswer: 1,
        explanation: "Koalas eat eucalyptus leaves almost exclusively and sleep 18-22 hours a day!"
      },
      {
        id: 9,
        question: "Which animal has the longest neck?",
        options: ["Horse", "Ostrich", "Giraffe", "Swan"],
        correctAnswer: 2,
        explanation: "A giraffe's neck can be up to 6 feet long and weighs about 600 pounds!"
      },
      {
        id: 10,
        question: "What sound does a cow make?",
        options: ["Woof", "Meow", "Moo", "Chirp"],
        correctAnswer: 2,
        explanation: "Cows say 'moo' and can actually have different accents depending on where they live!"
      }
    ]
  },
  {
    id: 'math',
    title: 'Math',
    description: 'Fun numbers and counting!',
    emoji: '➕',
    color: 'sky-blue',
    questions: [
      {
        id: 1,
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "5 + 3 = 8. You can count on your fingers to check!"
      },
      {
        id: 2,
        question: "Which number comes after 9?",
        options: ["8", "10", "11", "12"],
        correctAnswer: 1,
        explanation: "After 9 comes 10, which is a special number with two digits!"
      },
      {
        id: 3,
        question: "What is 10 - 4?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
        explanation: "10 - 4 = 6. Try counting backwards from 10!"
      },
      {
        id: 4,
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "A triangle always has exactly 3 sides and 3 corners!"
      },
      {
        id: 5,
        question: "What is 2 × 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 2,
        explanation: "2 × 3 = 6. This means 2 groups of 3, or 3 + 3!"
      },
      {
        id: 6,
        question: "Which number is the smallest?",
        options: ["15", "3", "8", "12"],
        correctAnswer: 1,
        explanation: "3 is the smallest number here. The others are all bigger!"
      },
      {
        id: 7,
        question: "What is half of 8?",
        options: ["2", "3", "4", "6"],
        correctAnswer: 2,
        explanation: "Half of 8 is 4. You can split 8 into two equal groups of 4!"
      },
      {
        id: 8,
        question: "How many corners does a square have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        explanation: "A square has 4 corners and 4 equal sides!"
      },
      {
        id: 9,
        question: "What is 7 + 2?",
        options: ["8", "9", "10", "11"],
        correctAnswer: 1,
        explanation: "7 + 2 = 9. You can use your fingers to count up from 7!"
      },
      {
        id: 10,
        question: "Which number is bigger: 6 or 4?",
        options: ["6", "4", "They're the same", "Can't tell"],
        correctAnswer: 0,
        explanation: "6 is bigger than 4. The number 6 comes after 4 when counting!"
      }
    ]
  },
  {
    id: 'colors',
    title: 'Colors',
    description: 'Learn about beautiful colors!',
    emoji: '🌈',
    color: 'mint-green',
    questions: [
      {
        id: 1,
        question: "What color do you get when you mix red and yellow?",
        options: ["Purple", "Orange", "Green", "Blue"],
        correctAnswer: 1,
        explanation: "Red + Yellow = Orange! Like the color of a beautiful sunset!"
      },
      {
        id: 2,
        question: "What color is the sun?",
        options: ["Blue", "Green", "Yellow", "Purple"],
        correctAnswer: 2,
        explanation: "The sun appears yellow to us! It gives us light and warmth."
      },
      {
        id: 3,
        question: "What color do you get when you mix blue and yellow?",
        options: ["Purple", "Orange", "Green", "Red"],
        correctAnswer: 2,
        explanation: "Blue + Yellow = Green! Like the color of grass and leaves!"
      },
      {
        id: 4,
        question: "What color is an apple usually?",
        options: ["Blue", "Red", "Purple", "Black"],
        correctAnswer: 1,
        explanation: "Apples are often red, though they can also be green or yellow!"
      },
      {
        id: 5,
        question: "What color do you get when you mix red and blue?",
        options: ["Orange", "Green", "Purple", "Yellow"],
        correctAnswer: 2,
        explanation: "Red + Blue = Purple! It's a beautiful royal color!"
      },
      {
        id: 6,
        question: "What color is the ocean?",
        options: ["Red", "Blue", "Yellow", "Green"],
        correctAnswer: 1,
        explanation: "The ocean looks blue because it reflects the color of the sky!"
      },
      {
        id: 7,
        question: "How many colors are in a rainbow?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "A rainbow has 7 colors: Red, Orange, Yellow, Green, Blue, Indigo, and Violet!"
      },
      {
        id: 8,
        question: "What color is snow?",
        options: ["White", "Gray", "Blue", "Silver"],
        correctAnswer: 0,
        explanation: "Snow is white! It's made of tiny ice crystals that reflect all colors."
      },
      {
        id: 9,
        question: "What color are most bananas?",
        options: ["Red", "Blue", "Yellow", "Purple"],
        correctAnswer: 2,
        explanation: "Ripe bananas are yellow! They start green and turn yellow as they ripen."
      },
      {
        id: 10,
        question: "What color do you get when you mix all colors together?",
        options: ["Black", "White", "Gray", "Brown"],
        correctAnswer: 0,
        explanation: "When you mix all paint colors together, you get black or a dark muddy color!"
      }
    ]
  }
];