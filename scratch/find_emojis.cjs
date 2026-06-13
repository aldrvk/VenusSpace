const fs = require('fs');
const path = require('path');

const nonAsciiRegex = /[^\x00-\x7F]/;

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (nonAsciiRegex.test(line)) {
            console.log(`${path.basename(filePath)}:${idx + 1}: ${line.trim()}`);
        }
    });
}

checkFile('/Users/aldriknoel/Kuliah/Semester 4/IMK/VenusSpace/resources/js/Pages/Admin/TimKaryawan.tsx');
checkFile('/Users/aldriknoel/Kuliah/Semester 4/IMK/VenusSpace/resources/js/Pages/Admin/Pengaturan.tsx');
checkFile('/Users/aldriknoel/Kuliah/Semester 4/IMK/VenusSpace/resources/js/Pages/Admin/Dashboard.tsx');
checkFile('/Users/aldriknoel/Kuliah/Semester 4/IMK/VenusSpace/resources/js/Pages/Admin/Laporan.tsx');
