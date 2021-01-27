import Cropper from "cropperjs";
import firebase from './firebase-app';

document.querySelectorAll("#change-photo").forEach(page => {

    let cropper = null;
    let userGlobal = null;
    const imageElement = document.querySelector("#photo-preview");
    const buttonElement = document.querySelector(".choose-photo");
    const inputFileElement = document.querySelector("#file");
    const form = imageElement.closest('form');
    const btnSubmit = form.querySelector("[type=submit]");
    const bodyElement = document.body;

    imageElement.addEventListener("click", e => inputFileElement.click());
    buttonElement.addEventListener("click", e => inputFileElement.click());

    const auth = firebase.auth();

    auth.onAuthStateChanged(user => {
        if (user) {
            userGlobal = user;
            imageElement.src = user.photoURL || "https://i.pravatar.cc/300";
        }
    });

    const uploadFiles = files => {
        if (files.length > 0) {
            const file = files[0];

            const reader = new FileReader();

            reader.onload = () => {
                imageElement.src = reader.result;

                form.classList.add('cropping');

                cropper = new Cropper(imageElement, {
                    aspectRatio: 1 / 1,
                    // crop(event) {

                    //     console.log(event)
                    // }
                });
            }

            reader.readAsDataURL(file);
            // e.target.value = "";
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        form.classList.remove('cropping');

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = "Salvando...";

        imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png");        

        cropper.getCroppedCanvas().toBlob(blob => {
            const storage = firebase.storage();
            const fileRef = storage.ref().child(`photos/${userGlobal.uid}.png`);
    
            fileRef.put(blob)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(photoURL => userGlobal.updateProfile({ photoURL }) )
            .then(() => {
                
                document.querySelector("#header > div.menu.logged > div > div > picture > a > img").src = userGlobal.photoURL;
                console.log("Foto atualizada")
            });

            cropper.destroy();
        });       
    });

    bodyElement.addEventListener("drop", e => {
        e.preventDefault();
        uploadFiles(e.dataTransfer.files);
    });

    bodyElement.addEventListener("dragover", e => e.preventDefault());

    inputFileElement.addEventListener("change", e => {
        uploadFiles(e.target.files);
        e.target.value = "";
    });
});