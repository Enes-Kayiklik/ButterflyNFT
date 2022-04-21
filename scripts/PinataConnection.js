const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function uploadImage(file_name, tokenId, nft_title, nft_desc) {
    const image = fs.readFileSync(`./${file_name}`);
    return await uploadToPinata(image, file_name, tokenId, nft_title, nft_desc)
}

async function uploadToPinata(image, name, tokenId, nft_title, nft_desc) {
    // put file into form data
    const formData = new FormData()
    formData.append('file', image, name)
    const API_KEY = "PINATA_API_KEY"
    const API_SECRET = "PINATA_API_SECRET"

    // the endpoint needed to upload the file
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    const response = await axios.post(
        url,
        formData,
        {
            maxContentLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET

            }
        }
    )
    return await sendMetadata(response.data.IpfsHash, nft_title, nft_desc, tokenId)
}

async function sendMetadata(IPFSHash, nft_title, nft_desc, tokenId) {
    const API_KEY = "PINATA_API_KEY"
    const API_SECRET = "PINATA_API_SECRET"
    const JSONBody = {
        name: nft_title,
        tokenId: tokenId,
        image: `https://gateway.pinata.cloud/ipfs/${IPFSHash}/`,
        description: nft_desc,
        attributes: []
    }
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const response = await axios.post(
        url,
        JSONBody,
        {
            maxContentLength: "Infinity",
            headers: {
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET

            }
        }
    ).catch(function (error) {
        console.log(error.response.data.error)
    })
    console.log(response.data.IpfsHash)
    return response.data.IpfsHash
}

module.exports = {
    uploadImage,
};