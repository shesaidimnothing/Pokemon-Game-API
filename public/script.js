// Pokémon Game API Frontend JavaScript
const API_BASE = 'http://localhost:3001/api';

// Global state
let trainers = [];
let currentTab = 'trainers';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTrainers();
    showTab('trainers');
});

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentTab = tabName;
    
    // Load data for specific tabs
    if (tabName === 'battle' || tabName === 'arena') {
        loadTrainerSelects();
    } else if (tabName === 'stats') {
        loadStatsTrainerSelect();
    }
}

// Loading indicator
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// API calls
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

// Load trainers
async function loadTrainers() {
    try {
        const result = await apiCall('/trainers');
        trainers = result.data;
        displayTrainers();
    } catch (error) {
        console.error('Failed to load trainers:', error);
    }
}

// Display trainers
function displayTrainers() {
    const container = document.getElementById('trainers-list');
    container.innerHTML = '';
    
    trainers.forEach(trainer => {
        const trainerCard = document.createElement('div');
        trainerCard.className = 'trainer-card';
        
        const pokemonList = trainer.pokemons.map(pokemon => {
            const attacks = pokemon.attacks.map(attack => 
                `${attack.name} (${attack.damage}dmg, ${attack.currentUsage}/${attack.usageLimit})`
            ).join(', ');
            
            return `
                <div class="pokemon-item">
                    <div class="pokemon-name">${pokemon.name}</div>
                    <div class="pokemon-hp">HP: ${pokemon.lifePoint}/${pokemon.maxLifePoint}</div>
                    <div class="attacks-list">Attacks: ${attacks || 'None'}</div>
                </div>
            `;
        }).join('');
        
        trainerCard.innerHTML = `
            <div class="trainer-name">${trainer.name}</div>
            <div class="trainer-info">
                Level: ${trainer.level} | Experience: ${trainer.experience}
            </div>
            <div class="pokemon-list">
                ${pokemonList || '<div style="text-align: center; color: #6c757d; font-size: 8px;">No Pokémon</div>'}
            </div>
        `;
        
        container.appendChild(trainerCard);
    });
}

// Load trainer selects for battle/arena
function loadTrainerSelects() {
    const select1 = document.getElementById('trainer1-select');
    const select2 = document.getElementById('trainer2-select');
    const arenaSelect1 = document.getElementById('arena-trainer1-select');
    const arenaSelect2 = document.getElementById('arena-trainer2-select');
    
    const options = trainers.map(trainer => 
        `<option value="${trainer.id}">${trainer.name} (Lv.${trainer.level})</option>`
    ).join('');
    
    select1.innerHTML = '<option value="">Select Trainer 1</option>' + options;
    select2.innerHTML = '<option value="">Select Trainer 2</option>' + options;
    arenaSelect1.innerHTML = '<option value="">Select Challenger 1</option>' + options;
    arenaSelect2.innerHTML = '<option value="">Select Challenger 2</option>' + options;
}

