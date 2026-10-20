export interface Persona {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  citta: string;
  provincia: string;
  codiceFiscale: string;
  dataNascita: string;
  professione: string;
}

const nomi = [
  'Marco', 'Giuseppe', 'Giovanni', 'Antonio', 'Francesco', 'Alessandro', 'Andrea',
  'Luca', 'Matteo', 'Lorenzo', 'Roberto', 'Stefano', 'Paolo', 'Davide', 'Simone',
  'Federico', 'Riccardo', 'Michele', 'Tommaso', 'Leonardo', 'Gabriele', 'Emanuele',
  'Claudio', 'Fabio', 'Massimo', 'Nicola', 'Vincenzo', 'Salvatore', 'Domenico',
  'Raffaele', 'Angelo', 'Pietro', 'Carlo', 'Mario', 'Luigi', 'Franco', 'Bruno',
  'Maurizio', 'Giorgio', 'Enrico', 'Alberto', 'Filippo', 'Giacomo', 'Emanuele',
  'Chiara', 'Maria', 'Anna', 'Giulia', 'Francesca', 'Sara', 'Laura', 'Valentina',
  'Alessia', 'Silvia', 'Elena', 'Martina', 'Federica', 'Elisa', 'Cristina', 'Barbara',
  'Paola', 'Monica', 'Daniela', 'Roberta', 'Lucia', 'Caterina', 'Antonella',
  'Giovanna', 'Teresa', 'Angela', 'Rita', 'Stefania', 'Patrizia', 'Claudia',
  'Serena', 'Michela', 'Simona', 'Debora', 'Vanessa', 'Ilenia', 'Giada',
  'Alice', 'Beatrice', 'Sofia', 'Aurora', 'Greta', 'Noemi', 'Giorgia'
];

const cognomi = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo',
  'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini',
  'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana',
  'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini',
  'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra',
  'Coppola', 'De Santis', 'D\'Angelo', 'Marchetti', 'Parisi', 'Villa', 'Conte',
  'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valente',
  'Mazza', 'Sanna', 'Casadei', 'Pagano', 'Riva', 'Giuliani', 'Battaglia',
  'Sartori', 'Neri', 'Caputo', 'Pellegrini', 'Palumbo', 'Piras', 'Sanna',
  'Silvestri', 'Bartolomei', 'De Angelis', 'Montanari', 'Guerra', 'Pellegrino',
  'Pellegrini', 'Testa', 'Barraco', 'Catalano', 'Napoli', 'Parodi', 'Sorrentino'
];

const citta = [
  'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna',
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova',
  'Trieste', 'Brescia', 'Taranto', 'Prato', 'Modena', 'Reggio Calabria',
  'Reggio Emilia', 'Perugia', 'Livorno', 'Ravenna', 'Cagliari', 'Foggia',
  'Rimini', 'Salerno', 'Ferrara', 'Sassari', 'Latina', 'Bergamo', 'Pescara',
  'Monza', 'Siracusa', 'Pescara', 'Bergamo', 'Forlì', 'Trento', 'Bolzano'
];

const province = [
  'RM', 'MI', 'NA', 'TO', 'PA', 'GE', 'BO', 'FI', 'BA', 'CT', 'VE', 'VR',
  'ME', 'PD', 'TS', 'BS', 'TA', 'PO', 'MO', 'RC', 'RE', 'PG', 'LI', 'RA',
  'CA', 'FG', 'RN', 'SA', 'FE', 'SS', 'LT', 'BG', 'PE', 'MB', 'SR', 'PE',
  'BG', 'FC', 'TN', 'BZ'
];

const professioni = [
  'Impiegato', 'Operaio', 'Insegnante', 'Medico', 'Avvocato', 'Ingegnere',
  'Architetto', 'Commercialista', 'Commerciante', 'Libero Professionista',
  'Funzionario', 'Dirigente', 'Studente', 'Pensionato', 'Disoccupato',
  'Artigiano', 'Agricoltore', 'Infermiere', 'Farmacista', 'Geometra',
  'Elettricista', 'Idraulico', 'Meccanico', 'Cuoco', 'Camionista',
  'Programmatore', 'Designer', 'Giornalista', 'Fotografo', 'Archivista'
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCodiceFiscale(nome: string, cognome: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let cf = '';
  cf += cognome.substring(0, 3).toUpperCase();
  cf += nome.substring(0, 3).toUpperCase();
  for (let i = 0; i < 12; i++) {
    cf += chars[Math.floor(Math.random() * chars.length)];
  }
  return cf;
}

function generateTelefono(): string {
  const prefissi = ['333', '334', '335', '336', '337', '338', '339', '340', '347', '348', '349', '380', '388', '389', '392', '393'];
  const prefisso = randomFrom(prefissi);
  let numero = '';
  for (let i = 0; i < 7; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return `${prefisso} ${numero.substring(0, 3)} ${numero.substring(3)}`;
}

function generateDataNascita(): string {
  const year = 1950 + Math.floor(Math.random() * 55);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

export function generatePersone(count: number = 10000): Persona[] {
  const persone: Persona[] = [];
  for (let i = 0; i < count; i++) {
    const nome = randomFrom(nomi);
    const cognome = randomFrom(cognomi);
    const cityIndex = Math.floor(Math.random() * citta.length);
    persone.push({
      id: i + 1,
      nome,
      cognome,
      email: `${nome.toLowerCase()}.${cognome.toLowerCase()}@email.it`.replace(/[^a-z0-9.@]/g, ''),
      telefono: generateTelefono(),
      citta: citta[cityIndex],
      provincia: province[cityIndex],
      codiceFiscale: generateCodiceFiscale(nome, cognome),
      dataNascita: generateDataNascita(),
      professione: randomFrom(professioni),
    });
  }
  return persone;
}
