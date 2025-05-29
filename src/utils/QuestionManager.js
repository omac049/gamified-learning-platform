export class QuestionManager {
    constructor() {
        this.mathQuestions = [
            // Addition problems (3rd grade level)
            { question: "7 + 5 = ?", answer: 12, choices: [10, 11, 12, 13], type: "addition" },
            { question: "9 + 6 = ?", answer: 15, choices: [14, 15, 16, 17], type: "addition" },
            { question: "8 + 7 = ?", answer: 15, choices: [13, 14, 15, 16], type: "addition" },
            { question: "12 + 9 = ?", answer: 21, choices: [20, 21, 22, 23], type: "addition" },
            { question: "15 + 8 = ?", answer: 23, choices: [22, 23, 24, 25], type: "addition" },
            { question: "6 + 9 = ?", answer: 15, choices: [13, 14, 15, 16], type: "addition" },
            { question: "11 + 7 = ?", answer: 18, choices: [16, 17, 18, 19], type: "addition" },
            { question: "13 + 6 = ?", answer: 19, choices: [17, 18, 19, 20], type: "addition" },
            { question: "14 + 5 = ?", answer: 19, choices: [17, 18, 19, 20], type: "addition" },
            { question: "16 + 4 = ?", answer: 20, choices: [18, 19, 20, 21], type: "addition" },
            { question: "17 + 8 = ?", answer: 25, choices: [23, 24, 25, 26], type: "addition" },
            { question: "19 + 6 = ?", answer: 25, choices: [23, 24, 25, 26], type: "addition" },
            
            // Subtraction problems
            { question: "15 - 8 = ?", answer: 7, choices: [6, 7, 8, 9], type: "subtraction" },
            { question: "12 - 5 = ?", answer: 7, choices: [6, 7, 8, 9], type: "subtraction" },
            { question: "20 - 9 = ?", answer: 11, choices: [10, 11, 12, 13], type: "subtraction" },
            { question: "18 - 6 = ?", answer: 12, choices: [10, 11, 12, 13], type: "subtraction" },
            { question: "25 - 7 = ?", answer: 18, choices: [16, 17, 18, 19], type: "subtraction" },
            { question: "14 - 9 = ?", answer: 5, choices: [4, 5, 6, 7], type: "subtraction" },
            { question: "22 - 8 = ?", answer: 14, choices: [12, 13, 14, 15], type: "subtraction" },
            { question: "19 - 7 = ?", answer: 12, choices: [10, 11, 12, 13], type: "subtraction" },
            { question: "16 - 9 = ?", answer: 7, choices: [5, 6, 7, 8], type: "subtraction" },
            { question: "21 - 6 = ?", answer: 15, choices: [13, 14, 15, 16], type: "subtraction" },
            { question: "23 - 9 = ?", answer: 14, choices: [12, 13, 14, 15], type: "subtraction" },
            { question: "17 - 8 = ?", answer: 9, choices: [7, 8, 9, 10], type: "subtraction" },
            
            // Multiplication problems (basic facts)
            { question: "3 × 4 = ?", answer: 12, choices: [10, 11, 12, 13], type: "multiplication" },
            { question: "5 × 6 = ?", answer: 30, choices: [25, 28, 30, 32], type: "multiplication" },
            { question: "7 × 8 = ?", answer: 56, choices: [54, 56, 58, 60], type: "multiplication" },
            { question: "4 × 9 = ?", answer: 36, choices: [32, 34, 36, 38], type: "multiplication" },
            { question: "6 × 7 = ?", answer: 42, choices: [40, 42, 44, 46], type: "multiplication" },
            { question: "8 × 9 = ?", answer: 72, choices: [70, 72, 74, 76], type: "multiplication" },
            { question: "3 × 7 = ?", answer: 21, choices: [18, 20, 21, 24], type: "multiplication" },
            { question: "4 × 6 = ?", answer: 24, choices: [20, 22, 24, 26], type: "multiplication" },
            { question: "5 × 8 = ?", answer: 40, choices: [35, 38, 40, 42], type: "multiplication" },
            { question: "6 × 9 = ?", answer: 54, choices: [48, 52, 54, 56], type: "multiplication" },
            { question: "7 × 7 = ?", answer: 49, choices: [42, 45, 49, 52], type: "multiplication" },
            { question: "8 × 6 = ?", answer: 48, choices: [42, 45, 48, 51], type: "multiplication" },
            
            // Division problems
            { question: "24 ÷ 6 = ?", answer: 4, choices: [3, 4, 5, 6], type: "division" },
            { question: "35 ÷ 7 = ?", answer: 5, choices: [4, 5, 6, 7], type: "division" },
            { question: "48 ÷ 8 = ?", answer: 6, choices: [5, 6, 7, 8], type: "division" },
            { question: "36 ÷ 9 = ?", answer: 4, choices: [3, 4, 5, 6], type: "division" },
            { question: "42 ÷ 7 = ?", answer: 6, choices: [5, 6, 7, 8], type: "division" },
            { question: "54 ÷ 9 = ?", answer: 6, choices: [5, 6, 7, 8], type: "division" },
            { question: "32 ÷ 8 = ?", answer: 4, choices: [3, 4, 5, 6], type: "division" },
            { question: "28 ÷ 7 = ?", answer: 4, choices: [3, 4, 5, 6], type: "division" },
            { question: "45 ÷ 9 = ?", answer: 5, choices: [4, 5, 6, 7], type: "division" },
            { question: "56 ÷ 8 = ?", answer: 7, choices: [6, 7, 8, 9], type: "division" },
        ];

        this.readingQuestions = [
            {
                passage: "The cat sat on the mat. It was a sunny day. The cat liked to watch birds fly by the window.",
                question: "Where did the cat sit?",
                answer: "on the mat",
                choices: ["on the chair", "on the mat", "on the bed", "on the floor"],
                type: "comprehension"
            },
            {
                passage: "Birds can fly high in the sky. They have wings and feathers. Birds build nests to keep their eggs safe.",
                question: "What helps birds fly?",
                answer: "wings and feathers",
                choices: ["legs and tail", "wings and feathers", "eyes and beak", "claws and feet"],
                type: "comprehension"
            },
            {
                passage: "Sarah loves to read books. Every night before bed, she reads for 30 minutes. Her favorite books are about adventures.",
                question: "When does Sarah like to read?",
                answer: "before bed",
                choices: ["in the morning", "before bed", "during lunch", "after school"],
                type: "comprehension"
            },
            {
                passage: "The library is a quiet place where people go to read and study. You can borrow books for free with a library card.",
                question: "What do you need to borrow books?",
                answer: "a library card",
                choices: ["money", "a library card", "a backpack", "a pencil"],
                type: "comprehension"
            },
            {
                passage: "Dogs are loyal pets. They love to play fetch and go for walks. Dogs wag their tails when they are happy.",
                question: "What do dogs do when they are happy?",
                answer: "wag their tails",
                choices: ["bark loudly", "wag their tails", "run away", "hide"],
                type: "comprehension"
            },
            {
                passage: "The ocean is home to many sea creatures. Fish, whales, and dolphins all live in the salty water. Coral reefs provide shelter for small fish.",
                question: "What provides shelter for small fish?",
                answer: "coral reefs",
                choices: ["big rocks", "coral reefs", "seaweed", "sand"],
                type: "comprehension"
            },
            {
                passage: "Bees are important insects. They help flowers grow by carrying pollen from one flower to another. Bees also make honey.",
                question: "How do bees help flowers grow?",
                answer: "by carrying pollen",
                choices: ["by eating leaves", "by carrying pollen", "by making noise", "by digging holes"],
                type: "comprehension"
            }
        ];

        this.scienceQuestions = [
            {
                question: "What do plants need to grow?",
                answer: "water and sunlight",
                choices: ["only water", "water and sunlight", "only soil", "only air"],
                type: "biology"
            },
            {
                question: "What happens when you mix red and blue?",
                answer: "purple",
                choices: ["green", "orange", "purple", "yellow"],
                type: "chemistry"
            },
            {
                question: "Which planet is closest to the Sun?",
                answer: "Mercury",
                choices: ["Venus", "Mercury", "Earth", "Mars"],
                type: "astronomy"
            },
            {
                question: "What do we call animals that eat only plants?",
                answer: "herbivores",
                choices: ["carnivores", "herbivores", "omnivores", "predators"],
                type: "biology"
            },
            {
                question: "What causes day and night?",
                answer: "Earth spinning",
                choices: ["Moon moving", "Earth spinning", "Sun moving", "Clouds covering"],
                type: "astronomy"
            },
            {
                question: "What is the hardest natural substance?",
                answer: "diamond",
                choices: ["gold", "diamond", "iron", "silver"],
                type: "geology"
            },
            {
                question: "How many legs does an insect have?",
                answer: "6",
                choices: ["4", "6", "8", "10"],
                type: "biology"
            },
            {
                question: "What gas do plants give off during photosynthesis?",
                answer: "oxygen",
                choices: ["carbon dioxide", "oxygen", "nitrogen", "hydrogen"],
                type: "biology"
            },
            {
                question: "What is the center of our solar system?",
                answer: "the Sun",
                choices: ["the Moon", "the Sun", "Earth", "Jupiter"],
                type: "astronomy"
            },
            {
                question: "What happens to water when it freezes?",
                answer: "it becomes ice",
                choices: ["it disappears", "it becomes ice", "it becomes gas", "it becomes hot"],
                type: "physics"
            }
        ];

        this.historyQuestions = [
            {
                question: "Who was the first President of the United States?",
                answer: "George Washington",
                choices: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
                type: "presidents"
            },
            {
                question: "What holiday celebrates America's independence?",
                answer: "July 4th",
                choices: ["Memorial Day", "July 4th", "Labor Day", "Veterans Day"],
                type: "holidays"
            },
            {
                question: "Which ocean did Christopher Columbus cross to reach America?",
                answer: "Atlantic Ocean",
                choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
                type: "exploration"
            },
            {
                question: "What did the Pilgrims celebrate with the first Thanksgiving?",
                answer: "a good harvest",
                choices: ["a birthday", "a good harvest", "a wedding", "a new house"],
                type: "holidays"
            },
            {
                question: "Who wrote the Declaration of Independence?",
                answer: "Thomas Jefferson",
                choices: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"],
                type: "founding_fathers"
            },
            {
                question: "What was the name of the ship the Pilgrims sailed on?",
                answer: "Mayflower",
                choices: ["Titanic", "Mayflower", "Santa Maria", "Pinta"],
                type: "exploration"
            },
            {
                question: "Which President is on the penny?",
                answer: "Abraham Lincoln",
                choices: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "Theodore Roosevelt"],
                type: "presidents"
            },
            {
                question: "What do we call the 13 original colonies' fight for independence?",
                answer: "Revolutionary War",
                choices: ["Civil War", "Revolutionary War", "World War", "French War"],
                type: "wars"
            },
            {
                question: "Who helped Lewis and Clark explore the western United States?",
                answer: "Sacagawea",
                choices: ["Pocahontas", "Sacagawea", "Sitting Bull", "Squanto"],
                type: "exploration"
            },
            {
                question: "What document begins with 'We the People'?",
                answer: "Constitution",
                choices: ["Declaration", "Constitution", "Bill of Rights", "Pledge"],
                type: "documents"
            }
        ];

        // Vocabulary questions for reading enhancement
        this.vocabularyQuestions = [
            {
                question: "What does 'enormous' mean?",
                answer: "very big",
                choices: ["very small", "very big", "very fast", "very slow"],
                type: "vocabulary"
            },
            {
                question: "What does 'ancient' mean?",
                answer: "very old",
                choices: ["very new", "very old", "very clean", "very dirty"],
                type: "vocabulary"
            },
            {
                question: "What does 'furious' mean?",
                answer: "very angry",
                choices: ["very happy", "very angry", "very sad", "very tired"],
                type: "vocabulary"
            },
            {
                question: "What does 'brilliant' mean?",
                answer: "very smart",
                choices: ["very dull", "very smart", "very dark", "very quiet"],
                type: "vocabulary"
            }
        ];
    }

    getRandomMathQuestion(type = null) {
        let questions = this.mathQuestions;
        if (type) {
            questions = this.mathQuestions.filter(q => q.type === type);
        }
        return questions[Math.floor(Math.random() * questions.length)];
    }

    getRandomReadingQuestion() {
        return this.readingQuestions[Math.floor(Math.random() * this.readingQuestions.length)];
    }

    getRandomScienceQuestion() {
        return this.scienceQuestions[Math.floor(Math.random() * this.scienceQuestions.length)];
    }

    getRandomHistoryQuestion() {
        return this.historyQuestions[Math.floor(Math.random() * this.historyQuestions.length)];
    }

    getRandomVocabularyQuestion() {
        return this.vocabularyQuestions[Math.floor(Math.random() * this.vocabularyQuestions.length)];
    }

    // Get mixed questions for crossover week
    getRandomMixedQuestion() {
        const allQuestions = [
            ...this.mathQuestions,
            ...this.readingQuestions,
            ...this.scienceQuestions,
            ...this.historyQuestions,
            ...this.vocabularyQuestions
        ];
        return allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }

    // Method to add more questions dynamically
    addMathQuestion(question, answer, choices, type) {
        this.mathQuestions.push({ question, answer, choices, type });
    }

    addReadingQuestion(passage, question, answer, choices, type) {
        this.readingQuestions.push({ passage, question, answer, choices, type });
    }

    addScienceQuestion(question, answer, choices, type) {
        this.scienceQuestions.push({ question, answer, choices, type });
    }

    addHistoryQuestion(question, answer, choices, type) {
        this.historyQuestions.push({ question, answer, choices, type });
    }

    // Validate answer
    checkAnswer(userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    }

    // Get questions by difficulty (for adaptive learning)
    getQuestionsByDifficulty(subject, difficulty = 'medium') {
        // This could be expanded to categorize questions by difficulty
        switch(subject) {
            case 'math':
                if (difficulty === 'easy') {
                    return this.mathQuestions.filter(q => q.type === 'addition');
                } else if (difficulty === 'hard') {
                    return this.mathQuestions.filter(q => q.type === 'multiplication' || q.type === 'division');
                } else {
                    return this.mathQuestions.filter(q => q.type === 'subtraction');
                }
            default:
                return this.getRandomMathQuestion();
        }
    }

    // Get question count for progress tracking
    getQuestionCount(subject) {
        switch(subject) {
            case 'math': return this.mathQuestions.length;
            case 'reading': return this.readingQuestions.length;
            case 'science': return this.scienceQuestions.length;
            case 'history': return this.historyQuestions.length;
            case 'vocabulary': return this.vocabularyQuestions.length;
            default: return 0;
        }
    }

    // Generate question method that Week1MathScene expects
    generateQuestion(subject, difficulty = 'medium') {
        let rawQuestion;
        
        switch(subject.toLowerCase()) {
            case 'math':
                // Improved difficulty mapping with more variety
                if (difficulty === 'Easy') {
                    // Easy: Mix of addition and simple subtraction
                    const easyTypes = ['addition'];
                    const simpleSubtraction = this.mathQuestions.filter(q => 
                        q.type === 'subtraction' && parseInt(q.question.split(' - ')[0]) <= 15
                    );
                    const additionQuestions = this.mathQuestions.filter(q => q.type === 'addition');
                    const easyQuestions = [...additionQuestions, ...simpleSubtraction];
                    rawQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)];
                } else if (difficulty === 'Hard') {
                    // Hard: Mix of multiplication and division
                    const hardTypes = ['multiplication', 'division'];
                    const selectedType = hardTypes[Math.floor(Math.random() * hardTypes.length)];
                    rawQuestion = this.getRandomMathQuestion(selectedType);
                } else if (difficulty === 'Expert') {
                    // Expert: All types with emphasis on multiplication and division
                    const expertQuestions = this.mathQuestions.filter(q => 
                        q.type === 'multiplication' || q.type === 'division'
                    );
                    // Add some challenging addition/subtraction
                    const challengingArithmetic = this.mathQuestions.filter(q => 
                        (q.type === 'addition' && parseInt(q.question.split(' + ')[0]) >= 12) ||
                        (q.type === 'subtraction' && parseInt(q.question.split(' - ')[0]) >= 18)
                    );
                    const allExpertQuestions = [...expertQuestions, ...challengingArithmetic];
                    rawQuestion = allExpertQuestions[Math.floor(Math.random() * allExpertQuestions.length)];
                } else {
                    // Medium difficulty - Mix of all types for variety
                    const mediumQuestions = this.mathQuestions.filter(q => 
                        q.type === 'subtraction' || 
                        q.type === 'addition' || 
                        (q.type === 'multiplication' && parseInt(q.question.split(' × ')[0]) <= 6)
                    );
                    rawQuestion = mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)];
                }
                break;
            case 'reading':
                rawQuestion = this.getRandomReadingQuestion();
                break;
            case 'science':
                rawQuestion = this.getRandomScienceQuestion();
                break;
            case 'history':
                rawQuestion = this.getRandomHistoryQuestion();
                break;
            case 'vocabulary':
                rawQuestion = this.getRandomVocabularyQuestion();
                break;
            default:
                // Default to random math question from all types
                rawQuestion = this.getRandomMathQuestion();
        }
        
        if (!rawQuestion) {
            // Enhanced fallback with random generation
            const operations = ['+', '-', '×'];
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let num1, num2, answer, choices;
            
            switch(operation) {
                case '+':
                    num1 = Math.floor(Math.random() * 15) + 5;
                    num2 = Math.floor(Math.random() * 10) + 3;
                    answer = num1 + num2;
                    choices = [answer - 2, answer - 1, answer, answer + 1];
                    break;
                case '-':
                    num1 = Math.floor(Math.random() * 20) + 10;
                    num2 = Math.floor(Math.random() * (num1 - 5)) + 3;
                    answer = num1 - num2;
                    choices = [answer - 1, answer, answer + 1, answer + 2];
                    break;
                case '×':
                    num1 = Math.floor(Math.random() * 8) + 2;
                    num2 = Math.floor(Math.random() * 8) + 2;
                    answer = num1 * num2;
                    choices = [answer - 3, answer - 1, answer, answer + 2];
                    break;
            }
            
            // Shuffle choices
            choices = choices.sort(() => Math.random() - 0.5);
            
            rawQuestion = {
                question: `${num1} ${operation} ${num2} = ?`,
                answer: answer,
                choices: choices,
                type: operation === '+' ? 'addition' : operation === '-' ? 'subtraction' : 'multiplication'
            };
        }
        
        // Convert to expected format for Week1MathScene
        return {
            question: rawQuestion.question,
            correctAnswer: rawQuestion.answer,
            options: rawQuestion.choices || [],
            type: rawQuestion.type || 'unknown',
            passage: rawQuestion.passage || null // For reading questions
        };
    }
} 