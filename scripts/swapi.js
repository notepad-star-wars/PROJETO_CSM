// swapi.js
export class SWAPIService {
    constructor() {
        // Usando a API do akabab que já tem imagens
        this.baseURL = 'https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api';
        this.currentCategory = 'people';
        this.currentPage = 1;
        this.isLoading = false;
        this.allCharacters = []; // Para armazenar todos os personagens
    }

    async fetchAllCharacters() {
        try {
            this.showLoading();
            // Busca TODOS os personagens de uma vez (são 88 no total)
            const response = await fetch(`${this.baseURL}/all.json`);
            const data = await response.json();
            this.allCharacters = data;
            return data;
        } catch (error) {
            console.error('Erro na Força:', error);
            this.showError('Falha na conexão com a Força');
            return null;
        } finally {
            this.hideLoading();
        }
    }

    // Paginação manual já que a API não tem paginação nativa
    getPaginatedCharacters(page = 1, itemsPerPage = 9) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return {
            results: this.allCharacters.slice(start, end),
            next: end < this.allCharacters.length ? `page_${page + 1}` : null
        };
    }

    renderCards(data, category) {
        const container = document.getElementById('swapi-cards');
        if (!container) return;

        if (this.currentPage === 1) {
            container.innerHTML = '';
        }

        data.results.forEach(item => {
            const card = this.createCard(item, category);
            container.appendChild(card);
        });
    }

    createCard(item, category) {
        const card = document.createElement('div');
        card.className = 'swapi-card';
        
        // Verifica se tem imagem, senão usa placeholder
        const imageUrl = item.image || 'https://via.placeholder.com/200/000000/FFE81F?text=Star+Wars';
        
        let content = '';
        switch(category) {
            case 'people':
                content = `
                    <img src="${imageUrl}" alt="${item.name}" 
                         class="w-full h-48 object-cover rounded-lg mb-3"
                         onerror="this.src='https://via.placeholder.com/200/000000/FFE81F?text=Imagem+não+disponível'">
                    <h3 class="text-xl mb-2">${item.name}</h3>
                    <p><strong>Espécie:</strong> ${item.species || 'Humano'}</p>
                    <p><strong>Gênero:</strong> ${item.gender}</p>
                    <p><strong>Altura:</strong> ${item.height || '?'}cm</p>
                    <p><strong>Peso:</strong> ${item.mass || '?'}kg</p>
                    ${item.homeworld ? `<p><strong>Planeta:</strong> ${item.homeworld}</p>` : ''}
                `;
                break;
                
            case 'planets':
                // Para planetas, usamos imagens genéricas
                content = `
                    <img src="https://via.placeholder.com/200/000000/FFE81F?text=Planeta" 
                         alt="${item.name}" 
                         class="w-full h-48 object-cover rounded-lg mb-3">
                    <h3 class="text-xl mb-2">${item.name}</h3>
                    <p><strong>Clima:</strong> ${item.climate}</p>
                    <p><strong>Terreno:</strong> ${item.terrain}</p>
                    <p><strong>População:</strong> ${item.population}</p>
                `;
                break;
                
            case 'starships':
                content = `
                    <img src="https://via.placeholder.com/200/000000/FFE81F?text=Nave" 
                         alt="${item.name}" 
                         class="w-full h-48 object-cover rounded-lg mb-3">
                    <h3 class="text-xl mb-2">${item.name}</h3>
                    <p><strong>Modelo:</strong> ${item.model}</p>
                    <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
                    <p><strong>Classe:</strong> ${item.starship_class}</p>
                `;
                break;
                
            case 'films':
                content = `
                    <img src="https://via.placeholder.com/200/000000/FFE81F?text=Filme+${item.episode_id}" 
                         alt="${item.title}" 
                         class="w-full h-48 object-cover rounded-lg mb-3">
                    <h3 class="text-xl mb-2">${item.title}</h3>
                    <p><strong>Episódio:</strong> ${item.episode_id}</p>
                    <p><strong>Diretor:</strong> ${item.director}</p>
                    <p><strong>Lançamento:</strong> ${item.release_date}</p>
                `;
                break;
        }

        card.innerHTML = content;
        return card;
    }

    showLoading() {
        const loading = document.getElementById('swapi-loading');
        if (loading) loading.classList.remove('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loading = document.getElementById('swapi-loading');
        if (loading) loading.classList.add('hidden');
        this.isLoading = false;
    }

    showError(message) {
        const container = document.getElementById('swapi-cards');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center p-8">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4" style="color: var(--highlighted-color);"></i>
                    <p class="text-xl">${message}</p>
                </div>
            `;
        }
    }

    resetForNewCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
    }
}