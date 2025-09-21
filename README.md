margdarshak
============

AI-Based Internship Recommendation Engine for PM Internship Scheme

--------------------------------------------------
📌 Problem Statement ID: 25034
Title: AI-Based Internship Recommendation Engine for PM Internship Scheme
--------------------------------------------------

🧭 Background
The PM Internship Scheme receives applications from youth across India, including rural areas, tribal districts, urban slums, and remote colleges. Many of these candidates are first-generation learners with limited digital exposure and no prior internship experience.

With hundreds of internships listed on the portal, it becomes difficult for such candidates to identify which ones match their skills, interests, or aspirations. This leads to misaligned applications and missed opportunities.

--------------------------------------------------
🎯 Objective
To build a simple, lightweight AI-based recommendation engine that suggests the most relevant internships to each candidate based on their profile.

--------------------------------------------------
🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- Recommendation Engine: Python (custom lightweight matching logic)

--------------------------------------------------
⚙️ Features
- Candidate profile form (skills, interests, education).
- AI-based matching engine that ranks internships.
- Simple, lightweight, and easy-to-use UI.
- Can be extended with advanced ML/NLP methods.

--------------------------------------------------

🚀 Getting Started

1. Clone or Download
   git clone https://github.com/ninja0x01/margdarshak.git
   <br>
   cd margdarshak

3. Create Virtual Environment
   python -m venv venv

   Activate it:
   - Windows: venv\Scripts\activate
   - Linux/macOS: source venv/bin/activate

4. Install Dependencies
   pip install Flask

5. Run the Server
   python app.py

6. Open in Browser
   http://127.0.0.1:5000

--------------------------------------------------
📡 How It Works
1. Candidate enters skills, interests, and education.
2. Backend calculates similarity between candidate profile and internships dataset.
3. The system suggests top relevant internships with a score.
4. Candidate can click "Apply" to proceed.

--------------------------------------------------
🏗️ Future Enhancements
- Resume upload + automatic skill extraction using NLP.
- TF-IDF or ML-based ranking for smarter recommendations.
- Multilingual interface for wider accessibility.
- Dashboard for candidates and admins.

--------------------------------------------------
🤝 Contribution
Contributions are welcome!
- Fork the repo
- Create a new branch
- Make your changes
- Submit a Pull Request

--------------------------------------------------
📄 License
This project is licensed under the MIT License — you are free to use, modify, and distribute.
