// Default data structure
const defaultData = {
    currentPath: [],
    selectedNote: null,
    editorMode: 'edit',
    sidebarVisible: true,
    folders: {
        'root': {
            id: 'root',
            name: 'All Notes',
            parent: null,
            folders: ['personal', 'work'],
            notes: ['welcome']
        },
        'personal': {
            id: 'personal',
            name: 'Personal',
            parent: 'root',
            folders: ['projects'],
            notes: ['ideas', 'journal']
        },
        'work': {
            id: 'work',
            name: 'Work',
            parent: 'root',
            folders: [],
            notes: ['meetings', 'tasks']
        },
        'projects': {
            id: 'projects',
            name: 'Projects',
            parent: 'personal',
            folders: [],
            notes: ['webapp']
        }
    },
    notes: {
        'welcome': {
            id: 'welcome',
            name: 'Welcome to My Notes',
            content: '# Welcome to My Notes App! 🎉\n\nThis is your personal note-taking app that works across all your devices.\n\n## Features\n- 📁 **Folders**: Organize your notes\n- ✏️ **Rich editing**: Write in plain text or markdown\n- 👁️ **Preview mode**: See your formatted notes\n- 📱 **Responsive**: Works on mobile and desktop\n\n## Getting Started\n1. Create folders to organize your notes\n2. Add notes to your folders\n3. Switch between edit and preview modes\n\n**Pro tip**: Use markdown syntax like `# headings`, `**bold text**`, and `- bullet points` for rich formatting!\n\n---\n\n*Happy note-taking!* ✨',
            folder: 'root'
        },
        'ideas': {
            id: 'ideas',
            name: 'Ideas',
            content: '# Ideas 💡\n\n- Build a note-taking app ✅\n- Learn a new programming language\n- Start a blog\n- Create a personal website\n- Write more documentation',
            folder: 'personal'
        },
        'journal': {
            id: 'journal',
            name: 'Daily Journal',
            content: '# Daily Journal 📔\n\n## Today\nWorked on the note-taking app. It\'s coming together nicely!\n\n## Tomorrow\n- Add more features\n- Test on different devices\n- Share with friends',
            folder: 'personal'
        },
        'meetings': {
            id: 'meetings',
            name: 'Meeting Notes',
            content: '# Meeting Notes 📋\n\n## Weekly Standup - Jan 15\n- Discussed project progress\n- Planned next sprint\n- Resolved blockers\n\n## Action Items\n- [ ] Update documentation\n- [ ] Review pull requests\n- [ ] Schedule follow-up meeting',
            folder: 'work'
        },
        'tasks': {
            id: 'tasks',
            name: 'Tasks',
            content: '# Tasks ✅\n\n## High Priority\n- [ ] Fix critical bug\n- [ ] Deploy new feature\n- [ ] Update user documentation\n\n## Medium Priority\n- [ ] Code review\n- [ ] Team meeting prep\n- [ ] Update project timeline\n\n## Low Priority\n- [ ] Organize files\n- [ ] Clean up old branches',
            folder: 'work'
        },
        'webapp': {
            id: 'webapp',
            name: 'Web App Ideas',
            content: '# Web App Ideas 🚀\n\n## Note-Taking App\n- Single HTML file\n- Works offline\n- Multi-device support\n- Markdown support\n- Simple and clean UI\n\n## Features to Add\n- [ ] Export notes\n- [ ] Search functionality\n- [ ] Tags system\n- [ ] Dark mode\n- [ ] Sync between devices',
            folder: 'projects'
        }
    }
};

// Load data from localStorage or use defaults
let appData = JSON.parse(localStorage.getItem('notesApp')) || defaultData;

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('notesApp', JSON.stringify(appData));
}

// Initialize app
function initApp() {
    updateSidebar();
    updateUI();
    updateSidebarVisibility();
}

// Update sidebar visibility
function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    if (appData.sidebarVisible) {
        sidebar.classList.remove('hidden');
    } else {
        sidebar.classList.add('hidden');
    }
}

