//pokemon.js
let currentPokemon = null;
let team = [];

const CACHE_PREFIX = "pokeCache:";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

window.addEventListener("load", function()
{
    setup();
});

function setup()
{
    // Button events
    const findBtn = document.getElementById("findBtn");
    const addBtn = document.getElementById("addBtn");

    findBtn.addEventListener("click", function()
    {
        findPokemon();
    });

    addBtn.addEventListener("click", function()
    {
        addToTeam();
    });

    // Enter key search
    const input = document.getElementById("pokemonInput");
    input.addEventListener("keydown", function(e)
    {
        if(e.key === "Enter")
        {
            findPokemon();
        }
    });

    // Load saved team + reset UI
    loadTeamFromStorage();
    resetPokemonUI();
    updateTeamUI();
}

function resetPokemonUI()
{
    // Clear pokemon display
    setStatus("");

    const img = document.getElementById("pokeImg");
    img.src = "";
    img.style.display = "none";

    const audio = document.getElementById("pokeAudio");
    audio.src = "";

    const audioNote = document.getElementById("audioNote");
    audioNote.textContent = "";

    fillSelectWithMessage("move1", "Find a Pokemon first");
    fillSelectWithMessage("move2", "Find a Pokemon first");
    fillSelectWithMessage("move3", "Find a Pokemon first");
    fillSelectWithMessage("move4", "Find a Pokemon first");

    currentPokemon = null;
}

function setStatus(msg)
{
    // Status message under search bar
    const status = document.getElementById("statusText");
    status.textContent = msg;
}

async function findPokemon()
{
    // Read user input and fetch pokemon
    const input = document.getElementById("pokemonInput");
    let query = input.value;

    if(query)
    {
        query = query.trim().toLowerCase();
    }

    if(!query)
    {
        setStatus("Please enter a Pokemon name or ID.");
        resetPokemonUI();
        return;
    }

    setStatus("Loading...");
    resetPokemonUI();

    const url = "https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(query);

    try
    {
        const data = await cachedFetchJson(url);
        currentPokemon = data;

        setStatus("Loaded: " + safeName(currentPokemon.name));
        updatePokemonUI(currentPokemon);
    }
    catch(err)
    {
        setStatus("Pokemon not found. Try a number between 1 and 151 or a valid name.");
        currentPokemon = null;
    }
}

