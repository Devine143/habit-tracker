export interface StoicQuote {
  id: number;
  text: string;
  author: string;
  category: 'marcus_aurelius' | 'seneca' | 'epictetus' | 'cato' | 'viktor_frankl';
}

export const stoicQuotes: StoicQuote[] = [
  // Marcus Aurelius quotes
  {
    id: 1,
    text: "Waste no more time arguing what a good man should be. Be One.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 2,
    text: "Think of the life you have lived until now as over and, as a dead man, see what's left as a bonus and live it according to Nature. Love the hand that fate deals you and play it as your own, for what could be more fitting?",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 3,
    text: "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 4,
    text: "In your actions, don't procrastinate. In your conversations, don't confuse. In your thoughts, don't wander. In your soul, don't be passive or aggressive. In your life, don't be all about business.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 5,
    text: "If it is not right, do not do it, if it is not true, do not say it.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 6,
    text: "The best revenge is not to be like your enemy.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 7,
    text: "Choose not to be harmed — and you won't feel harmed. Don't feel harmed — and you haven't been.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 8,
    text: "It's time you realized that you have something in you more powerful and miraculous than the things that affect you and make you dance like a puppet.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 9,
    text: "External things are not the problem. It's your assessment of them. Which you can erase right now.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 10,
    text: "If anyone can refute me—show me I'm making a mistake or looking at things from the wrong perspective—I'll gladly change. It's the truth I'm after, and the truth never harmed anyone.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 11,
    text: "You could leave life right now. Let that determine what you do and say and think.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },
  {
    id: 12,
    text: "Be tolerant with others and strict with yourself.",
    author: "Marcus Aurelius",
    category: "marcus_aurelius"
  },

  // Seneca quotes
  {
    id: 13,
    text: "We are more often frightened than hurt; and we suffer more in imagination than in reality.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 14,
    text: "If a man knows not which port he sails, no wind is favorable.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 15,
    text: "No person has the power to have everything they want, but it is in their power not to want what they don't have, and to cheerfully put to good use what they do have.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 16,
    text: "Nothing, to my way of thinking, is a better proof of a well ordered mind than a man's ability to stop just where he is and pass some time in his own company.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 17,
    text: "He who fears death will never do anything worthy of a man who is alive.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 18,
    text: "This is our big mistake: to think we look forward to death. Most of death is already gone. Whatever time has passed is owned by death.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 19,
    text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 20,
    text: "I judge you unfortunate because you have never lived through misfortune. You have passed through life without an opponent—no one can ever know what you are capable of, not even you.",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 21,
    text: "How does it help…to make troubles heavier by bemoaning them?",
    author: "Seneca",
    category: "seneca"
  },
  {
    id: 22,
    text: "People are frugal in guarding their personal property; but as soon as it comes to squandering time they are most wasteful of the one thing in which it is right to be stingy.",
    author: "Seneca",
    category: "seneca"
  },

  // Epictetus quotes
  {
    id: 23,
    text: "How long are you going to wait before you demand the best for yourself?",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 24,
    text: "Don't seek for everything to happen as you wish it would, but rather wish that everything happens as it actually will—then your life will flow well.",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 25,
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 26,
    text: "Curb your desire—don't set your heart on so many things and you will get what you need.",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 27,
    text: "That's why the philosophers warn us not to be satisfied with mere learning, but to add practice and then training. For as time passes we forget what we learned and end up doing the opposite, and hold opinions the opposite of what we should.",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 28,
    text: "Don't explain your philosophy. Embody it.",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 29,
    text: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control. Where then do I look for good and evil? Not to uncontrollable externals, but within myself to the choices that are my own…",
    author: "Epictetus",
    category: "epictetus"
  },
  {
    id: 30,
    text: "If anyone tells you that a certain person speaks ill of you, do not make excuses about what is said of you but answer, 'He was ignorant of my other faults, else he would have not mentioned these alone.'",
    author: "Epictetus",
    category: "epictetus"
  },

  // Cato quotes
  {
    id: 31,
    text: "I begin to speak only when I'm certain what I'll say isn't better left unsaid.",
    author: "Cato",
    category: "cato"
  },

  // Viktor Frankl quotes
  {
    id: 32,
    text: "What man actually needs is not a tensionless state but rather the striving and struggling for some goal worthy of him.",
    author: "Viktor Frankl",
    category: "viktor_frankl"
  },
  {
    id: 33,
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
    category: "viktor_frankl"
  }
];

export function getDailyQuote(date: Date): StoicQuote {
  // Use the date to get a consistent quote for each day
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const hash = hashString(dateString);
  const index = hash % stoicQuotes.length;
  return stoicQuotes[index];
}

// Simple hash function to ensure same quote for same date
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getRandomQuote(): StoicQuote {
  const randomIndex = Math.floor(Math.random() * stoicQuotes.length);
  return stoicQuotes[randomIndex];
}

export function getQuotesByAuthor(author: string): StoicQuote[] {
  return stoicQuotes.filter(quote => 
    quote.author.toLowerCase().includes(author.toLowerCase())
  );
}