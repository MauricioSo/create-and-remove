import { Configuration, OpenAIApi } from "openai";
const RemoveBg = require('remove.bg');
const {removeBackgroundFromImageUrl} = RemoveBg

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }
  console.log(animal, req.body.animal)
  try {
    const response = await openai.createImage({
      prompt: animal,
      n: 1,
      size: '256x256'
    });
    const image_url = response.data.data[0].url;
    const image_final = await deleteBackgroundImages(image_url, animal)
    res.status(200).json({ result: image_final });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }


  function crearDigitoDesdePalabra(cadena) {
    // Dividir la cadena en palabras
    const palabras = cadena.split(' ');
  
    if (palabras.length === 0) {
      return null; // La cadena está vacía
    }
  
    // Tomar la primera palabra
    const primeraPalabra = palabras[0];
  
    // Generar un número aleatorio de 4 dígitos
    const numeroAleatorio = Math.floor(Math.random() * 90000) + 1000;
  
    // Combinar la primera palabra y el número para formar un dígito de 6 dígitos
    const digito = primeraPalabra.slice(0, 3).toUpperCase() + numeroAleatorio;
  
    return digito;
  }
  // // Definir la función que genera imágenes con DALL-E y les quita el fondo
  async function deleteBackgroundImages(url, prompt) {
    const nameImage = crearDigitoDesdePalabra(prompt)
    const outputFile = `${__dirname}/public/${nameImage}.png`;
    
      const image_url = url
      const result = await removeBackgroundFromImageUrl({
        url: image_url,
        apiKey: REMOVE_BG_API_KEY,
        size: "regular",
        outputFile 
      })
      
      
      
    return {result, nameImage};
  }
  


}


