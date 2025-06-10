// Global Variables
let currentAssessment = null;
let currentQuestionIndex = 0;
let assessmentAnswers = [];
let assessmentQuestions = {};
let chatBotVisible = false;

// Sample Articles Data
const articlesData = [
    {
        id: 1,
        title: "Mengatasi Kecemasan di Era Digital",
        excerpt: "Tips praktis untuk mengelola kecemasan yang dipicu oleh teknologi dan media sosial.",
        category: "anxiety",
        date: "2025-06-08",
        readTime: "5 min",
        icon: "fas fa-heartbeat"
    },
    {
        id: 2,
        title: "Membangun Rutinitas Self-Care yang Efektif",
        excerpt: "Panduan lengkap untuk menciptakan rutinitas perawatan diri yang berkelanjutan.",
        category: "self-care",
        date: "2025-06-07",
        readTime: "7 min",
        icon: "fas fa-spa"
    },
    {
        id: 3,
        title: "Mengenali Tanda-tanda Depresi",
        excerpt: "Pelajari gejala-gejala depresi dan kapan harus mencari bantuan profesional.",
        category: "depression",
        date: "2025-06-06",
        readTime: "6 min",
        icon: "fas fa-cloud-rain"
    },
    {
        id: 4,
        title: "Teknik Manajemen Stres untuk Pekerja",
        excerpt: "Strategi efektif untuk mengelola stres di tempat kerja dan menjaga work-life balance.",
        category: "stress",
        date: "2025-06-05",
        readTime: "8 min",
        icon: "fas fa-briefcase"
    },
    {
        id: 5,
        title: "Mindfulness untuk Pemula",
        excerpt: "Pengenalan dasar praktik mindfulness dan manfaatnya bagi kesehatan mental.",
        category: "self-care",
        date: "2025-06-04",
        readTime: "4 min",
        icon: "fas fa-leaf"
    },
    {
        id: 6,
        title: "Cara Mengatasi Panic Attack",
        excerpt: "Teknik darurat untuk mengelola serangan panik dan pencegahannya.",
        category: "anxiety",
        date: "2025-06-03",
        readTime: "5 min",
        icon: "fas fa-heart"
    }
];

