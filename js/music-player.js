document.addEventListener('DOMContentLoaded', function() {
  // 从主题配置或默认数据获取播放列表
  const playlist = window.theme?.music_player?.playlist || 
                  window.MUSIC_PLAYLIST || 
                  [
                    {
                      name: "Love 2000",
                      artist: "Anna Yanami",
                      url: "/music/love2000.mp3",
                      cover: "/music/love2000.jpg"
                    },
                    {
                      name: "青春なんていらないわ",
                      artist: "三月のパンタシア ",
                      url: "/music/青春なんていらないわ.mp3",
                      cover: "/music/青春なんていらないわ.jpg"
                    },
                    {
                      name: "ハルジオン",
                      artist: "YOASOBI",
                      url: "/music/YOASOBI - ハルジオン.mp3",
                      cover: "/music/ハルジオン.jpg"
                    },
                    {
                      name: "インドア系ならトラックメイカ",
                      artist: "Yunomi",
                      url: "/music/Yunomi - インドア系ならトラックメイカー (内向都是作曲家).mp3",
                      cover: "/music/Yunomi - インドア系ならトラックメイカー (内向都是作曲家).jpg"
                    },
                    {
                      name: "富士山下",
                      artist: "陈奕迅",
                      url: "/music/富士山下.mp3",
                      cover: "/music/富士山下.jpg"
                    }
                  ];

  // 创建播放器DOM
  const player = document.createElement('div');
  player.className = 'music-player';
  player.innerHTML = `
    <div class="player-header">
      <div class="player-title">
        <i class="iconfont icon-music"></i>
        <span>正在播放</span>
      </div>
      <div class="player-actions">
        <button class="player-btn playlist-toggle">
          <i class="iconfont icon-list"></i>
        </button>
        <button class="player-btn minimize-btn">
          <i class="iconfont icon-minus"></i>
        </button>
      </div>
    </div>
    <div class="player-content">
      <div class="now-playing">
        <img class="album-cover" src="${playlist[0].cover}" alt="封面">
        <div class="track-info">
          <div class="track-name">${playlist[0].name}</div>
          <div class="track-artist">${playlist[0].artist}</div>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <div class="time-display">
          <span class="current-time">00:00</span>
          <span class="duration">00:00</span>
        </div>
      </div>
      <div class="controls">
        <button class="control-btn prev-btn">
          <i class="iconfont icon-step-backward"></i>
        </button>
        <button class="control-btn play-pause-btn">
          <i class="iconfont icon-play"></i>
        </button>
        <button class="control-btn next-btn">
          <i class="iconfont icon-step-forward"></i>
        </button>
      </div>
      <div class="playlist">
        ${playlist.map((song, index) => `
          <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img class="playlist-item-cover" src="${song.cover}" alt="封面">
            <div class="playlist-item-info">
              <div class="playlist-item-name">${song.name}</div>
              <div class="playlist-item-artist">${song.artist}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(player);

  // 播放器逻辑
  const audio = new Audio();
  let currentTrack = 0;
  let isPlaying = false;
  let isPlaylistVisible = false;
  
  // DOM元素
  const elements = {
    player: player,
    albumCover: player.querySelector('.album-cover'),
    trackName: player.querySelector('.track-name'),
    trackArtist: player.querySelector('.track-artist'),
    progressBar: player.querySelector('.progress-bar'),
    progress: player.querySelector('.progress'),
    currentTime: player.querySelector('.current-time'),
    duration: player.querySelector('.duration'),
    playPauseBtn: player.querySelector('.play-pause-btn'),
    prevBtn: player.querySelector('.prev-btn'),
    nextBtn: player.querySelector('.next-btn'),
    playlistToggle: player.querySelector('.playlist-toggle'),
    playlist: player.querySelector('.playlist'),
    playlistItems: player.querySelectorAll('.playlist-item'),
    minimizeBtn: player.querySelector('.minimize-btn')
  };

  // 加载歌曲
  function loadTrack(index) {
    currentTrack = index;
    const track = playlist[index];
    
    audio.src = track.url;
    elements.albumCover.src = track.cover;
    elements.trackName.textContent = track.name;
    elements.trackArtist.textContent = track.artist;
    
    // 更新播放列表高亮
    elements.playlistItems.forEach(item => {
      item.classList.remove('active');
    });
    elements.playlistItems[index].classList.add('active');
    
    // 重置进度
    elements.progress.style.width = '0%';
    elements.currentTime.textContent = '00:00';
    
    // 获取时长
    audio.addEventListener('loadedmetadata', function() {
      elements.duration.textContent = formatTime(audio.duration);
    });
    
    if (isPlaying) {
      audio.play();
    }
  }

  // 播放/暂停
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      elements.playPauseBtn.innerHTML = '<i class="iconfont icon-play"></i>';
    } else {
      audio.play();
      elements.playPauseBtn.innerHTML = '<i class="iconfont icon-pause"></i>';
    }
    isPlaying = !isPlaying;
  }

  // 上一首
  function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play();
    }
  }

  // 下一首
  function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play();
    }
  }

  // 格式化时间
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 事件监听
  elements.playPauseBtn.addEventListener('click', togglePlay);
  elements.prevBtn.addEventListener('click', prevTrack);
  elements.nextBtn.addEventListener('click', nextTrack);
  
  // 进度条控制
  elements.progressBar.addEventListener('click', function(e) {
    const percent = e.offsetX / this.offsetWidth;
    audio.currentTime = percent * audio.duration;
    elements.progress.style.width = `${percent * 100}%`;
  });

  // 播放列表切换
  elements.playlistToggle.addEventListener('click', function() {
    isPlaylistVisible = !isPlaylistVisible;
    elements.playlist.classList.toggle('show', isPlaylistVisible);
    this.innerHTML = isPlaylistVisible ? 
      '<i class="iconfont icon-close"></i>' : 
      '<i class="iconfont icon-list"></i>';
  });

  // 播放列表项点击
  elements.playlistItems.forEach(item => {
    item.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      loadTrack(index);
      if (!isPlaying) {
        togglePlay();
      }
    });
  });

  // 最小化/恢复
  let isMinimized = false;
  elements.minimizeBtn.addEventListener('click', function() {
    isMinimized = !isMinimized;
    if (isMinimized) {
      elements.player.style.transform = 'translateY(calc(100% - 40px))';
      this.innerHTML = '<i class="iconfont icon-plus"></i>';
    } else {
      elements.player.style.transform = '';
      this.innerHTML = '<i class="iconfont icon-minus"></i>';
    }
  });

  // 音频事件
  audio.addEventListener('timeupdate', function() {
    const percent = (audio.currentTime / audio.duration) * 100;
    elements.progress.style.width = `${percent}%`;
    elements.currentTime.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', nextTrack);

  // 初始化加载第一首歌
  loadTrack(0);
});