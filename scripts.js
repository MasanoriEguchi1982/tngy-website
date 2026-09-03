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
  const noteThumbnailMap = {
    'https://note.com/tunaguya_2798/n/n997f18a39955': 'https://assets.st-note.com/production/uploads/images/303028182/rectangle_large_type_2_a04c3bc59e25237380cbf4986b081ebf.png?fit=bounds&quality=85&width=1280',
    'https://note.com/tunaguya_2798/n/naca8fbbc9b11': 'https://assets.st-note.com/production/uploads/images/302679665/rectangle_large_type_2_1b513d80fdc3020f882c3ce4b69b3fd6.png?fit=bounds&quality=85&width=1280',
    'https://note.com/tunaguya_2798/n/n5ed8230a3d02': 'https://assets.st-note.com/production/uploads/images/294555318/rectangle_large_type_2_7ba142c4e059a284299b28808867401d.png?fit=bounds&quality=85&width=1280'
  };

  if (feedContainer) {
    const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[character]));

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (!feedContainer || !data.items) return;
        
        feedContainer.innerHTML = ""; // 読み込み中... を消去
        
        // 最新の3件を表示
        data.items.slice(0, 3).forEach(item => {
          const date = new Date(item.pubDate);
          const dateString = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
          const thumbnailUrl = noteThumbnailMap[item.link] || item.thumbnail || item.enclosure?.link || 'images/ogp.png';
          
          const html = `
            <article class="news-card">
              <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                <div class="news-card-thumbnail">
                  <img src="${escapeHtml(thumbnailUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
                </div>
                <div class="news-card-body">
                  <time class="news-card-date" datetime="${escapeHtml(item.pubDate)}">${dateString}</time>
                  <h3 class="news-card-title">${escapeHtml(item.title)}</h3>
                </div>
              </a>
            </article>
          `;
          feedContainer.insertAdjacentHTML("beforeend", html);
        });
      })
      .catch(error => {
        document.getElementById("note-rss-feed").innerHTML = '<div class="small text-muted">お知らせの読み込みに失敗しました。</div>';
      });
  }
});