// Update sidebar content
function updateSidebar() {
    const currentFolderId = appData.currentPath.length > 0 ? appData.currentPath[appData.currentPath.length - 1] : 'root';
    const currentFolder = appData.folders[currentFolderId];
    const folderContent = document.getElementById('folderContent');
    
    if (!currentFolder) return;

    let html = '';

    // Add folders
    if (currentFolder.folders) {
        currentFolder.folders.forEach(folderId => {
            const folder = appData.folders[folderId];
            if (folder) {
                html += `
                    <div class="folder-item" onclick="openFolder('${folderId}')">
                        <span class="folder-icon">📁</span>
                        <span class="item-name">${folder.name}</span>
                    </div>
                `;
            }
        });
    }

    // Add notes
    if (currentFolder.notes) {
        currentFolder.notes.forEach(noteId => {
            const note = appData.notes[noteId];
            if (note) {
                const isSelected = appData.selectedNote === noteId ? 'selected' : '';
                html += `
                    <div class="note-item ${isSelected}" onclick="openNote('${noteId}')">
                        <span class="note-icon">📄</span>
                        <span class="item-name">${note.name}</span>
                    </div>
                `;
            }
        });
    }

    if (html === '') {
        html = '<div style="text-align: center; padding: 2rem; color: #6c757d;">This folder is empty</div>';
    }

    folderContent.innerHTML = html;
    updateBreadcrumb();
}

// Update breadcrumb
function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    const backBtn = document.getElementById('backBtn');
    
    if (appData.currentPath.length === 0) {
        breadcrumb.textContent = '📁 All Notes';
        backBtn.style.display = 'none';
    } else {
        const currentFolderId = appData.currentPath[appData.currentPath.length - 1];
        const currentFolder = appData.folders[currentFolderId];
        breadcrumb.textContent = `📁 ${currentFolder.name}`;
        backBtn.style.display = 'block';
    }
}

// Open folder
function openFolder(folderId) {
    appData.currentPath.push(folderId);
    saveToStorage();
    updateSidebar();
}

// Go to parent folder
function goToParentFolder() {
    appData.currentPath.pop();
    saveToStorage();
    updateSidebar();
}

// Open note
function openNote(noteId) {
    appData.selectedNote = noteId;
    saveToStorage();
    const note = appData.notes[noteId];
    
    if (note) {
        document.getElementById('editorTitle').textContent = note.name;
        document.getElementById('noteTextarea').value = note.content;
        updateMarkdownPreview();
        showEditor();
        updateSidebar(); // Refresh to show selected state
    }
}

// Show editor
function showEditor() {
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('editorView').classList.remove('hidden');
    
    // On mobile, hide sidebar when opening a note
    if (window.innerWidth <= 768) {
        hideSidebar();
    }
}

// Set editor mode
function setEditorMode(mode) {
    appData.editorMode = mode;
    saveToStorage();
    const editBtn = document.getElementById('editModeBtn');
    const previewBtn = document.getElementById('previewModeBtn');
    const splitBtn = document.getElementById('splitModeBtn');
    const textarea = document.getElementById('noteTextarea');
    const preview = document.getElementById('markdownPreview');

    // Reset button states
    [editBtn, previewBtn, splitBtn].forEach(btn => btn.classList.remove('active'));

    if (mode === 'edit') {
        editBtn.classList.add('active');
        textarea.style.display = 'block';
        textarea.style.width = '100%'; // Fix: Reset width to full
        preview.classList.add('hidden');
    } else if (mode === 'preview') {
        previewBtn.classList.add('active');
        textarea.style.display = 'none';
        preview.classList.remove('hidden');
        updateMarkdownPreview();
    } else if (mode === 'split') {
        splitBtn.classList.add('active');
        textarea.style.display = 'block';
        textarea.style.width = '50%';
        preview.classList.remove('hidden');
        updateMarkdownPreview();
    }
}

