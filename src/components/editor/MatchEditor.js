import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import MenuBar from './MenuBar';
import useWebSocket from './useWebSocketHook';

const MatchEditor = ({ onSave, placeholder = 'Comece a escrever sua notícia aqui...', authorId }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('M');
  const [isPublished, setIsPublished] = useState('N');
  const [playerIds, setPlayerIds] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [savedContent, setSavedContent] = useState('');
  const [savedJson, setSavedJson] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ 
        inline: true, 
        allowBase64: true,
        HTMLAttributes: {
          class: 'news-image',
        },
      }),
    ],
    content: `
      <h2>${placeholder}</h2>
      <p>Digite o conteúdo da sua notícia aqui...</p>
      <p>Você pode adicionar:</p>
      <ul>
        <li>Imagens</li>
        <li>Links</li>
        <li>Destaques</li>
        <li>E muito mais!</li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none max-w-none',
      },
    },
  });

  const matchStats = useWebSocket('wss://klmg.com.br/api/ws');

  const handleSave = (publish = false) => {
    if (!editor) return;

    const html = editor.getHTML();
    setSavedContent(html);

    const payload = {
      title,
      content: html,
      is_published: publish ? 'Y' : 'N',
      author_id: authorId,
      type,
      player_ids: playerIds,
      team_ids: teamIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSavedJson(payload);
    onSave(payload);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '15px' }}>Estatísticas da Partida</h2>
        {matchStats ? (
          Array.isArray(matchStats) ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
              {matchStats.map((stat, index) => (
                <div key={index} style={{ background: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginBottom: '5px', fontSize: '16px' }}>{stat.estatistica}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{stat.time1}</span>
                    <span>vs</span>
                    <span>{stat.time2}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px' }}>
              {JSON.stringify(matchStats, null, 2)}
            </pre>
          )
        ) : (
          <p style={{ color: '#666' }}>Aguardando dados da partida...</p>
        )}
      </div>

      <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: '20px' }}>Editor de Notícia</h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Título da notícia</label>
          <input
            type="text"
            placeholder="Digite um título impactante"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              transition: 'border 0.3s',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipo de notícia</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
            }}
          >
            <option value="P">Notícia vinculada a jogador(es)</option>
            <option value="T">Notícia vinculada a time(s)</option>
            <option value="G">Notícia geral</option>
            <option value="M">Notícia mista</option>
          </select>
        </div>

        {type === 'P' || type === 'M' ? (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Jogadores relacionados</label>
            <select 
              multiple 
              value={playerIds} 
              onChange={(e) => setPlayerIds([...e.target.selectedOptions].map(opt => opt.value))} 
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                minHeight: '100px',
                background: 'white',
              }}
            >
              <option value="550e8400-e29b-41d4-a716-446655440000">Jogador 1</option>
              <option value="110e8400-e29b-41d4-a716-446655440001">Jogador 2</option>
              <option value="220e8400-e29b-41d4-a716-446655440002">Jogador 3</option>
            </select>
          </div>
        ) : null}

        {type === 'T' || type === 'M' ? (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Times relacionados</label>
            <select 
              multiple 
              value={teamIds} 
              onChange={(e) => setTeamIds([...e.target.selectedOptions].map(opt => opt.value))} 
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                minHeight: '100px',
                background: 'white',
              }}
            >
              <option value="330e8400-e29b-41d4-a716-446655440002">Time 1</option>
              <option value="440e8400-e29b-41d4-a716-446655440003">Time 2</option>
              <option value="550e8400-e29b-41d4-a716-446655440004">Time 3</option>
            </select>
          </div>
        ) : null}

        <div style={{ marginBottom: '20px' }}>
          <MenuBar editor={editor} />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <EditorContent 
            editor={editor} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '20px',
              minHeight: '400px',
              background: 'white',
            }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button
            onClick={() => handleSave(false)}
            style={{ 
              background: '#4a6bdf', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background 0.3s',
              flex: 1,
            }}
          >
            Salvar como Rascunho
          </button>

          <button
            onClick={() => handleSave(true)}
            style={{ 
              background: '#28a745', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background 0.3s',
              flex: 1,
            }}
          >
            Publicar Notícia
          </button>
        </div>

        {savedContent && (
          <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Conteúdo Salvo</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>Pré-visualização:</h3>
              <div
                style={{ 
                  border: '1px solid #eee', 
                  borderRadius: '8px', 
                  padding: '25px', 
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
                dangerouslySetInnerHTML={{ __html: savedContent }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>JSON Completo:</h3>
              <pre style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                overflowX: 'auto',
                border: '1px solid #eee',
                maxHeight: '400px',
              }}>
                {JSON.stringify(savedJson, null, 2)}
              </pre>
            </div>

            <div>
              <h3 style={{ marginBottom: '15px' }}>Código HTML:</h3>
              <pre style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                overflowX: 'auto',
                border: '1px solid #eee',
                maxHeight: '400px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}>
                {savedContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchEditor;