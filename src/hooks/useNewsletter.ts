import { useState } from 'react';
import { useSimpleStorage } from './useSimpleStorage';
import { NewsletterSubscriber } from '../types';

export function useNewsletter() {
  const [subscribers, setSubscribers] = useSimpleStorage<NewsletterSubscriber[]>('newsletter-subscribers', []);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const subscribe = async (email: string) => {
    setIsSubscribing(true);
    setMessage(null);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Adresse email invalide');
      }

      // Check if already subscribed
      if (subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Cette adresse email est déjà inscrite à notre newsletter');
      }

      // Add subscriber
      const newSubscriber: NewsletterSubscriber = {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
      };

      setSubscribers([...subscribers, newSubscriber]);
      setMessage({
        type: 'success',
        text: 'Merci ! Vous êtes maintenant inscrit(e) à notre newsletter. Vous recevrez nos derniers articles directement dans votre boîte mail.'
      });

      return true;
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
      });
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const unsubscribe = (email: string) => {
    const updatedSubscribers = subscribers.filter(sub => sub.email !== email.toLowerCase());
    setSubscribers(updatedSubscribers);
    setMessage({
      type: 'info',
      text: 'Vous avez été désinscrit(e) de notre newsletter'
    });
  };

  const isSubscribed = (email: string) => {
    return subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const getSubscriberCount = () => {
    return subscribers.length;
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    message,
    clearMessage,
    getSubscriberCount,
    subscribers
  };
}