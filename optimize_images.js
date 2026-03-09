const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data', 'photography.js');
const imgDir = path.join(__dirname, 'public', 'photography');

let content = fs.readFileSync(dataFile, 'utf8');

// Extract the photos array matching
const match = content.match(/export const photos = (\[[\s\S]*?\]);/);
if (!match) {
    console.error("Could not find photos array in photography.js");
    process.exit(1);
}

const photosString = match[1];
const photos = eval(photosString);

photos.forEach(photo => {
    const currentName = path.basename(photo.src);
    const oldPath = path.join(imgDir, currentName);

    const categorySlug = photo.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const titleSlug = photo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const newName = `sagheer-akram-photography-${categorySlug}-${titleSlug}.jpg`;
    const newPath = path.join(imgDir, newName);

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${currentName} -> ${newName}`);
    } else if (fs.existsSync(newPath)) {
        console.log(`Exists: ${newName}`);
    } else {
        console.log(`Missing: ${currentName}`);
    }

    // Update src
    photo.src = `/photography/${newName}`;
});

// Re-stringify the photos, keeping 4 spaces indent
const newPhotosString = JSON.stringify(photos, null, 4);

// Replace in content
const newContent = content.replace(/export const photos = \[[\s\S]*?\];/, `export const photos = ${newPhotosString};`);

fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("\nSuccess: Updated src/data/photography.js with new paths.");