// Simple markdown parser
function parseMarkdown(text) {
    return text
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]*)`/gim, '<code>$1</code>')
        // Code blocks
        .replace(/```([^```]*)```/gim, '<pre><code>$1</code></pre>')
        // Links
        .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" target="_blank">$1</a>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Unordered lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
        // Checkboxes
        .replace(/\- \[ \] (.*$)/gim, '<li>☐ $1</li>')
        .replace(/\- \[x\] (.*$)/gim, '<li>☑ $1</li>')
        // Line breaks
        .replace(/\n/gim, '<br>')
        // Paragraphs
        .replace(/(<br>\s*<br>)/gim, '</p><p>')
        .replace(/^(.*)/, '<p>$1')
        .replace(/(.*)$/, '$1</p>')
        // Clean up
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<h[1-6]>)/gim, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
        .replace(/<p>(<ul>)/gim, '$1')
        .replace(/(<\/ul>)<\/p>/gim, '$1')
        .replace(/<p>(<blockquote>)/gim, '$1')
        .replace(/(<\/blockquote>)<\/p>/gim, '$1');
}

// Update markdown preview
function updateMarkdownPreview() {
    const textarea = document.getElementById('noteTextarea');
    const preview = document.getElementById('markdownPreview');
    const html = parseMarkdown(textarea.value);
    preview.innerHTML = html;
}

// Save note content
function saveNoteContent() {
    if (appData.selectedNote) {
        const content = document.getElementById('noteTextarea').value;
        appData.notes[appData.selectedNote].content = content;
        saveToStorage();
    }
}

// Show create modal
function showCreateModal(type) {
    const modal = document.getElementById('createModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalInput = document.getElementById('modalInput');
    
    modalTitle.textContent = type === 'folder' ? 'Create New Folder' : 'Create New Note';
    modalInput.placeholder = type === 'folder' ? 'Folder name...' : 'Note name...';
    modalInput.value = '';
    modal.dataset.type = type;
    
    modal.classList.remove('hidden');
    modalInput.focus();
}

// Hide create modal
function hideCreateModal() {
    document.getElementById('createModal').classList.add('hidden');
}

// Create new item
function createItem() {
    const modal = document.getElementById('createModal');
    const modalInput = document.getElementById('modalInput');
    const type = modal.dataset.type;
    const name = modalInput.value.trim();

    if (!name) return;

    const currentFolderId = appData.currentPath.length > 0 ? appData.currentPath[appData.currentPath.length - 1] : 'root';
    const id = generateId();

    if (type === 'folder') {
        appData.folders[id] = {
            id: id,
            name: name,
            parent: currentFolderId,
            folders: [],
            notes: []
        };
        appData.folders[currentFolderId].folders.push(id);
    } else {
        appData.notes[id] = {
            id: id,
            name: name,
            content: `# ${name}\n\nStart writing your note here...`,
            folder: currentFolderId
        };
        appData.folders[currentFolderId].notes.push(id);
    }

    saveToStorage();
    updateSidebar();
    hideCreateModal();
    
    if (type === 'note') {
        openNote(id);
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Toggle sidebar - Fixed to work on both desktop and mobile
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        // Mobile behavior
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('show');
    } else {
        // Desktop behavior
        appData.sidebarVisible = !appData.sidebarVisible;
        saveToStorage();
        updateSidebarVisibility();
    }
}

// Hide sidebar on mobile
function hideSidebar() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('show');
    }
}

// Update UI based on screen size
function updateUI() {
    // Restore editor mode
    if (appData.editorMode) {
        setEditorMode(appData.editorMode);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('noteTextarea').addEventListener('input', function() {
        saveNoteContent();
        if (appData.editorMode === 'split') {
            updateMarkdownPreview();
        }
    });

    document.getElementById('modalInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createItem();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideCreateModal();
        }
    });

    window.addEventListener('resize', updateUI);

    // Initialize the app
    initApp();
});