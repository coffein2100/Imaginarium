import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://frhttueohohfxedjbtun.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyaHR0dWVvaG9oZnhlZGpidHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMDk5MzEsImV4cCI6MjAzMDY4NTkzMX0.rj5HVv_w1OJm3OvwvRWBOYAWNcdCf8IHoIAGI8PfMMU"); //подключение к супербас копируем url и key  из раздела Project API

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}> {/* Отслеживание сессии */}
      <App /> 
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
