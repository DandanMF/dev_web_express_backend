const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const notesPath = path.join(__dirname, 'notes.json');

// Helper para ler notas
async function readNotes() {
  try {
    const data = await fs.readFile(notesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper para salvar notas
async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
}

// CRUD Routes

// GET todas as notas
router.get('/notes', async (req, res) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notas' });
  }
});

// GET nota por ID
router.get('/notes/:id', async (req, res) => {
  try {
    const notes = await readNotes();
    const note = notes.find(n => n.id === req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar nota' });
  }
});

// POST criar nova nota
router.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    
    const notes = await readNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    await saveNotes(notes);
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar nota' });
  }
});

// PUT atualizar nota
router.put('/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    await saveNotes(notes);
    
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar nota' });
  }
});

// DELETE remover nota
router.delete('/notes/:id', async (req, res) => {
  try {
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    const [deletedNote] = notes.splice(noteIndex, 1);
    await saveNotes(notes);
    
    res.json(deletedNote);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover nota' });
  }
});

module.exports = router;