function safeName(name)
{
    // Make names look nicer (mr-mime -> Mr Mime)
    if(!name)
    {
        return "";
    }

    const parts = name.split("-");
    let result = "";

    for(let i = 0; i < parts.length; i++)
    {
        let word = parts[i];

        if(word.length > 0)
        {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        if(i > 0)
        {
            result += " ";
        }

        result += word;
    }

    return result;
}

function updatePokemonUI(pokemon)
{
    // Update image, audio, and moves
    updateImage(pokemon);
    updateAudio(pokemon);
    updateMoves(pokemon);
}

function updateImage(pokemon)
{
    // Pick a sprite and display it
    const img = document.getElementById("pokeImg");

    let spriteUrl = "";

    if(pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other["official-artwork"])
    {
        spriteUrl = pokemon.sprites.other["official-artwork"].front_default;
    }

    if(!spriteUrl && pokemon.sprites)
    {
        spriteUrl = pokemon.sprites.front_default;
    }

    if(spriteUrl)
    {
        img.src = spriteUrl;
        img.alt = safeName(pokemon.name);
        img.style.display = "block";
    }
    else
    {
        img.src = "";
        img.alt = "No image available";
        img.style.display = "none";
    }
}

function updateAudio(pokemon)
{
    // Load cry audio if available
    const audio = document.getElementById("pokeAudio");
    const audioNote = document.getElementById("audioNote");

    let cryUrl = "";

    if(pokemon.cries)
    {
        if(pokemon.cries.latest)
        {
            cryUrl = pokemon.cries.latest;
        }
        else if(pokemon.cries.legacy)
        {
            cryUrl = pokemon.cries.legacy;
        }
    }

    if(cryUrl)
    {
        audio.src = cryUrl;
        audioNote.textContent = "";
    }
    else
    {
        audio.src = "";
        audioNote.textContent = "No audio clip available for this Pokemon.";
    }
}

function updateMoves(pokemon)
{
    // Build a list of move names and fill dropdowns
    let moveNames = [];

    if(pokemon.moves && pokemon.moves.length > 0)
    {
        for(let i = 0; i < pokemon.moves.length; i++)
        {
            const m = pokemon.moves[i];

            if(m && m.move && m.move.name)
            {
                moveNames.push(m.move.name);
            }
        }
    }

    moveNames.sort();

    fillMoveSelect("move1", moveNames);
    fillMoveSelect("move2", moveNames);
    fillMoveSelect("move3", moveNames);
    fillMoveSelect("move4", moveNames);
}

function fillSelectWithMessage(selectId, message)
{
    // Put a single message option in a dropdown
    const sel = document.getElementById(selectId);
    sel.innerHTML = "";

    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = message;
    sel.appendChild(opt);

    sel.disabled = true;
}

function fillMoveSelect(selectId, moveNames)
{
    // Fill a dropdown with all moves
    const sel = document.getElementById(selectId);
    sel.innerHTML = "";

    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "-- select move --";
    sel.appendChild(opt0);

    for(let i = 0; i < moveNames.length; i++)
    {
        const opt = document.createElement("option");
        opt.value = moveNames[i];
        opt.textContent = moveNames[i];
        sel.appendChild(opt);
    }

    sel.disabled = false;
}

function getSelectedMoves()
{
    // Collect selected moves from dropdowns
    const ids = ["move1", "move2", "move3", "move4"];
    let moves = [];

    for(let i = 0; i < ids.length; i++)
    {
        const sel = document.getElementById(ids[i]);
        const value = sel.value;

        if(value)
        {
            moves.push(value);
        }
    }

    return moves;
}

function addToTeam()
{
    // Add current pokemon + selected moves to team list
    if(!currentPokemon)
    {
        setStatus("Find a Pokemon first, then choose moves.");
        return;
    }

    if(team.length >= 6)
    {
        setStatus("Team is full (6 Pokemon).");
        return;
    }

    const moves = getSelectedMoves();

    if(moves.length === 0)
    {
        setStatus("Please select at least one move before adding to team.");
        return;
    }

    const entry =
    {
        id: currentPokemon.id,
        name: currentPokemon.name,
        sprite: getTeamSprite(currentPokemon),
        moves: moves
    };

    team.push(entry);
    saveTeamToStorage();
    updateTeamUI();

    setStatus("Added " + safeName(entry.name) + " to your team!");
}

function getTeamSprite(pokemon)
{
    // Choose a smaller sprite for team list
    let spriteUrl = "";

    if(pokemon.sprites && pokemon.sprites.front_default)
    {
        spriteUrl = pokemon.sprites.front_default;
    }

    if(!spriteUrl && pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other["official-artwork"])
    {
        spriteUrl = pokemon.sprites.other["official-artwork"].front_default;
    }

    return spriteUrl;
}

function updateTeamUI()
{
    // Render the team list on the page
    const box = document.getElementById("teamBox");
    box.innerHTML = "";

    const note = document.getElementById("teamNote");

    if(team.length === 0)
    {
        note.textContent = "Your team is empty. Add a Pokemon!";
        return;
    }

    note.textContent = "Team size: " + team.length + " / 6";

    for(let i = 0; i < team.length; i++)
    {
        const entry = team[i];

        const row = document.createElement("div");
        row.className = "teamEntry";

        const img = document.createElement("img");
        img.src = entry.sprite || "";
        img.alt = safeName(entry.name);

        const moveList = document.createElement("ul");
        moveList.className = "teamMoves";

        for(let j = 0; j < entry.moves.length; j++)
        {
            const li = document.createElement("li");
            li.textContent = entry.moves[j];
            moveList.appendChild(li);
        }

        row.appendChild(img);
        row.appendChild(moveList);

        box.appendChild(row);
    }
}

function saveTeamToStorage()
{
    // Save team array into localStorage
    try
    {
        localStorage.setItem("pokemonTeam", JSON.stringify(team));
    }
    catch(e)
    {
    }
}

function loadTeamFromStorage()
{
    // Load team array from localStorage
    try
    {
        const raw = localStorage.getItem("pokemonTeam");

        if(raw)
        {
            const parsed = JSON.parse(raw);

            if(Array.isArray(parsed))
            {
                team = parsed;
            }
        }
    }
    catch(e)
    {
        team = [];
    }
}

async function cachedFetchJson(url)
{
    // Fetch json using cache first
    const cached = readCache(url);

    if(cached)
    {
        return cached;
    }

    const resp = await fetch(url);

    if(!resp.ok)
    {
        throw new Error("Fetch failed");
    }

    const data = await resp.json();
    writeCache(url, data);

    return data;
}

function readCache(url)
{
    // Read cached response from localStorage
    const key = CACHE_PREFIX + url;

    try
    {
        const raw = localStorage.getItem(key);

        if(!raw)
        {
            return null;
        }

        const obj = JSON.parse(raw);

        if(!obj || !obj.time || !obj.data)
        {
            return null;
        }

        const age = Date.now() - obj.time;

        if(age > CACHE_TTL_MS)
        {
            localStorage.removeItem(key);
            return null;
        }

        return obj.data;
    }
    catch(e)
    {
        return null;
    }
}

function writeCache(url, data)
{
    // Save response into localStorage cache
    const key = CACHE_PREFIX + url;

    const obj =
    {
        time: Date.now(),
        data: data
    };

    try
    {
        localStorage.setItem(key, JSON.stringify(obj));
    }
    catch(e)
    {
    }
}
