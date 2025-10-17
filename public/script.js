const API_BASE = 'http://localhost:3000/api';

let trainers = [];
let currentTab = 'trainers';
let selectedTrainerId = null;
let selectedPokemonId = null;
let availableAttacks = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTrainers();
    loadAvailableAttacks();
    showTab('trainers');
});

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    
    event.target.classList.add('active');
    
    currentTab = tabName;
    
    if (tabName === 'battle' || tabName === 'arena') {
        loadTrainerSelects();
    } else if (tabName === 'stats') {
        loadStatsTrainerSelect();
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

async function apiCall(endpoint, method = 'GET', data = null) {
    showLoading();
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'API Error');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadTrainers() {
    try {
        const result = await apiCall('/trainers');
        trainers = result.data;
        displayTrainers();
    } catch (error) {
        console.error('Failed to load trainers:', error);
    }
}

function displayTrainers() {
    const container = document.getElementById('trainers-list');
    if (!container) return;
    
    if (trainers.length === 0) {
        container.innerHTML = '<div class="no-data">Aucun dresseur trouvé</div>';
        return;
    }
    
    container.innerHTML = trainers.map(trainer => createTrainerCard(trainer)).join('');
}

function createTrainerCard(trainer) {
    const pokemonList = trainer.pokemons.map(pokemon => createPokemonItem(trainer.id, pokemon)).join('');
    
    return `
        <div class="trainer-card">
            <div class="trainer-header">
                <div class="trainer-name">${trainer.name}</div>
                <div class="trainer-actions">
                    <button onclick="manageTrainer(${trainer.id})" class="btn small">⚙️ Manage</button>
                    <button onclick="healTrainerPokemon(${trainer.id})" class="btn small">💚 Heal All</button>
                </div>
            </div>
            <div class="trainer-info">
                Level: ${trainer.level} | Experience: ${trainer.experience}
            </div>
            <div class="pokemon-list">
                ${pokemonList || '<div style="text-align: center; color: #6c757d; font-size: 8px;">No Pokémon</div>'}
            </div>
        </div>
    `;
}

function createPokemonItem(trainerId, pokemon) {
    const attacks = pokemon.attacks.map(attack => attack.name).join(', ');
    
    return `
        <div class="pokemon-item clickable" onclick="managePokemonAttacks(${trainerId}, ${pokemon.id}, '${pokemon.name}')">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-hp">HP: ${pokemon.lifePoint}/${pokemon.maxLifePoint}</div>
            <div class="attacks-list">Attacks: ${attacks || 'None'}</div>
            <div class="pokemon-manage-hint">Click to manage attacks</div>
        </div>
    `;
}

async function createTrainer() {
    const name = document.getElementById('trainer-name').value.trim();
    if (!name) {
        alert('Please enter a trainer name');
        return;
    }
    
    try {
        await apiCall('/trainers', 'POST', { name });
        closeCreateTrainerModal();
        loadTrainers();
        alert('Trainer created successfully!');
    } catch (error) {
        console.error('Failed to create trainer:', error);
    }
}

function openCreateTrainerModal() {
    document.getElementById('create-trainer-modal').style.display = 'block';
}

function closeCreateTrainerModal() {
    document.getElementById('create-trainer-modal').style.display = 'none';
    document.getElementById('trainer-name').value = '';
}

async function manageTrainer(trainerId) {
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;
    
    document.getElementById('manage-trainer-id').value = trainerId;
    document.getElementById('manage-trainer-name').value = trainer.name;
    document.getElementById('manage-trainer-level').value = trainer.level;
    document.getElementById('manage-trainer-experience').value = trainer.experience;
    
    document.getElementById('manage-trainer-modal').style.display = 'block';
}

function closeManageTrainerModal() {
    document.getElementById('manage-trainer-modal').style.display = 'none';
}

async function updateTrainer() {
    const trainerId = parseInt(document.getElementById('manage-trainer-id').value);
    const name = document.getElementById('manage-trainer-name').value.trim();
    const level = parseInt(document.getElementById('manage-trainer-level').value);
    const experience = parseInt(document.getElementById('manage-trainer-experience').value);
    
    if (!name || level < 1 || experience < 0) {
        alert('Please enter valid trainer information');
        return;
    }
    
    try {
        await apiCall(`/trainers/${trainerId}`, 'PUT', { name, level, experience });
        closeManageTrainerModal();
        loadTrainers();
        alert('Trainer updated successfully!');
    } catch (error) {
        console.error('Failed to update trainer:', error);
    }
}

async function addPokemonToTrainer() {
    const trainerId = parseInt(document.getElementById('manage-trainer-id').value);
    const name = document.getElementById('pokemon-name').value.trim();
    const maxLifePoint = parseInt(document.getElementById('pokemon-hp').value);
    
    if (!name || maxLifePoint <= 0) {
        alert('Please enter valid Pokemon information');
        return;
    }
    
    try {
        await apiCall(`/trainers/${trainerId}/pokemons`, 'POST', { name, maxLifePoint });
        document.getElementById('pokemon-name').value = '';
        document.getElementById('pokemon-hp').value = '';
        loadTrainers();
        alert('Pokemon added successfully!');
    } catch (error) {
        console.error('Failed to add Pokemon:', error);
    }
}

async function healTrainerPokemon(trainerId) {
    if (!confirm('Are you sure you want to heal all Pokemon for this trainer?')) {
        return;
    }
    
    try {
        await apiCall(`/trainers/${trainerId}/heal`, 'POST');
        loadTrainers();
        alert('All Pokemon have been healed!');
    } catch (error) {
        console.error('Failed to heal Pokemon:', error);
    }
}

async function loadAvailableAttacks() {
    try {
        const result = await apiCall('/trainers/attacks');
        availableAttacks = result.data;
    } catch (error) {
        console.error('Failed to load attacks:', error);
    }
}

async function managePokemonAttacks(trainerId, pokemonId, pokemonName) {
    selectedTrainerId = trainerId;
    selectedPokemonId = pokemonId;
    
    document.getElementById('pokemon-attacks-title').textContent = `Manage ${pokemonName}'s Attacks`;
    
    displayCurrentAttacks();
    displayAvailableAttacks();
    
    document.getElementById('manage-pokemon-attacks-modal').style.display = 'block';
}

function closeManagePokemonAttacks() {
    document.getElementById('manage-pokemon-attacks-modal').style.display = 'none';
    selectedTrainerId = null;
    selectedPokemonId = null;
}

function displayCurrentAttacks() {
    const trainer = trainers.find(t => t.id === selectedTrainerId);
    if (!trainer) return;
    
    const pokemon = trainer.pokemons.find(p => p.id === selectedPokemonId);
    if (!pokemon) return;
    
    const container = document.getElementById('current-attacks');
    if (pokemon.attacks.length === 0) {
        container.innerHTML = '<div class="no-attacks">No attacks learned</div>';
        return;
    }
    
    container.innerHTML = pokemon.attacks.map(attack => `
        <div class="attack-item current">
            <div class="attack-info">
                <div class="attack-name">${attack.name}</div>
                <div class="attack-details">${attack.damage} dmg, ${attack.currentUsage}/${attack.usageLimit} uses</div>
            </div>
            <button onclick="removeAttackFromPokemon(${attack.id})" class="btn small danger">Remove</button>
        </div>
    `).join('');
}

function displayAvailableAttacks() {
    const trainer = trainers.find(t => t.id === selectedTrainerId);
    if (!trainer) return;
    
    const pokemon = trainer.pokemons.find(p => p.id === selectedPokemonId);
    if (!pokemon) return;
    
    const currentAttackIds = pokemon.attacks.map(attack => attack.id);
    const available = availableAttacks.filter(attack => !currentAttackIds.includes(attack.id));
    
    const container = document.getElementById('available-attacks');
    if (available.length === 0) {
        container.innerHTML = '<div class="no-attacks">No available attacks</div>';
        return;
    }
    
    container.innerHTML = available.map(attack => `
        <div class="attack-item available">
            <div class="attack-info">
                <div class="attack-name">${attack.name}</div>
                <div class="attack-details">${attack.damage} dmg, ${attack.usageLimit} uses</div>
            </div>
            <button onclick="addAttackToPokemon(${attack.id})" class="btn small">Add</button>
        </div>
    `).join('');
}

async function addAttackToPokemon(attackId) {
    try {
        await apiCall(`/trainers/${selectedTrainerId}/pokemons/${selectedPokemonId}/attacks`, 'POST', {
            attackId: attackId
        });
        
        await loadTrainers();
        displayCurrentAttacks();
        displayAvailableAttacks();
        alert('Attack added successfully!');
    } catch (error) {
        console.error('Failed to add attack:', error);
    }
}

async function removeAttackFromPokemon(attackId) {
    if (!confirm('Are you sure you want to remove this attack?')) {
        return;
    }
    
    try {
        await apiCall(`/trainers/${selectedTrainerId}/pokemons/${selectedPokemonId}/attacks/${attackId}`, 'DELETE');
        
        await loadTrainers();
        displayCurrentAttacks();
        displayAvailableAttacks();
        alert('Attack removed successfully!');
    } catch (error) {
        console.error('Failed to remove attack:', error);
    }
}

window.onclick = function(event) {
    const createModal = document.getElementById('create-trainer-modal');
    const manageModal = document.getElementById('manage-trainer-modal');
    const attacksModal = document.getElementById('manage-pokemon-attacks-modal');
    
    if (event.target === createModal) {
        closeCreateTrainerModal();
    }
    if (event.target === manageModal) {
        closeManageTrainerModal();
    }
    if (event.target === attacksModal) {
        closeManagePokemonAttacks();
    }
}

async function loadTrainerSelects() {
    const trainer1Select = document.getElementById('trainer1-select');
    const trainer2Select = document.getElementById('trainer2-select');
    
    if (trainer1Select && trainer2Select) {
        const options = trainers.map(trainer => 
            `<option value="${trainer.id}">${trainer.name} (Level ${trainer.level})</option>`
        ).join('');
        
        trainer1Select.innerHTML = '<option value="">Select Trainer 1</option>' + options;
        trainer2Select.innerHTML = '<option value="">Select Trainer 2</option>' + options;
    }
}

async function loadStatsTrainerSelect() {
    const trainerSelect = document.getElementById('stats-trainer-select');
    
    if (trainerSelect) {
        const options = trainers.map(trainer => 
            `<option value="${trainer.id}">${trainer.name} (Level ${trainer.level})</option>`
        ).join('');
        
        trainerSelect.innerHTML = '<option value="">Select Trainer</option>' + options;
    }
}

async function startRandomChallenge() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('Please select different trainers');
        return;
    }
    
    try {
        const result = await apiCall('/combat/random-challenge', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayBattleResult(result.data);
    } catch (error) {
        console.error('Failed to start random challenge:', error);
    }
}

