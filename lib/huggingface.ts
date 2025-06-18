import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

export async function summarizeText(text: string) {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      {
      headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
            }
                }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur HuggingFace:', error);
    throw error;
  }
}
