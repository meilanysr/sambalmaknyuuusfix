"use client";

import { useEffect } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

interface ChatWidgetProps {
  webhookUrl: string;
}

const ChatWidget = ({ webhookUrl }: ChatWidgetProps) => {
  useEffect(() => {
    const chat = createChat({
      webhookUrl: webhookUrl,
    });

    return () => {
      chat.destroy();
    };
  }, [webhookUrl]);

  return null; // The chat widget is injected into the DOM, so this component doesn't render anything itself.
};

export default ChatWidget;