async function startDeterministicChallenge() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('Please select different trainers');
        return;
    }
    
    try {
        const result = await apiCall('/combat/deterministic-challenge', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayBattleResult(result.data);
    } catch (error) {
        console.error('Failed to start deterministic challenge:', error);
    }
}

async function startArena1() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('Please select different trainers');
        return;
    }
    
    try {
        const result = await apiCall('/combat/arena1', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayArenaResult(result.data);
    } catch (error) {
        console.error('Failed to start arena 1:', error);
    }
}

async function startArena2() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('Please select different trainers');
        return;
    }
    
    try {
        const result = await apiCall('/combat/arena2', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayArenaResult(result.data);
    } catch (error) {
        console.error('Failed to start arena 2:', error);
    }
}

function displayBattleResult(result) {
    const container = document.getElementById('battle-result');
    container.innerHTML = `
        <h3>Battle Result</h3>
        <p><strong>Winner:</strong> ${result.winner.name}</p>
        <p><strong>Rounds:</strong> ${result.rounds}</p>
        <h4>Battle Details:</h4>
        <div class="battle-details">
            ${result.details.map(detail => `<p>${detail}</p>`).join('')}
        </div>
    `;
    container.style.display = 'block';
}

function displayArenaResult(result) {
    const container = document.getElementById('arena-result');
    container.innerHTML = `
        <h3>Arena Result</h3>
        <p><strong>Winner:</strong> ${result.winner.name}</p>
        <p><strong>Total Battles:</strong> ${result.totalBattles}</p>
        <h4>Battle Summary:</h4>
        <div class="arena-summary">
            ${result.results.slice(0, 10).map((battle, index) => 
                `<p>Battle ${index + 1}: ${battle.winner.name} won in ${battle.rounds} rounds</p>`
            ).join('')}
            ${result.results.length > 10 ? `<p>... and ${result.results.length - 10} more battles</p>` : ''}
        </div>
    `;
    container.style.display = 'block';
}

