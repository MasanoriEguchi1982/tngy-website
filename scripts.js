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

  // 夏季休業バナーは8月6日以降に自動で非表示
  const summerClosureBanner = document.getElementById('summer-closure-banner');
  if (summerClosureBanner) {
    const bannerEndDate = new Date('2026-08-06T00:00:00+09:00');
    const now = new Date();

    if (now >= bannerEndDate) {
      summerClosureBanner.remove();
    }
  }

  // NoteのRSSフィードを取得してお知らせ欄に表示
  const noteRssUrl = 'https://note.com/tunaguya_2798/rss';
  const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(noteRssUrl);
  const feedContainer = document.getElementById('note-rss-feed');

  if (feedContainer) {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (!feedContainer || !data.items) return;
        
        feedContainer.innerHTML = ""; // 読み込み中... を消去
        
        // 最新の3件を表示
        data.items.slice(0, 3).forEach(item => {
          const date = new Date(item.pubDate);
          const dateString = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
          
          const html = `
            <div class="news-item py-2 border-bottom d-flex flex-column flex-md-row gap-2">
              <span class="text-muted small">${dateString}</span>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-dark fw-medium">
                ${item.title}
              </a>
            </div>
          `;
          feedContainer.insertAdjacentHTML("beforeend", html);
        });
      })
      .catch(error => {
        document.getElementById("note-rss-feed").innerHTML = '<div class="small text-muted">お知らせの読み込みに失敗しました。</div>';
      });
  }
});