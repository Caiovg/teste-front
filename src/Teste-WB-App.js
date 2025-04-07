import React from 'react';
import useWebSocket from './useWebSocket';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

// Componente MenuBar para o editor
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar" style={{ marginBottom: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Negrito
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Itálico
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        Título
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        Lista
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        Lista Numerada
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter the URL of the image:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        Inserir Imagem
      </button>
    </div>
  );
};

const MatchStats = ({ onSave }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: '<p>Comece a escrever sua notícia...</p>',
  });

  const handleSave = () => {
    const html = editor.getHTML();
    onSave(html);
  };

  // local: ws://localhost:3333
  // dev: wss://klmg.com.br/api/ws
  const matchStats = useWebSocket('wss://klmg.com.br/api/ws');
  console.log("matchStats:", matchStats);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Estatísticas da Partida</h1>
      {matchStats ? (
        <div>
          {Array.isArray(matchStats) ? (
            matchStats.map((stat, index) => (
              <p key={index}>
                <strong>{stat.estatistica}:</strong> {stat.time1} - {stat.time2}
              </p>
            ))
          ) : (
            <pre>{JSON.stringify(matchStats, null, 2)}</pre>
          )}
        </div>
      ) : (
        <p>Aguardando dados...</p>
      )}

      <h1 style={{ marginTop: '40px' }}>Editor de texto</h1>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          minHeight: '300px',
          marginBottom: '20px'
        }} 
      />
      <button 
        onClick={handleSave}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Salvar
      </button>
    </div>
  );
};

export default MatchStats;