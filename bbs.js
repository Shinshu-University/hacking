const url = 'https://hackingdemo.microcms.io/api/v1/bbs';
const headers = {
    'Content-Type': 'application/json',
    'X-MICROCMS-API-KEY': 'bVsOaxRIkuEeMt1kYgEyt6ogJfkpwmIKlkv2'
};

const fetchPosts = () => {
    fetch(url, {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        const noPostsMessage = document.getElementById('no-posts-message');

        if (data.contents.length === 0) {
            noPostsMessage.style.display = 'block';
        } else {
            noPostsMessage.style.display = 'none';
            data.contents.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-content">${post.content}</p>
                    <p class="post-info">投稿者: ${post.name} | 投稿日: ${new Date(post.createdAt).toLocaleString()}</p>
                    <p class="post-id" style="font-size: 0.8em; color: gray; text-align: right;">ID: ${post.id}</p>
                `;
                postsContainer.appendChild(postDiv);
            });
        }
    })
    .catch(error => {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = 'エラーが発生しました: ' + error.message;
        errorMessageDiv.style.display = 'block';
    });
};

fetchPosts();

const getIpAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Could not fetch IP address:', error);
        return 'Unknown';
    }
};

document.getElementById('submit-post').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (title && content) {
        const ip = await getIpAddress();
        const postData = {
            title: title,
            content: content,
            name: ip,
        };

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            document.getElementById('title').value = '';
            document.getElementById('content').value = '';
            fetchPosts();
        })
        .catch(error => {
            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.textContent = '投稿に失敗しました: ' + error.message;
            errorMessageDiv.style.display = 'block';
        });
    } else {
        alert('タイトルと内容を入力してください。');
    }
});

document.getElementById('refresh-button').addEventListener('click', fetchPosts);

document.getElementById('delete-toggle').addEventListener('click', () => {
    const deleteForm = document.getElementById('delete-form');
    deleteForm.style.display = deleteForm.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('delete-post').addEventListener('click', () => {
    const contentId = document.getElementById('delete-content-id').value;

    if (contentId === '*') {
        if (confirm('すべてのコンテンツを削除しますか？')) {
            deletePost('*');
        }
    } else if (contentId) {
        deletePost(contentId);
    } else {
        alert('コンテンツIDを入力してください。');
    }
});

const deletePost = (contentId) => {
    const deleteUrl = contentId === '*' ? url : `${url}/${contentId}`;
    
    fetch(deleteUrl, {
        method: 'DELETE',
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        alert('202 Accepted');
        fetchPosts();
    })
    .catch(error => {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = '削除に失敗しました: ' + error.message;
        errorMessageDiv.style.display = 'block';
    });
};
