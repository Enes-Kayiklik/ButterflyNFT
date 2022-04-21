const { butterflyToken } = require('../config')
const { uploadImage } = require('./PinataConnection')
const fs = require('fs');
const ButterflyToken = JSON.parse(fs.readFileSync('./artifacts/contracts/ButterflyToken.sol/ButterflyToken.json', 'utf-8'))

async function main() {
    console.log("Image Uploading to Pinata...")
    const tokenCounter = await getTokenCounter()
    const ipfsHash = await uploadImage("butterfly.jpg", tokenCounter, "Chalk Hill Blue", "A small, widespread butterfly that occasionally visits gardens.")
    console.log("Minting NFT...")
    await mintToken(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
    console.log(`Contract Address: ${butterflyToken} Token Counter: ${tokenCounter}`)
}

async function getTokenCounter() {
    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
    const contract = new ethers.Contract(butterflyToken, ButterflyToken.abi, provider)
    const tokenCounter = await contract.tokenCounter()
    return tokenCounter
}

async function mintToken(ipfsUrl) {
    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
    const signer = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);
    const contract = new ethers.Contract(butterflyToken, ButterflyToken.abi, signer)
    const transaction = await contract.mint(ipfsUrl)
    await transaction.wait()
    const tokenCounter = await contract.tokenCounter()
    return `${tokenCounter - 1}`
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
