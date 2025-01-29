const submitButton = document.getElementById('submitButton');
const form = document.getElementById('timeCapsuleForm');
const previewContainer = document.getElementById('previewContainer');
const fileList = document.createElement('ul');
let uploadButtonCreated = false;

previewContainer.style.overflowY = 'auto'; // Make previewContainer scrollable

submitButton.addEventListener('click', async () => {
  form.style.display = 'none';
  previewContainer.style.display = 'block';

  // Clear previous content only when necessary
  if (previewContainer.firstChild) {
    previewContainer.innerHTML = ''; // Clear previous content if it exists
  }

  // Add Upload Button only once
  if (!uploadButtonCreated) {
    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Download Data (JSON)';
    uploadButton.id = 'uploadButton';
    uploadButton.style.marginTop = '20px'; // Add margin for spacing
    previewContainer.appendChild(uploadButton);
    uploadButtonCreated = true;

    uploadButton.addEventListener('click', async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          // Request MetaMask connection
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Once connected, get the accounts
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          console.log('MetaMask connected:', accounts[0]);

          // Prepare the data to download (time capsule data)
          const dataToDownload = [];

          previewContainer.querySelectorAll('li').forEach(listItem => {
            const type = listItem.textContent.split(':')[0].trim();
            const fileName = listItem.textContent.split(':')[1].trim();

            if (type === 'Photo') {
              const file = document.querySelector(`img[src*="${fileName}"]`);
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = file.width;
              canvas.height = file.height;
              ctx.drawImage(file, 0, 0);
              const base64Data = canvas.toDataURL('image/png');
              dataToDownload.push({ type, fileName, data: base64Data });
            } else if (type === 'Video') {
              const videoElement = document.querySelector(`video[src*="${fileName}"]`);
              const videoData = 'https://example.com/videos/' + fileName; // Placeholder
              dataToDownload.push({ type, fileName, data: videoData });
            } else if (type === 'Document') {
              const documentData = 'https://example.com/documents/' + fileName; // Placeholder
              dataToDownload.push({ type, fileName, data: documentData });
            } else if (type === 'Link') {
              dataToDownload.push({ type, fileName: '', data: fileName });
            }
          });

          // Convert data to JSON
          const jsonData = JSON.stringify(dataToDownload);

          // Create a downloadable link for the JSON data
          const blob = new Blob([jsonData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'time_capsule_data.json'; // Name of the file to be downloaded
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          alert('Time Capsule Data JSON file has been created and downloaded!');
        } else {
          alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask or generating JSON file:', error);
        alert('Failed to connect to MetaMask or generate Time Capsule data. Please try again.');
      }
    });
  }

  previewContainer.appendChild(fileList);

  // Preview Photos
  const photos = document.getElementById('photos').files;
  if (photos.length > 0) {
    Array.from(photos).forEach(file => {
      const listItem = document.createElement('li');
      listItem.textContent = `Photo: ${file.name}`;
      listItem.addEventListener('click', () => {
        const previewImage = document.createElement('img');
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.maxWidth = '500px'; // Example: Set maximum width
        previewImage.style.maxHeight = '400px'; // Example: Set maximum height
        previewContainer.insertBefore(previewImage, uploadButton);
      });
      fileList.appendChild(listItem);
    });
  }

  // Preview Videos
  const videos = document.getElementById('videos').files;
  if (videos.length > 0) {
    Array.from(videos).forEach(file => {
      const listItem = document.createElement('li');
      listItem.textContent = `Video: ${file.name}`;
      listItem.addEventListener('click', () => {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(file);
        videoElement.controls = true;
        videoElement.style.maxWidth = '640px'; // Example: Set maximum width
        videoElement.style.maxHeight = '480px'; // Example: Set maximum height
        previewContainer.insertBefore(videoElement, uploadButton);
      });
      fileList.appendChild(listItem);
    });
  }

  // Preview Documents
  const documents = document.getElementById('documents').files;
  if (documents.length > 0) {
    Array.from(documents).forEach(file => {
      const listItem = document.createElement('li');
      listItem.textContent = `Document: ${file.name}`;
      listItem.addEventListener('click', () => {
        // Handle document preview (for example using PDF.js or other methods)
      });
      fileList.appendChild(listItem);
    });
  }

  // Preview Links
  const link = document.getElementById('links').value;
  if (link) {
    const listItem = document.createElement('li');
    listItem.textContent = `Link: ${link}`;
    listItem.addEventListener('click', () => {
      window.open(link, '_blank');
    });
    fileList.appendChild(listItem);
  }
});


// Add this code after the existing code

const uploadJsonButton = document.createElement('button');
uploadJsonButton.textContent = 'Upload JSON File';
uploadJsonButton.id = 'uploadJsonButton';
uploadJsonButton.style.marginTop = '20px';
previewContainer.appendChild(uploadJsonButton);

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';

uploadJsonButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async (event) => {
  try {
    // Check MetaMask connection
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask first!');
      return;
    }

    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];
    console.log('Connected account:', userAddress);

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const displayContainer = document.createElement('div');
        displayContainer.id = 'restoredData';
        displayContainer.style.marginTop = '20px';

        jsonData.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.style.margin = '10px 0';
          itemDiv.style.padding = '10px';
          itemDiv.style.border = '1px solid #ccc';

          switch(item.type) {
            case 'Photo':
              const img = document.createElement('img');
              img.src = item.data;
              img.style.maxWidth = '500px';
              img.style.maxHeight = '400px';
              itemDiv.appendChild(img);
              break;

            case 'Video':
              const video = document.createElement('video');
              video.src = item.data;
              video.controls = true;
              video.style.maxWidth = '640px';
              video.style.maxHeight = '480px';
              itemDiv.appendChild(video);
              break;

            case 'Document':
              const docLink = document.createElement('a');
              docLink.href = item.data;
              docLink.textContent = `Download Document: ${item.fileName}`;
              docLink.target = '_blank';
              itemDiv.appendChild(docLink);
              break;

            case 'Link':
              const link = document.createElement('a');
              link.href = item.data;
              link.textContent = item.data;
              link.target = '_blank';
              itemDiv.appendChild(link);
              break;
          }

          const typeLabel = document.createElement('div');
          typeLabel.textContent = `Type: ${item.type}`;
          typeLabel.style.fontWeight = 'bold';
          itemDiv.insertBefore(typeLabel, itemDiv.firstChild);
          
          displayContainer.appendChild(itemDiv);
        });

        // Add owner address display
        const ownerInfo = document.createElement('div');
        ownerInfo.textContent = `Capsule Owner: ${userAddress}`;
        ownerInfo.style.marginBottom = '20px';
        ownerInfo.style.color = '#666';
        displayContainer.insertBefore(ownerInfo, displayContainer.firstChild);

        previewContainer.appendChild(displayContainer);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  } catch (error) {
    console.error('Error processing file:', error);
    alert('Error processing file. Please check the console for details.');
  }
});
