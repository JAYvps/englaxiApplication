document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = '/api/words';
    const form = document.getElementById('word-form');
    const tableBody = document.querySelector('#words-table tbody');
    const wordIdInput = document.getElementById('word-id');
    const clearFormBtn = document.getElementById('clear-form');

    const fetchAndRenderWords = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}?limit=1000`); // Get a large number of words
            if (!response.ok) throw new Error('Failed to fetch words');
            const words = await response.json();

            tableBody.innerHTML = ''; // Clear existing rows
            words.forEach(word => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${word.term}</td>
                    <td>${word.translation}</td>
                    <td>${word.difficulty}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id='${word.id}'>编辑</button>
                        <button class="delete-btn" data-id='${word.id}'>删除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching words:', error);
            alert('加载单词列表失败！');
        }
    };

    const resetForm = () => {
        form.reset();
        wordIdInput.value = '';
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const wordId = wordIdInput.value;
        const formData = new FormData(form);
        const word = {
            id: document.getElementById('word-id').value,
            term: document.getElementById('term').value,
            phonetic: document.getElementById('phonetic').value,
            definition: document.getElementById('definition').value,
            example: document.getElementById('example').value,
            exampleTranslation: document.getElementById('exampleTranslation').value,
            translation: document.getElementById('translation').value,
            difficulty: document.getElementById('difficulty').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            etymology: document.getElementById('etymology').value,
        };

        const method = wordId ? 'PUT' : 'POST';
        const url = wordId ? `${apiBaseUrl}/${wordId}` : apiBaseUrl;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(word),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Save failed');
            }
            alert('单词保存成功！');
            resetForm();
            fetchAndRenderWords();
        } catch (error) {
            console.error('Error saving word:', error);
            alert(`保存失败: ${error.message}`);
        }
    };
    
    const populateFormForEdit = async (id) => {
        try {
            // We need a way to get a single word. The API doesn't have GET /words/:id.
            // For now, we will find it from the already fetched list.
            // A better solution would be an API endpoint for a single word.
            const response = await fetch(`${apiBaseUrl}?limit=1000`);
            const words = await response.json();
            const wordToEdit = words.find(w => w.id === id);

            if (wordToEdit) {
                document.getElementById('word-id').value = wordToEdit.id;
                document.getElementById('term').value = wordToEdit.term;
                document.getElementById('phonetic').value = wordToEdit.phonetic;
                document.getElementById('definition').value = wordToEdit.definition;
                document.getElementById('example').value = wordToEdit.example;
                document.getElementById('exampleTranslation').value = wordToEdit.exampleTranslation;
                document.getElementById('translation').value = wordToEdit.translation;
                document.getElementById('difficulty').value = wordToEdit.difficulty;
                document.getElementById('tags').value = (wordToEdit.tags || []).join(', ');
                document.getElementById('etymology').value = wordToEdit.etymology;
                window.scrollTo(0, 0);
            } else {
                alert('未找到要编辑的单词！');
            }
        } catch (error) {
            console.error('Error fetching word for edit:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('确定要删除这个单词吗？此操作无法撤销。')) {
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Delete failed');
            }
            alert('单词删除成功！');
            fetchAndRenderWords();
        } catch (error) {
            console.error('Error deleting word:', error);
            alert(`删除失败: ${error.message}`);
        }
    };


    // Event Listeners
    form.addEventListener('submit', handleFormSubmit);
    clearFormBtn.addEventListener('click', resetForm);
    tableBody.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('edit-btn')) {
            populateFormForEdit(target.dataset.id);
        } else if (target.classList.contains('delete-btn')) {
            handleDelete(target.dataset.id);
        }
    });

    // Initial load
    fetchAndRenderWords();
});
