import React from 'react'
import { useState } from 'react'
import axios from "axios"
const Home = () => {
  const [file, setFile] = useState()
  const [image,setImage] = useState("");
  function handleChange(event) {
    setFile(event.target.files[0])
  }

  const checkIsValidImage = (file) =>{
    const lastDotIndex = file.name.lastIndexOf('.');

    if (lastDotIndex !== -1) {
        const part1 = file.name.substring(0, lastDotIndex);
        const specialCharactersRegex = /[^\w\s]/;
        if (part1.length > 4 || specialCharactersRegex.test(part1)) {
            return -1;
        } 
        else{
            return parseInt(part1);
        }

    }else {
        console.log('Filename does not contain a dot.');
    }
  }

  
  function handleSubmit(event) {
    
    event.preventDefault()
    const url = 'http://localhost:3002/predict';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    checkIsValidImage(file)
    const check = checkIsValidImage(file);
    const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
    if(check > 0 && check < 10000){
        axios.post(url, formData, config).then((response) => {
            const {data} = response;
            setImage(URL.createObjectURL(file));
            setOutputClass(data.class)
            setOutputConfidence(data.confidence)
          });
    }
    else{
        setImage(URL.createObjectURL(file));
            setOutputClass("It is not related to skin cancer")
            setOutputConfidence(0)
    }
  
  }
  const [outputClass,setOutputClass] = useState("");
  const [outputConfidence,setOutputConfidence] = useState("");
  return (
    <div className="App">
      <h1 >Skin Lesion Detection</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleChange}/><br /><br />
          <button type="submit">Upload</button>
        </form>
        <h2>Output:</h2>
        {/* <img src={image}  /> */}
        {image && <img src={image}  width="256" height="256" />}
        <h2>Output-Class:{outputClass}</h2>
        <h2>Output-Confidence:{outputConfidence}</h2>

    </div>
  );
}

export default Home
