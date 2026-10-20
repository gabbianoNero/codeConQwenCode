import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { generatePersone, Persona } from './data/generateData';

// Genera i dati una sola volta
const allData = generatePersone(10000);

type SortDirection = 'asc' | 'desc' | null;
type SortField = keyof Persona | null;

const ROW_HEIGHT = 36;
const VISIBLE_ROWS = 20;
const BUFFER = 5;

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState<string>('tutti');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [debouncedText, setDebouncedText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  // Debounce per la ricerca
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedText(value);
    }, 150);
  }, []);

  // Filtra i dati
  const filteredData = useMemo(() => {
    if (!debouncedText.trim()) return allData;

    const search = debouncedText.toLowerCase().trim();

    let result = allData.filter((p) => {
      if (searchField === 'tutti') {
        return (
          p.nome.toLowerCase().includes(search) ||
          p.cognome.toLowerCase().includes(search) ||
          p.email.toLowerCase().includes(search) ||
          p.citta.toLowerCase().includes(search) ||
          p.provincia.toLowerCase().includes(search) ||
          p.telefono.includes(search) ||
          p.codiceFiscale.toLowerCase().includes(search) ||
          p.professione.toLowerCase().includes(search)
        );
      }
      const field = searchField as keyof Persona;
      const value = String(p[field]).toLowerCase();
      return value.includes(search);
    });

    // Ordinamento
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortField]).toLowerCase();
        const bVal = String(b[sortField]).toLowerCase();
        if (sortDirection === 'asc') return aVal.localeCompare(bVal);
        return bVal.localeCompare(aVal);
      });
    }

    return result;
  }, [debouncedText, searchField, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: keyof Persona) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Virtual scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    filteredData.length,
    startIndex + VISIBLE_ROWS + BUFFER * 2
  );
  const visibleData = filteredData.slice(startIndex, endIndex);
  const totalHeight = filteredData.length * ROW_HEIGHT;

  // Reset scroll quando cambiano i filtri
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [debouncedText, searchField]);

  const getSortIcon = (field: keyof Persona) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const columns: { key: keyof Persona; label: string; width: string }[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'cognome', label: 'Cognome', width: '130px' },
    { key: 'nome', label: 'Nome', width: '120px' },
    { key: 'citta', label: 'Città', width: '120px' },
    { key: 'provincia', label: 'Prov.', width: '55px' },
    { key: 'telefono', label: 'Telefono', width: '130px' },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'professione', label: 'Professione', width: '140px' },
    { key: 'dataNascita', label: 'Data Nascita', width: '100px' },
    { key: 'codiceFiscale', label: 'Cod. Fiscale', width: '150px' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Title Bar - stile Access */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 flex items-center gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
          </svg>
          <span className="font-semibold text-sm">Maschera: Anagrafica Nominativi</span>
        </div>
        <div className="ml-auto text-xs opacity-80">
          Database: Anagrafica_Generale.accdb
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-200 border-b border-gray-300 px-2 py-1 flex items-center gap-4 text-sm">
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">File</span>
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">Modifica</span>
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">Visualizza</span>
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">Record</span>
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">Filtri</span>
        <span className="hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer">Ordinamento</span>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border-b border-gray-300 p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Field */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <i className="fa-solid fa-filter text-blue-600 mr-1"></i>
              Campo:
            </label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="tutti">🔍 Tutti i campi</option>
              <option value="nome">Nome</option>
              <option value="cognome">Cognome</option>
              <option value="citta">Città</option>
              <option value="provincia">Provincia</option>
              <option value="telefono">Telefono</option>
              <option value="email">Email</option>
              <option value="professione">Professione</option>
              <option value="codiceFiscale">Cod. Fiscale</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <i className="fa-solid fa-search text-blue-600 mr-1"></i>
              Cerca:
            </label>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Digita per filtrare in tempo reale..."
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-8"
              />
              {searchText && (
                <button
                  onClick={() => { setSearchText(''); setDebouncedText(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times-circle"></i>
                </button>
              )}
            </div>
          </div>

          {/* Record Counter */}
          <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-sm">
            <span className="text-blue-800 font-semibold">{filteredData.length.toLocaleString('it-IT')}</span>
            <span className="text-blue-600"> / {allData.length.toLocaleString('it-IT')} record</span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-gray-500">Filtri rapidi:</span>
          {['Roma', 'Milano', 'Napoli', 'Torino', 'Medico', 'Ingegnere'].map((filtro) => (
            <button
              key={filtro}
              onClick={() => { setSearchText(filtro); setDebouncedText(filtro); }}
              className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 border border-gray-300 hover:border-blue-300 rounded px-2 py-0.5 transition-colors"
            >
              {filtro}
            </button>
          ))}
          <button
            onClick={() => { setSearchText(''); setDebouncedText(''); setSearchField('tutti'); setSortField(null); setSortDirection(null); }}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded px-2 py-0.5 transition-colors ml-2"
          >
            <i className="fa-solid fa-eraser mr-1"></i>Reset filtri
          </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">
        {/* Column Headers */}
        <div className="flex bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 rounded-t font-semibold text-xs text-gray-700">
          {columns.map((col) => (
            <div
              key={col.key}
              style={{ width: col.width, minWidth: col.width }}
              className="px-2 py-2 border-r border-gray-300 cursor-pointer hover:bg-blue-50 flex items-center gap-1 select-none whitespace-nowrap"
              onClick={() => handleSort(col.key)}
            >
              <span>{col.label}</span>
              <span className="text-blue-500 text-[10px]">{getSortIcon(col.key)}</span>
            </div>
          ))}
        </div>

        {/* Virtual Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto border border-t-0 border-gray-300 rounded-b bg-white"
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {visibleData.map((persona, idx) => {
              const actualIndex = startIndex + idx;
              const isSelected = selectedRow === persona.id;
              return (
                <div
                  key={persona.id}
                  style={{
                    position: 'absolute',
                    top: `${actualIndex * ROW_HEIGHT}px`,
                    height: `${ROW_HEIGHT}px`,
                    width: '100%',
                  }}
                  className={`flex items-center text-xs border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : actualIndex % 2 === 0
                      ? 'bg-white hover:bg-blue-50'
                      : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedRow(isSelected ? null : persona.id)}
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      style={{ width: col.width, minWidth: col.width }}
                      className="px-2 truncate"
                    >
                      {String(persona[col.key])}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-200 border-t border-gray-300 px-4 py-1.5 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            <i className="fa-solid fa-database mr-1"></i>
            Record visualizzati: {filteredData.length.toLocaleString('it-IT')}
          </span>
          {selectedRow && (
            <span>
              <i className="fa-solid fa-check mr-1 text-green-600"></i>
              Record selezionato: #{selectedRow}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {sortField && (
            <span>
              <i className="fa-solid fa-sort mr-1"></i>
              Ordinato per: {columns.find(c => c.key === sortField)?.label} ({sortDirection === 'asc' ? 'Crescente' : 'Decrescente'})
            </span>
          )}
          <span className="text-gray-400">
            Filtro incrementale attivo | Debounce: 150ms
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
