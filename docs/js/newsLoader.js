// Update path and add error handling
fetch('/data/hot-news.md')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
    })
    .then(text => {
        const converter = new showdown.Converter();
        const html = converter.makeHtml(text);
        document.getElementById('news-container').innerHTML = html;
    })
    .catch(err => {
        console.error('Error loading news:', err);
        document.getElementById('news-container').innerHTML = 
            '<p>Impossible de charger les actualités.</p>';
    });
