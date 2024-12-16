const getGeminiApiKey = () => {
      return localStorage.getItem('geminiApiKey');
    };

    export const fetchWithGemini = async (url: string, options: RequestInit = {}) => {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        throw new Error('No Gemini API key set. Please set it in settings.');
      }

      const headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        ...options.headers,
      };

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    };
