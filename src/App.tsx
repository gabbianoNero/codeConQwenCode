import { useState } from 'react';

type Section = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

function CodeBlock({ code, language = 'vba' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? '✓ Copiato!' : 'Copia'}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 uppercase tracking-wider">{language}</div>
    </div>
  );
}

function Tip({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' | 'danger' }) {
  const colors = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    danger: 'bg-red-50 border-red-300 text-red-800',
  };
  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    danger: '🚫',
  };
  return (
    <div className={`${colors[type]} border-l-4 p-3 my-3 rounded-r text-sm`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 my-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
        <div className="text-sm text-gray-700">{children}</div>
      </div>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Panoramica & Strategia',
      icon: '📋',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Strategia di Ottimizzazione FE Access</h3>
          <p className="text-gray-700">
            La tua situazione: hai un FE Access collegato a un BE Access (tabelle), con l'intenzione di migrare il BE su SQL Server Express. 
            L'obiettivo è creare una maschera con <strong>filtro dinamico/incrementale</strong> che filtri in tempo reale i Patti (contratti datore/colf).
          </p>
          
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Architettura target:</h4>
            <div className="font-mono text-sm bg-white p-3 rounded border">
              <div>┌─────────────────────────┐</div>
              <div>│   FE Access (Client)    │</div>
              <div>│  • Maschere             │</div>
              <div>│  • Query parametrizzate │</div>
              <div>│  • Filtro dinamico      │</div>
              <div>└───────────┬─────────────┘</div>
              <div>            │ ODBC / OLEDB</div>
              <div>┌───────────▼─────────────┐</div>
              <div>│  SQL Server Express     │</div>
              <div>│  • Tabelle Patti        │</div>
              <div>│  • Tabelle Datori       │</div>
              <div>│  • Tabelle Colf         │</div>
              <div>│  • Indici ottimizzati   │</div>
              <div>└─────────────────────────┘</div>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Principi chiave per l'ottimizzazione:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li><strong>Non caricare mai tutti i record</strong> nella maschera — usa query filtrate</li>
            <li><strong>Usa Recordset ADO</strong> invece di Recordset DAO per la compatibilità futura con SQL Server</li>
            <li><strong>Filtro incrementale</strong> = la query si aggiorna ad ogni carattere digitato</li>
            <li><strong>Subform in modalità datasheet</strong> per la lista risultati</li>
            <li><strong>Indici</strong> sui campi più cercati (fondamentale su SQL Express)</li>
          </ul>

          <Tip type="warning">
            <strong>Importante:</strong> Il codice che ti fornisco è già predisposto per funzionare sia con tabelle Access locali (ora) sia con tabelle SQL Server (dopo la migrazione). 
            Basta cambiare la stringa di connessione.
          </Tip>
        </div>
      ),
    },
    {
      id: 'maschera',
      title: 'Creazione Maschera',
      icon: '🖥️',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Creazione della Maschera in Access</h3>
          
          <Step number={1} title="Crea una nuova maschera in Visualizzazione Struttura">
            <p>Vai su <code className="bg-gray-200 px-1 rounded">Crea → Maschera → Visualizzazione Struttura</code></p>
            <p>Salvala con nome: <strong>frm_Patti_FiltroDinamico</strong></p>
          </Step>

          <Step number={2} title="Aggiungi i controlli nella sezione Intestazione Maschera">
            <p>Posiziona i seguenti controlli nell'intestazione:</p>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-1 text-left">Controllo</th>
                    <th className="border px-3 py-1 text-left">Nome (Name)</th>
                    <th className="border px-3 py-1 text-left">Etichetta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border px-3 py-1">Casella di testo</td><td className="border px-3 py-1 font-mono text-xs">txtRicerca</td><td className="border px-3 py-1">Cerca:</td></tr>
                  <tr><td className="border px-3 py-1">Casella combinata</td><td className="border px-3 py-1 font-mono text-xs">cboCampo</td><td className="border px-3 py-1">Campo:</td></tr>
                  <tr><td className="border px-3 py-1">Casella combinata</td><td className="border px-3 py-1 font-mono text-xs">cboStato</td><td className="border px-3 py-1">Stato Patto:</td></tr>
                  <tr><td className="border px-3 py-1">Etichetta</td><td className="border px-3 py-1 font-mono text-xs">lblRecordCount</td><td className="border px-3 py-1">Record trovati: 0</td></tr>
                  <tr><td className="border px-3 py-1">Pulsante</td><td className="border px-3 py-1 font-mono text-xs">btnReset</td><td className="border px-3 py-1">Reset Filtri</td></tr>
                </tbody>
              </table>
            </div>
          </Step>

          <Step number={3} title="Aggiungi una SubMaschera in modalità Foglio Dati">
            <p>Nella sezione Dettaglio della maschera principale, inserisci una <strong>sottomaschera</strong>:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Nome submaschera: <code className="bg-gray-200 px-1 rounded font-mono text-xs">subfrm_PattiRisultati</code></li>
              <li>Fonte record: la query <code className="bg-gray-200 px-1 rounded font-mono text-xs">qry_Patti_Filtrati</code> (che creeremo)</li>
              <li>Modalità predefinita: <strong>Foglio dati</strong></li>
              <li>Navigazione consentita: <strong>Sì</strong></li>
              <li>Permetti modifiche: <strong>Sì</strong> (se vuoi poter editare i record)</li>
            </ul>
          </Step>

          <Step number={4} title="Imposta le proprietà della maschera principale">
            <p>Nella finestra Proprietà della maschera principale:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><strong>Carica su evento (On Load):</strong> <code className="bg-gray-200 px-1 rounded font-mono text-xs">[Evento]</code></li>
              <li><strong>Nessuna origine record</strong> per la maschera principale (solo la subform ha la fonte dati)</li>
            </ul>
          </Step>

          <Tip type="info">
            <strong>Perché una SubMaschera?</strong> La subform in modalità foglio dati permette di visualizzare i risultati come una griglia, 
            esattamente come la vista "Maschera/Sottomaschera" di Access. Il filtro agisce sulla <code>RecordSource</code> della subform.
          </Tip>
        </div>
      ),
    },
    {
      id: 'vba-filtro',
      title: 'Codice VBA - Filtro Dinamico',
      icon: '⚡',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Codice VBA per il Filtro Incrementale</h3>
          <p className="text-gray-700">
            Questo è il cuore della soluzione. Il codice si attiva ad ogni carattere digitato nella casella di ricerca 
            e aggiorna la subform in tempo reale.
          </p>

          <h4 className="font-semibold text-gray-800 mt-4">1. Evento On Load della maschera principale:</h4>
          <CodeBlock code={`Private Sub Form_Load()
    ' Inizializza la casella combinata dei campi
    Me.cboCampo.RowSource = "Tutti i campi;Cognome Datore;Nome Datore;Città;Provincia;Codice Fiscale;Stato Patto"
    Me.cboCampo.Value = "Tutti i campi"
    
    ' Inizializza la combo Stato
    Me.cboStato.RowSource = "Tutti;Attivo;Scaduto;In attesa;Annullato"
    Me.cboStato.Value = "Tutti"
    
    ' Carica tutti i record inizialmente
    Call AggiornaFiltro
    
    ' Posiziona il cursore nella casella di ricerca
    Me.txtRicerca.SetFocus
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">2. Evento On Change della casella di ricerca (FILTRO INCREMENTALE):</h4>
          <CodeBlock code={`Private Sub txtRicerca_Change()
    ' Questo evento si attiva ad OGNI carattere digitato
    ' Filtro incrementale in tempo reale
    Call AggiornaFiltro
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">3. Evento AfterUpdate delle combo:</h4>
          <CodeBlock code={`Private Sub cboCampo_AfterUpdate()
    Call AggiornaFiltro
End Sub

Private Sub cboStato_AfterUpdate()
    Call AggiornaFiltro
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">4. Pulsante Reset:</h4>
          <CodeBlock code={`Private Sub btnReset_Click()
    Me.txtRicerca.Value = ""
    Me.cboCampo.Value = "Tutti i campi"
    Me.cboStato.Value = "Tutti"
    Call AggiornaFiltro
    Me.txtRicerca.SetFocus
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">5. La funzione centrale AggiornaFiltro:</h4>
          <CodeBlock code={`Private Sub AggiornaFiltro()
    Dim strSQL As String
    Dim strWhere As String
    Dim strRicerca As String
    Dim strCampo As String
    Dim strStato As String
    Dim lngRecordCount As Long
    
    ' Recupera i valori dei controlli
    strRicerca = Nz(Me.txtRicerca.Text, "")
    strCampo = Nz(Me.cboCampo.Value, "Tutti i campi")
    strStato = Nz(Me.cboStato.Value, "Tutti")
    
    ' Costruisci la WHERE condition
    strWhere = ""
    
    ' --- FILTRO PER STATO ---
    If strStato <> "Tutti" Then
        strWhere = " WHERE StatoPatto = '" & Replace(strStato, "'", "''") & "'"
    End If
    
    ' --- FILTRO PER RICERCA TESTUALE ---
    If Len(strRicerca) > 0 Then
        Dim strSearchCondition As String
        strSearchCondition = ""
        
        Select Case strCampo
            Case "Tutti i campi"
                ' Cerca in tutti i campi principali
                strSearchCondition = "(" & _
                    "DatoreCognome LIKE '*" & Replace(strRicerca, "'", "''") & "*' OR " & _
                    "DatoreNome LIKE '*" & Replace(strRicerca, "'", "''") & "*' OR " & _
                    "ColfCognome LIKE '*" & Replace(strRicerca, "'", "''") & "*' OR " & _
                    "ColfNome LIKE '*" & Replace(strRicerca, "'", "''") & "*' OR " & _
                    "Citta LIKE '*" & Replace(strRicerca, "'", "''") & "*' OR " & _
                    "CodiceFiscale LIKE '*" & Replace(strRicerca, "'", "''") & "*'" & _
                    ")"
            Case "Cognome Datore"
                strSearchCondition = "DatoreCognome LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
            Case "Nome Datore"
                strSearchCondition = "DatoreNome LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
            Case "Città"
                strSearchCondition = "Citta LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
            Case "Provincia"
                strSearchCondition = "Provincia LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
            Case "Codice Fiscale"
                strSearchCondition = "CodiceFiscale LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
            Case "Stato Patto"
                strSearchCondition = "StatoPatto LIKE '*" & Replace(strRicerca, "'", "''") & "*'"
        End Select
        
        If Len(strWhere) > 0 Then
            strWhere = strWhere & " AND " & strSearchCondition
        Else
            strWhere = " WHERE " & strSearchCondition
        End If
    End If
    
    ' --- COSTRUISCI LA QUERY COMPLETA ---
    ' ADATTARE I NOMI DEI CAMPI ALLA TUA TABELLA REALE!
    strSQL = "SELECT Patti.ID, Patti.DatoreCognome, Patti.DatoreNome, " & _
             "Patti.ColfCognome, Patti.ColfNome, Patti.Citta, Patti.Provincia, " & _
             "Patti.DataInizio, Patti.DataFine, Patti.StatoPatto, Patti.CodiceFiscale " & _
             "FROM Patti" & strWhere & _
             " ORDER BY Patti.DatoreCognome, Patti.DatoreNome"
    
    ' --- APPLICA IL FILTRO ALLA SUBMASCHERA ---
    Me.subfrm_PattiRisultati.Form.RecordSource = strSQL
    
    ' --- AGGIORNA IL CONTATORE ---
    ' Metodo veloce per contare i record
    On Error Resume Next
    Me.subfrm_PattiRisultati.Form.Recordset.MoveLast
    lngRecordCount = Me.subfrm_PattiRisultati.Form.Recordset.RecordCount
    Me.subfrm_PattiRisultati.Form.Recordset.MoveFirst
    On Error GoTo 0
    
    Me.lblRecordCount.Caption = "Record trovati: " & Format(lngRecordCount, "#,##0")
    
End Sub`} />

          <Tip type="warning">
            <strong>⚠️ Adatta i nomi dei campi!</strong> I nomi dei campi (DatoreCognome, DatoreNome, Citta, ecc.) sono esempi. 
            Devi sostituirli con i nomi reali dei campi nella tua tabella Patti.
          </Tip>

          <Tip type="success">
            <strong>Nota sulle prestazioni:</strong> Con tabelle Access locali fino a ~50.000 record, questo approccio è istantaneo. 
            Quando passerai a SQL Express, basterà cambiare la <code>RecordSource</code> in una stored procedure o query pass-through per performance ancora migliori.
          </Tip>
        </div>
      ),
    },
    {
      id: 'vba-avanzato',
      title: 'Codice VBA - Versione Avanzata (ADO)',
      icon: '🚀',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Versione Avanzata con ADO (pronta per SQL Express)</h3>
          <p className="text-gray-700">
            Questa versione usa <strong>ADO (ActiveX Data Objects)</strong> invece di DAO. 
            È la stessa tecnologia che userai quando collegherai SQL Server Express. 
            Se la implementi ora, la migrazione sarà indolore.
          </p>

          <h4 className="font-semibold text-gray-800 mt-4">Funzione con ADO + Timer per debounce:</h4>
          <CodeBlock code={`' === DICHIARAZIONI A LIVELLO MODULO ===
Private m_rstPatti As ADODB.Recordset
Private m_blnUpdating As Boolean
Private m_lngTimer As Long

' === COSTANTI ===
Private Const DEBOUNCE_MS As Long = 200  ' millisecondi di attesa prima di eseguire la query

' === FUNZIONE AGGIORNATA CON ADO ===
Private Sub AggiornaFiltroADO()
    ' Evita chiamate multiple ravvicinate
    If m_blnUpdating Then Exit Sub
    m_blnUpdating = True
    
    On Error GoTo Err_Handler
    
    Dim strSQL As String
    Dim strWhere As String
    Dim strRicerca As String
    
    strRicerca = Nz(Me.txtRicerca.Text, "")
    
    ' Costruisci WHERE (stessa logica di prima, adattata)
    strWhere = BuildWhereClause(strRicerca, Nz(Me.cboCampo.Value, ""), Nz(Me.cboStato.Value, ""))
    
    ' Query SQL - compatibile sia Access che SQL Server
    ' NOTA: Per SQL Server cambia * con %
    strSQL = "SELECT TOP 500 ID, DatoreCognome, DatoreNome, " & _
             "ColfCognome, ColfNome, Citta, Provincia, " & _
             "DataInizio, DataFine, StatoPatto " & _
             "FROM Patti" & strWhere & _
             " ORDER BY DatoreCognome, DatoreNome"
    
    ' Usa ADO per il recordset
    If m_rstPatti Is Nothing Then
        Set m_rstPatti = New ADODB.Recordset
    ElseIf m_rstPatti.State = adStateOpen Then
        m_rstPatti.Close
    End If
    
    ' Apri il recordset
    m_rstPatti.Open strSQL, CurrentProject.Connection, _
                    adOpenStatic, adLockReadOnly
    
    ' Assegna alla subform
    Set Me.subfrm_PattiRisultati.Form.Recordset = m_rstPatti
    
    ' Aggiorna contatore
    Me.lblRecordCount.Caption = "Record trovati: " & _
        Format(m_rstPatti.RecordCount, "#,##0")
    
    m_blnUpdating = False
    Exit Sub
    
Err_Handler:
    m_blnUpdating = False
    MsgBox "Errore nel filtro: " & Err.Description, vbExclamation
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">Funzione helper per costruire la WHERE:</h4>
          <CodeBlock code={`Private Function BuildWhereClause(ByVal Ricerca As String, _
                                    ByVal Campo As String, _
                                    ByVal Stato As String) As String
    Dim strWhere As String
    Dim strSearch As String
    
    strWhere = ""
    
    ' Filtro stato
    If Stato <> "Tutti" Then
        strWhere = " WHERE StatoPatto = '" & Replace(Stato, "'", "''") & "'"
    End If
    
    ' Filtro ricerca
    If Len(Ricerca) > 0 Then
        strSearch = Replace(Ricerca, "'", "''")
        Dim strCondition As String
        
        Select Case Campo
            Case "Tutti i campi"
                strCondition = "(" & _
                    "DatoreCognome LIKE '*" & strSearch & "*' OR " & _
                    "DatoreNome LIKE '*" & strSearch & "*' OR " & _
                    "ColfCognome LIKE '*" & strSearch & "*' OR " & _
                    "ColfNome LIKE '*" & strSearch & "*' OR " & _
                    "Citta LIKE '*" & strSearch & "*' OR " & _
                    "CodiceFiscale LIKE '*" & strSearch & "*'" & _
                    ")"
            Case Else
                ' Mappa il nome visualizzato al nome campo
                Dim strField As String
                strField = MappaCampo(Campo)
                If strField <> "" Then
                    strCondition = strField & " LIKE '*" & strSearch & "*'"
                End If
        End Select
        
        If Len(strCondition) > 0 Then
            If Len(strWhere) > 0 Then
                strWhere = strWhere & " AND " & strCondition
            Else
                strWhere = " WHERE " & strCondition
            End If
        End If
    End If
    
    BuildWhereClause = strWhere
End Function

Private Function MappaCampo(ByVal NomeVisualizzato As String) As String
    Select Case NomeVisualizzato
        Case "Cognome Datore": MappaCampo = "DatoreCognome"
        Case "Nome Datore": MappaCampo = "DatoreNome"
        Case "Città": MappaCampo = "Citta"
        Case "Provincia": MappaCampo = "Provincia"
        Case "Codice Fiscale": MappaCampo = "CodiceFiscale"
        Case "Stato Patto": MappaCampo = "StatoPatto"
        Case Else: MappaCampo = ""
    End Select
End Function`} />

          <h4 className="font-semibold text-gray-800 mt-4">Cleanup alla chiusura:</h4>
          <CodeBlock code={`Private Sub Form_Close()
    ' Chiudi il recordset ADO
    If Not m_rstPatti Is Nothing Then
        If m_rstPatti.State = adStateOpen Then
            m_rstPatti.Close
        End If
        Set m_rstPatti = Nothing
    End If
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Call Form_Close
End Sub`} />

          <Tip type="info">
            <strong>TOP 500:</strong> Ho aggiunto <code>TOP 500</code> nella query per limitare i risultati. 
            Con 10.000+ record, mostrare tutti i risultati in una subform è lento e inutile. 
            L'utente digiterà fino a restringere il campo. Puoi aumentare a 1000 o togliere il limite se le prestazioni lo consentono.
          </Tip>

          <Tip type="success">
            <strong>Vantaggio ADO:</strong> Quando migrerai a SQL Express, basterà cambiare <code>CurrentProject.Connection</code> con 
            la stringa di connessione ADO a SQL Server. Tutto il resto del codice rimane identico!
          </Tip>
        </div>
      ),
    },
    {
      id: 'ottimizzazione',
      title: 'Ottimizzazione FE/BE',
      icon: '🔧',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Ottimizzazione FE/BE in preparazione a SQL Express</h3>
          
          <h4 className="font-semibold text-gray-800 mt-4">1. Split Database (se non l'hai già fatto)</h4>
          <Step number={1} title="Usa lo strumento integrato di Access">
            <p><code className="bg-gray-200 px-1 rounded">Strumenti Database → Sposta dati → Database Access</code></p>
            <p>Questo crea automaticamente il file BE con le tabelle e lascia il FE con i collegamenti.</p>
          </Step>

          <h4 className="font-semibold text-gray-800 mt-4">2. Collegamento tabelle via ODBC (invece di linked tables native)</h4>
          <p>Per la futura migrazione a SQL Express, è meglio collegare le tabelle tramite ODBC:</p>
          <CodeBlock code={`' Funzione per collegare tabelle SQL Server via ADO
Public Sub CollegaTabelleSQLServer()
    Dim cnn As ADODB.Connection
    Dim strConn As String
    
    ' Stringa di connessione a SQL Express
    strConn = "Provider=SQLOLEDB;" & _
              "Server=.\SQLEXPRESS;" & _
              "Database=AnagraficaPatti;" & _
              "Trusted_Connection=yes;"
    
    Set cnn = New ADODB.Connection
    cnn.Open strConn
    
    ' Verifica connessione
    If cnn.State = adStateOpen Then
        MsgBox "Connessione a SQL Server riuscita!", vbInformation
    End If
    
    cnn.Close
    Set cnn = Nothing
End Sub`} />

          <h4 className="font-semibold text-gray-800 mt-4">3. Indici da creare (sul BE o su SQL Express)</h4>
          <p>Indici fondamentali per velocizzare il filtro:</p>
          <CodeBlock code={`-- INDICI PER SQL SERVER EXPRESS (da eseguire dopo la migrazione)
-- Questi indici rendono il filtro incrementale istantaneo

CREATE INDEX IX_Patti_DatoreCognome ON Patti(DatoreCognome);
CREATE INDEX IX_Patti_DatoreNome ON Patti(DatoreNome);
CREATE INDEX IX_Patti_ColfCognome ON Patti(ColfCognome);
CREATE INDEX IX_Patti_Citta ON Patti(Citta);
CREATE INDEX IX_Patti_StatoPatto ON Patti(StatoPatto);
CREATE INDEX IX_Patti_CodiceFiscale ON Patti(CodiceFiscale);

-- Indice composto per la ricerca più comune
CREATE INDEX IX_Patti_CognomeNome ON Patti(DatoreCognome, DatoreNome);

-- Per le date (filtro per periodo)
CREATE INDEX IX_Patti_DataInizio ON Patti(DataInizio);
CREATE INDEX IX_Patti_DataFine ON Patti(DataFine);`} />

          <h4 className="font-semibold text-gray-800 mt-4">4. Indici nel BE Access (ora)</h4>
          <Step number={1} title="Apri il file BE in Access">
            <p>Per ogni tabella, vai in Visualizzazione Struttura e imposta la proprietà <strong>Indicizzato = Sì (Duplicati ammessi)</strong> sui campi:</p>
            <ul className="list-disc list-inside mt-1">
              <li>DatoreCognome</li>
              <li>ColfCognome</li>
              <li>Citta</li>
              <li>StatoPatto</li>
              <li>CodiceFiscale</li>
            </ul>
          </Step>

          <h4 className="font-semibold text-gray-800 mt-4">5. Altre ottimizzazioni FE</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li><strong>Compatta e ripristina</strong> il FE regolarmente (ogni giorno se multi-utente)</li>
            <li><strong>Disabilita AutoCorrezione</strong> nel FE (File → Opzioni → Correzione bozze)</li>
            <li><strong>Non usare domini DLookup</strong> nelle maschere — rallentano terribilmente</li>
            <li><strong>Usa query salvate</strong> invece di SQL dinamico dove possibile (Access le pre-compila)</li>
            <li><strong>Cache delle tabelle collegate</strong>: aggiungi un modulo con funzione di inizializzazione</li>
          </ul>

          <CodeBlock code={`' Modulo mod_Init - da chiamare all'avvio dell'applicazione
Public Sub InizializzaApplicazione()
    ' Mantiene le connessioni alle tabelle collegate attive
    ' Evita il ritardo al primo accesso
    Dim db As DAO.Database
    Dim tdf As DAO.TableDef
    
    Set db = CurrentDb
    
    ' "Tocca" ogni tabella collegata per mantenere la connessione
    For Each tdf In db.TableDefs
        If tdf.Attributes And dbAttachedTable Then
            ' Forza il refresh del collegamento
            On Error Resume Next
            tdf.RefreshLink
            On Error GoTo 0
        End If
    Next tdf
    
    Set tdf = Nothing
    Set db = Nothing
End Sub`} />

          <Tip type="danger">
            <strong>Errore comune:</strong> Non usare MAI <code>SELECT *</code> nelle query della subform. 
            Seleziona solo i campi che servono. Meno dati transitano = più veloce è tutto.
          </Tip>
        </div>
      ),
    },
    {
      id: 'migrazione',
      title: 'Migrazione a SQL Express',
      icon: '🗄️',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Roadmap Migrazione BE → SQL Server Express</h3>
          
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Fasi della migrazione:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <div>
                  <strong>Ora</strong> — Ottimizza il FE con filtri dinamici e ADO
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <div>
                  <strong>Pre-migrazione</strong> — Crea indici nel BE Access, testa le query pesanti
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <div>
                  <strong>Migrazione</strong> — Usa l'importazione guidata di SQL Server o SSMA (SQL Server Migration Assistant)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <div>
                  <strong>Post-migrazione</strong> — Ricollega il FE a SQL Express via ODBC, cambia solo la stringa di connessione
                </div>
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-4">Cambiamenti nel codice VBA per SQL Express:</h4>
          <CodeBlock code={`' === MODULO mod_Connessione ===
' Questo modulo centralizza la gestione della connessione.
' Cambiando solo qui, tutto il resto funziona sia con Access che SQL Server.

Private m_cnn As ADODB.Connection
Private m_blnIsSQLServer As Boolean

Public Function GetConnection() As ADODB.Connection
    If m_cnn Is Nothing Then
        Set m_cnn = New ADODB.Connection
        
        ' === CONFIGURA QUI IL TIPO DI BACKEND ===
        ' Metti True quando passi a SQL Server
        m_blnIsSQLServer = False
        
        If m_blnIsSQLServer Then
            ' CONNESSIONE A SQL SERVER EXPRESS
            m_cnn.ConnectionString = _
                "Provider=SQLOLEDB;" & _
                "Server=localhost\\SQLEXPRESS;" & _
                "Database=AnagraficaPatti;" & _
                "Trusted_Connection=yes;" & _
                "Connect Timeout=10;"
        Else
            ' CONNESSIONE AL BE ACCESS (situazione attuale)
            Set m_cnn = CurrentProject.Connection
        End If
        
        m_cnn.Open
    End If
    
    Set GetConnection = m_cnn
End Function

Public Sub CloseConnection()
    If Not m_cnn Is Nothing Then
        If m_cnn.State = adStateOpen Then m_cnn.Close
        Set m_cnn = Nothing
    End If
End Function`} />

          <h4 className="font-semibold text-gray-800 mt-4">Adattamento query per SQL Server:</h4>
          <CodeBlock code={`' La differenza principale tra Access e SQL Server nelle query:
' - Access usa * per LIKE, SQL Server usa %
' - Access usa & per concatenare, SQL Server usa +
' - SQL Server ha TOP invece di SELECT TOP (già compatibile)

' Funzione che adatta automaticamente la sintassi:
Public Function AdattaSQL(ByVal strSQL As String) As String
    If m_blnIsSQLServer Then
        ' Sostituisci * con % per i LIKE
        strSQL = Replace(strSQL, "LIKE '*", "LIKE '%")
        strSQL = Replace(strSQL, "*'", "%'")
    End If
    AdattaSQL = strSQL
End Function

' Quindi nella funzione AggiornaFiltro, prima di aprire il recordset:
' strSQL = AdattaSQL(strSQL)
' m_rstPatti.Open strSQL, GetConnection, adOpenStatic, adLockReadOnly`} />

          <h4 className="font-semibold text-gray-800 mt-4">Stored Procedure per SQL Server (bonus):</h4>
          <CodeBlock code={`-- Stored Procedure su SQL Server per il filtro
-- Molto più veloce di una query dinamica
CREATE PROCEDURE sp_CercaPatti
    @Ricerca NVARCHAR(100) = NULL,
    @Campo NVARCHAR(50) = NULL,
    @Stato NVARCHAR(20) = NULL,
    @MaxRecords INT = 500
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@MaxRecords)
        ID, DatoreCognome, DatoreNome,
        ColfCognome, ColfNome, Citta, Provincia,
        DataInizio, DataFine, StatoPatto, CodiceFiscale
    FROM Patti
    WHERE 
        (@Stato IS NULL OR @Stato = 'Tutti' OR StatoPatto = @Stato)
        AND 
        (@Ricerca IS NULL OR @Ricerca = '' OR
            CASE @Campo
                WHEN 'Tutti i campi' THEN
                    CASE WHEN DatoreCognome LIKE '%' + @Ricerca + '%'
                         OR DatoreNome LIKE '%' + @Ricerca + '%'
                         OR ColfCognome LIKE '%' + @Ricerca + '%'
                         OR ColfNome LIKE '%' + @Ricerca + '%'
                         OR Citta LIKE '%' + @Ricerca + '%'
                         OR CodiceFiscale LIKE '%' + @Ricerca + '%'
                    THEN 1 ELSE 0 END
                WHEN 'Cognome Datore' THEN
                    CASE WHEN DatoreCognome LIKE '%' + @Ricerca + '%' THEN 1 ELSE 0 END
                WHEN 'Città' THEN
                    CASE WHEN Citta LIKE '%' + @Ricerca + '%' THEN 1 ELSE 0 END
                ELSE 1
            END = 1)
    ORDER BY DatoreCognome, DatoreNome;
END
GO`} />

          <Tip type="success">
            <strong>Vantaggio Stored Procedure:</strong> Quando passerai a SQL Express, chiamando la stored procedure 
            invece di costruire SQL dinamico, otterrai performance nettamente superiori perché il piano di esecuzione viene cachato dal server.
          </Tip>
        </div>
      ),
    },
    {
      id: 'checklist',
      title: 'Checklist Finale',
      icon: '✅',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Checklist Implementazione</h3>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Fase 1 — Ora (BE Access)</h4>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Split database FE/BE (se non già fatto)</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Creare indici sui campi di ricerca nel BE</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Creare la maschera frm_Patti_FiltroDinamico</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Creare la subform subfrm_PattiRisultati in foglio dati</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Inserire il codice VBA per il filtro incrementale</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Adattare i nomi dei campi al tuo schema reale</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Testare con tutti i filtri (campo specifico, tutti i campi, stato)</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Verificare che il conteggio record sia corretto</span>
            </label>

            <h4 className="font-semibold text-gray-700 mt-4">Fase 2 — Preparazione SQL Express</h4>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Installare SQL Server Express (gratuito)</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Importare le tabelle dal BE Access a SQL Express</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Creare gli indici su SQL Server</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Creare la stored procedure sp_CercaPatti</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Modificare mod_Connessione: m_blnIsSQLServer = True</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Ricollegare le tabelle nel FE via ODBC</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" />
              <span>Testare il filtro con il nuovo backend SQL</span>
            </label>
          </div>

          <Tip type="info">
            <strong>Tempo stimato:</strong> Fase 1 circa 1-2 ore. Fase 2 circa 2-3 ore (incluso test).
          </Tip>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">📌 Riepilogo architettura</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Il FE contiene SOLO maschere, report, query, moduli VBA</li>
              <li>• Il BE contiene SOLO tabelle (ora Access, poi SQL Express)</li>
              <li>• La comunicazione avviene via query SQL costruite dinamicamente nel VBA</li>
              <li>• Il filtro incrementale funziona aggiornando la RecordSource della subform</li>
              <li>• ADO garantisce compatibilità futura con SQL Server</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="bg-white/20 rounded-lg p-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm4 2v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Guida: Maschera Filtro Dinamico per Access</h1>
            <p className="text-red-100 text-sm">Patti Datore/Colf — Ottimizzazione FE con filtro incrementale</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Sezioni</h2>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-red-50 text-red-700 font-semibold border-l-3 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>💡 Suggerimento:</strong> I blocchi di codice hanno il pulsante "Copia" — apparirà al passaggio del mouse.
            </p>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-3 text-xs">
        Guida tecnica — Maschera Filtro Dinamico Access per gestione Patti Datore/Colf
      </footer>
    </div>
  );
}

export default App;
