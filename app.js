const word = document.querySelector('.word');
const searchBtn = document.querySelector('.search');
const firstMeaning = document.querySelector('.meaning1');
const copyBtn = document.querySelector('.copy');
const overlay = document.querySelector('.loading-overlay');
const moreDefCont = document.querySelector('.more-definitions');
const moreDefBtn = document.querySelector('.more-definitions-btn');
const appContent = document.querySelector('.app-content');
let otherMeaning = {};
let onShowOtherDef = false;

async function getMeaning(){
    try{
        const fetchData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`);
        if(!fetchData.ok){
            throw new Error(`Word was not found: ${fetchData.status}`);
        }
        loadingScreen();
        const res = await fetchData.json();
        const meaning1 = res[0].meanings[0].definitions[0].definition;
        otherMeaning = res[0].meanings[0].definitions;
        firstMeaning.value = meaning1;
        copyBtn.classList.remove('copied');
        moreDefCont.classList.remove('more-definitions-hidden');
        copyBtn.value='Copy';

    }
    catch(error){
        OnErrorReload(error);
    }
}

function copyMeaning(){
     navigator.clipboard.writeText(firstMeaning.value);
     changeCopyBtn();
}

function changeCopyBtn(){
    copyBtn.value='copied';
    copyBtn.classList.add('copied');  
}

function loadingScreen(){
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1500); 
}

function OnErrorReload(errorMsg){
    alert(`Something went wrong: ${errorMsg.message}`);
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
    setTimeout( () => {
        window.location.reload();
    },1000); 
}

function resetInputs(){
    const additionalMeaning = document.querySelectorAll(".other-meaning");
    const cloneCopy = document.querySelectorAll('.clone-copy');
    additionalMeaning.forEach(items => items.remove());
    cloneCopy.forEach(buttons => buttons.remove());
    moreDefCont.classList.add('more-definitions-hidden');
    firstMeaning.value = null;
    copyBtn.classList.remove('copied');
    copyBtn.value = 'Copy';
}

moreDefBtn.addEventListener('click', function moreMeaning(meanings){
    meanings = otherMeaning;
    meanings.shift();
    meanings.forEach(otherMeaning = (element, index) =>{
        let htmlMeaning = `<div class="meaning-container">
        <textarea type="text" class="text other-meaning other-meaning" id="other-meaning${index}" placeholder="The meaning of the word will be displayed here" readonly>${element.definition}</textarea>
        </div>
        <div class="button-container">
            <input type="button" class="clone-copy" data-textarea="other-meaning${index}" value="Copy">
        </div>`;

        appContent.insertAdjacentHTML("afterend",htmlMeaning);
    })
    onShowOtherDef = true;
    moreDefCont.classList.add('more-definitions-hidden');

const cloneCopy = document.querySelectorAll('.clone-copy');
    if(onShowOtherDef){
        cloneCopy.forEach(function(button){
            button.addEventListener('click', async function () {
                const textareaId = this.dataset.textarea;
                const textarea = document.getElementById(textareaId);
        
                if (textarea) {
                    try {
                        await navigator.clipboard.writeText(textarea.value); // Modern Clipboard API
                        this.classList.add('copied');
                        this.value = 'copied';
                    } catch (err) {
                        alert(`${err} cannot be copied`);
                    }
                }
            });
        });
    }
});

word.addEventListener('input', function onChange(event){
    if(event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward"){
        if(word.value === ""){
            resetInputs();
        }
    }
});
   
searchBtn.addEventListener('click', getMeaning);
copyBtn.addEventListener('click', copyMeaning);

