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
    id: 'math',
    title: 'Math',
    description: 'Numbers and problem solving',
    emoji: '🔢',
    color: 'sky-blue',
    questions: [
      {
        id: 1,
        question: "What is 7 + 5?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "7 + 5 = 12. You can count up from 7!"
      },
      {
        id: 2,
        question: "What is 15 - 8?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "15 - 8 = 7. Try counting backwards from 15!"
      },
      {
        id: 3,
        question: "What is 4 × 3?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "4 × 3 = 12. This means 4 groups of 3!"
      },
      {
        id: 4,
        question: "Which number is bigger: 18 or 15?",
        options: ["18", "15", "They're the same", "Can't tell"],
        correctAnswer: 0,
        explanation: "18 is bigger than 15!"
      },
      {
        id: 5,
        question: "What is half of 14?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "Half of 14 is 7!"
      },
      {
        id: 6,
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
        explanation: "A hexagon has 6 sides!"
      },
      {
        id: 7,
        question: "What is 20 ÷ 4?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
        explanation: "20 ÷ 4 = 5!"
      },
      {
        id: 8,
        question: "What comes next: 2, 4, 6, 8, ?",
        options: ["9", "10", "11", "12"],
        correctAnswer: 1,
        explanation: "The pattern is even numbers, so 10 comes next!"
      },
      {
        id: 9,
        question: "What is 3 + 9?",
        options: ["11", "12", "13", "14"],
        correctAnswer: 1,
        explanation: "3 + 9 = 12!"
      },
      {
        id: 10,
        question: "How many corners does a rectangle have?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "A rectangle has 4 corners!"
      }
    ]
  },
  {
    id: 'volcanoes',
    title: 'Volcanoes',
    description: 'Amazing facts about volcanoes',
    emoji: '🌋',
    color: 'coral',
    questions: [
      {
        id: 1,
        question: "What comes out of a volcano when it erupts?",
        options: ["Water", "Lava", "Snow", "Sand"],
        correctAnswer: 1,
        explanation: "Hot melted rock called lava comes out of volcanoes!"
      },
      {
        id: 2,
        question: "What is the hot liquid rock inside a volcano called?",
        options: ["Magma", "Water", "Ice", "Mud"],
        correctAnswer: 0,
        explanation: "Hot melted rock inside a volcano is called magma!"
      },
      {
        id: 3,
        question: "Which country has the most active volcanoes?",
        options: ["USA", "Japan", "Indonesia", "Italy"],
        correctAnswer: 2,
        explanation: "Indonesia has more than 130 active volcanoes!"
      },
      {
        id: 4,
        question: "What shape do most volcanoes have?",
        options: ["Square", "Triangle", "Cone", "Circle"],
        correctAnswer: 2,
        explanation: "Most volcanoes are cone-shaped like mountains!"
      },
      {
        id: 5,
        question: "Can volcanoes be found underwater?",
        options: ["Yes", "No", "Only in lakes", "Only in rivers"],
        correctAnswer: 0,
        explanation: "Yes! Many volcanoes are underwater in the ocean!"
      },
      {
        id: 6,
        question: "What do we call a volcano that hasn't erupted for a long time?",
        options: ["Active", "Dormant", "Happy", "Sleeping"],
        correctAnswer: 1,
        explanation: "A dormant volcano is one that hasn't erupted recently but might again!"
      },
      {
        id: 7,
        question: "What gas do volcanoes release into the air?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
        correctAnswer: 1,
        explanation: "Volcanoes release carbon dioxide and other gases!"
      },
      {
        id: 8,
        question: "Which famous volcano destroyed the city of Pompeii?",
        options: ["Mount Fuji", "Mount Vesuvius", "Mount Etna", "Kilauea"],
        correctAnswer: 1,
        explanation: "Mount Vesuvius in Italy destroyed Pompeii long ago!"
      },
      {
        id: 9,
        question: "What is volcanic ash made of?",
        options: ["Burned wood", "Tiny rock pieces", "Sand", "Dirt"],
        correctAnswer: 1,
        explanation: "Volcanic ash is made of tiny pieces of rock and glass!"
      },
      {
        id: 10,
        question: "How hot can lava be?",
        options: ["Very cold", "Warm", "Hot", "Extremely hot"],
        correctAnswer: 3,
        explanation: "Lava can be over 1000°C - that's extremely hot!"
      }
    ]
  },
  {
    id: 'telugu',
    title: 'Telugu Vocabulary',
    description: 'Learn Telugu words',
    emoji: '📚',
    color: 'mint-green',
    questions: [
      {
        id: 1,
        question: "What does 'అమ్మ' (Amma) mean in English?",
        options: ["Father", "Mother", "Sister", "Brother"],
        correctAnswer: 1,
        explanation: "అమ్మ (Amma) means Mother!"
      },
      {
        id: 2,
        question: "What does 'నాన్న' (Nanna) mean in English?",
        options: ["Mother", "Father", "Uncle", "Aunt"],
        correctAnswer: 1,
        explanation: "నాన్న (Nanna) means Father!"
      },
      {
        id: 3,
        question: "What does 'పుస్తకం' (Pustakam) mean in English?",
        options: ["Pencil", "Paper", "Book", "Pen"],
        correctAnswer: 2,
        explanation: "పుస్తకం (Pustakam) means Book!"
      },
      {
        id: 4,
        question: "What does 'నీరు' (Neeru) mean in English?",
        options: ["Fire", "Water", "Air", "Earth"],
        correctAnswer: 1,
        explanation: "నీరు (Neeru) means Water!"
      },
      {
        id: 5,
        question: "What does 'సూర్యుడు' (Sooryudu) mean in English?",
        options: ["Moon", "Star", "Sun", "Cloud"],
        correctAnswer: 2,
        explanation: "సూర్యుడు (Sooryudu) means Sun!"
      },
      {
        id: 6,
        question: "What does 'చంద్రుడు' (Chandrudu) mean in English?",
        options: ["Sun", "Moon", "Star", "Earth"],
        correctAnswer: 1,
        explanation: "చంద్రుడు (Chandrudu) means Moon!"
      },
      {
        id: 7,
        question: "What does 'పువ్వు' (Puvvu) mean in English?",
        options: ["Tree", "Leaf", "Flower", "Fruit"],
        correctAnswer: 2,
        explanation: "పువ్వు (Puvvu) means Flower!"
      },
      {
        id: 8,
        question: "What does 'పక్షి' (Pakshi) mean in English?",
        options: ["Fish", "Bird", "Animal", "Insect"],
        correctAnswer: 1,
        explanation: "పక్షి (Pakshi) means Bird!"
      },
      {
        id: 9,
        question: "What does 'ఇల్లు' (Illu) mean in English?",
        options: ["School", "House", "Shop", "Park"],
        correctAnswer: 1,
        explanation: "ఇల్లు (Illu) means House!"
      },
      {
        id: 10,
        question: "What does 'స్నేహితుడు' (Snehitudu) mean in English?",
        options: ["Enemy", "Stranger", "Friend", "Teacher"],
        correctAnswer: 2,
        explanation: "స్నేహితుడు (Snehitudu) means Friend!"
      }
    ]
  }
];