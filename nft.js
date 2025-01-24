const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;


const ALCHEMY_API_KEY = 'your-alchemy-api-key';
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

document.getElementById('connectWallet').addEventListener('click', async () => {
    try {
        // Connect wallet
        await provider.send('eth_requestAccounts', []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        alert(`Wallet connected: ${address}`);

        fetchNFTs(address);
    } catch (error) {
        console.error('Error connecting wallet:', error);
    }
});

async function fetchNFTs(walletAddress) {
    const nftDisplay = document.getElementById('nftDisplay');
    nftDisplay.innerHTML = 'Loading NFTs...';

    try {
        const response = await fetch(`${ALCHEMY_URL}/getNFTs/?owner=${walletAddress}`);
        const data = await response.json();

        nftDisplay.innerHTML = ''; // Clear loading message

        if (data.ownedNfts.length > 0) {
            data.ownedNfts.forEach((nft) => {
                const nftElement = document.createElement('div');
                nftElement.innerHTML = `
                    <img src="${nft.media[0]?.gateway}" alt="${nft.title || 'NFT'}">
                    <p>${nft.title || 'Unnamed NFT'}</p>
                `;
                nftDisplay.appendChild(nftElement);
            });
        } else {
            nftDisplay.innerHTML = 'No NFTs found in this wallet.';
        }
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        nftDisplay.innerHTML = 'Failed to load NFTs.';
    }
}

