document.addEventListener('DOMContentLoaded', function() {
  // "もっとみる" ボタンの機能
  const readMoreBtn = document.getElementById('readMoreBtn');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', function() {
      const hiddenItems = document.querySelectorAll('.item-col');
      hiddenItems.forEach(function(item) {
        item.classList.add('show');
      });
      this.style.display = 'none';
    });
  }

  // NoteのRSSフィードを取得してお知らせ欄に表示
  const noteRssUrl = 'https://note.com/tunaguya_2798/rss';
  const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(noteRssUrl);
  const feedContainer = document.getElementById('note-rss-feed');

  if (feedContainer) {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok' && data.items.length > 0) {
          feedContainer.innerHTML = '';
          const items = data.items.slice(0, 3); // 最新3件を取得

          items.forEach(item => {
            const pubDate = new Date(item.pubDate);
            const dateString = new Intl.DateTimeFormat('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(pubDate).replace(/\//g, '.');
            
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';

            newsItem.innerHTML = `
              <div class="news-date">${dateString}</div>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-title">${item.title}</a>
            `;

            feedContainer.appendChild(newsItem);
          });
        } else {
          feedContainer.innerHTML = '<div class="text-muted small py-3">現在、新しいお知らせはありません。</div>';
        }
      })
      .catch(error => {
        console.error('RSS Fetch Error:', error);
        feedContainer.innerHTML = '<div class="text-danger small py-3">お知らせの読み込みに失敗しました。</div>';
      });
  }
});