async function loadTrainerStats() {
    const trainerId = document.getElementById('stats-trainer-select').value;
    
    if (!trainerId) {
        alert('Please select a trainer');
        return;
    }
    
    try {
        const result = await apiCall(`/combat/stats/${trainerId}`);
        displayTrainerStats(result.data);
    } catch (error) {
        console.error('Failed to load trainer stats:', error);
    }
}

function displayTrainerStats(stats) {
    const container = document.getElementById('stats-result');
    container.innerHTML = `
        <h3>Trainer Statistics</h3>
        <p><strong>Name:</strong> ${stats.trainer.name}</p>
        <p><strong>Level:</strong> ${stats.trainer.level}</p>
        <p><strong>Experience:</strong> ${stats.trainer.experience}</p>
        <p><strong>Alive Pokemon:</strong> ${stats.alivePokemonCount}/${stats.totalPokemonCount}</p>
        <p><strong>Average Pokemon HP:</strong> ${stats.averagePokemonHP}</p>
        <h4>Pokemon Details:</h4>
        <div class="pokemon-stats">
            ${stats.trainer.pokemons.map(pokemon => `
                <div class="pokemon-stat">
                    <strong>${pokemon.name}</strong> - HP: ${pokemon.lifePoint}/${pokemon.maxLifePoint}
                    <br>Attacks: ${pokemon.attacks.map(attack => attack.name).join(', ')}
                </div>
            `).join('')}
        </div>
    `;
    container.style.display = 'block';
}