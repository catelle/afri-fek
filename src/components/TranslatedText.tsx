import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  text: string;
  className?: string;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
}

export default function TranslatedText({ text, className = '', tag = 'span' }: TranslatedTextProps) {
  const { translateUIText, userLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const translate = async () => {
      if (userLanguage === 'fr') {
        setTranslatedText(text);
        return;
      }
      
      const translated = await translateUIText(text);
      setTranslatedText(translated);
    };

    translate();
  }, [text, userLanguage, translateUIText]);

  const Tag = tag;
  return <Tag className={className}>{translatedText}</Tag>;
}