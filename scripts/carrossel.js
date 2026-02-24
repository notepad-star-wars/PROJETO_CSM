// carrossel.js
export class Carrossel {
    constructor(containerId, trackClass, cardsContainer) {
        this.container = document.getElementById(containerId);
        this.track = document.querySelector(`.${trackClass}`);
        this.cardsContainer = cardsContainer;
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = 0;
        this.isTransitioning = false;
        
        // Elementos do carrossel
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');
        
        // Bind dos métodos
        this.handleResize = this.handleResize.bind(this);
        this.goToPrev = this.goToPrev.bind(this);
        this.goToNext = this.goToNext.bind(this);
        
        // Event listeners
        this.init();
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.goToPrev);
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.goToNext);
        }
        
        window.addEventListener('resize', this.handleResize);
    }
    
    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 640) return 1;
        if (width <= 1024) return 2;
        return 3;
    }
    
    updateCardsPerView() {
        this.cardsPerView = this.getCardsPerView();
        this.updateCarousel();
    }
    
    handleResize() {
        this.updateCardsPerView();
    }
    
    setCards(cards) {
        // Limpar track
        this.track.innerHTML = '';
        
        // Adicionar novos cards
        cards.forEach(card => {
            this.track.appendChild(card);
        });
        
        this.totalCards = cards.length;
        this.currentIndex = 0;
        this.createIndicators();
        this.updateCarousel();
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const totalPages = Math.ceil(this.totalCards / this.cardsPerView);
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.dataset.index = i;
            
            indicator.addEventListener('click', () => {
                this.goToPage(i);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
        
        this.updateIndicators();
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        const currentPage = Math.floor(this.currentIndex / this.cardsPerView);
        
        indicators.forEach((indicator, index) => {
            if (index === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    goToPage(pageIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = pageIndex * this.cardsPerView;
        this.updateCarousel();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    goToPrev() {
        if (this.isTransitioning || this.currentIndex <= 0) return;
        
        this.isTransitioning = true;
        this.currentIndex -= this.cardsPerView;
        
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        
        this.updateCarousel();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    goToNext() {
        if (this.isTransitioning) return;
        
        const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        
        if (this.currentIndex >= maxIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex += this.cardsPerView;
        
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
        
        this.updateCarousel();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        const cardWidth = this.track.children[0]?.offsetWidth || 0;
        const gap = 20; // gap entre cards
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Atualizar botões
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
            this.prevBtn.style.opacity = this.currentIndex <= 0 ? '0.3' : '0.8';
        }
        
        if (this.nextBtn) {
            const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.3' : '0.8';
        }
        
        this.updateIndicators();
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.goToPrev);
        }
        
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.goToNext);
        }
    }
}