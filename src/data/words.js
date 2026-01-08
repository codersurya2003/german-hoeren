export const WORDS = [
  { id: 1, german: "Der Apfel", english: "The Apple", type: "Noun (m)", phrase: "einen Apfel essen", example: "Ich esse einen Apfel zum Frühstück." },
  { id: 2, german: "Gehen", english: "To Go", type: "Verb", phrase: "ins Kino gehen", example: "Wir gehen heute Abend ins Kino." },
  { id: 3, german: "Das Haus", english: "The House", type: "Noun (n)", phrase: "ein großes Haus", example: "Das Haus am Ende der Straße ist sehr groß." },
  { id: 4, german: "Schnell", english: "Fast", type: "Adjective", phrase: "sehr schnell fahren", example: "Das Auto fährt schnell auf der Autobahn." },
  { id: 5, german: "Die Katze", english: "The Cat", type: "Noun (f)", phrase: "die kleine Katze", example: "Die Katze schläft auf dem Sofa." },
  { id: 6, german: "Hören", english: "To Hear/Listen", type: "Verb", phrase: "Musik hören", example: "Kannst du mich hören, wenn ich spreche?" },
  { id: 7, german: "Das Wasser", english: "The Water", type: "Noun (n)", phrase: "kaltes Wasser trinken", example: "Ich trinke jeden Tag viel Wasser." },
  { id: 8, german: "Morgen", english: "Tomorrow/Morning", type: "Adverb/Noun", phrase: "morgen früh", example: "Bis morgen, schlaf gut!" },
  { id: 9, german: "Danke", english: "Thank you", type: "Phrase", phrase: "Danke schön", example: "Danke schön für deine Hilfe!" },
  { id: 10, german: "Tschüss", english: "Bye", type: "Phrase", phrase: "Tschüss, bis bald", example: "Tschüss, bis bald! Wir sehen uns morgen." },
  { id: 11, german: "Der Hund", english: "The Dog", type: "Noun (m)", phrase: "der große Hund", example: "Der Hund bellt laut im Garten." },
  { id: 12, german: "Leben", english: "To Live", type: "Verb", phrase: "in Berlin leben", example: "Sie leben seit fünf Jahren in Berlin." },
  { id: 13, german: "Die Zeit", english: "The Time", type: "Noun (f)", phrase: "keine Zeit haben", example: "Ich habe heute leider keine Zeit." },
  { id: 14, german: "Arbeiten", english: "To Work", type: "Verb", phrase: "zu Hause arbeiten", example: "Er arbeitet jeden Tag sehr viel." },
  { id: 15, german: "Glücklich", english: "Happy", type: "Adjective", phrase: "sehr glücklich sein", example: "Sie ist sehr glücklich über die Nachricht." },
  { id: 16, german: "Die Schule", english: "The School", type: "Noun (f)", phrase: "in die Schule gehen", example: "Die Schule beginnt um acht Uhr morgens." },
  { id: 17, german: "Lernen", english: "To Learn", type: "Verb", phrase: "Deutsch lernen", example: "Wir lernen jeden Tag neue deutsche Wörter." },
  { id: 18, german: "Der Stift", english: "The Pen", type: "Noun (m)", phrase: "einen Stift brauchen", example: "Wo ist mein Stift? Ich muss etwas schreiben." },
  { id: 19, german: "Heute", english: "Today", type: "Adverb", phrase: "heute Nachmittag", example: "Heute ist ein wunderschöner Tag!" },
  { id: 20, german: "Machen", english: "To Do/Make", type: "Verb", phrase: "Hausaufgaben machen", example: "Was machst du heute Abend?" },
  { id: 21, german: "Die Arbeit", english: "The Work", type: "Noun (f)", phrase: "zur Arbeit gehen", example: "Die Arbeit ist heute besonders schwer." },
  { id: 22, german: "Fragen", english: "To Ask", type: "Verb", phrase: "eine Frage stellen", example: "Darf ich etwas fragen? Es ist wichtig." },
  { id: 23, german: "Das Buch", english: "The Book", type: "Noun (n)", phrase: "ein gutes Buch lesen", example: "Das Buch ist sehr interessant und spannend." },
  { id: 24, german: "Sehen", english: "To See", type: "Verb", phrase: "einen Film sehen", example: "Ich sehe dich am Bahnhof um drei." },
  { id: 25, german: "Vielleicht", english: "Maybe", type: "Adverb", phrase: "vielleicht morgen", example: "Vielleicht komme ich später zur Party." },
  { id: 26, german: "Die Freundin", english: "The Girlfriend/Friend (f)", type: "Noun (f)", phrase: "meine beste Freundin", example: "Das ist meine Freundin aus der Schule." },
  { id: 27, german: "Essen", english: "To Eat", type: "Verb", phrase: "zu Abend essen", example: "Wann essen wir heute zu Abend?" },
  { id: 28, german: "Wichtig", english: "Important", type: "Adjective", phrase: "sehr wichtig sein", example: "Das ist sehr wichtig für mich." },
  { id: 29, german: "Der Bahnhof", english: "The Train Station", type: "Noun (m)", phrase: "zum Bahnhof fahren", example: "Der Zug hält am Bahnhof in der Stadtmitte." },
  { id: 30, german: "Entschuldigung", english: "Excuse me", type: "Phrase", phrase: "Entschuldigung bitte", example: "Entschuldigung, darf ich bitte vorbei?" }
];

export function getDailyWords() {
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);

  // Return 5 random words
  return shuffled.slice(0, 5);
}