// Load stats trainer select
function loadStatsTrainerSelect() {
    const select = document.getElementById('stats-trainer-select');
    const options = trainers.map(trainer => 
        `<option value="${trainer.id}">${trainer.name} (Lv.${trainer.level})</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Select Trainer for Stats</option>' + options;
}

// Battle functions
async function startRandomBattle() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers!');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('A trainer cannot battle themselves!');
        return;
    }
    
    try {
        const result = await apiCall('/combat/random-challenge', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayBattleResult(result.data);
        loadTrainers(); // Refresh trainers to show updated stats
    } catch (error) {
        console.error('Battle failed:', error);
    }
}

async function startDeterministicBattle() {
    const trainer1Id = document.getElementById('trainer1-select').value;
    const trainer2Id = document.getElementById('trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both trainers!');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('A trainer cannot battle themselves!');
        return;
    }
    
    try {
        const result = await apiCall('/combat/deterministic-challenge', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayBattleResult(result.data);
        loadTrainers(); // Refresh trainers to show updated stats
    } catch (error) {
        console.error('Battle failed:', error);
    }
}

// Arena functions
async function startArena1() {
    const trainer1Id = document.getElementById('arena-trainer1-select').value;
    const trainer2Id = document.getElementById('arena-trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both challengers!');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('A trainer cannot battle themselves!');
        return;
    }
    
    try {
        const result = await apiCall('/combat/arena1', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayArenaResult(result.data);
        loadTrainers(); // Refresh trainers to show updated stats
    } catch (error) {
        console.error('Arena failed:', error);
    }
}

async function startArena2() {
    const trainer1Id = document.getElementById('arena-trainer1-select').value;
    const trainer2Id = document.getElementById('arena-trainer2-select').value;
    
    if (!trainer1Id || !trainer2Id) {
        alert('Please select both challengers!');
        return;
    }
    
    if (trainer1Id === trainer2Id) {
        alert('A trainer cannot battle themselves!');
        return;
    }
    
    try {
        const result = await apiCall('/combat/arena2', 'POST', {
            trainer1Id: parseInt(trainer1Id),
            trainer2Id: parseInt(trainer2Id)
        });
        
        displayArenaResult(result.data);
        loadTrainers(); // Refresh trainers to show updated stats
    } catch (error) {
        console.error('Arena failed:', error);
    }
}

// Display battle result
function displayBattleResult(battle) {
    const container = document.getElementById('battle-result');
    
    const details = battle.details.map(detail => `<div>${detail}</div>`).join('');
    
    container.innerHTML = `
        <div class="battle-winner">🏆 Winner: ${battle.winner.name}!</div>
        <div class="battle-details">
            <strong>Battle Summary:</strong><br>
            Rounds: ${battle.rounds}<br>
            Winner Level: ${battle.winner.level} | Experience: ${battle.winner.experience}<br>
            Loser Level: ${battle.loser.level} | Experience: ${battle.loser.experience}<br><br>
            <strong>Battle Log:</strong><br>
            ${details}
        </div>
    `;
}

// Display arena result
function displayArenaResult(arena) {
    const container = document.getElementById('arena-result');
    
    const summary = `
        <div class="arena-summary">
            <strong>🏆 Arena Champion: ${arena.winner.name}!</strong><br>
            Total Battles: ${arena.totalBattles}<br>
            Winner Level: ${arena.winner.level} | Experience: ${arena.winner.experience}
        </div>
    `;
    
    const battleResults = arena.results.slice(0, 10).map((battle, index) => 
        `<div>Battle ${index + 1}: ${battle.winner.name} won in ${battle.rounds} rounds</div>`
    ).join('');
    
    container.innerHTML = summary + `
        <div class="battle-details">
            <strong>First 10 Battles:</strong><br>
            ${battleResults}
            ${arena.results.length > 10 ? `<div>... and ${arena.results.length - 10} more battles</div>` : ''}
        </div>
    `;
}

// Stats functions
async function loadTrainerStats() {
    const trainerId = document.getElementById('stats-trainer-select').value;
    
    if (!trainerId) {
        alert('Please select a trainer!');
        return;
    }
    
    try {
        const result = await apiCall(`/combat/stats/${trainerId}`);
        displayTrainerStats(result.data);
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function displayTrainerStats(stats) {
    const container = document.getElementById('stats-result');
    
    const pokemonInfo = stats.trainer.pokemons.map(pokemon => {
        const attacks = pokemon.attacks.map(attack => 
            `${attack.name} (${attack.damage}dmg)`
        ).join(', ');
        
        return `
            <div class="pokemon-item">
                <div class="pokemon-name">${pokemon.name}</div>
                <div class="pokemon-hp">HP: ${pokemon.lifePoint}/${pokemon.maxLifePoint}</div>
                <div class="attacks-list">Attacks: ${attacks || 'None'}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="trainer-name">${stats.trainer.name}</div>
        <div class="trainer-info">
            Level: ${stats.trainer.level} | Experience: ${stats.trainer.experience}
        </div>
        <div style="margin: 15px 0;">
            <strong>Combat Statistics:</strong><br>
            Alive Pokémon: ${stats.alivePokemonCount}/${stats.totalPokemonCount}<br>
            Average Pokémon HP: ${stats.averagePokemonHP}
        </div>
        <div class="pokemon-list">
            ${pokemonInfo || '<div style="text-align: center; color: #6c757d; font-size: 8px;">No Pokémon</div>'}
        </div>
    `;
}

// Create trainer functions
function showCreateTrainer() {
    document.getElementById('create-trainer-modal').style.display = 'block';
}

function closeCreateTrainer() {
    document.getElementById('create-trainer-modal').style.display = 'none';
    document.getElementById('trainer-name').value = '';
}

async function createTrainer(event) {
    event.preventDefault();
    
    const name = document.getElementById('trainer-name').value.trim();
    
    if (!name) {
        alert('Please enter a trainer name!');
        return;
    }
    
    try {
        await apiCall('/trainers', 'POST', { name });
        closeCreateTrainer();
        loadTrainers();
        alert(`Trainer "${name}" created successfully!`);
    } catch (error) {
        console.error('Failed to create trainer:', error);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('create-trainer-modal');
    if (event.target === modal) {
        closeCreateTrainer();
    }
}
