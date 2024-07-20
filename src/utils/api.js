import axios from "axios";

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url);
        return data;
    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : { error: "Something went wrong" };
    }
}

// const result = await axios.post("http://localhost:4000/api/uploadImage", { image });
export const uploadImage = async (url, {image}) => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + url, {image});
        return response.data;
    } 
    catch (error) {
        console.error('Error uploading image:', error);
        return error.response ? error.response.data : { error: 'Something went wrong' };
    }
};

  

export const postData = async (url, formData) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Something went wrong' };
    }
}

export const postFile = async (url, formData) => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data; 

    } 
    catch (error) {
        console.error('Error:', error);
        return { error: 'Something went wrong' }; 
    }
}



export const editData = async (url, updatedData) => {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData);
        return data;
    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : { error: "Something went wrong" };
    }
}
// export const editData = async (url, updatedData ) => {
//     try{
//         const { res } = await axios.put(`${process.env.REACT_APP_API_URL}${url}`,updatedData);
//         return res;
//     }
//     catch(error){
//         console.error('Error:', error);
//         throw error;
//     }
    
// }

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
        return data;
    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : { error: "Something went wrong" };
    }
}

export const deleteImages = async (url, image) => {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, { data: { image } });
        return data;
    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : { error: "Something went wrong" };
    }
}