// Assessment Questions and Scoring Logic
assessmentQuestions = {
    anxiety: {
        title: "Tes Kecemasan (GAD-7)",
        description: "Seberapa sering Anda terganggu oleh masalah-masalah berikut dalam 2 minggu terakhir?",
        questions: [
            "Merasa gugup, cemas, atau tegang",
            "Tidak dapat menghentikan atau mengendalikan kekhawatiran",
            "Terlalu banyak khawatir tentang berbagai hal",
            "Sulit untuk rileks",
            "Merasa sangat gelisah sehingga sulit untuk duduk diam",
            "Mudah menjadi jengkel atau mudah tersinggung",
            "Merasa takut seolah-olah sesuatu yang mengerikan akan terjadi"
        ],
        options: [
            { text: "Tidak sama sekali", value: 0 },
            { text: "Beberapa hari", value: 1 },
            { text: "Lebih dari separuh hari", value: 2 },
            { text: "Hampir setiap hari", value: 3 }
        ],
        scoring: (score) => {
            let result = {};
            if (score >= 0 && score <= 4) {
                result.level = "Kecemasan Minimal";
                result.icon = "fas fa-check-circle low";
                result.description = "Anda memiliki tingkat kecemasan yang minimal. Pertahankan gaya hidup sehat untuk menjaga kesehatan mental Anda.";
                result.recommendations = ["Terus praktikkan self-care.", "Jaga pola makan dan tidur yang teratur.", "Tetap aktif secara fisik."];
            } else if (score >= 5 && score <= 9) {
                result.level = "Kecemasan Ringan";
                result.icon = "fas fa-exclamation-triangle moderate";
                result.description = "Anda mungkin mengalami tingkat kecemasan ringan. Perhatikan pola kecemasan Anda dan pertimbangkan untuk mencari dukungan.";
                result.recommendations = ["Pelajari teknik relaksasi (misalnya pernapasan dalam).", "Bicarakan perasaan Anda dengan teman atau keluarga.", "Pertimbangkan untuk mencoba meditasi atau mindfulness."];
            } else if (score >= 10 && score <= 14) {
                result.level = "Kecemasan Sedang";
                result.icon = "fas fa-exclamation-circle high";
                result.description = "Tingkat kecemasan Anda tergolong sedang. Disarankan untuk mencari konsultasi dengan profesional kesehatan mental.";
                result.recommendations = ["Jadwalkan konsultasi dengan psikolog atau psikiater.", "Identifikasi pemicu kecemasan Anda.", "Prioritaskan istirahat yang cukup."];
            } else {
                result.level = "Kecemasan Berat";
                result.icon = "fas fa-times-circle high";
                result.description = "Anda memiliki tingkat kecemasan yang berat. Sangat penting untuk segera mencari bantuan profesional kesehatan mental.";
                result.recommendations = ["Segera cari bantuan dari profesional kesehatan mental.", "Hindari pemicu stres yang diketahui.", "Fokus pada perawatan diri dan dukungan sosial."];
            }
            return result;
        }
    },
    depression: {
        title: "Tes Depresi (PHQ-9)",
        description: "Seberapa sering Anda terganggu oleh masalah-masalah berikut dalam 2 minggu terakhir?",
        questions: [
            "Sedikit minat atau kesenangan dalam melakukan aktivitas",
            "Merasa sedih, tertekan, atau putus asa",
            "Sulit tidur atau tetap tertidur, atau terlalu banyak tidur",
            "Merasa lelah atau memiliki sedikit energi",
            "Nafsu makan yang buruk atau makan berlebihan",
            "Merasa buruk tentang diri sendiri atau merasa gagal",
            "Sulit berkonsentrasi pada hal-hal seperti membaca atau menonton TV",
            "Bergerak atau berbicara sangat lambat, atau sebaliknya menjadi gelisah",
            "Berpikir bahwa Anda lebih baik mati atau menyakiti diri sendiri"
        ],
        options: [
            { text: "Tidak sama sekali", value: 0 },
            { text: "Beberapa hari", value: 1 },
            { text: "Lebih dari separuh hari", value: 2 },
            { text: "Hampir setiap hari", value: 3 }
        ],
        scoring: (score) => {
            let result = {};
            if (score >= 0 && score <= 4) {
                result.level = "Tidak Ada Depresi";
                result.icon = "fas fa-smile low";
                result.description = "Anda tidak menunjukkan tanda-tanda depresi signifikan. Jaga terus kesehatan mental Anda.";
                result.recommendations = ["Pertahankan aktivitas yang Anda nikmati.", "Jaga hubungan sosial yang positif.", "Pastikan tidur dan nutrisi yang cukup."];
            } else if (score >= 5 && score <= 9) {
                result.level = "Depresi Ringan";
                result.icon = "fas fa-frown moderate";
                result.description = "Anda mungkin mengalami gejala depresi ringan. Memperhatikan perasaan Anda adalah langkah penting.";
                result.recommendations = ["Libatkan diri dalam kegiatan yang menyenangkan.", "Olahraga secara teratur.", "Bicarakan perasaan Anda dengan orang terdekat."];
            } else if (score >= 10 && score <= 19) {
                result.level = "Depresi Sedang";
                result.icon = "fas fa-sad-tear high";
                result.description = "Gejala depresi Anda tergolong sedang. Sangat disarankan untuk mencari evaluasi dari profesional kesehatan mental.";
                result.recommendations = ["Cari dukungan dari psikolog atau konselor.", "Buat jadwal harian untuk membantu struktur.", "Hindari isolasi sosial."];
            } else {
                result.level = "Depresi Berat";
                result.icon = "fas fa-dizzy high";
                result.description = "Anda menunjukkan gejala depresi berat. Sangat penting untuk segera mencari bantuan medis atau psikologis.";
                result.recommendations = ["Segera hubungi profesional kesehatan mental.", "Pertimbangkan dukungan obat-obatan jika direkomendasikan.", "Prioritaskan keselamatan diri dan cari dukungan darurat jika ada pikiran untuk menyakiti diri."];
            }
            return result;
        }
    },
    stress: {
        title: "Tes Tingkat Stres",
        description: "Seberapa sering Anda terganggu oleh masalah-masalah berikut dalam 2 minggu terakhir?",
        questions: [
            "Merasa gugup atau tertekan",
            "Tidak mampu mengatasi hal-hal penting dalam hidup Anda",
            "Merasa yakin dengan kemampuan Anda untuk menangani masalah pribadi", // Reversed score for this question
            "Merasa semuanya di luar kendali Anda",
            "Merasa marah karena hal-hal yang terjadi di luar kendali Anda",
            "Merasa kesulitan menenangkan pikiran Anda",
            "Merasa bahwa Anda menumpuk terlalu banyak hal sehingga Anda tidak dapat mengatasinya"
        ],
        options: [
            { text: "Tidak Pernah", value: 0 },
            { text: "Jarang", value: 1 },
            { text: "Kadang-kadang", value: 2 },
            { text: "Sering", value: 3 },
            { text: "Sangat Sering", value: 4 }
        ],
        scoring: (score) => {
            let result = {};
            // Example scoring for PSS-10 (Perceived Stress Scale), common values are 0-40.
            // Adjusted for 7 questions with 0-4 scale: max score 28.
            // Note: For questions 2 and 3 (index 2 and 3 in a 0-indexed array) in PSS-10, they are positively worded
            // so their scores are reversed. This needs to be handled when calculating the score.
            // Assuming this is a simplified custom stress test where all are scored linearly for simplicity.
            if (score >= 0 && score <= 13) {
                result.level = "Tingkat Stres Rendah";
                result.icon = "fas fa-child low";
                result.description = "Anda memiliki tingkat stres yang rendah. Anda cukup baik dalam mengelola tekanan hidup.";
                result.recommendations = ["Terus kelola waktu dengan baik.", "Pertahankan hobi yang menyenangkan.", "Jaga keseimbangan antara pekerjaan dan kehidupan pribadi."];
            } else if (score >= 14 && score <= 26) {
                result.level = "Tingkat Stres Sedang";
                result.icon = "fas fa-running moderate";
                result.description = "Anda mungkin mengalami tingkat stres sedang. Perlu perhatian lebih untuk teknik pengelolaan stres.";
                result.recommendations = ["Identifikasi sumber stres utama Anda.", "Coba teknik relaksasi seperti yoga atau pernapasan dalam.", "Prioritaskan tidur yang cukup."];
            } else { // score >= 27
                result.level = "Tingkat Stres Tinggi";
                result.icon = "fas fa-head-side-mask high";
                result.description = "Tingkat stres Anda tinggi. Sangat penting untuk segera mencari strategi penanganan stres yang efektif.";
                result.recommendations = ["Konsultasi dengan ahli kesehatan mental.", "Lakukan perubahan gaya hidup untuk mengurangi pemicu stres.", "Belajar mengatakan 'tidak' pada hal-hal yang membebani."];
            }
            return result;
        }
    }
};


// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navBar = document.querySelector('header');
const backToTopButton = document.getElementById('backToTop');
const navLinkElements = document.querySelectorAll('.nav-link');
const statCards = document.querySelectorAll('.stat-card');
const articlesGrid = document.getElementById('articlesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const assessmentModal = document.getElementById('assessmentModal');
const assessmentTitle = document.getElementById('assessmentTitle');
const assessmentDescription = document.getElementById('assessmentDescription');
const assessmentContent = document.getElementById('assessmentContent');
const assessmentResult = document.getElementById('assessmentResult');
const assessmentProgress = document.getElementById('assessmentProgress');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const questionText = document.getElementById('questionText');
const answerOptionsDiv = document.getElementById('answerOptions');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const consultationForm = document.getElementById('consultationForm');
const contactForm = document.getElementById('contactForm');
const chatBot = document.getElementById('chatBot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatToggleBtn = document.querySelector('.fab'); // FAB to toggle chat

// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    loadArticles('all'); // Load all articles on page load
    setupSmoothScrolling();
    setupIntersectionObservers();
});

// Navigation and Header
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active'); // Add active class to hamburger for animation
});

// Close nav menu when a link is clicked (for mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navBar.classList.add('scrolled');
        backToTopButton.style.display = 'flex';
    } else {
        navBar.classList.remove('scrolled');
        backToTopButton.style.display = 'none';
    }
    highlightNavLinkOnScroll();
});

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - navBar.offsetHeight, // Adjust for fixed header
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function highlightNavLinkOnScroll() {
    let currentSection = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - navBar.offsetHeight - 20; // Adjust offset for better timing
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

// Quick Stats Counter Animation
function setupIntersectionObservers() {
    const animateCounter = (entry, observer) => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.querySelector('.stat-number').dataset.target);
            const statNumber = entry.target.querySelector('.stat-number');
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 10); // Adjust speed for smoother animation

            const timer = setInterval(() => {
                current += increment;
                if (current < target) {
                    statNumber.textContent = Math.ceil(current);
                } else {
                    statNumber.textContent = target;
                    clearInterval(timer);
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            }, 10);
        }
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => animateCounter(entry, observer));
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    statCards.forEach(card => {
        statObserver.observe(card);
    });
}


