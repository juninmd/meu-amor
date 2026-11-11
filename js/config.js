// Single source of truth for dates and texts, so content changes never touch logic.
export const REL = new Date(2022, 6, 28);
export const WED = new Date(2025, 10, 29);
export const CAPSULE = new Date(2025, 10, 29);
export const GREETING = 'Olá, amor da minha vida…';
export const MUSIC_AUTOPLAY = '&autoplay=1';

export const BODAS = {
  1: 'Papel', 2: 'Algodão', 3: 'Trigo', 4: 'Flores e Frutas', 5: 'Madeira',
  6: 'Perfume', 7: 'Lã', 8: 'Barro', 9: 'Cerâmica', 10: 'Estanho',
  15: 'Cristal', 20: 'Porcelana', 25: 'Prata', 30: 'Pérola', 40: 'Esmeralda', 50: 'Ouro'
};

export const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Captions come from the timestamp encoded in each file name.
export const PHOTOS = [
  'photo_2023-05-01_23-10-48.jpg', 'photo_2023-05-07_00-34-35.jpg', 'photo_2023-06-11_21-57-30.jpg',
  'photo_2023-06-12_20-20-39.jpg', 'photo_2023-06-21_22-32-40.jpg', 'photo_2023-06-24_00-17-04.jpg',
  'photo_2023-06-26_15-54-23.jpg', 'photo_2023-07-08_23-10-46.jpg', 'photo_2023-07-20_21-53-24.jpg'
].map(src => {
  const [, y, m, d, hh, mm] = src.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})/);
  return { src, cap: `${d} ${MES[m - 1]} ${y}`, time: `${hh}:${mm}` };
});

export const REASONS = [
  'Pelo seu sorriso que ilumina meu dia.', 'Pela forma como você cuida de mim.',
  'Por ser minha melhor amiga.', 'Pelo seu abraço aconchegante.',
  'Pela nossa cumplicidade única.', 'Porque você me inspira a ser melhor.',
  'Pelo brilho dos seus olhos.', 'Por me apoiar em todos os momentos.',
  'Pelas nossas conversas infinitas.', 'Porque ao seu lado, tudo fica perfeito.',
  'Pelo seu coração bondoso.', 'Pela paz que você me traz.',
  'Porque você é o amor da minha vida.', 'Pelo jeito que você me olha.',
  'Pela nossa história linda.', 'Porque você me entende como ninguém.',
  'Pelo seu cheiro que eu amo.', 'Porque você é meu porto seguro.',
  'Por todos os nossos planos futuros.', 'Simplesmente por você existir.'
];

export const BOTTLE = [
  'O destino me sorriu quando te conheci.', 'Nosso futuro é a minha vista favorita.',
  'Prometo te fazer feliz todos os dias.', 'Você é meu sonho realizado.',
  'Em cada estrela, vejo o brilho dos teus olhos.', 'Nossa história é meu livro preferido.',
  'Te amarei até o fim dos tempos.', 'Você é a melhor parte do meu dia.',
  'Juntos somos invencíveis.', 'Minha alma gêmea é você.'
];

export const PRIZES = [
  'Vale um beijo apaixonado!', 'Vale um jantar romântico!', 'Vale uma massagem!',
  'Vale um cinema em casa!', 'Vale um desejo à sua escolha!'
];

export const QUIZ = [
  { q: 'Qual é o meu lugar favorito no mundo?', o: ['Paris', 'Praia', 'Ao seu lado', 'Em casa'], c: 2 },
  { q: 'O que eu mais amo em você?', o: ['Seu sorriso', 'Seu abraço', 'Tudo', 'Seu cheiro'], c: 2 },
  { q: 'Quando nossa história começou?', o: ['2020', '2021', '2022', '2023'], c: 2 },
  { q: 'Qual a palavra que nos define?', o: ['Amor', 'Cumplicidade', 'Destino', 'Eternidade'], c: 3 }
];

export const DREAMS = [
  'Viajar para a Europa', 'Ter nossa casa própria', 'Adotar um cachorro',
  'Aprender a cozinhar algo novo juntos', 'Ver a aurora boreal'
];

export const PINS = [
  ['O início', 'Onde nos conhecemos.'],
  ['Primeiro beijo', 'Nosso primeiro beijo.'],
  ['Futuro lar', 'Nossa futura casa.']
];

export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export const SECRET_TAPS = 7;
