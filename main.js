async function submitForm(event) {
  event.preventDefault();
  // console.log("Submitting form...");

  const ruData = {
    firstname: document.getElementById('ruFirstname').value,
    lastname: document.getElementById('ruLastname').value,
    description: document.getElementById('ruDescription').value,
    instagram: document.getElementById('ruInstagram').value,
  };

  const uzData = {
    firstname: document.getElementById('uzFirstname').value,
    lastname: document.getElementById('uzLastname').value,
    description: document.getElementById('uzDescription').value,
    instagram: document.getElementById('uzInstagram').value,
  };

  const ruFiles = {
    smallaudio: document.getElementById('ruSmallaudio').files[0],
    image: document.getElementById('ruImage').files[0],
    video: document.getElementById('ruVideo').files[0],
  };

  const uzFiles = {
    smallaudio: document.getElementById('uzSmallaudio').files[0],
    image: document.getElementById('uzImage').files[0],
    video: document.getElementById('uzVideo').files[0],
  };

  const formData = new FormData();
  formData.append('ru', JSON.stringify(ruData));
  formData.append('uz', JSON.stringify(uzData));
  formData.append('ru_smallaudio', ruFiles.smallaudio);
  formData.append('ru_image', ruFiles.image);
  formData.append('ru_video', ruFiles.video);
  formData.append('uz_smallaudio', uzFiles.smallaudio);
  formData.append('uz_image', uzFiles.image);
  formData.append('uz_video', uzFiles.video);

  try {
    const response = await fetch('http://localhost:5001/api/audios', {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}