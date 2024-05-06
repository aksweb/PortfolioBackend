const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());

// Function to scrape Codeforces submissions
async function scrapeCodeforcesSubmissions(handle, directory) {
    const lang = {
        ".c": ["GNU C11"],
        ".cs": ["Mono C#"],
        ".cpp": ["Clang++17 Diagnostics", "GNU C++11", "GNU C++14", "GNU C++17", "MS C++", "MS C++2017"],
        ".d": ["D"],
        ".go": ["Go"],
        ".hs": ["Haskell"],
        ".java": ["Java 11", "Java 8"],
        ".js": ["JavaScript", "Node.js"],
        ".kt": ["Kotlin"],
        ".mli": ["Ocaml"],
        ".pas": ["Delphi", "FPC", "PascalABC.NET"],
        ".pl": ["Perl"],
        ".php": ["PHP"],
        ".py": ["Python 2", "Python 3", "PyPy 2", "PyPy 3"],
        ".rb": ["Ruby"],
        ".rs": ["Rust"],
        ".scala": ["Scala"]
    };

    const defExt = '.cpp';
    const probs = [];

    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1`);
        const stat = response.data.result.slice(0, 10); // Fetch only the first 5 submissions

        const okList = [];
        const proList = [];

        for (const submission of stat) {
            if (submission.verdict === 'OK') {
                okList.push(submission.problem.name);
            }
        }

        for (const submission of stat) {
            if (submission.verdict === 'OK' && !proList.includes(submission.problem.name)) {
                proList.push(submission.problem.name);
                const url = `https://codeforces.com/contest/${submission.problem.contestId}/submission/${submission.id}`;
                const resp = await axios.get(url, { timeout: 161380 });

                if (resp.status === 200) {
                    const $ = cheerio.load(resp.data);
                    const plang = $('table').find('td:nth-child(4)').text().trim();
                    const l = $('pre#program-source-text').text().trim();

                    let extension = Object.keys(lang).find(key => lang[key].includes(plang));
                    if (!extension) {
                        probs.push(`${submission.problem.contestId}${submission.problem.index}.cpp`);
                        extension = defExt;
                    }

                    fs.writeFileSync(`${directory}/${submission.problem.contestId}${submission.problem.index}${extension}`, l);
                } else {
                    console.error('Error Occurred.');
                }
            }
        }

        console.log('Done!');
        if (probs.length > 0) {
            console.log('Following source codes file extension is .cpp as I don\'t know about them:');
            console.log(probs);
        }
    } catch (error) {
        console.error('Error fetching Codeforces submissions:', error);
    }
}
// Route to fetch Codeforces data and submission stats
app.get('/codeforces/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log(username);

        const response = await axios.get(`https://codeforces.com/profile/${username}`);

        // Load HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // Find all elements with class _UserActivityFrame_counterValue and extract their text content
        const solvedProblems = [];
        $('._UserActivityFrame_counterValue').each((index, element) => {
            solvedProblems.push($(element).text().trim());
        });

        // Find all elements with class _UserActivityFrame_counterDescription and extract their text content
        const solvedDescriptions = [];
        $('._UserActivityFrame_counterDescription').each((index, element) => {
            solvedDescriptions.push($(element).text().trim());
        });

        // Combine the solved problems and their descriptions into an array of objects
        const solvedData = solvedProblems.map((problem, index) => ({
            problem,
            description: solvedDescriptions[index]
        }));
        console.log(solvedData);

        // Call the function to scrape submissions
        const directory = './code'; // Specify the directory where you want to store submissions
        await scrapeCodeforcesSubmissions(username, directory);

        res.json({ solvedData });
    } catch (error) {
        console.error('Error fetching Codeforces data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to serve code files
// Route to serve code files along with their content
app.get('/codefiles', (req, res) => {
    const directory = './code'; // Directory where code files are stored
    fs.readdir(directory, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            try {
                const codeFilesWithContent = await Promise.all(files.map(async (file) => {
                    const codeContent = await fs.promises.readFile(`${directory}/${file}`, 'utf-8');
                    return { fileName: file, codeContent };
                }));
                res.json({ codeFiles: codeFilesWithContent });
            } catch (error) {
                console.error('Error reading code files:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
