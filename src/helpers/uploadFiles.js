const uploadFile = async(file)=>{
    const formData= new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chat-app-file")
    console.log("in helpers================",formData)
    const url=`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`
       const res= await fetch(url,{
            method:"POST",
            body:formData
        })
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error response from Cloudinary:", errorText);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        const data = await res.json();
        console.log("in helpers after api call to cloudinary================",data)
        console.log("in helpers aftey================",data.url)
        
        return data 
    }
    export default uploadFile 



    // const  data = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload?upload_preset=chat-app-file`,formData);
// const url=`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/:auto/upload`
//     const  data = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload?upload_preset=I-club`,formData);
//   const response= await fetch(url,{
    //     method:"POST",
    //     body:formData
    // })
    


    

// console.log("process.env.REACT_APP_CLOUDINARY_CLOUD_NAME",process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
// console.log("process.env.REACT_APP_CLOUDINARY_CLOUD_NAME",process.env.REACT_APP_BACKEND_URL);