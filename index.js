
const COHORT = "2408-FTB-MT-WEB-PT";
const API_URL =`https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===

const state = {
    party:[]
};

const partyForm = document.querySelector('#addParty');
const partyList = document.querySelector('#partyList');
partyForm.addEventListener('submit',addParty);

/** Syncs state with the API and rerender */
async function render() {
    await getParty();
    renderParty();
}

//Update state from parties with API
async function getParty() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.party = json.data
        
        
    } catch (error) {
        console.log(error);
    }
}

getParty();


// === Render ===

/** Renders PARTIES from state */
function renderParty() {
      
    
    if (!state.party.length) {
        partyList.innerHTML = '<div>No Parties Found.</div>';
        return;
      }

    const partyCards = state.party.map((parties) => {
        const card = document.createElement('div');
        card.classList.add('party-card');
        const isoString  = parties.date;
        const date = new Date(isoString );
     
        const time = date.toTimeString();
      

        card.innerHTML =`
        <div>Name : ${parties.name}</div>
        <div>Description : ${parties.description} </div>
        <div>Date : ${parties.date}</div>
        <div>Time : ${time}</div>
        <div>Location : ${parties.location} </div>
        `;

        //Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Party';
        card.append(deleteButton);
        deleteButton.addEventListener('click', () =>deleteParty(parties.id));

        //Update Button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Party';
        card.append(updateButton);
        updateButton.addEventListener('click',() => updateParty(parties.id));

        return card;
    });
    partyList.replaceChildren(...partyCards); 
}

// === Script ===

render();
/** Asks the API to create a new PARTY based on the given `PARTY` */
async function addParty(parties) {
    const date = partyForm.date.value;
    const newDate = new Date(date).toISOString();
    parties.preventDefault();
    try {
        const response = await fetch(API_URL,{
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body:JSON.stringify({
                name : partyForm.partyname.value,
                description: partyForm.description.value,
                date : newDate,
                location : partyForm.location.value
        }),
        });

        
        if (!response.ok) {
            throw new Error("Failed to create party.");
          }
          render();
    } catch (error) {
        console.log(error);
    }
}
/** Asks the API to Delete a PARTY using delete button */
async function deleteParty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`,{
            method:"DELETE"
        })
        render();
    } catch (error) {
        console.log(error);
    }
}

/** Asks the API to Update a PARTY using update button */
async function updateParty(id) {
    const date = partyForm.date.value;
    const newDate = new Date(date).toISOString();
    event.preventDefault();
    try {
        const response = await fetch(`${API_URL}/${id}`,{
            method: 'PUT',
            headers:{ "Content-Type": "application/json" },
            body:JSON.stringify({
                name : partyForm.partyname.value,
                description: partyForm.description.value,
                date : newDate,
                location : partyForm.location.value
        }),
        });

        
        if (!response.ok) {
            throw new Error("Failed to create party.");
          }
          render();
    } catch (error) {
        console.log(error);
    }
}