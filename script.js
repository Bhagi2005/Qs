// Student Database
const studentDatabase = {
    '2024001': {
        name: 'Rajesh Kumar',
        dob: '2005-03-15',
        address: '123, MG Road, Gandhinagar',
        city: 'Vijayawada',
        examCenter: 'VIT Engineering College',
        examDate: '2024-12-20',
        examTime: '10:00 AM',
        examDuration: '3 hours',
        aadhar: '1234-5678-9012',
        photo: 'https://via.placeholder.com/150/4A90E2/ffffff?text=RK'
    },
    '2024002': {
        name: 'Priya Sharma',
        dob: '2005-07-22',
        address: '456, Bank Colony, Benz Circle',
        city: 'Vijayawada',
        examCenter: 'KL University',
        examDate: '2024-12-20',
        examTime: '10:00 AM',
        examDuration: '3 hours',
        aadhar: '9876-5432-1098',
        photo: 'https://via.placeholder.com/150/E91E63/ffffff?text=PS'
    },
    '2024003': {
        name: 'Anil Reddy',
        dob: '2005-11-08',
        address: '789, Gunadala, Near Bus Stand',
        city: 'Vijayawada',
        examCenter: 'VIT Engineering College',
        examDate: '2024-12-20',
        examTime: '10:00 AM',
        examDuration: '3 hours',
        aadhar: '5555-6666-7777',
        photo: 'https://via.placeholder.com/150/4CAF50/ffffff?text=AR'
    }
};

// State variables
let currentStudent = null;
let fingerprintVerified = false;
let photoTaken = false;
let videoStream = null;

// Handle roll number submission
function handleSubmit() {
    const rollNo = document.getElementById('rollNoInput').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    if (!rollNo) {
        showError(errorDiv, 'Please enter a registration number');
        return;
    }

    const student = studentDatabase[rollNo];
    if (student) {
        currentStudent = { ...student, rollNo };
        loadStudentDetails();
        showPage('detailsPage');
    } else {
        showError(errorDiv, 'Registration number not found. Try: 2024001, 2024002, or 2024003');
    }
}

// Load student details into form
function loadStudentDetails() {
    document.getElementById('studentPhoto').src = currentStudent.photo;
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentRollNo').textContent = 'Reg. No: ' + currentStudent.rollNo;
    document.getElementById('name').value = currentStudent.name;
    document.getElementById('dob').value = currentStudent.dob;
    document.getElementById('address').value = currentStudent.address;
    document.getElementById('city').value = currentStudent.city;
    document.getElementById('aadhar').value = currentStudent.aadhar;
    document.getElementById('examCenter').textContent = currentStudent.examCenter;
    document.getElementById('examDate').textContent = currentStudent.examDate;
    document.getElementById('examTime').textContent = currentStudent.examTime;
    document.getElementById('examDuration').textContent = currentStudent.examDuration;
}

// Handle fingerprint scanning
function handleFingerprint() {
    const btn = document.getElementById('fingerprintBtn');
    btn.textContent = 'Scanning...';
    btn.disabled = true;

    setTimeout(() => {
        fingerprintVerified = true;
        btn.textContent = '✓ Verified';
        btn.style.backgroundColor = '#16A34A';
    }, 2000);
}

// Start camera
async function startCamera() {
    const errorDiv = document.getElementById('detailsError');
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        const video = document.getElementById('video');
        video.srcObject = videoStream;
        
        document.getElementById('openCameraBtn').style.display = 'none';
        document.getElementById('cameraContainer').style.display = 'block';
    } catch (err) {
        showError(errorDiv, 'Camera access denied. Please allow camera permissions.');
    }
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    document.getElementById('capturedImage').src = photoData;
    
    photoTaken = true;
    stopCamera();
    
    document.getElementById('cameraContainer').style.display = 'none';
    document.getElementById('photoPreview').style.display = 'block';
}

// Stop camera
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    document.getElementById('cameraContainer').style.display = 'none';
    document.getElementById('openCameraBtn').style.display = 'block';
}

// Retake photo
function retakePhoto() {
    photoTaken = false;
    document.getElementById('photoPreview').style.display = 'none';
    startCamera();
}

// Handle final submission
function handleFinalSubmit() {
    const errorDiv = document.getElementById('detailsError');
    const confirmed = document.getElementById('confirmCheckbox').checked;

    if (!confirmed) {
        showError(errorDiv, 'Please confirm the information is correct');
        return;
    }
    if (!fingerprintVerified) {
        showError(errorDiv, 'Please verify your fingerprint');
        return;
    }
    if (!photoTaken) {
        showError(errorDiv, 'Please capture your photo');
        return;
    }

    alert('Registration completed successfully! Student marked present.');
    resetForm();
    showPage('loginPage');
}

// Go back to login page
function goBack() {
    resetForm();
    showPage('loginPage');
}

// Reset form
function resetForm() {
    document.getElementById('rollNoInput').value = '';
    document.getElementById('confirmCheckbox').checked = false;
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('detailsError').style.display = 'none';
    
    currentStudent = null;
    fingerprintVerified = false;
    photoTaken = false;
    
    const fingerprintBtn = document.getElementById('fingerprintBtn');
    fingerprintBtn.textContent = 'Scan Fingerprint';
    fingerprintBtn.disabled = false;
    fingerprintBtn.style.backgroundColor = '';
    
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('openCameraBtn').style.display = 'block';
    
    stopCamera();
}

// Show page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Show error
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Handle Enter key on roll number input
document.addEventListener('DOMContentLoaded', function() {
    const rollNoInput = document.getElementById('rollNoInput');
    if (rollNoInput) {
        rollNoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });
    }
});
