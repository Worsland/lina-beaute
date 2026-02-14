import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import api from '../../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis votre assistant beauté. Comment puis-je vous aider aujourd\'hui ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Recherche intelligente
      const response = await api.post('/ai/search', { query: input });

      const assistantMessage = {
        role: 'assistant',
        content: `J'ai trouvé ${response.data.data.count} établissement(s) correspondant à votre recherche !`,
        results: response.data.data.results,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Désolé, j\'ai rencontré une erreur. Pouvez-vous reformuler ?',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Assistant IA</Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: message.role === 'user' ? 'primary.light' : 'grey.100',
              }}
            >
              <Typography>{message.content}</Typography>
              {message.results && (
                <Box mt={2}>
                  {message.results.map((result) => (
                    <Typography key={result._id} variant="body2">
                      • {result.name} - {result.address.city}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box display="flex" justifyContent="flex-start">
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Décrivez ce que vous recherchez..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Envoyer
        </Button>
      </Box>
    </Paper>
  );
};

export default AIAssistant;