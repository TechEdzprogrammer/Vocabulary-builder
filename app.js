const word = document.querySelector('.word');
const searchBtn = document.querySelector('.search');
const firstMeaning = document.querySelector('.meaning1');
const copyBtn = document.querySelector('.copy');

async function getMeaning(){
    try{
        const fetchData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`);
        if(!fetchData.ok){
            throw new Error(`Word was not found: ${fetchData.status}`);
        }
        const res = await fetchData.json();
        const meaning1 = res[0].meanings[0].definitions[0].definition;
        firstMeaning.value = meaning1;
        copyBtn.classList.remove('copied');
        copyBtn.value='copy';
    }
    catch(error){
        alert(`Something went wrong: ${error.message}`);
        window.location.reload();
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

searchBtn.addEventListener('click', getMeaning);
copyBtn.addEventListener('click', copyMeaning);
