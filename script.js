// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE ROLAGEM SUAVE ---

    const scrollContainer = document.querySelector('.scrollable-content');
    const navLinks = document.querySelectorAll('.cabeçalho');
    const sections = document.querySelectorAll('.scrollable-content .titulo');

    // Função para atualizar a aba ativa
    function updateActiveTab() {
        if (!scrollContainer) return; 
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; 
            if (scrollContainer.scrollTop >= sectionTop) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateActiveTab);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection && scrollContainer) {
                scrollContainer.scrollTo({
                    top: targetSection.offsetTop - 24, 
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 2. LÓGICA DO PLAYER DE MÚSICA ---

    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const rewindBtn = document.getElementById('rewind-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressTotal = document.getElementById('progress-total');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const songListContainer = document.getElementById('song-list-container');
    const fileInput = document.getElementById('file-input');
    const createPlaylistBtn = document.getElementById('Criar');

    // Elementos do Modo Claro
    const lightModeBtn = document.getElementById('light-mode-btn');
    const lightModeIcon = document.getElementById('light-mode-icon');
    const lightModeText = document.getElementById('light-mode-text');

    let songs = []; 
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 'none'; 


    // --- Funções Principais do Player ---
    
    function loadSongs() {
        if (!songListContainer) {
            console.error("Erro: Container da lista de músicas não encontrado!");
            return;
        }
        songListContainer.innerHTML = ''; 
        
        songs.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.classList.add('song-item');
            songElement.setAttribute('data-index', index); 
            
            songElement.innerHTML = `
                <div class="song-item-info">
                    <img src="${song.cover}" alt="Capa" class="song-item-img" onerror="this.onerror=null;this.src='https://placehold.co/40x40/282828/808080?text=?';">
                    <div class="song-item-details">
                        <div class="song-item-title">${song.title}</div>
                        <div class="song-item-artist">${song.artist}</div>
                    </div>
                </div>
                <div class="song-item-options">
                    <i class="ph ph-dots-three-outline-vertical song-item-menu-btn" data-index="${index}"></i>
                    <div class="menu-dropdown" id="menu-for-song-${index}">
                        <div class="menu-option add-playlist" data-index="${index}">Adicionar à Playlist</div>
                        <div class="menu-option delete-song" data-index="${index}">Excluir Música</div>
                    </div>
                </div>
            `;
            
            const infoArea = songElement.querySelector('.song-item-info');
            const menuBtn = songElement.querySelector('.song-item-menu-btn');
            const deleteBtn = songElement.querySelector('.delete-song');
            const addPlaylistBtn = songElement.querySelector('.add-playlist');

            if (infoArea) {
                infoArea.addEventListener('click', () => {
                    closeAllMenus(); 
                    currentSongIndex = index;
                    loadSong(currentSongIndex);
                    playSong();
                });
            }
            
            if (menuBtn) {
                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    toggleMenu(index);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteSong(index);
                });
            }

            if (addPlaylistBtn) {
                addPlaylistBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log(`Adicionar à Playlist: ${songs[index].title}`);
                    closeAllMenus();
                });
            }
            
            songListContainer.appendChild(songElement);
        });
    }

    function toggleMenu(index) {
        const menu = document.getElementById(`menu-for-song-${index}`);
        if (menu) {
            const isAlreadyActive = menu.classList.contains('active');
            closeAllMenus();
            if (!isAlreadyActive) {
                menu.classList.add('active');
            }
        }
    }

    function closeAllMenus() {
        document.querySelectorAll('.menu-dropdown.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target && !e.target.classList.contains('song-item-menu-btn')) {
            closeAllMenus();
        }
    });

    function deleteSong(index) {
        if (!songs[index]) return; 
        
        // Simplificado para evitar o 'confirm()' que pode ser bloqueado
        const userConfirmed = true; 
        
        if (userConfirmed) {
            let wasPlaying = (index === currentSongIndex); 

            // Revoga o URL do blob para libertar memória
            if (songs[index].src.startsWith('blob:')) {
                URL.revokeObjectURL(songs[index].src);
            }

            // Remove a música do array
            songs.splice(index, 1);
            // Redesenha a lista
            loadSongs();

            // Lógica para parar o player se a música excluída estava a tocar
            if (wasPlaying) {
                pauseSong();
                if (audioPlayer) audioPlayer.src = ''; 
                if (currentTimeEl) currentTimeEl.textContent = '-:--';
                if (totalTimeEl) totalTimeEl.textContent = '-:--';
                if(progressFill) progressFill.style.width = '0%';
                
                // Se houver mais músicas, carrega a primeira (ou a próxima)
                if (songs.length > 0) {
                    currentSongIndex = 0;
                    loadSong(currentSongIndex);
                } else {
                    currentSongIndex = 0; // Reseta o índice
                }
            } else if (index < currentSongIndex) {
                // Se excluiu uma música *antes* da que estava a tocar, corrige o índice
                currentSongIndex--; 
                // Atualiza a classe .playing na UI (opcional mas bom)
                if (isPlaying) {
                    const activeSongItem = document.querySelector(`.song-item[data-index="${currentSongIndex}"]`);
                    if (activeSongItem) {
                        activeSongItem.classList.add('playing');
                    }
                }
            }
        }
    }

    function loadSong(index) {
        if (!songs[index]) return; 
        if (!audioPlayer) return; 
        const song = songs[index];
        audioPlayer.src = song.src;
        
        document.querySelectorAll('.song-item').forEach(item => {
            item.classList.remove('playing');
        });
        const activeSongItem = document.querySelector(`.song-item[data-index="${index}"]`);
        if (activeSongItem) {
            activeSongItem.classList.add('playing');
        }
    }

    function playSong() {
        if (!audioPlayer) return;

        // Se o src estiver vazio (início da app), carrega a primeira música
        if (!audioPlayer.src) {
            if (songs.length > 0) {
                loadSong(currentSongIndex);
                audioPlayer.play().catch(e => console.error("Erro ao tocar música:", e));
            } else {
                 console.warn("Nenhuma música para tocar.");
                 return;
            }
        } else {
             audioPlayer.play().catch(e => console.error("Erro ao tocar música:", e));
        }
       
        if (playPauseBtn) {
            playPauseBtn.classList.remove('ph-play');
            playPauseBtn.classList.add('ph-pause');
        }
        isPlaying = true;
    }

    function pauseSong() {
        if (!audioPlayer) return;
        audioPlayer.pause();
        if (playPauseBtn) {
            playPauseBtn.classList.remove('ph-pause');
            playPauseBtn.classList.add('ph-play');
        }
        isPlaying = false;
    }

    function togglePlayPause() {
        if (!audioPlayer) return; 
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function nextSong() {
        if (songs.length === 0) return; 
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (songs.length > 1 && newIndex === currentSongIndex); 
            currentSongIndex = newIndex;
        } else {
            currentSongIndex++;
            if (currentSongIndex >= songs.length) {
                currentSongIndex = 0; 
            }
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        if (!audioPlayer || songs.length === 0) return;
        // Se a música estiver nos primeiros 3 segundos, vai para a anterior
        if (audioPlayer.currentTime < 3) {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1; 
            }
        }
        // Se não, apenas reinicia a música atual
        loadSong(currentSongIndex);
        playSong();
    }

    function rewind10() {
        if (!audioPlayer) return;
        audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
    }

    function forward10() {
        if (!audioPlayer || isNaN(audioPlayer.duration)) return; 
        audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', isShuffle); 
        }
    }

    function toggleRepeat() {
        if (!repeatBtn) return;
        if (repeatMode === 'none') {
            repeatMode = 'all';
            repeatBtn.classList.add('active'); 
            repeatBtn.classList.remove('ph-repeat-once'); 
            repeatBtn.classList.add('ph-repeat');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.classList.remove('ph-repeat'); 
            repeatBtn.classList.add('ph-repeat-once');
        } else if (repeatMode === 'one') {
            repeatMode = 'none';
            repeatBtn.classList.remove('active'); 
            repeatBtn.classList.remove('ph-repeat-once'); 
            repeatBtn.classList.add('ph-repeat');
        }
        if (audioPlayer) {
             audioPlayer.loop = (repeatMode === 'one');
        }
    }
    
    // Formata o tempo de segundos (ex: 125) para "2:05"
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) { 
            return '-:--'; 
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Atualiza a barra de progresso (chamada pelo 'timeupdate')
    function updateProgress(e) {
        if (!audioPlayer) return;
        const { duration, currentTime } = e.target;
        
        if (duration > 0) { 
            const progressPercent = (currentTime / duration) * 100;
            if(progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }
        } else {
             if(progressFill) {
                 progressFill.style.width = '0%'; 
             }
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }
    
    // Atualiza o tempo total (chamada pelo 'loadedmetadata')
    function setTotalTime(e) {
         if (!audioPlayer) return;
        const { duration } = e.target;
         if (totalTimeEl && duration > 0) { 
            totalTimeEl.textContent = formatTime(duration);
        }
    }

    // Permite clicar na barra para mudar o tempo
    function setProgress(e) {
         if (!audioPlayer || isNaN(audioPlayer.duration)) return; 
        const width = this.clientWidth; 
        const clickX = e.offsetX; 
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // O que fazer quando a música termina
    function onSongEnd() {
        if (repeatMode === 'all') {
            nextSong(); 
        } else if (repeatMode === 'none'){
            if (currentSongIndex < songs.length - 1 || isShuffle) {
                nextSong();
            } else {
                pauseSong(); 
                if (audioPlayer) audioPlayer.currentTime = 0; 
                loadSong(currentSongIndex); 
            }
        }
    }

    // --- LÓGICA DE UPLOAD (ATUALIZADA) ---
    
    function handleFileUpload(e) {
        // Pega a LISTA de ficheiros
        const files = e.target.files;
        if (!files || files.length === 0) {
            return; 
        }

        let newSongs = []; // Array temporário para as novas músicas
        let firstNewSongIndex = songs.length; // Guarda o índice da primeira música a ser adicionada

        for (const file of files) {
            // Ignora ficheiros que não são de áudio
            if (!file.type.startsWith('audio/')) {
                console.warn(`Ficheiro ignorado (não é áudio): ${file.name}`);
                continue;
            }

            const title = file.name.replace(/\.[^/.]+$/, ""); 
            const artist = "Ficheiro Local";

            // ATUALIZADO: Verifica se a música já existe
            const isDuplicate = songs.some(song => song.title === title && song.artist === artist);
            if (isDuplicate) {
                console.warn(`Música duplicada ignorada: ${file.name}`);
                continue; // Pula este ficheiro
            }

            // Cria o URL e o objeto da música
            const fileURL = URL.createObjectURL(file);
            const newSong = {
                title: title, 
                artist: artist,
                src: fileURL,
                cover: "https://placehold.co/40x40/282828/808080?text=?" 
            };
            
            newSongs.push(newSong); // Adiciona ao array temporário
        }

        if (newSongs.length > 0) {
            const wasPlaying = isPlaying;
            
            // Adiciona todas as novas músicas ao INÍCIO da lista principal
            songs = [...newSongs, ...songs];
            
            // Redesenha a lista UMA VEZ com todas as músicas novas
            loadSongs(); 

            // Se o player não estava a tocar nada, toca a primeira música carregada
            if (!wasPlaying) { 
                currentSongIndex = 0; // O índice da primeira música nova
                loadSong(currentSongIndex);
                playSong();
            } else {
                 // Se já estava a tocar, atualiza o índice da música atual
                 currentSongIndex += newSongs.length;
                 updatePlayingClass(); // Atualiza a UI para a música que estava a tocar
            }
        }
        
        e.target.value = null; // Limpa o input
    }

    
    // --- Ligar todos os 'Ouvintes' de Eventos ---
    
    // Verifica se os botões existem antes de adicionar 'listeners'
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (nextBtn) nextBtn.addEventListener('click', nextSong);
    if (prevBtn) prevBtn.addEventListener('click', prevSong);
    if (rewindBtn) rewindBtn.addEventListener('click', rewind10);
    if (forwardBtn) forwardBtn.addEventListener('click', forward10);
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', setTotalTime);
        audioPlayer.addEventListener('ended', onSongEnd);
        audioPlayer.addEventListener('error', (e) => {
            console.error("Erro no áudio:", e);
            // Evita o 'alert' para links de exemplo que podem falhar
            if (audioPlayer.src && !audioPlayer.src.startsWith('blob:')) { 
                console.warn("Erro ao carregar a música. O link pode estar quebrado ou offline.");
            }
        });
    } else {
        console.error("Erro: Elemento <audio> não encontrado!");
    }
    
    if (progressTotal) progressTotal.addEventListener('click', setProgress);

    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', () => {
            if(fileInput) {
                fileInput.click(); 
            }
        });
    }
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // --- LÓGICA DO MODO CLARO ---
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            // Adiciona/remove a classe do body
            document.body.classList.toggle('light-mode');
            
            // Atualiza o ícone e o texto do botão
            if (document.body.classList.contains('light-mode')) {
                if (lightModeIcon) {
                    lightModeIcon.classList.remove('ph-sun');
                    lightModeIcon.classList.add('ph-moon');
                }
                if (lightModeText) lightModeText.textContent = 'Modo escuro';
            } else {
                 if (lightModeIcon) {
                    lightModeIcon.classList.remove('ph-moon');
                    lightModeIcon.classList.add('ph-sun');
                }
                if (lightModeText) lightModeText.textContent = 'Modo claro';
            }
        });
    }

    // --- Iniciar a Aplicação ---
    loadSongs(); // Carrega as músicas (lista vazia)

});

