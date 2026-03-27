// Word, Sentence, Paragraph Generator
class TextGenerator {
    constructor() {
        this.words = [
            'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
            'apple', 'banana', 'cherry', 'grape', 'orange', 'lemon', 'lime',
            'house', 'car', 'tree', 'water', 'fire', 'earth', 'air',
            'computer', 'keyboard', 'mouse', 'screen', 'internet', 'website',
            'beautiful', 'amazing', 'wonderful', 'fantastic', 'incredible',
            'running', 'jumping', 'swimming', 'flying', 'walking', 'talking',
            'happy', 'sad', 'angry', 'excited', 'bored', 'tired', 'sleepy',
            'morning', 'afternoon', 'evening', 'night', 'day', 'week', 'month', 'year'
        ];

        this.nouns = [
            'cat', 'dog', 'bird', 'fish', 'elephant', 'tiger', 'lion', 'bear',
            'house', 'car', 'tree', 'river', 'mountain', 'ocean', 'forest', 'city',
            'person', 'teacher', 'doctor', 'student', 'engineer', 'artist', 'musician',
            'book', 'computer', 'phone', 'camera', 'painting', 'song', 'movie'
        ];

        this.verbs = [
            'runs', 'jumps', 'swims', 'flies', 'walks', 'talks', 'reads', 'writes',
            'eats', 'drinks', 'sleeps', 'works', 'plays', 'studies', 'teaches', 'learns',
            'creates', 'builds', 'designs', 'paints', 'sings', 'dances', 'plays', 'watches'
        ];

        this.adjectives = [
            'beautiful', 'amazing', 'wonderful', 'fantastic', 'incredible',
            'happy', 'sad', 'angry', 'excited', 'bored', 'tired', 'sleepy',
            'big', 'small', 'large', 'tiny', 'huge', 'enormous', 'massive',
            'bright', 'dark', 'light', 'heavy', 'fast', 'slow', 'quick'
        ];

        this.connectors = [
            'and', 'but', 'or', 'so', 'because', 'although', 'while', 'when',
            'if', 'unless', 'since', 'until', 'after', 'before', 'during', 'while'
        ];

        this.initializeEventListeners();
        this.generateText(); // Generate initial text
    }

    initializeEventListeners() {
        const generateBtn = document.getElementById('generateBtn');
        const copyBtn = document.getElementById('copyBtn');
        const output = document.getElementById('output');

        generateBtn.addEventListener('click', () => this.generateText());
        copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Update stats when text changes
        output.addEventListener('input', () => this.updateStats());

        // Also update stats on initial load
        this.updateStats();
    }

    generateText() {
        const type = document.getElementById('generatorType').value;
        const count = parseInt(document.getElementById('count').value);
        const emphasis = document.getElementById('emphasis').value;

        let text = '';

        switch (type) {
            case 'word':
                text = this.generateWords(count, emphasis);
                break;
            case 'sentence':
                text = this.generateSentences(count, emphasis);
                break;
            case 'paragraph':
                text = this.generateParagraphs(count, emphasis);
                break;
        }

        this.displayText(text, emphasis);
        this.updateStats();
    }

    generateWords(count, emphasis) {
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.getRandomWord());
        }
        return words.join(' ');
    }

    generateSentences(count, emphasis) {
        const sentences = [];
        for (let i = 0; i < count; i++) {
            sentences.push(this.generateSentence());
        }
        return sentences.join(' ');
    }

    generateSentence() {
        const subject = this.getRandomElement(this.nouns);
        const verb = this.getRandomElement(this.verbs);
        const adjective = this.getRandomElement(this.adjectives);
        const object = this.getRandomElement(this.nouns);

        // Create different sentence patterns
        const patterns = [
            `The ${adjective} ${subject} ${verb} quickly.`,
            `A ${adjective} ${subject} ${verb} the ${object}.`,
            `${this.capitalize(subject)} ${verb} ${this.getRandomElement(['happily', 'slowly', 'carefully'])}.`,
            `The ${subject} ${verb} ${this.getRandomElement(['in the park', 'at home', 'on the street'])}.`
        ];

        return this.getRandomElement(patterns);
    }

    generateParagraphs(count, emphasis) {
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
            paragraphs.push(this.generateParagraph());
        }
        return paragraphs.join('\n\n');
    }

    generateParagraph() {
        const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences
        const sentences = [];

        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(this.generateSentence());
        }

        return sentences.join(' ');
    }

    getRandomWord() {
        return this.getRandomElement(this.words);
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    displayText(text, emphasis) {
        const output = document.getElementById('output');
        output.innerHTML = ''; // Clear existing content

        if (emphasis === 'none') {
            output.textContent = text;
            return;
        }

        // Split text into words for emphasis processing
        const words = text.split(/(\s+)/);
        let emphasisIndex = -1;

        if (emphasis === 'first') {
            emphasisIndex = 0;
        } else if (emphasis === 'random') {
            emphasisIndex = Math.floor(Math.random() * words.filter(w => w.trim()).length);
        }

        let wordCounter = 0;
        words.forEach((word, index) => {
            if (word.trim()) {
                const span = document.createElement('span');
                span.textContent = word;

                if (emphasis === 'all' || wordCounter === emphasisIndex) {
                    span.classList.add('emphasis-word');
                }

                output.appendChild(span);
                wordCounter++;
            } else {
                // Handle whitespace
                output.appendChild(document.createTextNode(word));
            }
        });
    }

    updateStats() {
        const output = document.getElementById('output');
        const text = output.textContent || output.innerText;

        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const charCount = text.length;

        document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
        document.getElementById('charCount').textContent = `Characters: ${charCount}`;
    }

    async copyToClipboard() {
        const output = document.getElementById('output');
        const text = output.textContent || output.innerText;

        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#4CAF50';

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextGenerator();
});