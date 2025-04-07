import React from 'react';
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaHeading
} from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div
      className="menu-bar"
      style={{
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid #ccc',
        gap: '12px',
        backgroundColor: '#f8f9fa',
        flexWrap: 'wrap'
      }}
    >
      {/* Fonte e tamanho (placeholder) */}
      <select style={{ padding: '4px' }}>
        <option value="arial">Arial</option>
        <option value="times">Times New Roman</option>
      </select>
      <select style={{ padding: '4px', width: '60px' }}>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="14">14</option>
      </select>

      {/* Botões de formatação */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="Negrito"
      >
        <FaBold />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="Itálico"
      >
        <FaItalic />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        title="Título"
      >
        <FaHeading />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title="Lista"
      >
        <FaListUl />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title="Lista Numerada"
      >
        <FaListOl />
      </button>

      {/* Adicione mais ícones conforme necessário */}
    </div>
  );
};

export default MenuBar;