// Articles Section
function loadArticles(filterCategory = 'all') {
    articlesGrid.innerHTML = ''; // Clear existing articles
    const filteredArticles = filterCategory === 'all' ? articlesData : articlesData.filter(article => article.category === filterCategory);

    if (filteredArticles.length === 0) {
        articlesGrid.innerHTML = '<p class="no-articles-message">Tidak ada artikel dalam kategori ini.</p>';
        return;
    }

    filteredArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.classList.add('article-card', 'fade-in-up'); // Added fade-in-up from styles.css
        articleCard.innerHTML = `
            <div class="article-image">
                <i class="${article.icon}"></i>
            </div>
            <div class="article-content">
                <span class="article-category">${article.category.charAt(0).toUpperCase() + article.category.slice(1).replace('-', ' ')}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span><i class="fas fa-calendar"></i> ${article.date}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                    <a href="#" class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
        articlesGrid.appendChild(articleCard);
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadArticles(button.dataset.category);
    });
});


// Mental Health Assessment Modal
function openAssessmentModal(type) {
    currentAssessment = assessmentQuestions[type];
    currentQuestionIndex = 0;
    assessmentAnswers = new Array(currentAssessment.questions.length).fill(null); // Initialize with null for unanswered questions

    assessmentTitle.textContent = currentAssessment.title;
    assessmentDescription.textContent = currentAssessment.description;
    totalQuestionsSpan.textContent = currentAssessment.questions.length;

    assessmentContent.style.display = 'block';
    assessmentResult.style.display = 'none';
    
    assessmentModal.style.display = 'flex'; // Use flex for centering
    loadQuestion();
}

function closeAssessmentModal() {
    assessmentModal.style.display = 'none';
}

function loadQuestion() {
    const question = currentAssessment.questions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    questionText.textContent = question;
    answerOptionsDiv.innerHTML = ''; // Clear previous options

    currentAssessment.options.forEach((option, index) => {
        const answerOption = document.createElement('button'); // Changed to button for accessibility
        answerOption.classList.add('answer-option');
        answerOption.textContent = option.text;
        answerOption.dataset.value = option.value; // Store value for scoring
        answerOption.addEventListener('click', () => selectAnswer(answerOption, option.value));
        answerOptionsDiv.appendChild(answerOption);

        // Highlight if already answered
        if (assessmentAnswers[currentQuestionIndex] === option.value) {
            answerOption.classList.add('selected');
        }
    });

    updateProgressBar();
    updateNavigationButtons();
}

function selectAnswer(selectedOptionElement, value) {
    const prevSelected = answerOptionsDiv.querySelector('.answer-option.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    selectedOptionElement.classList.add('selected');
    assessmentAnswers[currentQuestionIndex] = value;
    updateNavigationButtons(); // Re-enable next button if an answer is selected
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100;
    assessmentProgress.style.width = `${progress}%`;
}

function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = assessmentAnswers[currentQuestionIndex] === null; // Disable next if no answer selected

    if (currentQuestionIndex === currentAssessment.questions.length - 1) {
        nextBtn.textContent = "Lihat Hasil";
        nextBtn.classList.add('btn-primary'); // Highlight 'Lihat Hasil'
        nextBtn.classList.remove('btn-secondary');
    } else {
        nextBtn.textContent = "Selanjutnya";
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-secondary');
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (assessmentAnswers[currentQuestionIndex] === null) {
        alert("Harap pilih jawaban sebelum melanjutkan.");
        return;
    }

    if (currentQuestionIndex < currentAssessment.questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showAssessmentResults();
    }
}

function showAssessmentResults() {
    assessmentContent.style.display = 'none';
    assessmentResult.style.display = 'block';

    let totalScore = 0;
    assessmentAnswers.forEach((answer, index) => {
        if (answer !== null) {
            // Special handling for stress question 2 (index 2) as its score is reversed
            if (currentAssessment === assessmentQuestions.stress && index === 2) {
                totalScore += (currentAssessment.options.length - 1) - answer; // Reverse score (e.g., if max 4, then 4-answer)
            } else {
                totalScore += answer;
            }
        }
    });

    const resultData = currentAssessment.scoring(totalScore);

    document.getElementById('resultIcon').className = `result-icon ${resultData.icon}`;
    document.getElementById('resultTitle').textContent = resultData.level;
    document.getElementById('resultScore').textContent = `Skor Anda: ${totalScore}`;
    document.getElementById('resultDescription').textContent = resultData.description;

    const recommendationsList = document.getElementById('resultRecommendations');
    recommendationsList.innerHTML = '';
    resultData.recommendations.forEach(rec => {
        const listItem = document.createElement('li');
        listItem.textContent = rec;
        recommendationsList.appendChild(listItem);
    });
}

function retakeAssessment() {
    openAssessmentModal(Object.keys(assessmentQuestions).find(key => assessmentQuestions[key] === currentAssessment));
}

// Consultation Form Submission
consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(consultationForm);
    const data = Object.fromEntries(formData.entries());
    console.log("Konsultasi Dijadwalkan:", data);
    alert("Jadwal konsultasi Anda telah diterima. Kami akan menghubungi Anda segera!");
    consultationForm.reset();
});

// Resources Section
function findNearestCenter() {
    alert("Fitur pencarian lokasi terdekat akan segera tersedia. Untuk saat ini, Anda bisa mencari pusat kesehatan mental di Google Maps.");
}

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    console.log("Pesan Terkirim:", data);
    alert("Terima kasih! Pesan Anda telah terkirim.");
    contactForm.reset();
});

// Chat Bot
chatToggleBtn.addEventListener('click', toggleChatBot); // FAB click listener

function toggleChatBot() {
    chatBotVisible = !chatBotVisible;
    chatBot.style.display = chatBotVisible ? 'flex' : 'none';
    if (chatBotVisible) {
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom when opening
    }
}

function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;

    // Display user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user');
    userMessageDiv.innerHTML = `<p>${userMessage}</p>`;
    chatMessages.appendChild(userMessageDiv);

    chatInput.value = ''; // Clear input
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

    // Simulate bot response
    setTimeout(() => {
        const botResponseDiv = document.createElement('div');
        botResponseDiv.classList.add('chat-message', 'bot');
        let botText = "Mohon maaf, saya belum memahami pertanyaan Anda. Saya masih dalam tahap pengembangan.";
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes("halo") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hai")) {
            botText = "Halo juga! Ada yang bisa saya bantu terkait kesehatan mental?";
        } else if (lowerCaseMessage.includes("tes") || lowerCaseMessage.includes("assessment") || lowerCaseMessage.includes("kesehatan mental")) {
            botText = "Anda bisa mencoba 'Tes Kesehatan Mental' di bagian atas halaman untuk evaluasi awal Anda.";
        } else if (lowerCaseMessage.includes("konsultasi")) {
            botText = "Jika Anda ingin berkonsultasi dengan profesional, silakan kunjungi bagian 'Konsultasi Online' di halaman utama kami.";
        } else if (lowerCaseMessage.includes("artikel") || lowerCaseMessage.includes("bacaan")) {
            botText = "Kami punya banyak artikel menarik di bagian 'Artikel Terbaru'. Silakan lihat di sana untuk informasi lebih lanjut.";
        } else if (lowerCaseMessage.includes("terima kasih") || lowerCaseMessage.includes("makasih")) {
            botText = "Sama-sama! Senang bisa membantu Anda. Jangan ragu untuk bertanya lagi.";
        } else if (lowerCaseMessage.includes("stres")) {
            botText = "Stres adalah respons alami. Coba teknik relaksasi atau konsultasi jika stres Anda berlebihan.";
        } else if (lowerCaseMessage.includes("kecemasan")) {
            botText = "Kecemasan bisa dikelola. Pelajari teknik pernapasan atau pertimbangkan dukungan profesional.";
        } else if (lowerCaseMessage.includes("depresi")) {
            botText = "Jika Anda merasa sedih terus-menerus, penting untuk mencari bantuan. Depresi adalah kondisi serius yang bisa diobati.";
        } else if (lowerCaseMessage.includes("kontak")) {
            botText = "Anda bisa menemukan informasi kontak kami di bagian 'Kontak' pada halaman bawah.";
        } else if (lowerCaseMessage.includes("bantuan darurat")) {
            botText = "Jika Anda atau seseorang yang Anda kenal membutuhkan bantuan darurat, segera hubungi layanan kesehatan atau hotline krisis di area Anda.";
        }
        
        botResponseDiv.innerHTML = `<p>${botText}</p>`;
        chatMessages.appendChild(botResponseDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000); // Simulate typing delay
}

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Attach modal open listeners to assessment buttons
document.querySelectorAll('.assessment-card button').forEach(button => {
    button.addEventListener('click', (e) => {
        const type = e.target.dataset.assessmentType;
        if (type) {
            openAssessmentModal(type);
        }
    });
});

// Attach close modal listener to close button (X)
document.querySelector('.modal .close-button').addEventListener('click', closeAssessmentModal);

// Close modal if clicked outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === assessmentModal) {
        closeAssessmentModal();
    }
});

// Attach navigation buttons for assessment
prevBtn.addEventListener('click', previousQuestion);
nextBtn.addEventListener('click', nextQuestion);

// Attach retake assessment button
document.getElementById('retakeAssessmentBtn').addEventListener('click', retakeAssessment);

// Attach "Book a Consultation" button from result page (if any)
document.getElementById('bookConsultationBtn')?.addEventListener('click', () => {
    closeAssessmentModal();
    scrollToSection('consultation');
});

// Attach "Find Nearest Center" button
document.querySelector('#resources .btn-primary').addEventListener('click', findNearestCenter);