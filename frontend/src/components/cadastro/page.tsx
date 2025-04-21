'use client';

import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setMensagem('Usuário criado com sucesso! Redirecionando...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorData = await response.json();
        setMensagem(errorData.detail || 'Erro ao cadastrar usuário.');
      }
    } catch (err) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Cadastro</h2>

        {mensagem && <p className="mb-3 text-center text-sm text-blue-600">{mensagem}</p>}

        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-3 w-full border rounded px-3 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}
