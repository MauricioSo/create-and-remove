import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // State to store image URLs
  console.log(animalInput)
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });
     
      const data = await response.json();
      console.log(data, response)
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      
      setImageUrls(data.result.nameImage); // Set the image URLs received from the API
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrls + '.png';
    link.download = 'imagen_descargable.png';
    link.click();
  };
console.log("esta es la imagen url", imageUrls)
  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
            
            <img  src={imageUrls + ".png"}  className={styles.generatedImage} />
            <button onClick={handleDownload}>Descargar Imagen</button>
      </main>
    </div>
  );
}
